import type { SVGProps } from "react";

export function AppStoreBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 135 40"
      role="img"
      aria-label="Download on the App Store"
      {...props}
    >
      <rect width="135" height="40" rx="6" fill="#000" />
      <rect
        x="0.5"
        y="0.5"
        width="134"
        height="39"
        rx="5.5"
        fill="none"
        stroke="#A6A6A6"
        strokeOpacity="0.4"
      />
      {/* Apple logo */}
      <path
        fill="#fff"
        d="M22.92 20.34c-.02-2.27 1.86-3.37 1.94-3.43-1.06-1.55-2.71-1.76-3.3-1.78-1.4-.14-2.74.83-3.45.83-.72 0-1.81-.81-2.99-.79-1.53.02-2.95.89-3.74 2.26-1.6 2.77-.41 6.86 1.14 9.1.76 1.1 1.66 2.33 2.84 2.29 1.15-.05 1.58-.74 2.96-.74 1.38 0 1.77.74 2.97.71 1.23-.02 2-1.12 2.74-2.22.87-1.27 1.23-2.51 1.25-2.57-.03-.01-2.4-.92-2.43-3.66zm-2.27-6.7c.62-.78 1.05-1.85.93-2.93-.9.04-2.02.62-2.66 1.39-.57.68-1.08 1.79-.95 2.83 1.01.08 2.05-.51 2.68-1.29z"
      />
      {/* Text: "Download on the" */}
      <text
        x="33"
        y="14"
        fill="#fff"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="7"
      >
        Download on the
      </text>
      {/* Text: "App Store" */}
      <text
        x="33"
        y="29"
        fill="#fff"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="16"
        fontWeight="600"
      >
        App Store
      </text>
    </svg>
  );
}

export function GooglePlayBadge(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 135 40"
      role="img"
      aria-label="Get it on Google Play"
      {...props}
    >
      <rect width="135" height="40" rx="6" fill="#000" />
      <rect
        x="0.5"
        y="0.5"
        width="134"
        height="39"
        rx="5.5"
        fill="none"
        stroke="#A6A6A6"
        strokeOpacity="0.4"
      />
      {/* Google Play triangular icon */}
      <g transform="translate(10 10)">
        {/* Blue left triangle */}
        <path
          d="M0.5 0.5 L11 10 L0.5 19.5 C0.2 19.3 0 18.9 0 18.5 V1.5 C0 1.1 0.2 0.7 0.5 0.5 Z"
          fill="#2196F3"
        />
        {/* Green top-right */}
        <path
          d="M0.5 0.5 C0.8 0.3 1.2 0.3 1.6 0.5 L14.5 7.7 L11 10 Z"
          fill="#4CAF50"
        />
        {/* Yellow bottom-right */}
        <path
          d="M0.5 19.5 L11 10 L14.5 12.3 L1.6 19.5 C1.2 19.7 0.8 19.7 0.5 19.5 Z"
          fill="#FFC107"
        />
        {/* Red right triangle */}
        <path
          d="M11 10 L14.5 7.7 L17.4 9.3 C18.2 9.7 18.2 10.3 17.4 10.7 L14.5 12.3 Z"
          fill="#F44336"
        />
      </g>
      {/* Text: "GET IT ON" */}
      <text
        x="33"
        y="14"
        fill="#fff"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="7"
      >
        GET IT ON
      </text>
      {/* Text: "Google Play" */}
      <text
        x="33"
        y="29"
        fill="#fff"
        fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
        fontSize="14"
        fontWeight="600"
      >
        Google Play
      </text>
    </svg>
  );
}
