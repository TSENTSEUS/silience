import { Html, useProgress } from '@react-three/drei'
import type { CSSProperties } from 'react'

export default function Loading() {

  const { active, progress, errors, item, loaded, total } = useProgress()


  const style: CSSProperties = {
    position: 'fixed',
    inset: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
    fontSize: '50px'
  }

  return <div style={style} >Loading... {Math.round(progress == 0 ? 100 : progress)}% </div>


}
