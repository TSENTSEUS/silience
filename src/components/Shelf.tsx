import { Center, Plane, Text3D } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'
import { Box, Flex } from '@react-three/flex'
import {
  AdditiveBlending,
  MeshBasicMaterial,
  MeshStandardMaterial,
  MultiplyBlending,
  NormalBlending,
  SubtractiveBlending,
} from 'three'
import useDynamicTexture from '../hooks/useDynamicTexture'
import useScene from '../hooks/useScene'
import useConstants, {
  CASSETTE_HEIGHT,
  SHELF_DEPTH,
} from '../stores/useConstants'
import { ShelfData } from '../stores/useShelves'
import useStore from '../stores/useStore'
import Cassette from './Cassette'

export type ShelfProps = {
  data: ShelfData
} & ThreeElements['group']

export default function Shelf({ data: shelf, ...props }: ShelfProps) {
  const { cassetteSpacing } = useConstants()
  const { shelfMesh, shelfMaterial } = useScene()
  const { cassetteSelected } = useStore()
  const cassettes = shelf.cassettes

  var labelMaterial = new MeshStandardMaterial();
  if (shelf.texture != "") {
    labelMaterial = useDynamicTexture(labelMaterial, shelf.texture, true)
    labelMaterial.transparent = true
    // labelMaterial.blending = SubtractiveBlending
  }

  return (
    <group {...props}>
      <Flex flexDirection="row" justifyContent="center" alignItems="flex-end">
        {cassettes.map((cassette, i) => (
          <Box
            centerAnchor
            key={i}
            width={cassetteSpacing}
            height={CASSETTE_HEIGHT}
          >
            <Cassette data={cassette} />
          </Box>
        ))}
      </Flex>

      <group visible={!cassetteSelected}>
        <mesh
          material={shelfMaterial}
          geometry={shelfMesh.geometry}
          rotation-x={Math.PI / 2}
          // castShadow
          receiveShadow
          renderOrder={9999}
        />

        <group position={[0, 0, SHELF_DEPTH / 2]}>
          <Center>
            <Plane args={[250, 45]} material={labelMaterial}>
            </Plane>
          </Center>
        </group>
      </group>
    </group>
  )
}
