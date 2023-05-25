/**
 * Calculate the current scroll progress as a percentage
 * @source https://sbcode.net/threejs/animate-on-scroll/
 */
export const getScrollPercent = () => {
  const scrollPercent = (
    (document.documentElement.scrollTop || document.body.scrollTop) /
    (
      (document.documentElement.scrollHeight || document.body.scrollHeight)
      - document.documentElement.clientHeight
    )
  ) * 100

  return isNaN(scrollPercent) ? 0 : scrollPercent
}

/**
 * @inverse of `getScrollPercent`
 * @note that it takes ratio (`percent/100`)
 */
export const getScrollTop = (ratio: number) => {
  return (
    ratio *
    ((document.documentElement.scrollHeight || document.body.scrollHeight) -
      document.documentElement.clientHeight)
  )
}
