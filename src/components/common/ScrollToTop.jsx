import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const isFarFromTop = window.scrollY > 800;

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: isFarFromTop ? "auto" : "smooth",
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
