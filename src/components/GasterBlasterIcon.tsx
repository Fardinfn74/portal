export function GasterBlasterIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 100" 
      fill="currentColor"
      className={className}
    >
      <path d="M50 10 
               C 70 20, 80 40, 75 60
               C 70 80, 60 90, 50 90
               C 40 90, 30 80, 25 60
               C 20 40, 30 20, 50 10 Z" />
      <circle cx="35" cy="50" r="8" fill="black" />
      <circle cx="65" cy="50" r="8" fill="black" />
      <path d="M45 65 L 55 65 L 50 75 Z" fill="black" />
    </svg>
  );
}
