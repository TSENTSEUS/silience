import { useEffect } from 'react'
import invLerp from '../util/invLerp'
import lerp from '../util/lerp'
import type { CategoryData, ShelfData } from './useShelves'
import useShelves from './useShelves'

const wrapShelves = (shelves: ShelfData[], categories: CategoryData[], maxPerShelf: number) => {
  const allCassettes = shelves.flatMap(shelf => shelf.cassettes)
  const newShelves: ShelfData[] = []

  // Group cassettes by category (wrapping as needed)
  for (const cassette of allCassettes) {
    const shelf = newShelves.find(shelf =>
      shelf.name === cassette.category
      && shelf.cassettes.length + 1 <= maxPerShelf
    )
    if (shelf) shelf.cassettes.push(cassette)
    else newShelves.push({
      name: cassette.category,
      cassettes: [cassette],
      texture: categories.find(cat => cat.name === cassette.category)?.texture || ""
    })
  }

  // Sort category order
  const categoryMap: { [key: string]: number } = {}
  for (const category of categories)
    categoryMap[category.name] = category.order ?? 0
  newShelves.sort((a, b) => categoryMap[a.name] - categoryMap[b.name])

  // Sort cassettes order within each shelf
  for (const shelf of newShelves)
    shelf.cassettes.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))

  return newShelves
}

export default function useWrap() {
  const { shelves, categories, maxCassettesPerShelf: prevMaxCassettes, set } = useShelves()

  useEffect(() => {
    const wrap = () => {
      // const width = window.innerWidth
      // const height = window.innerHeight
      // const aspectRatio = width / height
      //
      // const minCassettesPerShelf = 3
      // const maxCassettesPerShelf = 6
      // const ratio = invLerp(9 / 16, 16 / 9, aspectRatio)
      // const cassettesPerShelf = Math.floor(lerp(minCassettesPerShelf, maxCassettesPerShelf, ratio))

      // if (cassettesPerShelf > 3 && cassettesPerShelf < 6) cassettesPerShelf = 3

      let cassettesPerShelf = 3
      if(window.innerWidth > 986) cassettesPerShelf = 6;

      if (cassettesPerShelf === prevMaxCassettes) return // Prevent re-renders
      const shelfScale = 1
      const newShelves = wrapShelves(shelves, categories, cassettesPerShelf)

      set({
        shelves: newShelves,
        maxCassettesPerShelf: cassettesPerShelf,
      })
    }

    window.addEventListener('resize', wrap)
    wrap()
    return () => window.removeEventListener('resize', wrap)
  }, [prevMaxCassettes])
}
