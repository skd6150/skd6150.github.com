import React from "react"
import { Link } from "gatsby"

interface BadgeProps {
  children: React.ReactNode
  link?: string
}

const Badge = ({ children, link }: BadgeProps) => {
  return link ? (
    <Link to={link} style={{ textDecoration: "none" }} className="badge">
      {children}
    </Link>
  ) : (
    <span className="badge">{children}</span>
  )
}

export default Badge
