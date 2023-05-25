import { useGLTF, useTexture } from '@react-three/drei'
import { Color, Group, Material, Mesh, MeshStandardMaterial, MeshPhysicalMaterial, Vector2, MirroredRepeatWrapping, MeshBasicMaterial } from 'three'
import UrlConfig from '../url-config'

export default function useScene() {
  const gltf = useGLTF(UrlConfig.sceneGltf)
 
  const resources = {
    animations : gltf.animations,

    shelfMesh: gltf.nodes['Narrative_Wood'] as Mesh,
    shelfMaterial: gltf.materials['Wood'] as MeshPhysicalMaterial,
    // shelfMaterial:  gltf.materials['4'] as MeshPhysicalMaterial,

    sleeveMesh: gltf.nodes['1'].children[0] as Mesh, // "Mesh003_1"
    sleeveMaterial: gltf.materials['4'] as MeshBasicMaterial,

    vhsMesh: gltf.nodes['1'].children[1] as Mesh, // "Mesh003"
    vhsMaterial: gltf.materials['VHS'] as MeshPhysicalMaterial,

    groundMesh: gltf.nodes['ground'] as Mesh,
    groundMaterial: gltf.materials['Spruce Planks Dark - Texture'].clone() as MeshPhysicalMaterial,

    sceneGroup: gltf.nodes['Scene'] as Group,
  }

  if (resources.groundMaterial.map?.repeat?.x !== 3) {
    resources.groundMaterial.map = resources.groundMaterial.map!.clone()
    resources.groundMaterial.map.repeat = new Vector2(3, 3)
    resources.groundMaterial.map.wrapS = MirroredRepeatWrapping;
    resources.groundMaterial.map.wrapT = MirroredRepeatWrapping;
  }

  for (const key in resources)
    if (!resources[key as keyof typeof resources])
      console.error('[gltf] missing resource', key)

  const tvScene = resources.sceneGroup
  tvScene.getObjectByName('Narrative_Wood')?.removeFromParent()
  tvScene.getObjectByName('Commercial_Wood')?.removeFromParent()
  tvScene.getObjectByName('Music_Videos_Wood')?.removeFromParent()
  tvScene.getObjectByName('tapes')?.removeFromParent()

  tvScene.getObjectByName('1')?.removeFromParent()

  const yellow = gltf.materials.yellow as MeshStandardMaterial
  yellow.color = new Color(0, 0, 0)

  // Prevent lag when tvScene is first rendered
  if (tvScene.frustumCulled)
    tvScene.traverse(obj => obj.frustumCulled = false)

  const buttonTextures = {
    contact : useTexture(UrlConfig.contactImage),
    press : useTexture(UrlConfig.pressImage),
  }
  return { ...resources, tvScene, gltf, buttonTextures }
}
