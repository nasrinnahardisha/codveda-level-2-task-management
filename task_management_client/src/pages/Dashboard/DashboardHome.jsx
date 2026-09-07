import { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  ShieldCheck,
  Search,
  X,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Sparkles,
  MonitorSmartphone,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import UseRole from "../../Hooks/UseRole";
import { useQuery } from "@tanstack/react-query";

export default function DashboardHome() {
  const { isAdmin } = UseRole();
  const axiosSecure = UseAxiosSecure();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    status: "In Stock",
    description: "",
    image: "",
  });

  // TanStack Query (refetch সহ)
  const {
    data: products = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data || [];
    },
  });

  // Image Upload Handler (Cloudinary)
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB.");
      return;
    }

    const data = new FormData();

    // Backend expects upload.single("image")
    data.append("image", file);

    try {
      setUploading(true);

      const res = await axiosSecure.post("/upload-image", data);

      if (res.data?.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          image: res.data.url,
        }));

        console.log("Cloudinary image URL:", res.data.url);
      } else {
        alert("Image upload failed.");
      }
    } catch (error) {
      console.error("Image upload failed:", error);

      alert(
        error.response?.data?.message ||
          "Image upload failed. Please try again.",
      );
    } finally {
      setUploading(false);

      // Same file আবার select করার জন্য
      e.target.value = "";
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axiosSecure.put(`/products/${editingProduct._id}`, formData);
      } else {
        await axiosSecure.post("/products", formData);
      }
      setModalOpen(false);
      resetForm();
      refetch(); // fetchProducts()-এর বদলে refetch() ব্যবহার করা হয়েছে
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosSecure.delete(`/products/${id}`);
        refetch(); // fetchProducts()-এর বদলে refetch() ব্যবহার করা হয়েছে
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  const openAddModal = () => {
    resetForm();
    setModalOpen(true);
  };

  const openEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      title: p.title || p.name || "",
      category: p.category || "",
      price: p.price || "",
      status: p.status || "In Stock",
      description: p.description || "",
      image: p.image || "",
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      title: "",
      category: "",
      price: "",
      status: "In Stock",
      description: "",
      image: "",
    });
  };

  // Search & Filter logic
  const filteredProducts = products.filter((p) => {
    const pTitle = p.title || p.name || "";
    const matchesSearch =
      pTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      p.status?.trim().toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Statistics calculation
  const totalProducts = products.length;
  const inStock = products.filter(
    (p) => p.status?.trim().toLowerCase() === "in stock",
  ).length;
  const outOfStock = products.filter(
    (p) => p.status?.trim().toLowerCase() === "out of stock",
  ).length;
  const inventoryValue = products
    .reduce((sum, p) => sum + (parseFloat(p.price) || 0), 0)
    .toFixed(2);

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-indigo-500/20 p-5 sm:p-6 md:p-8 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="p-3.5 sm:p-4 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/30 text-white ring-1 ring-white/20 shrink-0">
            <MonitorSmartphone className="h-6 w-6 sm:h-8 sm:w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-white">
                Electronic Devices
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3" /> Live
              </span>
            </div>
            <p className="text-xs sm:text-sm font-medium text-slate-400 mt-1">
              Product Management & Inventory System
            </p>
          </div>
        </div>

        <button
          onClick={openAddModal}
          className="relative z-10 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold rounded-2xl px-6 py-3 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/50 transition-all border border-indigo-400/30 active:scale-95 text-sm w-full md:w-auto"
        >
          <Plus className="h-5 w-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Admin Panel Link Banner */}
      {isAdmin && (
        <Link to="/dashboard/user-management">
          <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/50 backdrop-blur-md transition-all group">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400 shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                  Admin Console
                </h4>
                <p className="text-xs text-slate-400">
                  Manage users and their roles
                </p>
              </div>
            </div>
            <span className="text-indigo-400 font-bold text-lg group-hover:translate-x-1 transition-transform">
              →
            </span>
          </div>
        </Link>
      )}

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Products
            </span>
            <Layers className="h-4 w-4 text-indigo-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white">
            {totalProducts}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              In Stock
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-400">
            {inStock}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Out of Stock
            </span>
            <AlertCircle className="h-4 w-4 text-rose-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-400">
            {outOfStock}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-2xl p-5 backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Inventory Value
            </span>
            <TrendingUp className="h-4 w-4 text-violet-400" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-indigo-300">
            ${inventoryValue}
          </p>
        </div>
      </div>

      {/* Search & Filter Inputs */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-indigo-500/20 rounded-xl text-sm font-medium text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 transition-all shadow-inner"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 py-2.5 px-4 bg-slate-900/80 border border-indigo-500/20 rounded-xl text-sm font-medium text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/60 shadow-sm cursor-pointer"
        >
          <option value="All" className="bg-slate-900 text-slate-100">
            All Status
          </option>
          <option value="In Stock" className="bg-slate-900 text-slate-100">
            In Stock
          </option>
          <option value="Out of Stock" className="bg-slate-900 text-slate-100">
            Out of Stock
          </option>
        </select>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="text-center py-16 text-slate-400 font-medium">
          Loading products...
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredProducts.map((p) => {
            const isInStock = p.status?.trim().toLowerCase() === "in stock";

            return (
              <div
                key={p._id}
                className="group relative bg-slate-900/70 hover:bg-slate-900 border border-indigo-500/20 hover:border-indigo-500/50 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 backdrop-blur-xl overflow-hidden"
              >
                {/* Product Image */}
                {p.image ? (
                  <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-950 border border-indigo-500/10">
                    <img
                      src={p.image}
                      alt={p.title || p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="w-full h-44 rounded-xl bg-slate-950/60 border border-indigo-500/10 flex items-center justify-center text-slate-600">
                    <ImageIcon className="h-10 w-10 opacity-40" />
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-bold text-slate-100 text-lg tracking-tight line-clamp-1 group-hover:text-indigo-300 transition-colors">
                      {p.title || p.name}
                    </h3>
                    <span className="text-[11px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-lg shrink-0">
                      {p.category || "Electronics"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">
                      ${parseFloat(p.price || 0).toFixed(2)}
                    </span>

                    {isInStock ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        Out of Stock
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 font-normal line-clamp-2 pt-1 leading-relaxed">
                    {p.description || "No description provided."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-indigo-500/10">
                  <button
                    onClick={() => openEditModal(p)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-indigo-600/30 border border-indigo-500/20 hover:border-indigo-500/40 rounded-xl transition-all"
                  >
                    <Edit3 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
                    className="flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-xl transition-all"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-indigo-500/20 rounded-3xl p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="h-10 w-10 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">No Products Found</h3>
          <p className="text-xs text-slate-400">
            No products match your current search or filter rules.
          </p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-indigo-500/30 rounded-3xl max-w-md w-full p-6 relative shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-xl text-white mb-1">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Fill in the details to{" "}
              {editingProduct ? "update the" : "add a new"} product.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Image Input */}
              <div>
                <label className="text-xs font-semibold block mb-1.5 text-slate-300">
                  Product Image
                </label>
                <div className="flex items-center gap-3">
                  {formData.image ? (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-indigo-500/30 shrink-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: "" }))
                        }
                        className="absolute top-0.5 right-0.5 bg-slate-950/80 text-rose-400 p-0.5 rounded-full hover:bg-slate-900"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-indigo-500/30 hover:border-indigo-500/60 rounded-xl p-3 cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition text-slate-400 text-xs font-medium">
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 text-indigo-400" />
                          <span>Choose & Upload Image</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5 text-slate-300">
                  Product Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wireless Mouse"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1.5 text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electronics"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-slate-950/80 border border-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1.5 text-slate-300">
                    Price ($) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 19.99"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-slate-950/80 border border-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5 text-slate-300">
                  Stock Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="In Stock" className="bg-slate-900">
                    In Stock
                  </option>
                  <option value="Out of Stock" className="bg-slate-900">
                    Out of Stock
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5 text-slate-300">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Add a short product description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-950/80 border border-indigo-500/20 rounded-xl px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold hover:bg-slate-800 text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-semibold hover:from-indigo-500 hover:to-violet-500 transition shadow-lg shadow-indigo-600/30 disabled:opacity-50"
                >
                  {editingProduct ? "Save Changes" : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
