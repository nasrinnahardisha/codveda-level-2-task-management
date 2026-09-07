// মেইন অ্যাভাটার কন্টেইনার
export function Avatar({ children, className = "" }) {
  return (
    <div
      className={`relative flex h-8 w-8 shrink-0 overflow-hidden rounded-full ${className}`}
    >
      {children}
    </div>
  );
}

// অ্যাভাটার ছবি (যদি ইমেজ দিয়ে ব্যবহার করতে চান)
export function AvatarImage({ src, alt = "Avatar", className = "" }) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={`aspect-square h-full w-full object-cover ${className}`}
    />
  );
}

// নাম বা ইনিশিয়াল টেক্সটের জন্য ফলব্যাক
export function AvatarFallback({ children, className = "" }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center rounded-full bg-black text-white text-xs font-semibold ${className}`}
    >
      {children}
    </div>
  );
}
