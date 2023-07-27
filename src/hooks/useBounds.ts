import useConstants, { SCROLL_RATIO, SHELF_HEIGHT, TVSCENE_HEIGHT } from '../stores/useConstants'
import useShelves from '../stores/useShelves'
import { ScrollAnimation } from './useCameraScroll'
import useStore from "../stores/useStore";

/**
 * Calculates dimensions of the 3D scene,
 * and handles conversions to the browser scroll coordinate space
 */
export default function useBounds() {
  const { cameraZ } = useConstants()
  const isMobile = window.innerWidth <= 986
  const { cassetteSelected } = useStore()
  const isMobileAndNotSelected = isMobile && !cassetteSelected

  const currentPositionY = window.scrollY
  window.scroll(0, 50)
  window.scroll(0, currentPositionY)

  return useShelves(state => {
    const { shelves, shelfScale } = state
    const sceneHeight = SHELF_HEIGHT * shelves.length + TVSCENE_HEIGHT
    const maxCameraY = (SHELF_HEIGHT / 3) * shelfScale
    const minCameraY = -(sceneHeight - TVSCENE_HEIGHT / 2 + 200) * shelfScale
    const scrollHeight = sceneHeight * SCROLL_RATIO

    const scrollCameraY: ScrollAnimation = {
      startPercent: 0,
      endPercent: 100 - (0.4 * (TVSCENE_HEIGHT / sceneHeight) * 100),
      start: isMobileAndNotSelected ? maxCameraY - 250 : maxCameraY,
      end: minCameraY,
    }

    const scrollCameraZ: ScrollAnimation = {
      startPercent: scrollCameraY.endPercent,
      endPercent: 100,
      start: isMobile ? cameraZ + 500 : cameraZ,
      end: isMobile ? ((cameraZ + 500) - 400 * shelfScale) : (cameraZ - 900 * shelfScale),
    }

    return { sceneHeight, minCameraY, maxCameraY, scrollHeight, scrollCameraY, scrollCameraZ }
  })
}

