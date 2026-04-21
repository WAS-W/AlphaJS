(function() {

  // لو المستخدم عمل Alpha خده
  let Alpha = window.Alpha || {}

  // ولو مش مربوط بالـ window اربطه
  window.Alpha = Alpha

  Alpha.components = Alpha.components || {}

  Alpha.component = (name, fn) => Alpha.components[name] = fn

  Alpha.parse = (template) => {
    return template.replace(/~(.*?)~/g, (_, key) => {
      return Alpha.state[key] || ""
    })
  }

  Alpha.state = Alpha.state || new Proxy({}, {
    set(obj, key, value) {
      obj[key] = value
      Alpha.render()
      return true
    }
  })

  Alpha.render = () => {
    document.querySelectorAll("[alpha]").forEach(el => {
      const name = el.getAttribute("alpha")
      el.innerHTML = Alpha.parse(Alpha.components[name]?.() || "")
    })
  }

})()
