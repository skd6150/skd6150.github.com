const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/blog-post.tsx`)
  const postList = path.resolve(`./src/templates/post-list.tsx`)

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        site {
          siteMetadata {
            numPost
          }
        }
        allMarkdownRemark(sort: { fields: [frontmatter___date], order: ASC }) {
          nodes {
            id
            fields {
              slug
            }
            frontmatter {
              categories
            }
          }
          group(field: frontmatter___categories) {
            tag: fieldValue
            totalCount
          }
          distinct(field: frontmatter___categories)
          totalCount
        }
      }
    `
  )

  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    )
    return
  }

  const posts = result.data.allMarkdownRemark.nodes
  const group = result.data.allMarkdownRemark.group
  const numPost = result.data.site.siteMetadata.numPost

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL

  if (posts.length > 0) {
    posts.forEach((post, index) => {
      const previousPostId = index === 0 ? null : posts[index - 1].id
      const nextPostId = index === posts.length - 1 ? null : posts[index + 1].id

      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
          previousPostId,
          nextPostId,
        },
      })
    })
  }

  const all = {
    all: true,
    tag: result.data.allMarkdownRemark.distinct,
    totalCount: result.data.allMarkdownRemark.totalCount,
  }
  group.concat(all).forEach(group => {
    const totalCount = group.totalCount
    for (index = 0; index * numPost < totalCount; index++) {
      const category = group.all ? group.tag : [].concat(group.tag)
      const pathIdx = index === 0 ? "" : index
      createPage({
        path: group.all ? `/${pathIdx}` : `/${group.tag}/${pathIdx}`,
        component: postList,
        context: {
          category: category,
          skip: index * numPost,
          limit: numPost,
          index,
        },
      })
    }
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })

    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      author: Author
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
    }

    type Social {
      twitter: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `)
}
