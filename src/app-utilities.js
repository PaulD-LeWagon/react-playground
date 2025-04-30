
export const arrayChunk = (theArray, inToXes = 0) => {
  if (!theArray || inToXes < 1) return []
  const retArray = []
  while (theArray.length) {
    retArray.push(theArray.slice(0, inToXes))
    theArray = theArray.slice(inToXes)
  }
  return retArray
}

export const eachCons = (array, num) => {
  return Array.from({ length: array.length - num + 1 }, (_, i) =>
    array.slice(i, i + num)
  )
}
