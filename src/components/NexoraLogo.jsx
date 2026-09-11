const NexoraLogo = ({ className = "w-8 h-8", textClassName = "text-2xl" }) => {
  return (
    <div className="flex items-center cursor-pointer">
      <svg
        className={`${className} text-blue-500 mr-2`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span className={`${textClassName} font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500`}>
        Nexora AI
      </span>
    </div>
  );
};

export default NexoraLogo;