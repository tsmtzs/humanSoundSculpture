// 'Maybe' based on Appendix B of
// Brian Lonsdorf's 'Professor Frisby’s Mostly Adequate Guide to Functional Programming'.
// https://github.com/MostlyAdequate/mostly-adequate-guide
// and
// James Sinclair's 'THE MARVELLOUSLY MYSTERIOUS JAVASCRIPT MAYBE MONAD'
// https://jrsinclair.com/articles/2016/marvellously-mysterious-javascript-maybe-monad/
class Maybe {
  #value

  get isNothing () {
    return this.#value === null || this.#value === undefined
  }

  get isJust () {
    return !this.isNothing
  }

  constructor (x) {
    this.#value = x
  }

  // ----- Pointed Maybe
  static of (x) {
    return new Maybe(x)
  }

  // ----- Functor Maybe
  map (fn) {
    return this.isNothing ? this : Maybe.of(fn(this.#value))
  }

  // ----- Applicative Maybe
  ap (f) {
    return this.isNothing ? this : f.map(this.#value)
  }

  // ----- Monad Maybe
  chain (fn) {
    return this.map(fn).join()
  }

  join () {
    return this.isNothing ? this : this.#value
  }

  traverse (of, fn) {
    return this.isNothing ? of(this) : fn(this.#value).map(Maybe.of)
  }

  // ---- From James Sinclair
  orElse (value) {
    return this.isNothing ? Maybe.of(value) : this
  }
}

export { Maybe }
