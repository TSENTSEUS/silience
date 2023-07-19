import { Controller } from '@react-spring/three'
import { useFrame } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import invLerp from '../util/invLerp'
import lerp from '../util/lerp'
import { getScrollPercent } from '../util/scrollPercent'

export type ScrollAnimation = {
  startPercent: number
  endPercent: number
  start: number
  end: number
}

export const getValueFromScrollAnimation = (scrollAnimation: ScrollAnimation) => {
  const scrollPercent = getScrollPercent()
  const scrollRatio = invLerp(scrollAnimation.startPercent, scrollAnimation.endPercent, scrollPercent)
  const value = lerp(scrollAnimation.start, scrollAnimation.end, scrollRatio)
  return value
}

export default function useScrollAnimation(
  scrollAnimation: ScrollAnimation,
  update: (value: number) => void
): void {
  const spring = useRef(new Controller({
    value: getValueFromScrollAnimation(scrollAnimation),
  }))

  const onScroll = () => {
    const value = getValueFromScrollAnimation(scrollAnimation)
    spring.current?.update({ value }).start()
  }

  const onResize = () => {
    // Detect the screen size
    const isMobile = window.innerWidth <= 986

    // Adjust the start and end values of the scroll animation
    if (isMobile) {
      scrollAnimation.start = 1 // lower start value for mobile
      scrollAnimation.end = -20 // lower end value for mobile
    } else {
      scrollAnimation.start = 0 // reset start value for desktop
      scrollAnimation.end = -1 // reset end value for desktop
    }
    onScroll()
  }

  useEffect(() => {
    document.addEventListener('scroll', onScroll)
    document.addEventListener('resize', onScroll)
    return () => {
      document.removeEventListener('scroll', onScroll)
      document.removeEventListener('resize', onScroll)
    }
  }, [scrollAnimation])

  useFrame(() => update(spring.current?.get().value))
}
