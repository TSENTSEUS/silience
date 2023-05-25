import type { CSSProperties } from 'react'

export default function setCursor(cursor: CSSProperties['cursor']) {
  document.body.style.cursor = cursor ?? 'auto'
}
