import * as React from "react"
import { PageProps, Link, graphql } from "gatsby"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import Bio from "../components/bio"
import Layout from "../components/layout"
import Seo from "../components/seo"
import Badge from "../components/badge"

interface BlogPostTemplateProps {
  site: {
    siteMetadata: {
      title: string
    }
  }
  markdownRemark: {
    id: string
    excerpt: string
    html: string
    frontmatter: {
      title: string
      date: string
      description: string
      categories: string[]
    }
  }
  previous: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
    }
  }
  next: {
    fields: {
      slug: string
    }
    frontmatter: {
      title: string
    }
  }
}

const BlogPostTemplate: React.FC<PageProps<BlogPostTemplateProps>> = ({
  data,
  location,
}) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data
  const categories = data.markdownRemark.frontmatter.categories

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <header>
          <div className="blog-post-header">
            <h1 itemProp="headline">{post.frontmatter.title}</h1>
            <p>{post.frontmatter.date}</p>
          </div>
          <div className="blog-post-categories">
            {categories.map(category => (
              <Badge key={category}>{category}</Badge>
            ))}
          </div>
        </header>
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
        <footer>
          <Bio isolated />
        </footer>
      </article>
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link
                className="page-navigator"
                data-direction="prev"
                to={previous.fields.slug}
                rel="prev"
              >
                <MdKeyboardArrowLeft />
                {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link
                className="page-navigator"
                data-direction="next"
                to={next.fields.slug}
                rel="next"
              >
                {next.frontmatter.title}
                <MdKeyboardArrowRight />
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        categories
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
