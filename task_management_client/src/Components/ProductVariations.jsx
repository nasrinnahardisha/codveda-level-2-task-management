export default function ProductVariations({ variations, selected, onSelect }) {
  if (!variations || variations.length === 0) return null;

  return (
    <div>
      <label className="text-sm font-semibold mb-2 block">
        পরিমাণ / ভ্যারিয়েশন বেছে নিন
      </label>
      <div className="flex flex-wrap gap-2">
        {variations.map((v, i) => {
          const outOfStock = v.stock === 0;
          const isSelected = selected === i;

          return (
            <button
              key={i}
              onClick={() => !outOfStock && onSelect(i)}
              disabled={outOfStock}
              // cn() এর বদলে সাধারণ Template String দিয়ে কন্ডিশনাল ক্লাস হ্যান্ডেল করা হয়েছে
              className={`px-4 py-2 rounded-xl border-2 border-border text-sm font-medium transition-all ${
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-gray-200 hover:border-primary/60"
              } ${outOfStock ? "opacity-40 cursor-not-allowed line-through" : ""}`}
            >
              {v.label}
              {v.discounted_price
                ? ` — ৳${v.discounted_price}`
                : v.price
                  ? ` — ৳${v.price}`
                  : ""}
            </button>
          );
        })}
      </div>
    </div>
  );
}
