import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Star, CheckCircle } from "lucide-react";
import { Button } from "../Components/button";
import { toast } from "sonner";
import UseAxiosSecure from "../Hooks/UseAxiosSecure";

function StarRating({ value, onChange, size = "md" }) {
  const [hovered, setHovered] = useState(0);
  const sz = size === "sm" ? "w-4 h-4" : "w-6 h-6";
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHovered(star)}
          onMouseLeave={() => onChange && setHovered(0)}
          className={onChange ? "cursor-pointer" : "cursor-default"}
        >
          <Star
            className={`${sz} transition-colors ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm">
            {review.reviewer_name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-sm">
                {review.reviewer_name}
              </span>
              {review.is_verified && (
                <span className="flex items-center gap-0.5 text-xs text-green-600">
                  <CheckCircle className="w-3 h-3" /> যাচাইকৃত
                </span>
              )}
            </div>
            <StarRating value={review.rating} size="sm" />
          </div>
        </div>
        <span className="text-xs text-muted-foreground">
          {review.created_date
            ? new Date(review.created_date).toLocaleDateString("bn-BD")
            : "সদ্য প্রস্তুত"}
        </span>
      </div>
      {review.comment && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {review.comment}
        </p>
      )}
    </div>
  );
}

export default function ProductReviews({ productId }) {
  const queryClient = useQueryClient();
  const axiosSecure = UseAxiosSecure();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    reviewer_name: "",
    rating: 5,
    comment: "",
  });

  // base44 এর বদলে Axios দিয়ে ডাটা ফেচিং
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/reviews?product_id=${productId}`,
      );
      return response.data.data || response.data || [];
    },
    enabled: !!productId,
  });

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : null;

  // ১. Mutation এরর কনসোল লগের ব্যবস্থা করা
  const mutation = useMutation({
    mutationFn: async (newReview) => {
      // ডাটা ব্যাকএন্ডে পাঠানোর আগে কনসোলে দেখে নিন কী যাচ্ছে
      console.log("🚀 ব্যাকএন্ডে পাঠানো হচ্ছে রিভিউ ডাটা:", newReview);
      const response = await axiosSecure.post("/reviews", newReview);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      setForm({ reviewer_name: "", rating: 5, comment: "" });
      setShowForm(false);
      toast.success("রিভিউ দেওয়ার জন্য ধন্যবাদ!");
    },
    onError: (error) => {
      // কনসোলে এরর প্রিন্ট করলে আপনি আসল সমস্যা ধরতে পারবেন
      console.error(
        "❌ রিভিউ সাবমিট এরর:",
        error.response?.data || error.message,
      );
      toast.error(
        error.response?.data?.message ||
          "রিভিউ জমা দেওয়া যায়নি, আবার চেষ্টা করুন।",
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.reviewer_name.trim()) return toast.error("নাম দিন");
    mutation.mutate({ ...form, product_id: productId });
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">ক্রেতাদের মতামত</h2>
          {avgRating && (
            <div className="flex items-center gap-2 mt-1">
              <span className="text-3xl font-bold text-amber-500">
                {avgRating}
              </span>
              <div>
                <StarRating
                  value={Math.round(parseFloat(avgRating))}
                  size="sm"
                />
                <p className="text-xs mt-2 text-muted-foreground">
                  {reviews.length}টি রিভিউ
                </p>
              </div>
            </div>
          )}
        </div>
        <Button variant="outline" onClick={() => setShowForm(!showForm)}>
          {showForm ? "বাতিল" : "+ রিভিউ দিন"}
        </Button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-secondary/50 rounded-xl p-5 space-y-4 border border-border"
        >
          <h3 className="font-semibold">আপনার মতামত দিন</h3>
          <div>
            <label className="text-sm font-medium mb-1 block">রেটিং</label>
            <StarRating
              value={form.rating}
              onChange={(r) => setForm({ ...form, rating: r })}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              আপনার নাম *
            </label>
            <input
              value={form.reviewer_name}
              onChange={(e) =>
                setForm({ ...form, reviewer_name: e.target.value })
              }
              placeholder="যেমন: রহিম সাহেব"
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">মন্তব্য</label>
            <textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              rows={3}
              placeholder="পণ্য সম্পর্কে আপনার অভিজ্ঞতা লিখুন..."
              className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <Button
            type="submit"
            disabled={mutation.isPending}
            className="w-full"
          >
            {mutation.isPending ? "জমা হচ্ছে..." : "রিভিউ জমা দিন"}
          </Button>
        </form>
      )}

      {/* Reviews list */}
      <div className="space-y-3">
        {reviews.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground text-sm">
            এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!
          </div>
        ) : (
          reviews.map((r, i) => (
            <ReviewCard key={r._id || r.id || i} review={r} />
          ))
        )}
      </div>
    </div>
  );
}
