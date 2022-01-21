import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import Badge from "./badge"

interface node {
  frontmatter: {
    categories: string[]
  }
}

const CategoryFilter = () => {
  const data = useStaticQuery(graphql`
    query CategoryQuery {
      allMarkdownRemark {
        nodes {
          frontmatter {
            categories
          }
        }
      }
    }
  `)

  const categories: string[] = Array.from(
    new Set(
      data.allMarkdownRemark.nodes
        .map((node: node) => node.frontmatter.categories)
        .flat()
    )
  )

  return (
    <div className="categories-filter">
      <Badge link="/">All</Badge>
      {categories.map(category => {
        return (
          <Badge key={category} link={`/${category}`}>
            {category}
          </Badge>
        )
      })}
    </div>
  )
}

export default CategoryFilter
