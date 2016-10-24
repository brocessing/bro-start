let _hash

const store = {
  set hash (value) {
    _hash = value
  },
  get hash () {
    return _hash
  }
}

module.exports = store
