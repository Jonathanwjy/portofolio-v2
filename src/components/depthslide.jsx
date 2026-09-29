import React from "react";
import { ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

const DepthSlide = ({
  text = "Depth Slide",
  href = "#",
  className,
  ...props
}) => {
  return (
    <a
      href={href}
      className={cn(
        "relative cursor-pointer flex items-center justify-center gap-2 px-8 py-3 bg-primary text-foreground font-bold rounded-xl border-b-4 border-primary/60 overflow-hidden group active:border-b-0 active:translate-y-1 transition-all",
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2 group-hover:text-background transition-colors duration-200">
        {text} <ArrowDown className="w-4 h-4" />
      </span>

      <div className="absolute inset-0 bg-foreground scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
    </a>
  );
};

export default DepthSlide;
