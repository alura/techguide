import React from "react";

export function OptionalIcon({
  size = "10px",
  color = "currentColor",
}: {
  size?: string;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0_1709_1547"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="10"
        height="10"
      >
        <path
          d="M2.73854 8.80907C4.86435 10.0364 7.58243 9.30809 8.80977 7.18229C10.0371 5.05648 9.30879 2.3384 7.18299 1.11106C5.05718 -0.116271 2.3391 0.612038 1.11176 2.73784C-0.115571 4.86365 0.612738 7.58173 2.73854 8.80907Z"
          fill="white"
          stroke="white"
          strokeWidth="0.888889"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.2286 3.96005L6.69271 5.96005M4.96063 2.9601L4.96068 6.96001M6.69268 3.9601L3.22863 5.96001"
          stroke="black"
          strokeWidth="0.888889"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </mask>
      <g mask="url(#mask0_1709_1547)">
        <path d="M0 0L10 0V10H0L0 0Z" fill={color} />
      </g>
    </svg>
  );
}
