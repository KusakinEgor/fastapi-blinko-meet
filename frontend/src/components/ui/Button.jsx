export default function Button({ children, variant = "primary", ...props }) {
  const baseClasses = `
    w-full py-3 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 active:scale-95
  `;

  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 shadow-blue-900/40",
    success: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/40",
    danger: "bg-red-600 hover:bg-red-700 shadow-red-900/40",
    secondary: "bg-gray-700 hover:bg-gray-600 shadow-black/40",
  };

  return (
    <button className={`${baseClasses} ${variants[variant]}`} {...props}>
      {children}
    </button>
  );
}
