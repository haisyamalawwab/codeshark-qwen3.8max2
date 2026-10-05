import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function make(children: ReactNode, viewBox = "0 0 24 24") {
  return function Icon({ size = 20, ...rest }: IconProps) {
    return (
      <svg
        width={size}
        height={size}
        viewBox={viewBox}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        {...rest}
      >
        {children}
      </svg>
    );
  };
}

export const IconPlay = make(<path d="M7 4.5v15l13-7.5z" fill="currentColor" stroke="none" />);
export const IconPause = make(
  <>
    <rect x="6" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
    <rect x="14" y="4.5" width="4" height="15" rx="1.2" fill="currentColor" stroke="none" />
  </>
);
export const IconX = make(
  <>
    <path d="M5.5 5.5l13 13" />
    <path d="M18.5 5.5l-13 13" />
  </>
);
export const IconArrowR = make(
  <>
    <path d="M4 12h15" />
    <path d="M13 6l6 6-6 6" />
  </>
);
export const IconArrowL = make(
  <>
    <path d="M20 12H5" />
    <path d="M11 6l-6 6 6 6" />
  </>
);
export const IconCheck = make(<path d="M4.5 12.5l5 5L19.5 6.5" />);
export const IconRetry = make(
  <>
    <path d="M20 12a8 8 0 1 1-2.9-6.2" />
    <path d="M20 3v5h-5" />
  </>
);
export const IconHeart = make(
  <path
    d="M12 20.5S3.5 15.2 3.5 9.3C3.5 6.4 5.7 4.5 8 4.5c1.7 0 3.2 1 4 2.4.8-1.4 2.3-2.4 4-2.4 2.3 0 4.5 1.9 4.5 4.8 0 5.9-8.5 11.2-8.5 11.2z"
    fill="currentColor"
    stroke="none"
  />
);
export const IconStar = make(
  <path
    d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z"
    fill="currentColor"
    stroke="none"
  />
);
export const IconStarLine = make(
  <path d="M12 2.8l2.8 5.9 6.4.8-4.7 4.4 1.2 6.3L12 17.1l-5.7 3.1 1.2-6.3-4.7-4.4 6.4-.8z" />
);
export const IconCoin = make(
  <>
    <circle cx="12" cy="12" r="8.5" fill="currentColor" stroke="none" opacity="0.25" />
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.6" />
    <path d="M12 9.6v4.8" />
  </>
);
export const IconBolt = make(
  <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor" stroke="none" />
);
export const IconBook = make(
  <>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15.5H6.5A2.5 2.5 0 0 0 4 21z" />
    <path d="M4 18.5A2.5 2.5 0 0 1 6.5 16H20" />
    <path d="M9 8h7" />
  </>
);
export const IconKeyboard = make(
  <>
    <rect x="2.5" y="6" width="19" height="12" rx="2.5" />
    <path d="M6.5 10h.01M10.2 10h.01M13.9 10h.01M17.5 10h.01M6.5 14h.01M17.5 14h.01M9.5 14h5" />
  </>
);
export const IconTimer = make(
  <>
    <circle cx="12" cy="13.5" r="7.5" />
    <path d="M12 13.5V9.5" />
    <path d="M9.5 2.5h5" />
    <path d="M12 2.5V6" />
  </>
);
export const IconTarget = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <circle cx="12" cy="12" r="4.5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
  </>
);
export const IconLock = make(
  <>
    <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
    <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" />
    <circle cx="12" cy="15.2" r="1.3" fill="currentColor" stroke="none" />
  </>
);
export const IconSound = make(
  <>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" fill="currentColor" stroke="none" />
    <path d="M15.5 9a4.5 4.5 0 0 1 0 6" />
    <path d="M18 6.5a8.5 8.5 0 0 1 0 11" />
  </>
);
export const IconMute = make(
  <>
    <path d="M4 9.5v5h3.5L12 19V5L7.5 9.5z" fill="currentColor" stroke="none" />
    <path d="M16 9.5l5 5M21 9.5l-5 5" />
  </>
);
export const IconMap = make(
  <>
    <path d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6z" />
    <path d="M9 4v14M15 6v14" />
  </>
);
export const IconHome = make(
  <>
    <path d="M4 11l8-7 8 7" />
    <path d="M6 9.5V20h12V9.5" />
    <path d="M10 20v-5h4v5" />
  </>
);
export const IconConsole = make(
  <>
    <rect x="2.5" y="4" width="19" height="16" rx="2.5" />
    <path d="M6.5 9l3.5 3-3.5 3" />
    <path d="M12.5 15.5h5" />
  </>
);
export const IconTag = make(
  <>
    <path d="M8.5 7L4 12l4.5 5" />
    <path d="M15.5 7L20 12l-4.5 5" />
    <path d="M13.2 5.5l-2.4 13" />
  </>
);
export const IconBrush = make(
  <>
    <path d="M19.5 4.5c-3.6 1.6-7.4 4.9-9.6 7.9l2.2 2.2c3-2.2 6.3-6 7.9-9.6z" fill="currentColor" stroke="none" opacity="0.3" />
    <path d="M19.5 4.5c-3.6 1.6-7.4 4.9-9.6 7.9l2.2 2.2c3-2.2 6.3-6 7.9-9.6z" />
    <path d="M9.5 12.9c-2 .4-3 1.7-3.3 4.6 2.6.6 4.7-.2 5.7-2.2z" />
  </>
);
export const IconTrophy = make(
  <>
    <path d="M7 4h10v5a5 5 0 0 1-10 0z" />
    <path d="M7 5.5H4.5a0 0 0 0 0 0 0c0 3 1 4.5 2.9 5M17 5.5h2.5c0 3-1 4.5-2.9 5" />
    <path d="M12 14v3" />
    <path d="M8 20.5h8M9.5 17.5h5v3h-5z" />
  </>
);
export const IconEye = make(
  <>
    <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3" />
  </>
);
export const IconInfo = make(
  <>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5" />
    <circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none" />
  </>
);
export const IconFin = make(
  <path
    d="M4 19c1.5-8 7-12.5 16-13.5-3 3.5-4 6.5-4 13.5H4z M15.5 19c.8-3.4 2.5-5.6 5-7-.8 2.4-.9 4.2-.9 7h-4.1z"
    fill="currentColor"
    stroke="none"
  />
);

