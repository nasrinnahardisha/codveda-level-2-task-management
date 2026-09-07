import { useState, useEffect } from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Edit3,
  Trash2,
  Search,
  X,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Loader2,
  Image as ImageIcon,
  Upload,
  UserCheck,
  ChevronRight,
} from "lucide-react";

import UseAxiosSecure from "../../Hooks/UseAxiosSecure";
import UseRole from "../../Hooks/UseRole";
import UseAuth from "../../Hooks/UseAuth";

export default function AdminDashboard() {
  const { user } = UseAuth();
  const { role, isAdmin } = UseRole();
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

  useEffect(() => {
    console.log("📊 Admin Dashboard Loaded");
  }, [user?.email, role]);

  // TanStack Query for Products
  const {
    data: products = [],
    isPending: loading,
    refetch,
  } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get("/products");
        return res.data || [];
      } catch (error) {
        console.error("❌ Error loading products:", error);
        return [];
      }
    },
  });

  // Redirect if not admin
  if (user && role !== "admin" && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b19] text-white">
        <div className="text-center p-6 bg-[#0f172a]/80 border border-slate-800 rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-6">
            This page is strictly reserved for administrators.
          </p>
          <Link
            to="/dashboard/user-dashboard"
            className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-500 transition-colors"
          >
            Go to User Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Cloudinary Image Upload Handler
  // Cloudinary Image Upload via Backend
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert("Image size must be less than 10MB");
      e.target.value = "";
      return;
    }

    const data = new FormData();
    data.append("image", file);

    try {
      setUploading(true);

      const res = await axiosSecure.post("/upload-image", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Upload response:", res.data);

      if (res.data?.success && res.data?.url) {
        setFormData((prev) => ({
          ...prev,
          image: res.data.url,
        }));

        console.log("Cloudinary URL:", res.data.url);
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error(
        "Image upload error:",
        error.response?.data || error.message,
      );

      alert(
        error.response?.data?.message ||
          "Image upload failed. Please try again.",
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uploading) return;

    try {
      if (editingProduct) {
        await axiosSecure.put(`/products/${editingProduct._id}`, formData);
      } else {
        await axiosSecure.post("/products", formData);
      }
      setModalOpen(false);
      resetForm();
      refetch();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosSecure.delete(`/products/${id}`);
        refetch();
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

  // Search & Filter Logic
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

  // Statistics Calculation
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

  const stats = [
    {
      label: "TOTAL PRODUCTS",
      value: totalProducts,
      icon: Layers,
      color: "text-blue-400",
    },
    {
      label: "IN STOCK",
      value: inStock,
      icon: CheckCircle2,
      color: "text-emerald-400",
    },
    {
      label: "OUT OF STOCK",
      value: outOfStock,
      icon: AlertCircle,
      color: "text-rose-400",
    },
    {
      label: "INVENTORY VALUE",
      value: `$${parseFloat(inventoryValue).toLocaleString()}`,
      icon: TrendingUp,
      color: "text-indigo-400",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070b19] text-slate-100 pb-12">
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        {/* User Management Banner */}
        <Link to="/dashboard/user-management" className="block">
          <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-500/50 transition-all group backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl shrink-0">
                <UserCheck size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-200 group-hover:text-indigo-400 transition-colors">
                  User Management Control
                </h4>
                <p className="text-xs text-slate-400">
                  View user list and manage account roles
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        {/* Header & Add Product Action */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Product Management
            </h1>
            <p className="text-xs text-slate-400">
              Manage your inventory, prices, and stock statuses.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus size={18} />
            <span>Add New Product</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-[#0f172a]/60 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all backdrop-blur-md"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold text-slate-400 tracking-wider">
                  {s.label}
                </p>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-extrabold text-white">{s.value}</p>
            </div>
          ))}
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
              className="w-full pl-10 pr-4 py-2.5 bg-[#0f172a]/60 border border-slate-800/80 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 transition-all"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 py-2.5 px-4 bg-[#0f172a]/60 border border-slate-800/80 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50 cursor-pointer"
          >
            <option value="All" className="bg-[#0f172a] text-slate-200">
              All Status
            </option>
            <option value="In Stock" className="bg-[#0f172a] text-slate-200">
              In Stock
            </option>
            <option
              value="Out of Stock"
              className="bg-[#0f172a] text-slate-200"
            >
              Out of Stock
            </option>
          </select>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-medium flex justify-center items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
            Loading products...
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => {
              const isInStock = p.status?.trim().toLowerCase() === "in stock";

              return (
                <div
                  key={p._id}
                  className="bg-[#0f172a]/60 border border-slate-800/80 rounded-2xl p-4 transition-all flex flex-col justify-between space-y-4 hover:border-slate-700 backdrop-blur-md"
                >
                  {p.image ? (
                    <div className="w-full h-44 rounded-xl overflow-hidden bg-[#070b19]">
                      <img
                        src={p.image}
                        alt={p.title || p.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-44 rounded-xl bg-[#070b19] flex items-center justify-center text-slate-600">
                      <ImageIcon className="h-10 w-10 opacity-30" />
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-white line-clamp-1">
                        {p.title || p.name}
                      </h3>
                      <span className="text-[10px] font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-1 rounded-md shrink-0">
                        {p.category || "General"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-indigo-400">
                        ${parseFloat(p.price || 0).toFixed(2)}
                      </span>

                      {isInStock ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          • In Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                          • Out of Stock
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {p.description || "No description provided."}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => openEditModal(p)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 rounded-xl transition-colors"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-rose-300 bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/20 rounded-xl transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-[#0f172a]/60 border border-slate-800/80 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-2 backdrop-blur-md">
            <AlertCircle className="h-10 w-10 text-slate-500" />
            <h3 className="text-lg font-bold text-white">No Products Found</h3>
            <p className="text-xs text-slate-400">
              No products match your current search or status filter.
            </p>
          </div>
        )}
      </main>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto text-slate-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <h3 className="font-bold text-xl text-white mb-1">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Enter the details below to save your product.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Image Input */}
              <div>
                <label className="text-xs font-semibold block mb-1 text-slate-300">
                  Product Image
                </label>

                <div className="flex items-center gap-3">
                  {formData.image ? (
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            image: "",
                          }))
                        }
                        className="absolute top-1 right-1 bg-black/70 hover:bg-rose-600 text-white p-1 rounded-full transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 flex items-center justify-center gap-2 border border-dashed border-slate-700 rounded-xl p-3 cursor-pointer bg-[#070b19] hover:bg-slate-900 transition text-slate-400 text-xs font-medium">
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
                <label className="text-xs font-semibold block mb-1 text-slate-300">
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
                  className="w-full bg-[#070b19] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1 text-slate-300">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Electronics"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full bg-[#070b19] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1 text-slate-300">
                    Price ($) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="e.g. 29.99"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="w-full bg-[#070b19] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1 text-slate-300">
                  Stock Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full bg-[#070b19] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="In Stock" className="bg-[#070b19]">
                    In Stock
                  </option>
                  <option value="Out of Stock" className="bg-[#070b19]">
                    Out of Stock
                  </option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1 text-slate-300">
                  Description
                </label>
                <textarea
                  rows="3"
                  placeholder="Add product description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-[#070b19] border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20 disabled:opacity-50 flex items-center gap-1.5"
                >
                  {uploading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  )}
                  <span>{editingProduct ? "Save Changes" : "Add Product"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
