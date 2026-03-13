import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface IconCircleProps {
  children: ReactNode;
  color?: "green" | "blue" | "red" | "orange" | "purple";
  size?: "sm" | "md" | "lg";
}

const colorMap = {
  green: "bg-adaptig-green-light text-adaptig-green-dark",
  blue: "bg-adaptig-blue-light text-adaptig-blue",
  red: "bg-adaptig-red-light text-adaptig-red",
  orange: "bg-orange-100 text-adaptig-orange",
  purple: "bg-purple-100 text-purple-600",
};

const sizeMap = {
  sm: "h-8 w-8 [&_svg]:h-4 [&_svg]:w-4",
  md: "h-10 w-10 [&_svg]:h-5 [&_svg]:w-5",
  lg: "h-12 w-12 [&_svg]:h-6 [&_svg]:w-6",
};

export function IconCircle({
  children,
  color = "green",
  size = "md",
}: IconCircleProps) {
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0",
        colorMap[color],
        sizeMap[size]
      )}
    >
      {children}
    </div>
  );
}
