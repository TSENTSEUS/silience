export default function lerp(min: number, max: number, ratio: number): number {
  return (1 - ratio) * min + ratio * max
}
