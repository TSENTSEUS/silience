import useConstants, { SCROLL_RATIO, SHELF_HEIGHT, TVSCENE_HEIGHT } from '../stores/useConstants'
import useShelves from '../stores/useShelves'
import { ScrollAnimation } from './useCameraScroll'

/**
 * Calculates dimensions of the 3D scene,
 * and handles conversions to the browser scroll coordinate space
 */
export default function useBounds() {
  const { cameraZ } = useConstants()
  const isMobile = window.innerWidth < 768
  
  return useShelves(state => {
    const { shelves, shelfScale } = state
    const sceneHeight = SHELF_HEIGHT * shelves.length + TVSCENE_HEIGHT
    const maxCameraY = (SHELF_HEIGHT / 3) * shelfScale
    const minCameraY = -(sceneHeight - TVSCENE_HEIGHT / 2 + 200) * shelfScale
    const scrollHeight = sceneHeight * SCROLL_RATIO

    const scrollCameraY: ScrollAnimation = {
      startPercent: 0,
      endPercent: 100 - (0.4 * (TVSCENE_HEIGHT / sceneHeight) * 100),
      start: isMobile ? (maxCameraY - 20):(maxCameraY),
      end: minCameraY,
    }

    const scrollCameraZ: ScrollAnimation = {
      startPercent: scrollCameraY.endPercent,
      endPercent: 100,
      start: cameraZ,
      end: isMobile ? (cameraZ - 400 * shelfScale) : (cameraZ - 900 * shelfScale),
    }

    return { sceneHeight, minCameraY, maxCameraY, scrollHeight, scrollCameraY, scrollCameraZ }
  })
}

