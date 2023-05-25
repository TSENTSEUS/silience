import { BakeShadows, Environment } from '@react-three/drei'
import { Ref, useEffect, useRef } from 'react'
import { SpotLight } from 'three'
import Camera from './components/Camera'
import PostProcessing from './components/PostProcessing'
import Shelf from './components/Shelf'
import TVScene from './components/TVScene'
import usePreload from './hooks/usePreload'
import useScene from './hooks/useScene'
import {
  SHELF_HEIGHT,
  SHELF_WIDTH,
  TVSCENE_HEIGHT,
} from './stores/useConstants'
import useShelves from './stores/useShelves'
import useStore from './stores/useStore'
import useWrap from './stores/useWrap'
import UrlConfig from './url-config'

export default function ThreeApp() {
  const { shelves, categories, shelfScale, groundCassettes } = useShelves()
  const { gltf } = useScene()
  const { cassetteSelected } = useStore()

  useWrap()
  usePreload()

  // Debug logging
  useEffect(() => {
    console.log({ gltf })
    console.log({ shelves })
    console.log({ groundCassettes })
    console.log({ categories })
    console.log({
      numCassettes: shelves.flatMap(shelf => shelf.cassettes).length,
    })
  }, [])

  // Touch actions
  useEffect(() => {
    document.body.style.touchAction = cassetteSelected ? 'none' : 'auto'
    return () => void (document.body.style.touchAction = 'auto')
  }, [cassetteSelected])

  const tvSceneY = -SHELF_HEIGHT * shelves.length - TVSCENE_HEIGHT / 2
  return (
    <>
      <Camera />
      <PostProcessing />
      {/* <BakeShadows /> */}

      <fog
        attach="fog"
        color="black"
        near={500}
        far={cassetteSelected ? 2500 : 7500}
      />

      <Environment files={UrlConfig.environmentHDRI} />
      <ambientLight intensity={0.5} />

      <directionalLight
        position={[100, 750, 350]}
        shadow-camera-near={400}
        shadow-camera-far={10000}
        shadow-camera-left={-SHELF_WIDTH / 2}
        shadow-camera-right={SHELF_WIDTH / 2}
        shadow-camera-top={SHELF_WIDTH / 2}
        shadow-camera-bottom={-SHELF_WIDTH / 2}
        shadow-bias={-0.005}
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
        intensity={1.2}
        castShadow
      />

      <group scale={shelfScale}>
        {shelves.map((shelf, i) => (
          <group key={i}>
            <Shelf key={i} data={shelf} position-y={-SHELF_HEIGHT * i} />
          </group>
        ))}

        <TVScene position-y={tvSceneY} />
      </group>
    </>
  )
}
