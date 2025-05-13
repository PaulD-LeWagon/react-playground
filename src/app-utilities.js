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

Object.defineProperty(Array.prototype, "sortf", {
  value: function (compare) {
    return [].concat(this).sort(compare)
  },
})
Object.defineProperty(Array.prototype, "chunk", {
  value: function (inToXes = 0, callback) {
    if (inToXes < 1) return []
    const retArray = []
    let copyArray = [...this]
    while (copyArray.length) {
      retArray.push(copyArray.slice(0, inToXes))
      copyArray = copyArray.slice(inToXes)
    }
    return retArray
  },
})
Object.defineProperty(Array.prototype, "each_cons", {
  value: function (num) {
    return Array.from({ length: this.length - num + 1 }, (_, i) =>
      this.slice(i, i + num)
    )
  },
})
Object.defineProperty(Array.prototype, "first", {
  value: function () {
    return this[0]
  },
})
Object.defineProperty(Array.prototype, "second", {
  value: function () {
    return this[1]
  },
})
Object.defineProperty(Array.prototype, "third", {
  value: function () {
    return this[2]
  },
})
Object.defineProperty(Array.prototype, "fourth", {
  value: function () {
    return this[3]
  },
})
Object.defineProperty(Array.prototype, "fifth", {
  value: function () {
    return this[4]
  },
})
Object.defineProperty(Array.prototype, "last", {
  value: function () {
    return this[this.length - 1]
  },
})

// Object.defineProperty(Array.prototype, "###", {
//   value: function () {},
// })
