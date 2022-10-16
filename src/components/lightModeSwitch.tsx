import React, { useEffect } from "react";
import { FaLightbulb } from "react-icons/fa";

const LightModeSwitch: React.FC = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleLightMode = () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  };

  return (
    <button
      className="rounded-full absolute bottom-5 right-5 bg-stone-900 text-blue-50 dark:bg-white dark:text-black p-2"
      title="Switch light mode"
      onClick={toggleLightMode}
    >
      <FaLightbulb />
    </button>
  );
};

export default LightModeSwitch;
