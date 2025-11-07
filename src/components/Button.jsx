const Button = ({ 
  label, 
  onClick, 
  type = "button", 
  className = "", 
  variant = "primary" // "primary" | "secondary" | "outline"
}) => {
  // Base styles
  const base =
    "px-5 py-2.5 font-semibold rounded-lg transition-all duration-200 shadow-sm";

  // Variants
  const variants = {
    primary: "bg-[#0260a4] text-white hover:bg-[#01497c]",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200",
    outline:
      "bg-white border border-[#0260a4] text-[#0260a4] hover:bg-[#f0f9ff]",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      className={`${base} ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
