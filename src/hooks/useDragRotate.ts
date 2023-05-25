import { useEffect, useState } from 'react'
import { DRAG_HINT_ANIMATION_MARGIN } from '../stores/useConstants'

export default function useDragRotate(
  handlers: {
    onDrag: (e: PointerEvent) => any,
    onDragEnd?: (e: PointerEvent) => any,
    onHint?: (side: 'left' | 'right') => any,
    onHintEnd?: () => any,
  }, enabled: boolean) {
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!enabled) return

    const onPointerMove = (e: PointerEvent) => {
      const xProportion = e.clientX / window.innerWidth
      const hintLeft = xProportion <= DRAG_HINT_ANIMATION_MARGIN
      const hintRight = xProportion >= 1 - DRAG_HINT_ANIMATION_MARGIN
      if (!dragging && hintLeft) handlers.onHint?.('left')
      if (!dragging && hintRight) handlers.onHint?.('right')
      if (dragging || (!hintLeft && !hintRight)) handlers.onHintEnd?.()
      if (!dragging) return
      handlers.onDrag(e)
    }

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return
      setDragging(false)
      handlers.onDragEnd?.(e)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragging, handlers, enabled])

  return { dragging, setDragging }
}
