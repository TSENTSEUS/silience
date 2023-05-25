import { useGLTF, useTexture } from '@react-three/drei'
import { useEffect } from 'react'
import useShelves from '../stores/useShelves'
import UrlConfig from '../url-config'

export default function usePreload() {
  const { shelves, groundCassettes } = useShelves()

  return useEffect(() => {
    useGLTF.preload(UrlConfig.sceneGltf)

    shelves
      .flatMap(shelf => shelf.cassettes)
      .map(cassette => cassette.texture)
      .forEach(useTexture.preload) 

    groundCassettes
      .map(cassette => cassette.texture)
      .forEach(useTexture.preload)

    console.log('all assets preloaded')
    performance.mark('preloaded')
  }, [])
}
