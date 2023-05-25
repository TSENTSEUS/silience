import { Loader, useGLTF } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { CSSProperties, Suspense } from 'react'
import GUI from './components/GUI'
import Loading from './components/Loading'
import Scroll from './components/Scroll'
import ThreeApp from './ThreeApp'
import UrlConfig from './url-config'

const canvasStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
}

export default function App() {
  useGLTF.preload(UrlConfig.sceneGltf)

  const loader = <Loader
    // containerStyles={...container} // Flex layout styles
    // innerStyles={...inner} // Inner container styles
    // barStyles={...bar} // Loading-bar styles
    // dataStyles={...data} // Text styles
    dataInterpolation={(p) => { p = (p == 0) ? 100 : 0; return `Loading ${Math.round(p)}%` }} // Text
  // initialState={(active) => active} // Initial black out state
  />

  return (
    <Suspense fallback={loader}>
      <Canvas shadows style={canvasStyle} dpr={[1, 2]}>
        <ThreeApp />
      </Canvas>

      <Scroll />
      {/* <GUI /> */}
    </Suspense>
  )
}
