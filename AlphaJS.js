(function() {
  
  let Alpha = window.Alpha || {}
  window.Alpha = Alpha
  
  // 🧩 Components
  // من الاخر ده اوبجكت بخزن فيه كل الكومبونانس بتاعتي
  Alpha.components = {}
  //الكومبونه الجديد انا خليتها فانكشن علشان لما اشغل الكومبونا انت فتاخد الاسم من الاتش تي ام ال وتشغل عليه الفانكشن اللي هي التمبلت
  Alpha.component = (name, fn) => {
    Alpha.components[name] = fn
  }
  
  // ⚡ Reactive State
  //ده صاحبنا الكبير من الاخر هو بيعمل اوبجيكت اسمه الفا وليه حاجه اسمها ستات ايه بتاخد الفاليو من الاخر هو عنده متغير خاص بيه اسمه الداتا بيعمل نيو بروكسي من الاخر البروكس ديت هتاخد الفيديو وهتخزن الاوبجيكت يعني من الاخر هتعمل ايه ببجي دوت كي بيساوي الفاليو اللي هو النيم بتاع الكي بيساوي الفاليو بتاعه الكاي جوه الاوبجكت ده هتشغل الرندر عشان يعمل تلقائي وهترجع تروح وفي القط هترجع الداتا بقى اللي احنا استخدمناها دي
  Object.defineProperty(Alpha, "state", {
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
  
  // 🧠 Template Parser
  //ده الوحش العملاق هيشوف المتغير ما بين علامتين الدولار ساين جوه اي اتش تي ام ال او اي سترنج وهيقوم محوله على طول للمتغير اللي انا كنت عامله
  Alpha.parse = (template) => {
    return template.replace(/\$(\w+)/g, (_, key) => {
      return Alpha.state?.[key.trim()] ?? ""
    })
  }
  
  const app = document.querySelector('body');
  
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[link]");
    if (!el) return;
    
    e.preventDefault();
    
    const path = el.getAttribute("href"); // 👈 مفيش URL ولا حاجة
    
    history.pushState(null, "", path);
    
    const page = Alpha.routes[path];
    
    if (page) {
      app.innerHTML = page();
      Alpha.render();
    }
  });
  
  document.addEventListener('click', (e) => {
    let el = e.target
    
    while (el && el !== document) {
      if (el.hasAttribute && el.hasAttribute('$click')) {
        const code = el.getAttribute('$click')
        
        new Function(
          "Alpha",
          `with(Alpha.state){ ${code} }`
        )(Alpha)
        break
      }
      el = el.parentElement
    }
  })
  
  
  // 🚀 Render
  //ده يا اسطى بقى المخ المدبر اللي حرفيا بعمل فيه كل حاجه بعمل اتريبيوت الاتربيوت ده وكانه عامل زي الاي دي بشغل عليه الكومباوند وبعمل خاصيه اسمها كليك بشغلها كاتريبيوت زي فيو ات كليك
  Alpha.render = () => {
    
    console.warn('You Are use AlphaJS.js framework')
    // 🧱 HTML + Components
    document.querySelectorAll("[alpha]").forEach(el => {
      const name = el.getAttribute("alpha")
      const comp = Alpha.components[name]
      
      // حفظ الأصل
      if (!el.__alpha_original) {
        el.__alpha_original = el.innerHTML
      }
      
      let content = el.__alpha_original
      
      // إضافة component
      if (comp) {
        content += comp()
      }
      
      el.innerHTML = Alpha.parse(content)
    })
    
    
    // 🧠 Conditions ($if)
    document.querySelectorAll('[\\$if]').forEach(el => {
      
      if (!el.__alpha_original_if) {
        el.__alpha_original_if = el.innerHTML
      }
      
      const code = el.getAttribute('$if')
      
      const result = new Function(
        "Alpha",
        `with(Alpha.state){ return ${code} }`
      )(Alpha)
      
      if (result) {
        el.innerHTML = Alpha.parse(el.__alpha_original_if)
      } else {
        el.innerHTML = ""
      }
      
    })
    
  }
  
  
})() 
