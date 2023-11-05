import { useState } from "react";
import { BiSun, BiMoon } from "react-icons/bi";

const Header = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme"));
  const element = document.documentElement;

  switch (theme) {
    case "dark":
      element.classList.add("dark");
      localStorage.setItem("theme", "dark");
      break;
    case "light":
      element.classList.remove("dark");
      localStorage.setItem("theme", "light");
      break;
    default:
      break;
  }

  return (
    <div
      onClick={() => (theme === "light" ? setTheme("dark") : setTheme("light"))}
      className="cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-800 px-3 py-2 rounded transition-all duration-[0.5s]"
    >
      {theme === "dark" ? (
        <div className="flex items-center gap-4 ml-1">
          <BiSun className="w-7 h-6 text-amber-500" />
        </div>
      ) : (
        <div className="flex items-center gap-4 ml-1">
          <BiMoon className="w-7 h-6 text-sky-400" />
        </div>
      )}
    </div>
  );
};

export default Header;
