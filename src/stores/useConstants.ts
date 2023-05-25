import create from 'zustand'
import { combine } from 'zustand/middleware'

// These are defined in one place rather than in their
// corresponding component files (Cassette, Shelf, TVScene, etc)
// to avoid circular import problems

export const CASSETTE_HEIGHT = 600
export const CASSETTE_HOVER_TRANSLATE_Y = CASSETTE_HEIGHT / 4
export const CASSETTE_CLICK_TRANSLATE_Z = 500
export const CASSETTE_FLOOR_Y = -CASSETTE_HEIGHT / 2
export const SHELF_HEIGHT = CASSETTE_HEIGHT * 1.3
export const SHELF_WIDTH = 3000
export const SHELF_DEPTH = 430
export const TVSCENE_HEIGHT = 1500
export const SCROLL_RATIO = 0.75
export const DRAG_HINT_ANIMATION_MARGIN = 0.1
export const DRAG_HINT_ANIMATION_ROTATION = Math.PI / 6

/**
 * "Dynamic" constants -- an oxymoron, but useful for iterating w/ design!
 * Can be refactored after removing `<GUI>` component.
 */
const useConstants = create(
  combine({
    // cameraZ: 3500,
    cameraZ: 1500,
    cassetteAngle: Math.PI / 6,
    cassetteSpacing: 300,
    ambientLightIntensity: 0.0,
    directionalLightIntensity: 0,
    cassetteClickTargetX: -525,
  }, set => ({ set }))
)

export default useConstants
