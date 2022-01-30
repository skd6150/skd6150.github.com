import * as React from "react"
import { PageProps, Link, graphql } from "gatsby"
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md"
import Bio from "../components/bio"
import CategoryFilter from "../components/category-filter"
import Layout from "../components/layout"
import Seo from "../components/seo"

interface BlogIndexProps {
  site: {
    siteMetadata: {
      title: string
      numPost: number
    }
  }
  allMarkdownRemark: {
    nodes: {
      excerpt: string
      fields: {
        slug: string
      }
      frontmatter: {
        date: string
        title: string
        description: string
      }
    }[]
    totalCount: number
  }
}

interface PageContext {
  category: string
  skip: number
  limit: number
  index: number
}

const BlogIndex: React.FC<PageProps<BlogIndexProps>> = ({
  data,
  location,
  pageContext,
}) => {
  const siteTitle = data.site.siteMetadata.title
  const posts = data.allMarkdownRemark.nodes
  const category = (pageContext as PageContext).category
  const endIndex =
    data.allMarkdownRemark.totalCount / data.site.siteMetadata.numPost
  const pageIndex = (pageContext as PageContext).index
  const pathPrefix = category.length > 1 ? "" : `/${category[0]}`

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title={category.length > 1 ? "Home" : category[0]} />
        <Bio />
        <CategoryFilter />
        <p>No blog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title={category.length > 1 ? "Home" : category[0]} />
      <Bio />
      <CategoryFilter />
      <ol style={{ listStyle: `none` }} className="post-list">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug}>
              <Link to={post.fields.slug} itemProp="url">
                <article
                  className="post-list-item"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <header>
                    <h2>
                      <span itemProp="headline">{title}</span>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </article>
              </Link>
            </li>
          )
        })}
      </ol>
      <div>
        {pageIndex - 1 >= 0 && (
          <Link
            className="page-navigator"
            data-direction="prev"
            to={
              pageIndex - 1 === 0
                ? `${pathPrefix}/`
                : `${pathPrefix}/${pageIndex - 1}`
            }
          >
            <MdKeyboardArrowLeft />
            prev
          </Link>
        )}
        {pageIndex + 1 < endIndex && (
          <Link
            className="page-navigator"
            data-direction="next"
            to={`${pathPrefix}/${pageIndex + 1}`}
          >
            next
            <MdKeyboardArrowRight />
          </Link>
        )}
      </div>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query PostListQuery($category: [String], $skip: Int, $limit: Int) {
    site {
      siteMetadata {
        title
        numPost
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { categories: { in: $category } } }
      skip: $skip
      limit: $limit
    ) {
      nodes {
        excerpt(truncate: true)
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
      totalCount
    }
  }
`
