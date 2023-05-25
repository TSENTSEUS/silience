import { Controller, useSpring } from '@react-spring/three'
import { Plane as Plane1 } from '@react-three/drei';
import { ThreeElements, ThreeEvent, useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Group, TextureLoader, Vector3 } from 'three'
import '/Users/bapt/Desktop/MERCIV/Active Projects/Silience/Nick Files/silience/src/index.scss';

import { CSSProperties } from 'react';

type PlaneProps = {
  id?: string;
  className?: string;
  style?: CSSProperties;
  // other props...
};

function Plane(props: PlaneProps) {
  const { id, className, style, ...otherProps } = props;

  return (
    <div
      id={id}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999,
        ...style,
      }}
      {...otherProps}
    />
  );
}

import useDragRotate from '../hooks/useDragRotate'
import useDynamicTexture from '../hooks/useDynamicTexture'
import useScene from '../hooks/useScene'


import useConstants, {
  CASSETTE_CLICK_TRANSLATE_Z,
  CASSETTE_FLOOR_Y,
  CASSETTE_HOVER_TRANSLATE_Y,
  DRAG_HINT_ANIMATION_ROTATION,
} from '../stores/useConstants'
import useShelves, { CassetteData } from '../stores/useShelves'
import useStore from '../stores/useStore'
import UrlConfig from '../url-config'
import setCursor from '../util/setCursor'
import Ground from './Ground'
import { useScrollToGroup } from './Scroll'
import VideoPlayer from './VideoPlayer'

export type CassetteProps = {
  data: CassetteData
} & ThreeElements['group']

