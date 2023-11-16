import React, { useState, useEffect } from 'react'
import { MainContainer } from './Scrollbar.styles'

const Scrollbar = ({ scrollContainerRef }) => {
  const [scrollPercent, setScrollPercent] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scroll = scrollContainerRef.current.scrollTop
        const dh = scrollContainerRef.current.scrollHeight
        const wh = scrollContainerRef.current.clientHeight
        const newScrollPercent = (scroll / (dh - wh)) * 100
        setScrollPercent(newScrollPercent)
      }
    }

    const scrollContainer = scrollContainerRef.current
    scrollContainer?.addEventListener('scroll', handleScroll)

    return () => {
      scrollContainer?.removeEventListener('scroll', handleScroll)
    }
  }, [scrollContainerRef])

  return (
    <MainContainer id='progressbar' style={{ height: `${scrollPercent}%` }} />
  )
}

export default Scrollbar
