import * as React from "react"
import { PageProps, Link } from "gatsby"
import ThemeToggler from "./theme-toggler"

interface LayoutProps {
  location: any
  title: string
  children: React.ReactNode
}

const Layout = ({ location, title, children }: LayoutProps) => {
  const rootPath = `${__PATH_PREFIX__}/`

  return (
    <div className="global-wrapper">
      <header className="global-header">
        <h1 className="main-heading">
          <Link to="/">{title}</Link>
        </h1>
      </header>
      <main>{children}</main>
      <ThemeToggler />
      <footer>
        © {new Date().getFullYear()}, Built with
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
