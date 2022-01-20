import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"

interface BioProps {
  isolated?: boolean
}

const Bio = ({ isolated }: BioProps) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
          }
          social {
            email
            github
          }
        }
      }
    }
  `)

  const author = data.site.siteMetadata?.author.name
  const email = data.site.siteMetadata.social.email
  const github = data.site.siteMetadata.social.github

  return (
    <div className="bio" data-isolated={isolated || false}>
      <div className="bio-avatar">👨‍💻</div>
      <div className="bio-description">
        <div>{author}</div>
        <p>
          Email. <a href={`mailto:${email}`}>{email}</a>
        </p>
        <p>
          Github. <a href={github}>{github}</a>
        </p>
      </div>
    </div>
  )
}

export default Bio
