export default class AppState {
  #memory
  #displayValue
  #calcStack

  constructor(args = { memory: "0", displayValue: "0", calcStack: [] }) {
    this.#memory = args.memory
    this.#displayValue = args.displayValue
    this.#calcStack = args.calcStack
  }

  getCalculation() {
    return `${this.calcStack.join("")}${this.displayValue}`
  }

  toString() {
    return `m: (${this.#memory}), dv: (${
      this.#displayValue
    }) cs: [${this.#calcStack.join(", ")}]`
  }

  newState(newState = {}) {
    let curState = {
      memory: this.#memory,
      displayValue: this.#displayValue,
      calcStack: this.#calcStack,
    }
    return new AppState(Object.assign(curState, newState))
  }

  *[Symbol.iterator]() {
    yield* Object.values(this) // yield* Object.entries(this)
  }

  get memory() {
    return this.#memory
  }

  set memory(toThisValue) {
    this.#memory = toThisValue
  }

  get displayValue() {
    return this.#displayValue
  }

  set displayValue(toThisValue) {
    this.#displayValue = toThisValue
  }

  get calcStack() {
    return this.#calcStack
  }

  set calcStack(toThisValue) {
    this.#calcStack = toThisValue
  }
}
