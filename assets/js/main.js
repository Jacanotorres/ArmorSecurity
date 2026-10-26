/* ============================================================
   ARMOR SECURITY — lógica del sitio (HTML estático + data.js)
   ============================================================ */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const page = document.body.dataset.page || "";
  const params = new URLSearchParams(location.search);

  /* ---------- Contacto ---------- */
  function waNumber() {
    let n = (SITE.whatsapp || "").replace(/\D/g, "");
    if (n.length === 10) n = "57" + n;
    return n;
  }
  function contactHref(text) {
    const n = waNumber();
    return n ? "https://wa.me/" + n + "?text=" + encodeURIComponent(text || "") : "contacto.html";
  }
  const money = (v) =>
    v == null ? "Consultar" : new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(v);

  const ICON_WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.200zm4.5-6.100c-.2-.1-1.500-.7-1.700-.8s-.4-.1-.6.100-.6.8-.8 1-.3.2-.5.100a6.700 6.700 0 0 1-3.300-2.900c-.2-.4.2-.4.600-1.200.1-.1 0-.3 0-.4l-.8-1.900c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.300 3 3 0 0 0-.9 2.200 5.200 5.200 0 0 0 1.100 2.800 11.900 11.900 0 0 0 4.600 4c1.700.7 2.400.8 3.200.7a2.700 2.700 0 0 0 1.800-1.300 2.200 2.200 0 0 0 .2-1.300c-.1-.1-.3-.2-.5-.3z"/></svg>';
  const ICON_SHIELD = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 3 5v6c0 5.500 3.800 10.700 9 12 5.200-1.300 9-6.500 9-12V5l-9-4z"/></svg>';

  /* ---------- Siluetas de referencia (cuando aún no hay foto) ---------- */
  const SIL = {
    SUV: {
      body: "M36 140 L36 106 Q36 98 46 96 L90 90 L124 48 Q130 42 140 42 L270 42 Q282 42 290 50 L324 92 L356 98 Q368 100 368 112 L368 140",
      win: "M132 54 L156 54 L156 90 L104 90 Z M166 54 L216 54 L216 90 L166 90 Z M226 54 L268 54 Q274 54 278 60 L304 90 L226 90 Z"
    },
    Sedán: {
      body: "M36 140 L36 112 Q36 104 46 102 L98 96 L134 66 Q140 62 150 62 L238 62 Q250 62 258 68 L298 98 L354 104 Q368 106 368 116 L368 140",
      win: "M142 74 L174 74 L174 96 L112 96 Z M182 74 L232 74 L232 96 L182 96 Z M240 74 L250 74 L282 96 L240 96 Z"
    },
    Camioneta: {
      body: "M36 140 L36 106 Q36 98 46 96 L92 90 L124 52 Q130 46 140 46 L208 46 Q218 46 224 54 L238 92 L368 92 L368 140",
      win: "M132 58 L158 58 L158 88 L104 88 Z M168 58 L206 58 Q210 58 212 64 L222 88 L168 88 Z M238 92 L238 100 L368 100"
    },
    Van: {
      body: "M36 140 L36 90 Q36 80 48 78 L78 74 L110 44 Q116 40 124 40 L332 40 Q342 40 346 48 L368 92 L368 140",
      win: "M120 50 L150 50 L150 80 L92 80 Z M160 50 L206 50 L206 80 L160 80 Z M216 50 L262 50 L262 80 L216 80 Z M272 50 L324 50 L346 80 L272 80 Z"
    }
  };
  function silhouette(tipo) {
    const s = SIL[tipo] || SIL.SUV;
    return (
      '<svg class="silhouette" viewBox="0 0 400 190" aria-hidden="true">' +
      '<path class="ground" d="M10 172 H390"/>' +
      '<path d="' + s.body + '"/><path d="M36 140 H72 M128 140 H274 M330 140 H368"/>' +
      '<path d="' + s.win + '"/>' +
      '<circle class="wheel" cx="100" cy="140" r="28"/><circle cx="100" cy="140" r="11"/>' +
      '<circle class="wheel" cx="302" cy="140" r="28"/><circle cx="302" cy="140" r="11"/>' +
      "</svg>"
    );
  }

  /* ---------- Tarjeta de vehículo ---------- */
  function badgesHTML(v) {
    return (
      (v.modalidades.includes("venta") ? '<span class="badge">Venta</span>' : "") +
      (v.modalidades.includes("alquiler") ? '<span class="badge badge-line">Alquiler</span>' : "")
    );
  }
  function nombre(v) { return v.marca + " " + v.linea; }

  function vehCard(v) {
    const img = v.fotos && v.fotos.length
      ? '<img src="' + esc(v.fotos[0]) + '" alt="' + esc(nombre(v)) + '" loading="lazy">'
      : silhouette(v.tipo) + '<span class="soon">Foto próximamente</span>';
    const rows = [];
    if (v.modalidades.includes("venta")) rows.push('<div><span class="k">Venta</span><b>' + money(v.precioVenta) + "</b></div>");
    if (v.modalidades.includes("alquiler")) rows.push('<div><span class="k">Alquiler / día</span><b>' + money(v.tarifas && v.tarifas.dia) + "</b></div>");
    const specs = [v.anio, v.pasajeros ? v.pasajeros + " pasajeros" : "", v.transmision].filter(Boolean);
    return (
      '<article class="card reveal">' +
      '<a class="card-img" href="vehiculo.html?id=' + esc(v.id) + '" aria-label="Ver ' + esc(nombre(v)) + '">' +
      '<div class="card-badges">' + badgesHTML(v) + (v.ejemplo ? '<span class="badge badge-demo">Muestra</span>' : "") + "</div>" +
      img + "</a>" +
      '<div class="card-body">' +
      '<span class="card-ref">REF ' + esc(v.ref) + " · " + esc(v.tipo).toUpperCase() + "</span>" +
      '<h3><a href="vehiculo.html?id=' + esc(v.id) + '"><small>' + esc(v.marca) + "</small>" + esc(v.linea) + "</a></h3>" +
      '<span class="level">' + ICON_SHIELD + "Blindaje nivel " + esc(v.nivel) + "</span>" +
      '<div class="specs">' + specs.map((s) => "<span>" + esc(s) + "</span>").join("") + "</div>" +
      '<div class="prices">' + rows.join("") + "</div>" +
      '<a class="btn btn-sm" href="vehiculo.html?id=' + esc(v.id) + '">Ver ficha</a>' +
      "</div></article>"
    );
  }

  /* ---------- Encabezado y pie ---------- */
  function renderChrome() {
    const mod = params.get("modalidad");
    const act = (key) => {
      if (page === "catalogo") {
        if (key === "venta") return mod === "venta" ? " active" : "";
        if (key === "alquiler") return mod === "alquiler" ? " active" : "";
        if (key === "catalogo") return mod ? "" : " active";
      }
      if (key === "vehiculo") return "";
      return page === key ? " active" : "";
    };
    $("#header").innerHTML =
      '<div class="wrap header-in">' +
      '<a class="brand" href="index.html" aria-label="Armor Security, inicio">' +
      '<img src="assets/img/logo.webp" alt="" width="36" height="48">' +
      '<span class="brand-name">Armor <b>Security</b></span></a>' +
      '<button class="menu-btn" aria-label="Abrir menú" aria-expanded="false"><span></span></button>' +
      '<nav class="nav" id="nav">' +
      '<a class="' + act("home").trim() + '" href="index.html">Inicio</a>' +
      '<a class="' + act("catalogo").trim() + '" href="catalogo.html">Catálogo</a>' +
      '<a class="' + act("venta").trim() + '" href="catalogo.html?modalidad=venta">Venta</a>' +
      '<a class="' + act("alquiler").trim() + '" href="catalogo.html?modalidad=alquiler">Alquiler</a>' +
      '<a class="' + act("blindaje").trim() + '" href="blindaje.html">Blindaje</a>' +
      '<a class="' + act("contacto").trim() + '" href="contacto.html">Contacto</a>' +
      '<a class="btn btn-gold btn-sm" href="' + esc(contactHref("Hola, quiero cotizar un vehículo blindado.")) + '">Cotizar</a>' +
      "</nav></div>";

    const btn = $(".menu-btn");
    const nav = $("#nav");
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
    $$("#nav a").forEach((a) => a.addEventListener("click", () => nav.classList.remove("open")));

    const contacto = [];
    if (SITE.whatsapp) contacto.push('<li><a href="' + esc(contactHref("Hola, necesito información.")) + '">WhatsApp</a></li>');
    if (SITE.telefono) contacto.push("<li>" + esc(SITE.telefono) + "</li>");
    if (SITE.correo) contacto.push('<li><a href="mailto:' + esc(SITE.correo) + '">' + esc(SITE.correo) + "</a></li>");
    if (SITE.direccion || SITE.ciudad) contacto.push("<li>" + esc([SITE.direccion, SITE.ciudad].filter(Boolean).join(", ")) + "</li>");
    if (SITE.horario) contacto.push("<li>" + esc(SITE.horario) + "</li>");
    if (!contacto.length) contacto.push('<li><a href="contacto.html">Escríbenos desde Contacto</a></li>');

    const redes = [];
    if (SITE.instagram) redes.push('<li><a href="https://instagram.com/' + esc(SITE.instagram) + '" target="_blank" rel="noopener">Instagram</a></li>');
    if (SITE.facebook) redes.push('<li><a href="https://facebook.com/' + esc(SITE.facebook) + '" target="_blank" rel="noopener">Facebook</a></li>');
    if (SITE.tiktok) redes.push('<li><a href="https://tiktok.com/@' + esc(SITE.tiktok) + '" target="_blank" rel="noopener">TikTok</a></li>');
    if (SITE.linkedin) redes.push('<li><a href="' + esc(SITE.linkedin) + '" target="_blank" rel="noopener">LinkedIn</a></li>');

    $("#footer").innerHTML =
      '<div class="wrap"><div class="foot-grid">' +
      '<div class="foot-brand"><img src="assets/img/logo.webp" alt="Armor Security"><p>Vehículos blindados en venta y alquiler por periodos. Catálogo completo, claro y a la medida.</p></div>' +
      '<div><h4>Explorar</h4><ul><li><a href="catalogo.html">Catálogo</a></li><li><a href="catalogo.html?modalidad=venta">En venta</a></li><li><a href="catalogo.html?modalidad=alquiler">En alquiler</a></li><li><a href="blindaje.html">Niveles de blindaje</a></li></ul></div>' +
      '<div><h4>Contacto</h4><ul>' + contacto.join("") + "</ul></div>" +
      (redes.length ? "<div><h4>Síguenos</h4><ul>" + redes.join("") + "</ul></div>" : "<div></div>") +
      "</div>" +
      '<div class="foot-bottom"><span>© ' + new Date().getFullYear() + " Armor Security</span><span>Blindaje vehicular · Venta y alquiler</span></div></div>";

    if (waNumber()) {
      const a = document.createElement("a");
      a.className = "wa-float";
      a.href = contactHref("Hola, necesito información sobre vehículos blindados.");
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "Escribir por WhatsApp");
      a.innerHTML = ICON_WA;
      document.body.appendChild(a);
    }
  }

  /* ---------- Revelado al hacer scroll ---------- */
  function reveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- Inicio ---------- */
  function initHome() {
    const feat = VEHICULOS.filter((v) => v.destacado).slice(0, 3);
    $("#featured").innerHTML = (feat.length ? feat : VEHICULOS.slice(0, 3)).map(vehCard).join("");
    $("#niveles").innerHTML = NIVELES.map((n) =>
      '<div class="panel reveal"><span class="tag">Blindaje</span><h3>' + esc(n.titulo) + "</h3><p><strong>" + esc(n.resumen) + ".</strong> " + esc(n.detalle) + "</p></div>"
    ).join("");
    $("#periodos").innerHTML = PERIODOS.map((p, i) =>
      '<div class="panel reveal"><span class="step-n">0' + (i + 1) + "</span><h3>" + esc(p.titulo) + "</h3><p>" + esc(p.texto) + "</p></div>"
    ).join("");
  }

  /* ---------- Catálogo ---------- */
  function initCatalogo() {
    const state = {
      modalidad: ["venta", "alquiler"].includes(params.get("modalidad")) ? params.get("modalidad") : "todos",
      tipo: params.get("tipo") || "",
      nivel: params.get("nivel") || "",
      marca: params.get("marca") || "",
      q: params.get("q") || ""
    };
    const uniq = (k) => Array.from(new Set(VEHICULOS.map((v) => v[k]).filter(Boolean))).sort();
    const fill = (id, list, label) => {
      $(id).innerHTML = '<option value="">' + label + "</option>" + list.map((x) => '<option value="' + esc(x) + '">' + esc(x) + "</option>").join("");
    };
    fill("#f-tipo", uniq("tipo"), "Todos los tipos");
    fill("#f-nivel", NIVELES.map((n) => n.id), "Todo nivel");
    fill("#f-marca", uniq("marca"), "Todas las marcas");
    $("#f-tipo").value = state.tipo;
    $("#f-nivel").value = state.nivel;
    $("#f-marca").value = state.marca;
    $("#f-q").value = state.q;

    function paint() {
      $$(".tabs button").forEach((b) => b.classList.toggle("on", b.dataset.m === state.modalidad));
      const q = state.q.trim().toLowerCase();
      const list = VEHICULOS.filter((v) =>
        (state.modalidad === "todos" || v.modalidades.includes(state.modalidad)) &&
        (!state.tipo || v.tipo === state.tipo) &&
        (!state.nivel || v.nivel === state.nivel) &&
        (!state.marca || v.marca === state.marca) &&
        (!q || (v.marca + " " + v.linea + " " + v.anio + " " + v.ref).toLowerCase().includes(q))
      );
      $("#count").innerHTML = "<b>" + list.length + "</b> " + (list.length === 1 ? "unidad disponible" : "unidades disponibles");
      $("#grid").innerHTML = list.length
        ? list.map(vehCard).join("")
        : '<div class="empty" style="grid-column:1/-1"><h3>Sin resultados</h3><p>Prueba quitando algún filtro, o cuéntanos qué necesitas y lo conseguimos.</p><p style="margin-top:20px"><a class="btn btn-gold" href="' + esc(contactHref("Hola, busco un vehículo blindado que no veo en el catálogo.")) + '">Pedir una cotización</a></p></div>';
      $("#demo-note").classList.toggle("hidden", !list.some((v) => v.ejemplo));
      reveal();
      const p = new URLSearchParams();
      if (state.modalidad !== "todos") p.set("modalidad", state.modalidad);
      ["tipo", "nivel", "marca", "q"].forEach((k) => state[k] && p.set(k, state[k]));
      history.replaceState(null, "", location.pathname + (p.toString() ? "?" + p : ""));
      const titles = { todos: "Catálogo", venta: "Vehículos en venta", alquiler: "Vehículos en alquiler" };
      $("#cat-title").textContent = titles[state.modalidad];
    }

    $$(".tabs button").forEach((b) => b.addEventListener("click", () => { state.modalidad = b.dataset.m; paint(); }));
    [["#f-tipo", "tipo"], ["#f-nivel", "nivel"], ["#f-marca", "marca"]].forEach(([id, k]) =>
      $(id).addEventListener("change", (e) => { state[k] = e.target.value; paint(); })
    );
    $("#f-q").addEventListener("input", (e) => { state.q = e.target.value; paint(); });
    paint();
  }

  /* ---------- Ficha ---------- */
  function initVehiculo() {
    const root = $("#veh-root");
    const v = VEHICULOS.find((x) => x.id === params.get("id"));
    if (!v) {
      root.innerHTML = '<div class="empty" style="margin:64px 0"><h3>Vehículo no encontrado</h3><p>Puede que ya no esté disponible.</p><p style="margin-top:20px"><a class="btn btn-gold" href="catalogo.html">Ver catálogo</a></p></div>';
      return;
    }
    document.title = nombre(v) + " " + v.anio + " blindado — Armor Security";
    const nv = NIVELES.find((n) => n.id === v.nivel);
    const fotos = v.fotos || [];
    const main = fotos.length
      ? '<img id="g-main" src="' + esc(fotos[0]) + '" alt="' + esc(nombre(v)) + '">'
      : silhouette(v.tipo) + '<span class="soon">Foto próximamente</span>';
    const thumbs = fotos.length > 1
      ? '<div class="thumbs">' + fotos.map((f, i) => '<button class="' + (i === 0 ? "on" : "") + '" data-i="' + i + '" aria-label="Foto ' + (i + 1) + '"><img src="' + esc(f) + '" alt=""></button>').join("") + "</div>"
      : "";

    const row = (k, val) => (val ? "<div><dt>" + k + "</dt><dd>" + esc(val) + "</dd></div>" : "");
    const datos =
      row("Referencia", v.ref) + row("Tipo", v.tipo) + row("Año", v.anio) + row("Color", v.color) +
      row("Transmisión", v.transmision) + row("Combustible", v.combustible) + row("Cilindraje", v.cilindraje) +
      row("Pasajeros", v.pasajeros) + row("Nivel de blindaje", v.nivel);

    const tarifaRows = v.modalidades.includes("alquiler")
      ? '<div class="box"><h2>Alquiler <span>Por periodo</span></h2><dl class="rows">' +
        '<div><dt>Por día</dt><dd class="big">' + money(v.tarifas && v.tarifas.dia) + "</dd></div>" +
        '<div><dt>Por semana</dt><dd class="big">' + money(v.tarifas && v.tarifas.semana) + "</dd></div>" +
        '<div><dt>Por mes</dt><dd class="big">' + money(v.tarifas && v.tarifas.mes) + "</dd></div></dl></div>"
      : "";
    const ventaRow = v.modalidades.includes("venta")
      ? '<div class="box"><h2>Venta <span>Precio</span></h2><dl class="rows"><div><dt>Precio</dt><dd class="big">' + money(v.precioVenta) + "</dd></div></dl></div>"
      : "";

    const base = "Hola, me interesa el " + nombre(v) + " " + v.anio + " (REF " + v.ref + ")";
    const ctas =
      (v.modalidades.includes("venta") ? '<a class="btn btn-gold" href="' + esc(contactHref(base + " para compra. ¿Me comparten información?")) + '">Cotizar compra</a>' : "") +
      (v.modalidades.includes("alquiler") ? '<a class="btn" href="' + esc(contactHref(base + " para alquiler. Necesito el vehículo del ___ al ___.")) + '">Cotizar alquiler</a>' : "");

    root.innerHTML =
      '<a class="veh-back" href="catalogo.html">← Volver al catálogo</a>' +
      '<div class="veh"><div>' +
      '<div class="gallery-main">' + main + "</div>" + thumbs +
      (v.descripcion ? '<p class="veh-desc">' + esc(v.descripcion) + "</p>" : "") +
      '</div><div><div class="veh-title"><div class="badges">' + badgesHTML(v) + (v.ejemplo ? '<span class="badge badge-demo">Ficha de muestra</span>' : "") + "</div>" +
      "<h1><small>" + esc(v.marca) + "</small>" + esc(v.linea) + " " + esc(v.anio) + "</h1></div>" +
      ventaRow + tarifaRows +
      '<div class="box"><h2>Ficha técnica <span>' + esc(v.ref) + "</span></h2><dl class=\"rows\">" + datos + "</dl></div>" +
      (nv ? '<div class="box"><h2>Blindaje <span>Nivel ' + esc(nv.id) + "</span></h2><dl class=\"rows\"><div><dt>Protección</dt><dd>" + esc(nv.resumen) + '</dd></div></dl><p style="padding:0 22px 18px;color:var(--muted);font-size:15px">' + esc(nv.detalle) + "</p></div>" : "") +
      '<div class="veh-cta">' + ctas + "</div></div></div>";

    $$(".thumbs button").forEach((b) => b.addEventListener("click", () => {
      $("#g-main").src = fotos[+b.dataset.i];
      $$(".thumbs button").forEach((x) => x.classList.toggle("on", x === b));
    }));
  }

  /* ---------- Contacto ---------- */
  function initContacto() {
    const items = [];
    if (SITE.whatsapp) items.push('<a href="' + esc(contactHref("Hola, necesito información.")) + '" target="_blank" rel="noopener"><small>WhatsApp</small>Escríbenos ahora</a>');
    if (SITE.telefono) items.push("<div><small>Teléfono</small>" + esc(SITE.telefono) + "</div>");
    if (SITE.correo) items.push('<a href="mailto:' + esc(SITE.correo) + '"><small>Correo</small>' + esc(SITE.correo) + "</a>");
    if (SITE.direccion || SITE.ciudad) items.push("<div><small>Ubicación</small>" + esc([SITE.direccion, SITE.ciudad].filter(Boolean).join(", ")) + "</div>");
    if (SITE.horario) items.push("<div><small>Horario</small>" + esc(SITE.horario) + "</div>");
    $("#contact-list").innerHTML = items.length
      ? items.join("")
      : '<div><small>Canales</small>Los datos de contacto se publicarán muy pronto.</div>';

    const sel = $("#c-veh");
    sel.innerHTML = '<option value="">Aún no lo sé</option>' +
      VEHICULOS.map((v) => '<option value="' + esc(v.ref) + '">' + esc(v.ref + " · " + nombre(v) + " " + v.anio) + "</option>").join("");
    const pre = params.get("id") && VEHICULOS.find((v) => v.id === params.get("id"));
    if (pre) sel.value = pre.ref;

    $("#c-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const f = e.target;
      const msg =
        "Hola, soy " + f.nombre.value + ". Me interesa: " + f.interes.value +
        (f.vehiculo.value ? " (vehículo " + f.vehiculo.value + ")" : "") +
        (f.periodo.value ? ". Periodo: " + f.periodo.value : "") +
        (f.mensaje.value ? ". " + f.mensaje.value : "");
      const note = $("#c-note");
      if (waNumber()) {
        window.open(contactHref(msg), "_blank", "noopener");
        note.textContent = "Abrimos WhatsApp con tu mensaje listo para enviar.";
      } else if (SITE.correo) {
        location.href = "mailto:" + SITE.correo + "?subject=" + encodeURIComponent("Consulta Armor Security") + "&body=" + encodeURIComponent(msg);
      } else {
        note.textContent = "Estamos configurando los canales de contacto. Vuelve a intentarlo en un momento.";
      }
    });
  }

  /* ---------- Arranque ---------- */
  renderChrome();
  if (page === "home") initHome();
  if (page === "catalogo") initCatalogo();
  if (page === "vehiculo") initVehiculo();
  if (page === "contacto") initContacto();
  reveal();
})();
