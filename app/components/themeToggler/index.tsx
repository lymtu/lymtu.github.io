import { OsSvg, SunSvg, MoonSvg } from "~/components/svg";

import { useTheme, changeTheme } from "~/lib/store/theme";

export function ThemeToggler() {
  const { expectTheme: theme } = useTheme();

  return (
    <button
      className="toggleBtn"
      onClick={() => {
        switch (theme) {
          case "os":
            changeTheme("light");
            break;
          case "light":
            changeTheme("dark");
            break;
          default:
            changeTheme("os");
            break;
        }
      }}
    >
      {theme === "os" && <OsSvg />}
      {theme === "light" && <SunSvg />}
      {theme === "dark" && <MoonSvg />}
    </button>
  );
}
