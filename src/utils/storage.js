export default class Storage {
    constructor({ prefix } = {}) {
      this._prefix = prefix
    //   this._storage = window.localStorage || {}
      this._storage = window.sessionStorage || {}
    }
  
    get(key) {
      const data = JSON.parse(this._storage.getItem(`${this._prefix}.${key}`))
      if (!data) {
        return
      }
      if (data.expire === false || data.expire >= Date.now()) {
        return data.value
      } else {
        this.remove(key)
      }
    }
  
    // expire 以毫秒为单位
    set(key, value, expire = false) {
      if (expire && typeof expire !== 'number') {
        return
      }
      return this._storage.setItem(
        `${this._prefix}.${key}`,
        JSON.stringify({
          value,
          expire: expire === false ? expire : Date.now() + expire
        })
      )
    }
  
    remove(key) {
      return this._storage.removeItem(`${this._prefix}.${key}`)
    }
  }
  