import React from "react";

export type IconName = "research" | "education" | "training";

export const Icon: React.FC<{
  name: IconName;
  color: string;
  size?: number;
}> = ({ name, color, size = 48 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      {name === "research" ? (
        <>
          <circle cx="21" cy="21" r="11" stroke={color} strokeWidth="2" />
          <circle cx="21" cy="21" r="4" stroke={color} strokeWidth="2" />
          <path
            d="M29 29l8 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {name === "education" ? (
        <>
          <path
            d="M8 12.5c5.8-2.2 11.1-1.6 16 1.8v24c-4.9-3.4-10.2-4-16-1.8v-24Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M40 12.5c-5.8-2.2-11.1-1.6-16 1.8v24c4.9-3.4 10.2-4 16-1.8v-24Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M13 19h6M13 24h6M29 19h6M29 24h6"
            stroke={color}
            strokeWidth="1.5"
          />
        </>
      ) : null}
      {name === "training" ? (
        <>
          <path
            d="M8 34h10c7 0 8-20 15-20h7"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="m35 9 5 5-5 5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="34" r="3" fill={color} />
        </>
      ) : null}
    </svg>
  );
};
