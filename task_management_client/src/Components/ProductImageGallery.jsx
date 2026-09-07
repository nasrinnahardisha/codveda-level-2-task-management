import { useState } from "react";

export default function ProductImageGallery({ mainImage, galleryImages }) {
  const allImages = [mainImage, ...(galleryImages || [])].filter(Boolean);
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border">
        {allImages[selected] ? (
          <img
            src={allImages[selected]}
            alt="পণ্যের ছবি"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📦
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-border transition-all ${
                selected === i
                  ? "border-primary"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <img
                src={img}
                alt={`ছবি ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
