import { PerspectiveCamera } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { PerspectiveCamera as ThreePerspectiveCamera } from 'three'
import useBounds from '../hooks/useBounds'
import useScrollAnimation from '../hooks/useCameraScroll'
import useConstants from '../stores/useConstants'

export default function Camera(props: ThreeElements['perspectiveCamera']) {
  const ref = useRef<ThreePerspectiveCamera>()
  const { scrollCameraY, scrollCameraZ } = useBounds()
  const { cameraZ } = useConstants()

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        ref.current.aspect = window.innerWidth / window.innerHeight
        ref.current.updateProjectionMatrix()
      }

      setTimeout(() => {
        const currentPositionY = window.scrollY
        window.scroll(0, 50)
        window.scroll(0, currentPositionY)
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useScrollAnimation(
    scrollCameraY,
    cameraY => ref.current && (ref.current.position.y = cameraY)
  )

  useScrollAnimation(
    scrollCameraZ,
    cameraZ => ref.current && (ref.current.position.z = cameraZ)
  )

  const handleCameraUpdate = () => {
    if (ref.current) {
      ref.current.aspect = window.innerWidth / window.innerHeight
      ref.current.updateProjectionMatrix()
    }
  }

  return (
    <PerspectiveCamera
      ref={ref}
      makeDefault
      position-z={cameraZ}
      filmGauge={35}
      far={10000}
      near={400}
      onUpdate={handleCameraUpdate}
      {...props}
    />
  )
}
