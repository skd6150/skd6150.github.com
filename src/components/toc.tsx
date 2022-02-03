import React, { useRef, useEffect } from "react"
import { throttle } from "lodash"

interface TableOfContentsProps {
  html: string
}

const TableOfContents = ({ html }: TableOfContentsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const initialOffset = useRef<number>()
  const fixedPosition = 130

  const handleScroll = () => {
    if (window.scrollY > initialOffset.current! - fixedPosition) {
      ref.current!.style.position = "fixed"
      ref.current!.style.top = `${fixedPosition}px`
    } else {
      ref.current!.style.position = ""
      ref.current!.style.top = ""
    }
  }
  const throttledHandleScroll = throttle(handleScroll, 100)

  useEffect(() => {
    document.fonts.onloadingdone = () => {
      initialOffset.current =
        ref.current!.getBoundingClientRect().top + window.scrollY
      handleScroll()
      window.addEventListener("scroll", throttledHandleScroll)
    }
    return () => {
      document.fonts.onloadingdone = null
      window.removeEventListener("scroll", throttledHandleScroll)
    }
  }, [])

  return (
    <div className="toc_wrapper">
      <div ref={ref} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}

export default TableOfContents
