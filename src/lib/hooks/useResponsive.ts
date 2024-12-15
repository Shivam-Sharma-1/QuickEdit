"use client";

import { useState, useEffect } from "react";

export function useResponsive(mobileBreakpoint: number = 640) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Scroll to top on mount
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }

    // Check if window is available (client-side)
    if (typeof window !== "undefined") {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= mobileBreakpoint);
      };

      // Initial check
      checkMobile();

      // Add event listener
      window.addEventListener("resize", checkMobile);

      // Cleanup
      return () => {
        window.removeEventListener("resize", checkMobile);
      };
    }
  }, [mobileBreakpoint]);

  return isMobile;
}
