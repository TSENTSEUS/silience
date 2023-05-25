import clamp from './clamp'

const invLerp = (start: number, end: number, current: number) =>
  clamp((current - start) / (end - start), 0.0, 1.0)

export default invLerp