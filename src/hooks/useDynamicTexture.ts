import { useTexture } from '@react-three/drei'
import { Material, MeshStandardMaterial } from 'three'

export default function useDynamicTexture(material: Material, texture: string, flipY:boolean = false) {
  const sleeveColorMap = useTexture(texture)
  const dynamicMaterial = material.clone() as MeshStandardMaterial
  dynamicMaterial.map = sleeveColorMap
  dynamicMaterial.map.flipY = flipY
  dynamicMaterial.metalness = 0.7
  return dynamicMaterial
}
