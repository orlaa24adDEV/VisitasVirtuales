
// eslint-disable-next-line no-unused-vars
const Button = ({onClick, disabled = false, type = 'submit', variant = 'primary', size = 'normal', children, className = '', iconPosition = 'left'}) => {
    const baseStyles = "rounded-md transition-all min-w-fit flex items-center justify-center whitespace-nowrap disabled:cursor-not-allowed cursor-pointer shadow-sm duration-200";
    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        secondary: "bg-slate-500 text-white hover:bg-slate-600",
        danger: "bg-red-500 text-white hover:bg-red-600",
        outline: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-50",
        ghost: "bg-transparent text-slate-700 hover:bg-slate-50 shadow-none!",
    };

    const iconOnly = typeof children === 'object' && !Array.isArray(children);

    const sizes = {
        small: `text-sm h-8 p-1.5 font-medium ${iconOnly ? 'w-8 h-8 p-0!' : ''}`,
        normal: `text-base h-10 px-4 py-2 font-medium ${iconOnly ? 'w-10 h-10 p-0!' : ''}`,
        large: `text-lg h-12 px-8 py-3 font-semibold ${iconOnly ? 'w-10 h-10 p-0!' : ''}`,
    };

    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50' : ''} ${className}`}
      >
        {children}
      </button>
    );
}
export default Button;