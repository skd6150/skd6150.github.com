import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

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
      <StaticImage
        className="bio-avatar"
        src="../images/icon.png"
        alt="icon"
        layout="fixed"
        width={60}
        height={60}
        quality={100}
      />
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