export default function Cassette({ data: cassette, ...props }: CassetteProps) {
  const { sleeveMesh, sleeveMaterial, vhsMesh, vhsMaterial } = useScene()

  const { cassetteAngle, cassetteClickTargetX } = useConstants()

  const { ref: parentWrapper, scrollToObject: scrollToShelf } =
    useScrollToGroup()

  const dynamicMaterial = useDynamicTexture(sleeveMaterial, cassette.texture)
  const cassetteGroup = useRef<Group>(null)
  const cassetteWrapper = useRef<Group>(null)

  const [selected, setSelected] = useState(false)
  const [showVideoPlayer, setShowVideoPlayer] = useState(false)

  const slowerSpringConfig = {
    mass: 5,
    friction: 50,
  }

  const getSpringState = (selected: boolean) => ({
    rotateY: selected ? -(5 * Math.PI) / 6 : cassetteAngle,
    translateZ: selected ? CASSETTE_CLICK_TRANSLATE_Z : 0,
    transition: 0,
    config: slowerSpringConfig
  })
  const [isTransitioning, setIsTransitioning] = useState(false)

  const springs = useRef(new Controller(getSpringState(selected)))

  // Drag
  const [dragState, setDragState] = useState<{
    initialRotationY: number
    initialPointerX: number
  } | null>(null)

  const [hint, setHint] = useState<'left' | 'right' | 'none'>('none')

  const { dragging, setDragging } = useDragRotate(
    {
      onDrag: e => {
        e.stopPropagation()
        const initialPointerX = dragState?.initialPointerX ?? 0
        const initialRotationY = dragState?.initialRotationY ?? 0

        const deltaX = e.clientX - initialPointerX
        const ratio = (4 * Math.PI) / window.innerWidth
        const newRotateY = initialRotationY + deltaX * ratio

        setCursor('grabbing')
        springs.current.update({ rotateY: newRotateY }).start()
        setIsTransitioning(true)

      },
      onDragEnd: e => {
        setCursor('auto')
        setIsTransitioning(false)

      },
      onHint: side => {
        if (hint === side) return
        setHint(side)
        const curRotateY = springs.current.get().rotateY
        const coef = side === 'left' ? -1 : 1
        springs.current
          .update({ rotateY: curRotateY + coef * DRAG_HINT_ANIMATION_ROTATION })
          .start()
      },
      onHintEnd: () => {
        if (hint === 'none') return
        const curRotateY = springs.current.get().rotateY
        const coef = hint !== 'left' ? -1 : 1
        springs.current
          .update({ rotateY: curRotateY + coef * DRAG_HINT_ANIMATION_ROTATION })
          .start()
        setHint('none')
      },
    },
    selected
  )

  const onPointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (isMobile && !selected && !hover) {
      setHover(true)
      return
    }

    if (!selected) return toggleSelected()

    setDragState({
      initialRotationY: cassetteGroup.current!.rotation.y,
      initialPointerX: e.nativeEvent.clientX,
    })
    setDragging(true)
  }

  // Click
  const { cassetteSelected, set } = useStore()
  const hide = cassetteSelected && !selected

  const toggleSelected = (force: boolean = false) => {
    if (!force && isTransitioning) return;
    if (cassetteSelected && !selected) return
    const newSelected = !selected
    if (newSelected) {
      setHover(false)
      scrollToShelf()
      setTimeout(() => setShowVideoPlayer(true), 333)
      document.body.style.overflowY = 'hidden'
    } else {
      setShowVideoPlayer(false)
      document.body.style.overflowY = 'auto'
    }
    setIsTransitioning(true)
    setTimeout(() => setIsTransitioning(false), 1000)

    springs.current?.update(getSpringState(newSelected)).start()
    setSelected(newSelected)
    set({ cassetteSelected: newSelected })
  }

  // Align
  const [deltaX, setDeltaX] = useState(0)
  const { translateX } = useSpring({
    translateX: selected ? deltaX : 0,
    config: slowerSpringConfig
  })

  // Mobile layout
  const { maxCassettesPerShelf, shelfScale } = useShelves()
  const isMobile = maxCassettesPerShelf <= 3
  const cassetteTargetX = isMobile ? 0 : cassetteClickTargetX
  const cassetteY = isMobile && selected && cassetteSelected ? 270 : 0
  const videoPlayerRotation = isMobile ? 0 : -Math.PI / 18
  const videoPlayerX = isMobile ? deltaX : deltaX + 675
  const videoPlayerY = isMobile ? -230 : 0
  const videoPlayerScale = isMobile ? 0.80 : 1

  // Hover
  const [hover, _setHover] = useState(false)
  const setHover = (value: boolean) => {
    const newHover = value && !selected && !cassetteSelected
    if (hover !== newHover) _setHover(newHover)
    if (dragging) setCursor('grabbing')
    else if (value) {
      if (selected && cassetteSelected) setCursor('grab')
      else setCursor('pointer')
    } else setCursor('auto')
  }
  const { translateY } = useSpring({
    translateY: hover ? CASSETTE_HOVER_TRANSLATE_Y : cassetteY,
    config: slowerSpringConfig
  })

  useEffect(() => {
    if (!cassetteSelected || !selected) return
    const wrapper = parentWrapper.current
    if (!wrapper) return
    const { x } = wrapper.getWorldPosition(new Vector3())
    const deltaX = (cassetteTargetX - x) / shelfScale
    setDeltaX(deltaX)
  }, [
    parentWrapper.current,
    cassetteSelected,
    selected,
    maxCassettesPerShelf,
    isMobile,
    shelfScale,
    cassetteTargetX,
  ])

  // Animate
  useFrame(() => {
    const group = cassetteGroup.current
    const wrapper = cassetteWrapper.current
    if (!group || !wrapper || !springs.current) return
    const { rotateY, translateZ } = springs.current.get()

    if ( selected && !hover) { 
      springs.current.update({rotateY:rotateY+ 0.03}).start()
    }

    // On hover
    group.position.y = translateY.get()

    // On click
    group.rotation.y = rotateY
    group.position.z = translateZ
    wrapper.position.x = translateX.get()
  })

  return (
    <group {...props} ref={parentWrapper}>
      {/* // Background plane for click */}
      <Plane1 
        id={Number("1")}
        args={[30000, 40000]}
        onClick={() => selected && toggleSelected()}
        visible={selected && showVideoPlayer}
        position={[0, 0, -3000]} >
        <meshBasicMaterial color={"black"} transparent={true} />
      </Plane1>

      <group ref={cassetteWrapper} position={[deltaX, 0, 0]}>
        <group
          ref={cassetteGroup}
          onClick={(e) => e.stopPropagation()}
          onPointerOver={() => setHover(true)}
          onPointerMove={() => setHover(true)}
          onPointerOut={() => setHover(false)}
          onPointerDown={onPointerDown}
          visible={!hide}
        >
          <mesh
            geometry={sleeveMesh.geometry}
            material={dynamicMaterial}
            rotation-x={Math.PI / 2}
            castShadow
            receiveShadow
          />
          <mesh
            geometry={vhsMesh.geometry}
            material={vhsMaterial}
            rotation-x={Math.PI / 2}
            castShadow
            receiveShadow
          />
        </group>
      </group>


      {/* // Back button, not really necessary because all clicks go back */}
      <Plane1
        id={Number("2")}
        
        args={[30, 30]}
        onClick={() => toggleSelected(true)}
        onPointerOver={() => setCursor("pointer")}
        onPointerLeave={() => setCursor("auto")}
        visible={selected && showVideoPlayer}
        position={isMobile ? [deltaX - 130, 310, 1400] : [deltaX + 86, 230, 800]}
      >
        <meshBasicMaterial map={new TextureLoader().load(UrlConfig.backButton)}
          transparent={true}
          opacity={0.9}
          color={"white"}
        />
      </Plane1>

      <VideoPlayer
        visible={selected && showVideoPlayer}
        url={cassette.video}
        width={960}
        height={540}
        scale={32 * videoPlayerScale}
        position={[videoPlayerX, videoPlayerY, 680]}
        rotation-y={videoPlayerRotation}
        pointerEvents={dragging ? 'none' : 'auto'}
      />

      <Ground
        onClick={() => selected && toggleSelected()}
        position={[-4, CASSETTE_FLOOR_Y, -3]} visible={selected} />
    </group>
  )
}
