(function() {

  let Alpha = window.Alpha || {}
  window.Alpha = Alpha

  // components
  Alpha.components = {}

  Alpha.component = (name, fn) => {
    Alpha.components[name] = fn
  }

  // data (reactive)
  Object.defineProperty(Alpha, "data", {
    set(value) {
      Alpha._data = new Proxy(value, {
        set(obj, key, val) {
          obj[key] = val
          Alpha.render()
          return true
        }
      })
    },
    get() {
      return Alpha._data
    }
  })

  // template parser
  Alpha.parse = (template) => {
    return template.replace(/~(.*?)~/g, (_, key) => {
      return Alpha.data?.[key] ?? ""
    })
  }

  // render
  Alpha.render = () => {
    document.querySelectorAll("[alpha]").forEach(el => {
      const name = el.getAttribute("alpha")
      const comp = Alpha.components[name]
      el.innerHTML = Alpha.parse(comp?.() || "")
    })
  }

})()
