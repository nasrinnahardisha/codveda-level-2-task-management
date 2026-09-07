import * as React from "react";

// ১. ভ্যারিয়েন্ট ও সাইজের জন্য সাধারণ অবজেক্ট ম্যাপিং
const variantStyles = {
  default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
  destructive:
    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
  outline:
    "border border-input bg-transparent shadow-sm hover:bg-accent hover:text-accent-foreground",
  secondary:
    "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
  ghost: "hover:bg-accent hover:text-accent-foreground",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizeStyles = {
  default: "h-9 px-4 py-2",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8",
  icon: "h-9 w-9",
};

// ২. মেইন বাটন কম্পোনেন্ট
const Button = React.forwardRef(
  (
    { className = "", variant = "default", size = "default", ...props },
    ref,
  ) => {
    // বাটনের কমন বা বেস ক্লাসসমূহ
    const baseClasses =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0";

    // প্রপ্স অনুযায়ী ক্লাস সিলেক্ট করা
    const selectedVariant = variantStyles[variant] || variantStyles.default;
    const selectedSize = sizeStyles[size] || sizeStyles.default;

    // সব ক্লাস একসাথে জোড়া দেওয়া (কোনো এক্সটার্নাল cn ফাংশন ছাড়া)
    const combinedClasses =
      `${baseClasses} ${selectedVariant} ${selectedSize} ${className}`
        .trim()
        .replace(/\s+/g, " ");

    return <button ref={ref} className={combinedClasses} {...props} />;
  },
);

Button.displayName = "Button";

export { Button };
