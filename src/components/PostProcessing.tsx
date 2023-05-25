import {
  BrightnessContrast,
  EffectComposer,
  HueSaturation,
  ToneMapping,
  Vignette,
  Noise
} from '@react-three/postprocessing'
import { ACESFilmicToneMapping } from 'three'

export default function PostProcessing() {
  return (
    <EffectComposer>
      {/* <ToneMapping
        toneMappingMode= {ACESFilmicToneMapping}
        middleGrey={1}
        whitePoint={20}
        minLuminance={0}
      /> */}
      <HueSaturation saturation={0.1} />
      <BrightnessContrast brightness={0.1} contrast={0.3} />
      <Vignette eskil={false} offset={0.02} darkness={1.025} />
      {/* <Noise opacity={0.01} /> */}
    </EffectComposer>
  )
}


// * TODO Change default mode to ACES_FILMIC and white point to 4.
// * @param {Object} [options] - The options.
// * @param {BlendFunction} [options.blendFunction=BlendFunction.NORMAL] - The blend function of this effect.
// * @param {Boolean} [options.adaptive=true] - Deprecated. Use mode instead.
// * @param {ToneMappingMode} [options.mode=ToneMappingMode.REINHARD2_ADAPTIVE] - The tone mapping mode.
// * @param {Number} [options.resolution=256] - The resolution of the luminance texture. Must be a power of two.
// * @param {Number} [options.maxLuminance=16.0] - Deprecated. Same as whitePoint.
// * @param {Number} [options.whitePoint=16.0] - The white point.
// * @param {Number} [options.middleGrey=0.6] - The middle grey factor.
// * @param {Number} [options.minLuminance=0.01] - The minimum luminance. Prevents very high exposure in dark scenes.
// * @param {Number} [options.averageLuminance=1.0] - The average luminance. Used for the non-adaptive Reinhard operator.
// * @param {Number} [options.adaptationRate=1.0] - The luminance adaptation rate.