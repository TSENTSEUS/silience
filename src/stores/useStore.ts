import create from 'zustand'
import { combine } from 'zustand/middleware'
import { SHELF_HEIGHT, TVSCENE_HEIGHT } from './useConstants'

const useStore = create(
  combine({
    cassetteSelected: false,
    activeCassette: "",
    cameraY: SHELF_HEIGHT / 2,
    cameraDeltaZ: 0,
    sceneHeight: 3 * SHELF_HEIGHT + TVSCENE_HEIGHT,
  }, set => ({ set }))
)

export default useStore
