const Button = ({ 
  children, 
  variant = 'primary', 
  className = '',
  type = 'button', 
  ...props 
  }) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors duration-200 cursor-pointer';
  
  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    pride: 'bg-green-600 hover:bg-green-700 text-white',
  };
  
  return (
    <button 
    className={`${baseClasses} ${variants[variant]} ${className}`}
    type={type}
    {...props}
    >
    {children}
    </button>
  );
  };
  
  export default Button;