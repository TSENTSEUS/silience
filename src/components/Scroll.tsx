import { CSSProperties, useRef } from 'react'
import { Group, Object3D, Vector3 } from 'three'
import useBounds from '../hooks/useBounds'
import invLerp from '../util/invLerp'
import { getScrollTop } from '../util/scrollPercent'

/**
 * An empty, transparent, and pass-through component
 * used to give the page as scrollbar with consistent
 * cross-device scroll behavior.
 *
 * Height is proportional to the height of the 3D scene,
 * set dynamically from inside Three.js.
 *
 * @source https://sbcode.net/threejs/animate-on-scroll/
 */
export default function Scroll() {
  const { scrollHeight } = useBounds()
  const divStyle: CSSProperties = {
    pointerEvents: 'none',
    height: scrollHeight,
  }
  return <div style={divStyle} />
}

export function useScrollTo() {
  const { minCameraY, maxCameraY, scrollCameraY } = useBounds()
  const scrollTo = (cameraY: number) => {
    const cameraYRatio = invLerp(maxCameraY, minCameraY, cameraY)
    const ratio =
      scrollCameraY.startPercent +
      cameraYRatio * (scrollCameraY.endPercent / 100)
    const top = getScrollTop(ratio)
    window.scrollTo({ top })
  }
  return scrollTo
}

export function useScrollToGroup() {
  const ref = useRef<Group>(null)
  const scrollTo = useScrollTo()
  const scrollToObject = () => {
    const object = ref.current
    if (!object) return
    const { y } = object.getWorldPosition(new Vector3())
    scrollTo(y)
  }

  return { ref, scrollToObject }
}
