require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { initializeApp, cert } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

// Step 1: Multer ও Cloudinary ইমপোর্ট করুন
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const app = express();
const port = process.env.PORT || 5000;

// Step 2: Multer Memory Storage কনফিগারেশন
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // সর্বোচ্চ ১০ মেগাবাইট ফাইল অ্যালাউ করবে
});

// Step 3: Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Firebase Admin SDK Config
const decoded = Buffer.from(process.env.FB_SERVICE_KEY, "base64").toString(
  "utf8",
);
const serviceAccount = JSON.parse(decoded);
initializeApp({
  credential: cert(serviceAccount),
});

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());

// Middleware: Verify Firebase Token
const verifyFBToken = async (req, res, next) => {
  const authorization = req.headers?.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({
      message: "unauthorized access - token missing",
    });
  }

  try {
    const idToken = authorization.split(" ")[1];
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.decoded_email = decodedToken.email;
    next();
  } catch (error) {
    return res.status(401).send({
      message: "unauthorized access",
    });
  }
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jdtyh.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("productDB");
    const productsCollection = db.collection("products");
    const usersCollection = db.collection("users");

    // Middleware: Verify Admin Access
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded_email;
      const query = { email };
      const user = await usersCollection.findOne(query);

      if (!user || user.role !== "admin") {
        return res.status(403).send({ message: "forbidden access" });
      }

      next();
    };

    // ==================== IMAGE UPLOAD API ====================
    // Step 4: সিঙ্গেল ছবি ক্লাউডিনারিতে আপলোড করার API Endpoint
    app.post(
      "/upload-image",
      verifyFBToken,
      verifyAdmin,
      upload.single("image"),
      async (req, res) => {
        try {
          if (!req.file) {
            return res.status(400).send({
              success: false,
              message: "No image file provided",
            });
          }

          // Memory buffer থেকে Base64 string তৈরি
          const b64 = Buffer.from(req.file.buffer).toString("base64");
          const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

          // Cloudinary তে আপলোড
          const result = await cloudinary.uploader.upload(dataURI, {
            folder: "taskflow_products", // ক্লাউডিনারির ফোল্ডার নেম
          });

          res.status(200).send({
            success: true,
            url: result.secure_url, // এই URL-টি ফ্রন্টএন্ডে নিয়ে প্রোডাক্ট অ্যাড করার সময় ডাটাবেজে সেভ করবেন
          });
        } catch (error) {
          console.error("Cloudinary Upload Error:", error);
          res.status(500).send({ success: false, message: error.message });
        }
      },
    );

    // ==================== USERS COLLECTION APIs ====================

    app.get("/users", verifyFBToken, async (req, res) => {
      try {
        const searchText = req.query.searchText || "";
        const query = searchText
          ? { email: { $regex: searchText, $options: "i" } }
          : {};
        const users = await usersCollection.find(query).toArray();
        res.send(users);
      } catch (error) {
        res.status(500).send({ message: "Failed to get users" });
      }
    });

    app.get("/users/:email/role", verifyFBToken, async (req, res) => {
      const email = decodeURIComponent(req.params.email).trim().toLowerCase();
      const user = await usersCollection.findOne({
        email: { $regex: new RegExp(`^${email}$`, "i") },
      });
      res.send({ role: user?.role || "user" });
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const existingUser = await usersCollection.findOne(query);

      if (existingUser) {
        return res.send({ message: "User already exists", insertedId: null });
      }

      const newUser = {
        name: user.displayName,
        email: user.email,
        role: user.role || "user",
        createdAt: new Date(),
      };

      const result = await usersCollection.insertOne(newUser);
      res.send(result);
    });

    app.patch(
      "/users/:id/role",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const { role } = req.body;
        const filter = { _id: new ObjectId(id) };
        const updatedDoc = { $set: { role } };
        const result = await usersCollection.updateOne(filter, updatedDoc);
        res.send(result);
      },
    );

    // ==================== PRODUCTS COLLECTION APIs ====================

    // 1. Get products (Public route)
    app.get("/products", async (req, res) => {
      const { search } = req.query;
      let query = {};

      if (search) {
        query = { name: { $regex: search, $options: "i" } };
      }

      const products = await productsCollection
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();
      res.send(products);
    });

    // 2. Add product (Admin route) - Step 5: imageUrl রিসিভ করে MongoDB তে ফিল্ড হিসেবে সেভ করা
    // 2. Add product (Admin route)
    app.post("/products", verifyFBToken, verifyAdmin, async (req, res) => {
      try {
        const { title, name, category, price, status, description, image } =
          req.body;

        const newProduct = {
          title: title || name || "",
          name: name || title || "",
          category: category || "",
          price: parseFloat(price) || 0,
          status: status || "In Stock",
          description: description || "",
          image: image || "",
          createdAt: new Date(),
        };

        const result = await productsCollection.insertOne(newProduct);

        res.status(201).send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({
          message: "Failed to add product",
        });
      }
    });
    // ⭐ Get Single Product by ID (Public Route) ⭐
    app.get(["/products/:id", "/product/:id"], async (req, res) => {
      try {
        const id = req.params.id;

        // MongoDB ObjectId ভ্যালিড কি না চেক করা
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid Product ID format" });
        }

        const query = { _id: new ObjectId(id) };
        const product = await productsCollection.findOne(query);

        if (!product) {
          return res.status(404).send({ message: "Product not found" });
        }

        res.send(product);
      } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).send({ message: "Server error fetching product" });
      }
    });

    // 3. Update product (Admin route)
    // 3. Update product (Admin route)
    app.put("/products/:id", verifyFBToken, verifyAdmin, async (req, res) => {
      try {
        const id = req.params.id;
        const updatedData = req.body;

        const filter = {
          _id: new ObjectId(id),
        };

        const updatedDoc = {
          $set: {
            title: updatedData.title || updatedData.name || "",
            name: updatedData.name || updatedData.title || "",
            category: updatedData.category || "",
            price: parseFloat(updatedData.price) || 0,

            // Stock status
            status: updatedData.status || "In Stock",

            description: updatedData.description || "",

            image: updatedData.image || updatedData.imageUrl || "",
          },
        };

        const result = await productsCollection.updateOne(filter, updatedDoc);

        res.send(result);
      } catch (error) {
        console.error("Failed to update product:", error);

        res.status(500).send({
          message: "Failed to update product",
        });
      }
    });
    // 4. Delete product (Admin route)
    app.delete(
      "/products/:id",
      verifyFBToken,
      verifyAdmin,
      async (req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await productsCollection.deleteOne(query);
        res.send(result);
      },
    );

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. Connected to MongoDB!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("TaskFlow Server is Running");
});

app.listen(port, () => {
  console.log(`TaskFlow app listening on port ${port}`);
});
