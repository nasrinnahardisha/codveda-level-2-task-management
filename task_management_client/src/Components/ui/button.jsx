export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}) {
  // Variant Styling
  const variants = {
    default: "bg-black text-white hover:bg-gray-800",
    outline:
      "border border-gray-200 bg-transparent text-gray-900 hover:bg-gray-100",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  // Size Styling
  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-11 px-8 text-base",
    icon: "h-9 w-9 p-0 flex items-center justify-center",
  };

  const baseStyles =
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
