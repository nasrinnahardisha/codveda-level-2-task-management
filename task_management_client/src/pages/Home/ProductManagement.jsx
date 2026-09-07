import { useState, useEffect } from "react";
import { Link } from "react-router"; // Link ইমপোর্ট করুন
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";

export default function HomeProductGrid({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const axiosSecure = UseAxiosSecure();

  const DEFAULT_IMAGE = "https://via.placeholder.com/300?text=No+Image";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get("/products");
        const dataList = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setProducts(dataList);
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [axiosSecure]);

  const filteredProducts = products.filter((product) => {
    const productName = product?.name || product?.title || "";
    return productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      {/* Search Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Featured Products
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Explore our collection and add to cart
          </p>
        </div>

        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="text-center py-16 text-slate-400 font-medium">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-base">
              No products available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const productId = product._id || product.id;
              const imageSrc =
                product.image ||
                product.img ||
                product.photo ||
                product.imageUrl ||
                product.productImg ||
                DEFAULT_IMAGE;

              return (
                <div
                  key={productId}
                  className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg flex flex-col hover:border-indigo-500/50 transition-all duration-300 group"
                >
                  {/* Image & Title Clickable with Link */}
                  <Link to={`/product/${productId}`} className="flex-grow">
                    <div className="h-48 w-full bg-slate-800 overflow-hidden relative">
                      <img
                        src={imageSrc}
                        alt={product.name || product.title || "Product Image"}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGE;
                        }}
                      />
                      <span className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-950/80 text-indigo-400 border border-indigo-500/20 backdrop-blur-md">
                        ${product.price}
                      </span>
                    </div>

                    <div className="p-5 pb-0">
                      <h3 className="text-lg font-semibold text-white line-clamp-1 group-hover:text-indigo-400 transition-colors">
                        {product.name || product.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                        {product.description || "No description available."}
                      </p>
                    </div>
                  </Link>

                  {/* Price & Add to Cart Button */}
                  <div className="p-5 pt-4 mt-auto border-t border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-500 block">
                        Price
                      </span>
                      <span className="text-base font-bold text-white">
                        ${product.price}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Link ক্লিক প্রতিরোধ করার জন্য
                        if (onAddToCart) onAddToCart(product);
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-xl transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
