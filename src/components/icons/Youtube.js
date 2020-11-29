import * as React from "react";

function SvgYoutube(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      viewBox="0 0 18 18"
      {...props}
    >
      <g fill="#fff">
        <path d="M2.637 13.71h12.726A2.64 2.64 0 0018 11.075V2.637A2.64 2.64 0 0015.363 0H2.637A2.64 2.64 0 000 2.637v8.437a2.64 2.64 0 002.637 2.637zM1.055 2.638c0-.871.71-1.582 1.582-1.582h12.726c.871 0 1.582.71 1.582 1.582v8.437c0 .871-.71 1.582-1.582 1.582H2.637c-.871 0-1.582-.71-1.582-1.582zm0 0" />
        <path d="M6.363 3.324v7.168l6.348-3.644zm1.055 1.79l3.144 1.75-3.144 1.804zm0 0" />
      </g>
    </svg>
  );
}

export default SvgYoutube;
