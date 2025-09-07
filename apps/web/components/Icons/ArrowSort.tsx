import React from "react";

interface PropsWithClassName {
  className?: string;
}
interface IconProps {
  color?: string;
  height?: number;
  width?: number;
  sortState?: "asc" | "desc" | "none";
}

function Icon({
  height,
  width,
  color,
  className = "",
  sortState = "none",
}: IconProps & PropsWithClassName) {
  const getArrowClasses = () => {
    switch (sortState) {
      case "asc":
        return { upArrow: "text-black", downArrow: "text-secondary-500" };
      case "desc":
        return { upArrow: "text-secondary-500", downArrow: "text-black" };
      case "none":
      default:
        return {
          upArrow: "text-secondary-500",
          downArrow: "text-secondary-500",
        };
    }
  };

  const { upArrow, downArrow } = getArrowClasses();

  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width={width ?? "20"}
      height={height ?? "20"}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      {/* Down Arrow */}
      <path
        className={downArrow}
        d="M14.84 16.722a.762.762 0 01-.59.278.731.731 0 01-.527-.22l-3.004-3.008a.75.75 0 010-1.06.748.748 0 011.06 0l1.721 1.732V3.75a.75.75 0 011.5 0v10.684l1.722-1.718a.748.748 0 011.059 0 .75.75 0 010 1.06l-2.942 2.946z"
      />
      {/* Up Arrow */}
      <path
        className={upArrow}
        d="M6.34 3.278A.762.762 0 005.75 3a.731.731 0 00-.527.22L2.22 6.228a.75.75 0 000 1.06.748.748 0 001.06 0L5 5.557V16.25a.75.75 0 001.5 0V5.566l1.722 1.718a.748.748 0 001.059 0 .75.75 0 000-1.06L6.339 3.277z"
      />
    </svg>
  );
}

export default Icon;
