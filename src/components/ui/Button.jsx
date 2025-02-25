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
    secondary: 'bg-gray-900 hover:bg-gray-500 text-white',
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