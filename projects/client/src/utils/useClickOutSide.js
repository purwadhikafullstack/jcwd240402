import { useRef, useEffect } from "react";

const useClickOutside = (handler) => {
  const domNode = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (domNode.current && !domNode.current.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handler]);

  return domNode;
};

export default useClickOutside;
