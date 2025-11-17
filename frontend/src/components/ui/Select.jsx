export default function Select({ children, ...props }) {
  return (
    <select
      className="
        w-full p-3 rounded-xl bg-white/5 border border-white/10
        focus:border-blue-500/40 outline-none transition-all duration-200
      "
      {...props}
    >
      {children}
    </select>
  );
}
