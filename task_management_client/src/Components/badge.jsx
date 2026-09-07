// ১. ভ্যারিয়েন্টের অবজেক্ট (ভেতরে রাখা হলো)
const styles = {
  default:
    "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary:
    "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive:
    "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground border-input",
};

// ২. শ্যাডসিএন-এর মতো করে badgeVariants-কে ফাংশন বানিয়ে এক্সপোর্ট করা
const badgeVariants = (options) => {
  const variant = options?.variant || "default";
  return styles[variant] || styles.default;
};

// ৩. মেইন ব্যাজ কম্পোনেন্ট
function Badge({ className = "", variant = "default", ...props }) {
  const baseClasses =
    "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  // এখানে ফাংশন হিসেবে কল করা হচ্ছে
  const selectedVariant = badgeVariants({ variant });

  const combinedClasses = `${baseClasses} ${selectedVariant} ${className}`
    .trim()
    .replace(/\s+/g, " ");

  return <div className={combinedClasses} {...props} />;
}

export { Badge };
