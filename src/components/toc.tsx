import React, { useRef, useEffect } from "react"
import { throttle } from "lodash"

interface TableOfContentsProps {
  html: string
}

const TableOfContents = ({ html }: TableOfContentsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const initialOffset = useRef<number>()
  const offset = 130

  useEffect(() => {
    initialOffset.current =
      ref.current!.getBoundingClientRect().top + window.scrollY
    handleScroll()
    window.addEventListener("scroll", throttle(handleScroll, 100))
    return () => {
      window.addEventListener("scroll", throttle(handleScroll, 100))
    }
  }, [])

  const handleScroll = () => {
    if (ref.current === null) return
    if (initialOffset.current === undefined) return
    if (window.scrollY > initialOffset.current - offset) {
      ref.current.style.position = "fixed"
      ref.current.style.top = `${offset}px`
    } else {
      ref.current.style.position = ""
      ref.current.style.top = ""
    }
  }

  return (
    <div className="toc_wrapper">
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default TableOfContents
