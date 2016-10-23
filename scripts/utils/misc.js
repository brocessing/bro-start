let _hash

const utils = {
  set hash (value) {
    _hash = value
  },
  get hash () {
    return _hash
  }
}

module.exports = utils
