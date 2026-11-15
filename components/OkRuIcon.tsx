import React from 'react';

interface OkRuIconProps extends React.SVGProps<SVGSVGElement> {}

export function OkRuIcon({
  className = "w-5 h-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
  ...props
}: OkRuIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <path d="M12 0a12 12 0 1 0 12 12A12.014 12.014 0 0 0 12 0Zm-.005 4.35a3.349 3.349 0 1 1-3.349 3.349 3.35 3.35 0 0 1 3.349-3.349ZM17.4 15.65a8.777 8.777 0 0 1-3.633 1.947l3.425 3.4a1.272 1.272 0 1 1-1.8 1.8l-3.41-3.385a8.88 8.88 0 0 1-3.41 3.385 1.272 1.272 0 0 1-1.8-1.8l3.426-3.4a8.777 8.777 0 0 1-3.634-1.947 1.272 1.272 0 0 1 1.76-1.834 6.275 6.275 0 0 0 7.316 0 1.272 1.272 0 0 1 1.76 1.834Z" />
    </svg>
  );
}
