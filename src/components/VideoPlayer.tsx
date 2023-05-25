import { Html, Plane } from '@react-three/drei'
import { ThreeElements } from '@react-three/fiber'
import { CSSProperties } from 'react'
import { MeshBasicMaterial } from 'three'

export type VideoPlayerProps = ThreeElements['group'] & {
  url: string
  width: number
  height: number
  scale: number
  reflection?: boolean
  visible?: boolean
  opacity?: number
  pointerEvents?: CSSProperties['pointerEvents']
}

export default function VideoPlayer({
  visible,
  url,
  width,
  height,
  scale,
  reflection,
  pointerEvents,
  opacity,
  ...props
}: VideoPlayerProps) {
  const style: CSSProperties = {
    width,
    height,
    opacity:opacity,
    userSelect: 'none',
    background: 'black',
    overflow: 'hidden',
    WebkitBoxReflect:
      reflection === false
        ? undefined
        : 'below 10px linear-gradient(180deg, transparent 50%, rgba(255, 255, 255, 25%))',
  }

  const isVideo =
    url.endsWith('.mp4') ||
    url.endsWith('.webm') ||
    url.endsWith('.ogv') ||
    url.endsWith('.ogg')

  const isImg =
    !isVideo &&
    (url.endsWith('.jpg') ||
      url.endsWith('.png') ||
      url.endsWith('.gif') ||
      url.endsWith('.jpeg') ||
      url.endsWith('.svg') ||
      url.endsWith('.bmp') ||
      url.endsWith('.tiff') ||
      url.endsWith('.webp'))

  const isIframe = !isVideo && !isImg

  const rawYoutubeUrl = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/)
  if (rawYoutubeUrl?.length === 2)
    url = `https://www.youtube.com/embed/${rawYoutubeUrl[1]}?autoplay=1`

  const shortYoutubeUrl = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/)
  if (shortYoutubeUrl?.length === 2)
    url = `https://www.youtube.com/embed/${shortYoutubeUrl[1]}?autoplay=1`

  const rawVimeoUrl = url.match(/vimeo\.com\/([0-9]+)/)
  if (rawVimeoUrl?.length === 2)
    url = `https://player.vimeo.com/video/${rawVimeoUrl[1]}?autoplay=1&color=000000`

  return (
    <group visible={visible} {...props}>
      {visible !== false && (
        <Html style={style} scale={scale} transform>
          {isVideo && (
            <video
              width={width}
              height={height}
              style={{ pointerEvents }}
              controls
              autoPlay
            >
              <source src={url} />
            </video>
          )}

          {isImg && (
            <img
              width={width}
              height={height}
              alt=""
              src={url}
              style={{ pointerEvents }}
            />
          )}

          {isIframe && (
            <iframe
              width={width}
              height={height}
              src={url}
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ pointerEvents }}
            />
          )}
        </Html>
      )}
    </group>
  )
}
