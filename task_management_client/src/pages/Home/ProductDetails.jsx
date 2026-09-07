import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router"; // react-router-dom হলে সেটি ব্যবহার করুন
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  Heart,
} from "lucide-react";
import UseAxiosSecure from "../../Hooks/UseAxiosSecure"; // আপনার পাথ অনুযায়ী অ্যাডজাস্ট করুন

export default function ProductDetails({ onAddToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = UseAxiosSecure();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const DEFAULT_IMAGE =
    "https://via.placeholder.com/600?text=No+Image+Available";

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/products/${id}`);
        const data = res.data?.data || res.data;
        setProduct(data);

        // প্রধান ছবি সিলেক্ট করা
        const mainImg =
          data?.image ||
          data?.img ||
          data?.photo ||
          data?.imageUrl ||
          data?.gallery_images?.[0] ||
          DEFAULT_IMAGE;
        setSelectedImage(mainImg);
      } catch (err) {
        console.error("Failed to load product details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    }
  }, [id, axiosSecure]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium text-sm">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-8 flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found!</h2>
        <p className="text-slate-400 mb-6">
          The product you are looking for might have been removed or is
          unavailable.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-all"
        >
          Go Back
        </button>
      </div>
    );
  }

  // বিভিন্ন ছবির অ্যারে তৈরি (গ্যালারি বা সিঙ্গেল ইমেজ)
  const gallery = product.gallery_images || [
    product.image ||
      product.img ||
      product.photo ||
      product.imageUrl ||
      DEFAULT_IMAGE,
  ];

  const handleAddToCartClick = () => {
    if (onAddToCart) {
      onAddToCart({ ...product, quantity });
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white mb-8 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left Column: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="w-full h-[380px] sm:h-[480px] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden relative group">
              <img
                src={selectedImage}
                alt={product.name || product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className="absolute top-4 right-4 p-3 rounded-2xl bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-rose-500 backdrop-blur-md transition-all active:scale-95"
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-rose-500 text-rose-500" : ""}`}
                />
              </button>
            </div>

            {/* Thumbnail Gallery */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-slate-900 ${
                      selectedImage === imgUrl
                        ? "border-indigo-500 scale-95"
                        : "border-slate-800 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details Info */}
          <div className="flex flex-col">
            {/* Category / Tag */}
            {product.category && (
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full w-fit mb-3">
                {product.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
              {product.name || product.title}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-sm mb-6">
              <div className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-semibold">{product.rating || "4.8"}</span>
              </div>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-medium">In Stock</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 pb-6 border-b border-slate-800">
              <span className="text-3xl sm:text-4xl font-extrabold text-white">
                ${product.discounted_price || product.price}
              </span>
              {product.discounted_price && (
                <span className="text-lg text-slate-500 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="py-6 border-b border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2">
                Description
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {product.description ||
                  "No detailed description provided for this product."}
              </p>
            </div>

            {/* Quantity Selector & Action Button */}
            <div className="py-6 flex flex-col sm:flex-row items-center gap-4">
              {/* Quantity */}
              <div className="flex items-center border border-slate-800 bg-slate-900 rounded-2xl p-1 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors active:scale-95"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 font-bold text-white text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCartClick}
                className="w-full flex-grow py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-2xl transition-all shadow-lg shadow-indigo-600/25 active:scale-95 flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
            </div>

            {/* Features Info Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Fast Delivery
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Within 2-3 business days
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Authentic Product
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    100% original guaranteed
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-white">
                    Easy Returns
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    7 Days return policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
