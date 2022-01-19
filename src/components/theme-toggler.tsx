import React from "react"
import { ThemeToggler as GatsbyThemeToggler } from "gatsby-plugin-dark-mode"
import { MdLightMode, MdDarkMode } from "react-icons/md"

interface GatsbyThemeTogglerProps {
  theme: string
  toggleTheme: (theme: string) => void
}

const ThemeToggler = () => {
  return (
    <GatsbyThemeToggler>
      {({ theme, toggleTheme }: GatsbyThemeTogglerProps) => (
        <label className="theme-toggler">
          <input
            type="checkbox"
            onChange={e => toggleTheme(e.target.checked ? "dark" : "light")}
            checked={theme === "dark"}
          />
          {theme === "dark" ? <MdLightMode /> : <MdDarkMode />}
        </label>
      )}
    </GatsbyThemeToggler>
  )
}

export default ThemeToggler
