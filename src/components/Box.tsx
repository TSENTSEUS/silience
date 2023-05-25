import { ThreeElements, useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Mesh } from 'three'

export function Box(props: ThreeElements['mesh']) {
  const ref = useRef<Mesh>(null!)
  const [hovered, hover] = useState(false)
  const [clicked, click] = useState(false)
  useFrame(() => (ref.current.rotation.x += 0.01))
  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 1.5 : 1}
      onClick={() => click(!clicked)}
      onPointerOver={() => hover(true)}
      onPointerOut={() => hover(false)}
    >
      <boxGeometry args={[100, 100, 100]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
