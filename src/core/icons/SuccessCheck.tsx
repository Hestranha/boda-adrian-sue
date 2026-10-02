import "../../styles/SuccessCheck.css";

interface SuccessCheckProps {
  id?: string;
  className?: string;
}

const SuccessLoop = ({ id, className = "" }: SuccessCheckProps) => {
  return (
    <div id={id} className={`success-container ${className}`.trim()}>
      <svg 
        className="success-mark" 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 52 52"
      >
        <circle 
          className="success-mark__circle" 
          cx="26" 
          cy="26" 
          r="25" 
          fill="none"
        />
        <path 
          className="success-mark__check" 
          fill="none" 
          d="M14.1 27.2l7.1 7.2 16.7-16.8"
        />
      </svg>
    </div>
  );
};

export default SuccessLoop;