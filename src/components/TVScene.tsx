import { Plane, useTexture } from '@react-three/drei'
import { ThreeElements, ThreeEvent, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AnimationClip,
  AnimationMixer,
  Mesh,
  MeshBasicMaterial,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  MeshToonMaterial,
  Object3D,
  Vector3,
} from 'three'
import useBounds from '../hooks/useBounds'
import useScrollAnimation from '../hooks/useCameraScroll'
import useScene from '../hooks/useScene'
import useShelves from '../stores/useShelves'
import useStore from '../stores/useStore'
import UrlConfig from '../url-config'
import { getScrollPercent } from '../util/scrollPercent'
import setCursor from '../util/setCursor'
import VideoPlayer from './VideoPlayer'

export type GroundCassette = {
  texture: string
}

export default function TVScene(props: ThreeElements['group']) {
  const { groundCassettes } = useShelves()
  const { animations, tvScene, buttonTextures } = useScene()
  const { cassetteSelected } = useStore()
  
  // Apply dynamic textures
  const textures = useTexture(groundCassettes.map(cassette => cassette.texture))

  {
    const mesh = tvScene.children.find(child => child.name == "paper") as Mesh
    const material = mesh.material as MeshPhysicalMaterial
    material.metalness = 0.7
    material.map = buttonTextures.contact
  }
  {
    const mesh = tvScene.children.find(child => child.name == "box") as Mesh
    const material = mesh.material as MeshPhysicalMaterial
    material.metalness = 0.7
    material.map = buttonTextures.press
  }

  var vhsMeshes = tvScene.children
    .filter(child => child.name.startsWith("tvvhs"))
    .map(child =>
      child.children.find(
        child =>
          ((child as Mesh).material as MeshStandardMaterial)?.name === 'tvvhs'
      )
    )
    .filter(child => !!child) as Mesh[]

  const vhsMeshes2 = tvScene.children
    .filter(child => child.name.startsWith("tvvhs") && ((child as Mesh).material as MeshStandardMaterial)?.name === 'tvvhs') as Mesh[]

  vhsMeshes = vhsMeshes.concat(vhsMeshes2)

  useEffect(() => {
    vhsMeshes.forEach((mesh, i) => {
      const texture = textures[i % textures.length]
      const material = mesh.material as MeshBasicMaterial
      const newMaterial = material.clone()
      newMaterial.map = texture
      texture.flipY = false
      mesh.material = newMaterial
      // mesh.name += '-loaded'
    })
  }, [vhsMeshes, textures])

  // Scroll insert animation
  const tvVhs = tvScene.children.find(child => child.name === 'vhs_animation')

  // Fix scale
  useEffect(() => {
    if (!tvVhs) return
    const scale = 0.009999999776482582 * 1.25
    tvVhs.scale.set(scale, scale, scale)
  }, [tvVhs])

  const mixerSlit = new AnimationMixer(tvScene);
  const mixerVHS = new AnimationMixer(tvScene);
  const clipVHS = AnimationClip.findByName(animations, "vhs_animation|CINEMA_4D_Main|Layer0")
  const clipSlit = AnimationClip.findByName(animations, "slit|CINEMA_4D_Main|Layer0")
  mixerVHS.clipAction(clipVHS).play()
  mixerSlit.clipAction(clipSlit).play()

  function map_range(value: number, low1: number, high1: number, low2: number, high2: number) {
    return Math.max(0, Math.min(high2, low2 + (high2 - low2) * (value - low1) / (high1 - low1)));
  }

  // Scroll effect: turn on TV + do animations
  const [showPlayer, setShowPlayer] = useState(false)
  useEffect(() => {
    const onscroll = () => {
      const percent = getScrollPercent()
      setShowPlayer(percent >= 80)
      mixerVHS.setTime(map_range(percent, 75, 81, 0, clipVHS.duration * 0.99))
      mixerSlit.setTime(map_range(percent, 78, 83, 0, clipSlit.duration * 0.99))

    }
    const removeListener = () => window.removeEventListener('scroll', onscroll)
    window.addEventListener('scroll', onscroll)
    return removeListener
  })

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    if (hasName(event.object, 'Fax')) {
      window.open(UrlConfig.contactLink, '_self')
      return event.stopPropagation()
    }

    if (hasName(event.object, 'box')) {
      window.open(UrlConfig.pressLink, '_self')
      return event.stopPropagation()
    }
  }

  const checkHover = (event: ThreeEvent<PointerEvent>) => {
    if (hasName(event.object, 'paper') || hasName(event.object, 'box')) {
      setCursor('pointer')
      event.stopPropagation()
    } else setCursor('auto')
  }

  const tvSceneY = -300

  const shaderData = useMemo(
    () => ({
      uniforms: { u_time: { value: 0 } },
      fragmentShader: `
      varying vec2 vUv;
      uniform float u_time;
      float rand(float n){return fract(sin(n) * 43758.5453123);}
        void main() {
          float n = rand(vUv.x * 1000.0 + vUv.y + u_time);
          gl_FragColor = vec4(0.5 * n);
      }`,
      vertexShader: `varying vec2 vUv; void main() {vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);}`
    }),
    []
  )

  return (
    <group {...props}>
      <primitive
        object={tvScene}
        position={[0, tvSceneY, 0]}
        scale={100}
        onClick={onClick}
        onPointerMove={checkHover}
        onPointerLeave={() => setCursor('auto')}
        onPointerOut={() => setCursor('auto')}
      />

      <VideoPlayer
        visible={!cassetteSelected && showPlayer}
        width={1092}
        height={623}
        position={[70, tvSceneY + 400, -2000]}
        rotation-y={Math.PI / 14}
        scale={34 * (1 / 0.6)}
        reflection={false}
        url={UrlConfig.tvIframe}
      />

      <Plane
        rotation-y={Math.PI / 14}
        position={[70, tvSceneY + 400, -2000]}
        args={[940 * (4 / 3) * 0.64 * 1.6 + 290, 965 * 0.64 * 1.6]}>
        <shaderMaterial attach="material" {...shaderData} />
      </Plane>


    </group>
  )
}

const hasName = (object: Object3D, name: string) => {
  if (object.name === name) return true
  let match = false
  object.traverseAncestors(
    ancestor => (match = match || ancestor.name === name)
  )
  return match
}