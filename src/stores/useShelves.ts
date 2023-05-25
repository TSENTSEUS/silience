import create from 'zustand'
import { combine } from 'zustand/middleware'
import { GroundCassette } from '../components/TVScene'

export type CassetteData = {
  name: string
  category: string
  texture: string
  video: string
  order?: number
}

export type ShelfData = {
  name: string
  cassettes: CassetteData[]
  texture: string
}

export type CategoryData = {
  name: string
  order?: number
  texture: string
}

/** Helper function to convert order property from string to number */
const parseOrder = (obj: any & ({ order: string })): any & { order: number } =>
  ({ ...obj, order: obj.order === "" ? Number.MAX_VALUE : +obj.order })

/**
 * Webflow deployment injects entries from the
 * cassettes" CMS collection into script tags in the body
 */
function getCassettesFromDOM(): CassetteData[] {
  const cassettes: CassetteData[] = Array
    .from(document.querySelectorAll('script.cassette-item'))
    .map(elem => JSON.parse(elem.innerHTML))
    .map(parseOrder)
  return cassettes
}

function getGroundCassettesFromDOM(): GroundCassette[] {
  const cassettes: GroundCassette[] = Array
    .from(document.querySelectorAll('script.tv-cassette-item'))
    .map(elem => JSON.parse(elem.innerHTML))
  return cassettes
}

function getCategoriesFromDOM(): CategoryData[] {
  const categories: CategoryData[] = Array
    .from(document.querySelectorAll('script.category-item'))
    .map(elem => JSON.parse(elem.innerHTML))
    .map(parseOrder)
  return categories
}

function sortCassettesIntoShelves(cassettes: CassetteData[]): ShelfData[] {
  const categories: CategoryData[] = getCategoriesFromDOM()
  const shelves: ShelfData[] = []
  for (const cassette of cassettes) {
    const shelf = shelves.find(shelf => shelf.name === cassette.category)
    if (shelf)
      shelf.cassettes.push(cassette)
    else
      shelves.push({
        name: cassette.category,
        cassettes: [cassette],
        texture: categories.find(cat => cat.name === cassette.category)?.texture || "" ,
      })
  }
  return shelves
}

const useShelves = create(
  combine({
    maxCassettesPerShelf: 0,
    shelfScale: 1,
    categories: getCategoriesFromDOM(),
    shelves: sortCassettesIntoShelves(getCassettesFromDOM()),
    groundCassettes: getGroundCassettesFromDOM(),
  }, set => ({ set }))
)
export default useShelves
