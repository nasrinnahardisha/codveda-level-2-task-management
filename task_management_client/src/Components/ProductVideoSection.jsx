import { Play } from "lucide-react";

function getEmbedUrl(url) {
  if (!url) return null;
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Facebook
  if (url.includes("facebook.com"))
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  return url;
}

export default function ProductVideoSection({ videoUrl }) {
  if (!videoUrl) return null;
  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div className="bg-muted/50 rounded-2xl overflow-hidden border border-border">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border bg-muted">
        <Play className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">পণ্যের ভিডিও</span>
      </div>
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title="পণ্যের ভিডিও"
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    </div>
  );
}
