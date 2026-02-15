// ./components/SearchIcon.js
export default function SearchIcon() {
  return (
    <svg
      width="100px"
      height="100px"
      viewBox="0 0 64 64"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <circle
          cx="27"
          cy="27"
          r="16"
          stroke="#394240"
          strokeWidth="2"
          fill="none"
        />
        <line
          x1="37"
          y1="37"
          x2="57"
          y2="57"
          stroke="#394240"
          strokeWidth="2"
        />
        <line
          x1="40"
          y1="27"
          x2="14"
          y2="27"
          stroke="#F76D57"
          strokeWidth="4"
        >
          <animate
            attributeName="x1"
            values="27;40;27"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="x2"
            values="27;14;27"
            dur="2s"
            repeatCount="indefinite"
          />
        </line>
      </g>
    </svg>
  );
}
