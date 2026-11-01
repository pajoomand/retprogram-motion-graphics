import type { CSSProperties } from "react";

export type PerspectiveIconName =
  | "clinical"
  | "innovation"
  | "funding"
  | "experience";

export const PerspectiveIcon = ({
  name,
  size = 64,
  style,
}: {
  readonly name: PerspectiveIconName;
  readonly size?: number;
  readonly style?: CSSProperties;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={style}
    aria-hidden="true"
  >
    {name === "clinical" ? (
      <>
        <path d="M17 12v13a11 11 0 0 0 22 0V12M17 12h5m12 0h5M28 36v8a11 11 0 0 0 22 0v-5" />
        <circle cx="50" cy="33" r="6" />
        <path d="M22 10v5m12-5v5" />
      </>
    ) : null}
    {name === "innovation" ? (
      <>
        <path d="M22 36c-4-3-6-7-6-12a16 16 0 0 1 32 0c0 5-2 9-6 12-3 2-4 5-4 8H26c0-3-1-6-4-8Z" />
        <path d="M26 49h12m-10 5h8M32 43V30m-6-5 6 5 6-5M8 24H4m56 0h-4M13 8l-3-3m41 3 3-3" />
      </>
    ) : null}
    {name === "funding" ? (
      <>
        <rect x="22" y="9" width="31" height="43" rx="5" />
        <path d="M30 19h15m-15 7h9m-6 11 4 4 8-9" />
        <ellipse cx="17" cy="39" rx="10" ry="4" />
        <path d="M7 39v7c0 2 4 4 10 4s10-2 10-4v-7M7 46v7c0 2 4 4 10 4s10-2 10-4v-7" />
      </>
    ) : null}
    {name === "experience" ? (
      <>
        <circle cx="24" cy="18" r="7" />
        <circle cx="44" cy="22" r="6" />
        <path d="M10 49V38c0-7 6-12 14-12 6 0 11 3 13 8m2-4c8-1 15 5 15 12v7M17 39v13m14-13v13" />
        <path d="M41 51s-8-5-8-10a4 4 0 0 1 8-1 4 4 0 0 1 8 1c0 5-8 10-8 10Z" />
      </>
    ) : null}
  </svg>
);
