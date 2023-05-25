import { ThreeElements } from '@react-three/fiber'
import useScene from '../hooks/useScene'

export default function Ground(props: ThreeElements['group']) {
  const { groundMesh, groundMaterial } = useScene()

  return (
    <group {...props}>
      <mesh
        geometry={groundMesh.geometry}
        material={groundMaterial}
        rotation-x={Math.PI / 2}
        receiveShadow
      />
    </group>
  )
}
