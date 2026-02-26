/* ════════════════════════════════════════════════════════════
   Mil Detalles LasTresY · script.js
   Módulos:
     1.  Loader animado
     2.  Navbar scroll + hamburguesa
     3.  Ribbon infinito (duplicar contenido)
     4.  Catálogo: datos base + localStorage + render + filtros
     5.  Carrito: agregar / quitar / actualizar UI
     6.  ✅ WhatsApp: window.open + https://wa.me/573165389152 + variables carrito
     7.  Formulario de contacto → WhatsApp
     8.  Admin: login / logout / CRUD localStorage
     9.  Scroll reveal (IntersectionObserver)
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── CONSTANTES ─── */
const WA       = '573165389152';         // Número WhatsApp (sin + ni espacios)
const A_USER   = 'admin';               // Usuario admin
const A_PASS   = 'mildetalles2025';     // Contraseña admin
const LS_KEY   = 'mld_productos';       // clave localStorage para productos admin
const SES_KEY  = 'mld_session';         // clave sessionStorage para login admin

/* ──────────────────────────────────────────────
   1. LOADER
─────────────────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  if (!loader || !fill) return;

  let prog = 0;
  const iv = setInterval(() => {
    prog += Math.random() * 15 + 5;
    if (prog >= 100) {
      prog = 100;
      clearInterval(iv);
      fill.style.width = '100%';
      setTimeout(() => loader.classList.add('gone'), 500);
    }
    fill.style.width = prog + '%';
  }, 80);
})();

/* ──────────────────────────────────────────────
   2. NAVBAR: scroll + hamburguesa + cerrar links
─────────────────────────────────────────────── */
(function () {
  const header    = document.getElementById('header');
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  /* Agrega clase .solid al bajar 60px */
  window.addEventListener('scroll', () => {
    header?.classList.toggle('solid', window.scrollY > 60);
  }, { passive: true });

  /* Hamburguesa toggle */
  hamburger?.addEventListener('click', () => {
    const open = navMobile?.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    navMobile?.setAttribute('aria-hidden', String(!open));
  });

  /* Cierra el menú al hacer clic en cualquier link del menú móvil */
  navMobile?.querySelectorAll('.nm-link').forEach(a => {
    a.addEventListener('click', () => {
      navMobile.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      navMobile.setAttribute('aria-hidden', 'true');
    });
  });

  /* También cierra al hacer clic en cualquier <a href="#…"> */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', () => {
      navMobile?.classList.remove('open');
      hamburger?.classList.remove('open');
    });
  });
})();

/* ──────────────────────────────────────────────
   3. RIBBON INFINITO
─────────────────────────────────────────────── */
(function () {
  const roll = document.getElementById('ribbonRoll');
  if (!roll) return;
  // Duplicar el contenido para scroll continuo sin saltos
  roll.innerHTML += roll.innerHTML;
})();

/* ──────────────────────────────────────────────
   4. CATÁLOGO — DATOS Y RENDER
─────────────────────────────────────────────── */

/**
 * Productos base del negocio (13 productos en 4 categorías).
 * Cada uno tiene: id, cat, emoji, name, desc, price, img
 */
const PRODUCTOS_BASE = [
  // ─ REPOSTERÍA ─
  {
    id: 1, cat: 'reposteria', emoji: '🎂',
    name: 'Torta de Cumpleaños Personalizada',
    desc: 'Bizcocho húmedo de vainilla o chocolate, relleno de frutas, crema o dulce de leche. Decorada a tu gusto.',
    price: 95000,
    img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80'
  },
  {
    id: 2, cat: 'reposteria', emoji: '🧁',
    name: 'Box Cupcakes Artesanales ×12',
    desc: 'Docena de cupcakes esponjosos con buttercream. Sabores: vainilla, chocolate, red velvet o frutos rojos.',
    price: 68000,
    img: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&q=80'
  },
  {
    id: 3, cat: 'reposteria', emoji: '🍰',
    name: 'Cheesecake de Maracuyá',
    desc: 'Base crujiente de galleta, crema de queso Philadelphia y coulis tropical de maracuyá. Entera de 20cm.',
    price: 72000,
    img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&q=80'
  },
  {
    id: 4, cat: 'reposteria', emoji: '🍫',
    name: 'Brownie Box Premium ×8',
    desc: 'Brownies de chocolate belga 70% con nueces pecanas. Crujientes por fuera, húmedos y fudgy por dentro.',
    price: 55000,
    img: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&q=80'
  },
  {
    id: 5, cat: 'reposteria', emoji: '💒',
    name: 'Torta de Matrimonio Premium',
    desc: 'Torta de boda de 3 pisos, cubierta en fondant o buttercream, con flores naturales o en azúcar. Diseño exclusivo.',
    price: 350000,
    img: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=500&q=80'
  },
  {
    id: 6, cat: 'reposteria', emoji: '🍩',
    name: 'Donas Artesanales ×6',
    desc: 'Donas esponjosas glaseadas en cobertura de colores y toppings: sprinkles, oreo, maní, frutas liofilizadas.',
    price: 42000,
    img: 'https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=500&q=80'
  },
  // ─ DECORACIONES ─
  {
    id: 7, cat: 'decoraciones', emoji: '🌸',
    name: 'Flores en Azúcar ×15',
    desc: 'Rosas, peonías y buganvilias modeladas a mano en pasta de azúcar. 100% comestibles y personalizables.',
    price: 58000,
    img: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?w=500&q=80'
  },
  {
    id: 8, cat: 'decoraciones', emoji: '✨',
    name: 'Drip de Chocolate Artesanal',
    desc: 'Cobertura tipo drip en chocolate blanco, negro o de colores. Incluye elementos comestibles de tu elección.',
    price: 35000,
    img: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80'
  },
  {
    id: 9, cat: 'decoraciones', emoji: '🎀',
    name: 'Topper Personalizado en Acrílico',
    desc: 'Letras, nombres y figuras en acrílico espejo. Acabado dorado, plateado o de colores. Diseño único tuyo.',
    price: 30000,
    img: ''
  },
  // ─ DETALLES ─
  {
    id: 10, cat: 'detalles', emoji: '🎁',
    name: 'Caja Regalo Artesanal',
    desc: 'Surtido de mini-postres en caja kraft decorada. Perfecta para regalos de cumpleaños, fechas especiales o amor.',
    price: 82000,
    img: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=500&q=80'
  },
  {
    id: 11, cat: 'detalles', emoji: '🍬',
    name: 'Paletas de Chocolate ×5',
    desc: 'Chocolate artesanal templado con toppings a elección: frutas, maní, galletas, liofilizados o sprinkles.',
    price: 38000,
    img: 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=500&q=80'
  },
  // ─ ACCESORIOS ─
  {
    id: 12, cat: 'accesorios', emoji: '🕯️',
    name: 'Kit Velas Metálicas Numéricas',
    desc: 'Números del 0 al 9 en acabado metálico dorado o plateado. Incluye portavelas. Pack de ×3 velas.',
    price: 15000,
    img: ''
  },
  {
    id: 13, cat: 'accesorios', emoji: '🎊',
    name: 'Kit Decoración Fiesta Completo',
    desc: 'Globos nacarados, guirnalda kraft, serpentinas y confetti metálico. ¡Todo para tu mesa dulce perfecta!',
    price: 24000,
    img: ''
  }
];

/* ── Utilidades ── */

/** Formatea número como precio en pesos colombianos */
function cop(n) {
  return '$' + Number(n).toLocaleString('es-CO');
}

/** Nombre legible de categoría */
function catLabel(c) {
  return { reposteria: 'Repostería', decoraciones: 'Decoraciones', detalles: 'Detalles', accesorios: 'Accesorios' }[c] || c;
}

/** Recupera productos del admin desde localStorage */
function getProdAdmin() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}

/** Todos los productos = base + admin */
function todosLosProductos() {
  return [...PRODUCTOS_BASE, ...getProdAdmin().map(p => ({ ...p, isNew: true }))];
}

/** Filtra por categoría */
function filtrar(cat) {
  const all = todosLosProductos();
  return cat === 'all' ? all : all.filter(p => p.cat === cat);
}

let filtroActivo = 'all';

/** Renderiza el grid de productos */
function renderProductos(cat) {
  filtroActivo = cat;
  const grid = document.getElementById('prodGrid');
  if (!grid) return;
  const lista = filtrar(cat);

  if (!lista.length) {
    grid.innerHTML = '<p style="color:var(--gray);grid-column:1/-1;text-align:center;padding:2rem">Sin productos en esta categoría aún. 🌸</p>';
    return;
  }

  grid.innerHTML = '';
  lista.forEach((p, i) => {
    const card = document.createElement('article');
    card.className = 'pcard' + (p.isNew ? ' is-new' : '');
    card.style.animationDelay = `${i * 60}ms`;
    card.setAttribute('aria-label', `Producto: ${p.name}`);

    // Imagen real o fallback emoji
    const imgHTML = p.img
      ? `<div class="pcard-img">
           <span class="pcard-cat">${catLabel(p.cat)}</span>
           ${p.isNew ? '<span class="pcard-new-badge">Nuevo ✨</span>' : ''}
           <img src="${p.img}" alt="${p.name}" loading="lazy"/>
         </div>`
      : `<div class="pcard-img" style="position:relative">
           <span class="pcard-cat">${catLabel(p.cat)}</span>
           ${p.isNew ? '<span class="pcard-new-badge">Nuevo ✨</span>' : ''}
           <div class="pcard-emoji">${p.emoji}</div>
         </div>`;

    card.innerHTML = `
      ${imgHTML}
      <div class="pcard-body">
        <h3 class="pcard-name">${p.name}</h3>
        <p class="pcard-desc">${p.desc}</p>
        <div class="pcard-footer">
          <span class="pcard-price">${cop(p.price)}</span>
          <button
            class="btn-agregar"
            aria-label="Agregar ${p.name} al carrito"
            data-id="${p.id}"
            data-name="${p.name}"
            data-price="${p.price}"
            data-emoji="${p.emoji}"
            data-img="${p.img || ''}">
            + Agregar
          </button>
        </div>
      </div>
    `;

    /* Evento: agregar al carrito */
    card.querySelector('.btn-agregar').addEventListener('click', function () {
      agregarAlCarrito({
        id:    Number(this.dataset.id),
        name:  this.dataset.name,
        price: Number(this.dataset.price),
        emoji: this.dataset.emoji,
        img:   this.dataset.img
      });
      this.textContent = '✓ Agregado';
      this.classList.add('added');
      setTimeout(() => {
        this.textContent = '+ Agregar';
        this.classList.remove('added');
      }, 1800);
    });

    grid.appendChild(card);
  });
}

/* Eventos de filtros */
document.querySelectorAll('.fpill').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.fpill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProductos(btn.dataset.cat);
  });
});

renderProductos('all'); // Render inicial

/* ──────────────────────────────────────────────
   5. CARRITO — Estado y UI
─────────────────────────────────────────────── */
let carrito = []; // [{ id, name, price, qty, emoji, img }]

const cartAside  = document.getElementById('cartAside');
const cartOvl    = document.getElementById('cartOvl');
const caItems    = document.getElementById('caItems');
const caEmpty    = document.getElementById('caEmpty');
const caForm     = document.getElementById('caForm');
const caFoot     = document.getElementById('caFoot');
const caSubtotal = document.getElementById('caSubtotal');
const caTotal    = document.getElementById('caTotal');
const cartBadge  = document.getElementById('cartBadge');

/** Abre el sidebar del carrito */
function abrirCarrito() {
  cartAside?.classList.add('open');
  cartOvl?.classList.add('open');
  cartAside?.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/** Cierra el sidebar del carrito */
function cerrarCarrito() {
  cartAside?.classList.remove('open');
  cartOvl?.classList.remove('open');
  cartAside?.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/** Suma todos los ítems del carrito */
function totalCarrito() {
  return carrito.reduce((s, i) => s + i.price * i.qty, 0);
}

/** Cantidad total de productos en el carrito */
function cantidadTotal() {
  return carrito.reduce((s, i) => s + i.qty, 0);
}

/** Agrega un producto al carrito (o aumenta su cantidad) */
function agregarAlCarrito(prod) {
  const existe = carrito.find(i => i.id === prod.id);
  if (existe) {
    existe.qty++;
  } else {
    carrito.push({ ...prod, qty: 1 });
  }
  actualizarCarritoUI();
  abrirCarrito();
  toast(`${prod.emoji} "${prod.name}" agregado al carrito 🎉`);
}

/** Cambia la cantidad de un ítem (+1 o -1) */
function cambiarCantidad(id, delta) {
  const item = carrito.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) carrito = carrito.filter(i => i.id !== id);
  actualizarCarritoUI();
}

/**
 * Actualiza toda la UI del carrito:
 * - Badge de cantidad en el ícono
 * - Lista de ítems
 * - Sección de formulario y totales (mostrar/ocultar)
 */
function actualizarCarritoUI() {
  /* Badge */
  if (cartBadge) cartBadge.textContent = cantidadTotal();

  /* Mostrar u ocultar secciones */
  const hayItems = carrito.length > 0;
  if (caEmpty)  caEmpty.style.display   = hayItems ? 'none' : 'block';
  if (caForm)   caForm.style.display    = hayItems ? 'block' : 'none';
  if (caFoot)   caFoot.style.display    = hayItems ? 'block' : 'none';

  /* Totales */
  const total = totalCarrito();
  if (caSubtotal) caSubtotal.textContent = cop(total);
  if (caTotal)    caTotal.textContent    = cop(total);

  /* Renderizar ítems */
  if (!caItems) return;
  // Limpia ítems previos pero conserva el empty state
  caItems.querySelectorAll('.ca-item-row').forEach(el => el.remove());

  carrito.forEach(item => {
    const row = document.createElement('div');
    row.className = 'ca-item-row';

    // Miniatura: imagen o emoji
    const thumbContent = item.img
      ? `<img src="${item.img}" alt="${item.name}" loading="lazy"/>`
      : item.emoji;

    row.innerHTML = `
      <div class="ca-thumb">${thumbContent}</div>
      <div class="ca-info">
        <p class="ca-name">${item.name}</p>
        <p class="ca-price">${cop(item.price)} c/u · <strong style="color:var(--pink)">${cop(item.price * item.qty)}</strong></p>
      </div>
      <div class="ca-qty-controls">
        <button class="ca-qbtn" data-delta="-1" aria-label="Quitar uno">−</button>
        <span class="ca-qty" aria-label="Cantidad ${item.qty}">${item.qty}</span>
        <button class="ca-qbtn" data-delta="1"  aria-label="Agregar uno">+</button>
      </div>
    `;

    /* Botones de cantidad */
    row.querySelectorAll('.ca-qbtn').forEach(btn => {
      btn.addEventListener('click', () => cambiarCantidad(item.id, Number(btn.dataset.delta)));
    });

    caItems.appendChild(row);
  });
}

/* Abrir / cerrar carrito */
document.getElementById('cartBtn')?.addEventListener('click', abrirCarrito);
document.getElementById('caClose')?.addEventListener('click', cerrarCarrito);
cartOvl?.addEventListener('click', cerrarCarrito);

/* ──────────────────────────────────────────────
   6. ✅ FINALIZAR PEDIDO POR WHATSAPP (carrito)
      Verificación: window.open con
      https://wa.me/573165389152 + variables del carrito
─────────────────────────────────────────────── */
document.getElementById('btnFinalizar')?.addEventListener('click', () => {

  /* Validación: carrito no vacío */
  if (!carrito.length) {
    toast('⚠️ Tu carrito está vacío. Agrega productos primero.');
    return;
  }

  /* Recoger datos del formulario de entrega */
  const nombre    = document.getElementById('cfNom')?.value.trim()  || '';
  const direccion = document.getElementById('cfDir')?.value.trim()  || '';
  const depto     = document.getElementById('cfDep')?.value         || '';
  const ciudad    = document.getElementById('cfCiu')?.value.trim()  || '';
  const telefono  = document.getElementById('cfTel')?.value.trim()  || '';

  /* Validación de campos obligatorios */
  if (!nombre || !direccion || !depto || !ciudad || !telefono) {
    toast('⚠️ Completa todos los datos de entrega para continuar');
    if (!nombre)    document.getElementById('cfNom')?.focus();
    else if (!direccion) document.getElementById('cfDir')?.focus();
    else if (!depto)     document.getElementById('cfDep')?.focus();
    else if (!ciudad)    document.getElementById('cfCiu')?.focus();
    else                 document.getElementById('cfTel')?.focus();
    return;
  }

  /* ── Construir el mensaje usando las variables del carrito ── */
  const totalItems   = cantidadTotal();     // Variable del carrito: total de ítems
  const totalPrecio  = totalCarrito();      // Variable del carrito: total en pesos

  let msg = `🎂 *PEDIDO NUEVO — Mil Detalles LasTresY*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `👤 *DATOS DEL CLIENTE*\n`;
  msg += `   • Nombre: *${nombre}*\n`;
  msg += `   • Teléfono: *${telefono}*\n`;
  msg += `   • Dirección: ${direccion}\n`;
  msg += `   • Ciudad: ${ciudad}, ${depto}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `🛍 *PRODUCTOS (${totalItems} ítem${totalItems !== 1 ? 's' : ''})*\n\n`;

  /* Itera sobre el array `carrito` (variable del estado) */
  carrito.forEach((item, idx) => {
    const subtotalItem = item.price * item.qty; // Variable del carrito: subtotal por ítem
    msg += `  ${idx + 1}. ${item.emoji} *${item.name}*\n`;
    msg += `     ${item.qty} × ${cop(item.price)} = *${cop(subtotalItem)}*\n\n`;
  });

  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `💰 *TOTAL A PAGAR: ${cop(totalPrecio)}*\n`;  // Variable del carrito
  msg += `📦 Envío: se coordina según ubicación\n\n`;
  msg += `📅 Fecha del pedido: ${new Date().toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n`;
  msg += `\n_⏰ Recuerda: pedidos con mínimo 48 horas de anticipación_\n`;
  msg += `_✅ Enviado desde mildetalles.lasstresy.com_`;

  /* ✅ window.open con https://wa.me/573165389152 y el mensaje codificado */
  const waURL = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  window.open(waURL, '_blank', 'noopener,noreferrer');
});

/* ──────────────────────────────────────────────
   7. FORMULARIO DE CONTACTO → WHATSAPP
─────────────────────────────────────────────── */
document.getElementById('pedidoForm')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const nombre    = document.getElementById('fNombre')?.value.trim()      || '';
  const direccion = document.getElementById('fDireccion')?.value.trim()   || '';
  const depto     = document.getElementById('fDepartamento')?.value       || '';
  const ciudad    = document.getElementById('fCiudad')?.value.trim()      || '';
  const telefono  = document.getElementById('fTelefono')?.value.trim()    || '';
  const mensaje   = document.getElementById('fMensaje')?.value.trim()     || '';

  if (!nombre || !direccion || !depto || !ciudad || !telefono) {
    toast('⚠️ Por favor completa los campos obligatorios (*) antes de enviar.');
    return;
  }

  let msg = `🎂 *ENCARGO ESPECIAL — Mil Detalles LasTresY*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `👤 *Nombre:* ${nombre}\n`;
  msg += `📞 *Teléfono:* ${telefono}\n`;
  msg += `📍 *Dirección:* ${direccion}, ${ciudad}, ${depto}\n`;
  if (mensaje) msg += `\n📝 *Descripción del pedido:*\n${mensaje}\n`;
  msg += `\n_Enviado desde el formulario de contacto_`;

  /* ✅ window.open con https://wa.me/573165389152 */
  const waURL = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
  window.open(waURL, '_blank', 'noopener,noreferrer');

  // Feedback visual
  toast('✅ ¡Abriendo WhatsApp! Completa el envío desde allá.');
  this.reset();
});

/* ──────────────────────────────────────────────
   8. PANEL DE ADMINISTRACIÓN
─────────────────────────────────────────────── */

/** Verifica si hay una sesión activa al cargar */
function checkSession() {
  if (sessionStorage.getItem(SES_KEY) === 'true') mostrarPanel();
}

function mostrarPanel() {
  document.getElementById('adminLogin').style.display  = 'none';
  document.getElementById('adminPanel').style.display  = 'block';
  renderAdminList();
}

function ocultarPanel() {
  document.getElementById('adminLogin').style.display  = 'block';
  document.getElementById('adminPanel').style.display  = 'none';
  sessionStorage.removeItem(SES_KEY);
}

/* Login */
document.getElementById('loginForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const user = document.getElementById('aUser')?.value.trim();
  const pass = document.getElementById('aPass')?.value;
  const err  = document.getElementById('loginErr');

  if (user === A_USER && pass === A_PASS) {
    sessionStorage.setItem(SES_KEY, 'true');
    if (err) err.textContent = '';
    mostrarPanel();
    toast('✅ Bienvenido al panel de administración');
  } else {
    if (err) err.textContent = '❌ Usuario o contraseña incorrectos.';
    document.getElementById('aPass').value = '';
  }
});

/* Logout */
document.getElementById('logoutBtn')?.addEventListener('click', () => {
  ocultarPanel();
  toast('Sesión cerrada correctamente');
});

/* Agregar producto al localStorage */
document.getElementById('addProdForm')?.addEventListener('submit', function (e) {
  e.preventDefault();
  const nom  = document.getElementById('pNom')?.value.trim();
  const pre  = Number(document.getElementById('pPre')?.value);
  const cat  = document.getElementById('pCat')?.value;
  const emo  = document.getElementById('pEmo')?.value.trim()  || '🍰';
  const des  = document.getElementById('pDes')?.value.trim();
  const img  = document.getElementById('pImg')?.value.trim()  || '';

  if (!nom || !pre || !cat || !des) {
    toast('⚠️ Completa todos los campos obligatorios del producto');
    return;
  }

  const prods = getProdAdmin();
  prods.push({
    id:    Date.now(),
    name:  nom, price: pre, cat, emoji: emo, desc: des, img,
    createdAt: new Date().toLocaleDateString('es-CO')
  });
  localStorage.setItem(LS_KEY, JSON.stringify(prods));

  this.reset();
  renderAdminList();
  renderProductos(filtroActivo); // Refresca el catálogo principal
  toast(`✅ "${nom}" agregado al catálogo correctamente`);
});

/** Renderiza la lista de productos del admin en el panel */
function renderAdminList() {
  const list = document.getElementById('apList');
  if (!list) return;
  const prods = getProdAdmin();

  if (!prods.length) { list.innerHTML = ''; return; }

  list.innerHTML = `<p class="ap-list-title">Productos agregados por admin</p>`;
  prods.forEach(p => {
    const row = document.createElement('div');
    row.className = 'ap-row';
    row.innerHTML = `
      <div>
        <strong>${p.emoji} ${p.name}</strong>
        <small>${catLabel(p.cat)} · ${cop(p.price)} · ${p.createdAt || ''}</small>
      </div>
      <button class="btn-del" data-id="${p.id}" aria-label="Eliminar ${p.name}">Eliminar</button>
    `;
    row.querySelector('.btn-del').addEventListener('click', () => {
      const updated = getProdAdmin().filter(x => x.id !== p.id);
      localStorage.setItem(LS_KEY, JSON.stringify(updated));
      renderAdminList();
      renderProductos(filtroActivo);
      toast('🗑 Producto eliminado del catálogo');
    });
    list.appendChild(row);
  });
}

checkSession(); // Verifica sesión al cargar

/* ──────────────────────────────────────────────
   9. SCROLL REVEAL (IntersectionObserver)
─────────────────────────────────────────────── */
(function () {
  // Asigna clases reveal a los elementos objetivo
  const targets = [
    ['.sec-head',         'reveal'],
    ['.filters-row',      'reveal'],
    ['.cat-card',         'reveal'],
    ['.nos-imgs',         'reveal-l'],
    ['.nos-text',         'reveal-r'],
    ['.gal-grid',         'reveal'],
    ['.tc',               'reveal'],
    ['.cont-left',        'reveal-l'],
    ['.cont-right',       'reveal-r'],
    ['.admin-box',        'reveal'],
  ];

  targets.forEach(([sel, cls]) => {
    document.querySelectorAll(sel).forEach(el => el.classList.add(cls));
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal,.reveal-l,.reveal-r').forEach(el => obs.observe(el));
})();

/* ──────────────────────────────────────────────
   TOAST — Notificación temporal global
─────────────────────────────────────────────── */
let _toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}
/* --- FUNCIÓN PARA AMPLIAR IMÁGENES --- */
document.addEventListener('click', function(e) {
  // Si lo que tocamos es una imagen dentro del catálogo
  if (e.target.closest('.cat-card img')) {
    const imgSrc = e.target.src;
    const imgName = e.target.alt;
    
    // Creamos el modal (el cuadro negro)
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed; top:0; left:0; width:100%; height:100%;
      background: rgba(0,0,0,0.9); z-index: 9999; display: flex;
      flex-direction: column; align-items: center; justify-content: center;
      cursor: zoom-out; animation: fadeIn 0.3s ease;
    `;
    
    // Metemos la imagen y el texto
    modal.innerHTML = `
      <img src="${imgSrc}" style="max-width: 90%; max-height: 80vh; border-radius: 10px; box-shadow: 0 0 20px rgba(0,0,0,0.5);">
      <p style="color: white; margin-top: 15px; font-family: 'Playfair Display', serif; font-size: 1.5rem;">${imgName}</p>
      <span style="position: absolute; top: 20px; right: 30px; color: white; font-size: 40px; cursor: pointer;">&times;</span>
    `;

    // Al hacer clic en cualquier parte del cuadro negro, se cierra
    modal.onclick = () => modal.remove();
    
    document.body.appendChild(modal);
  }
});

// Animación suave
const styleAnim = document.createElement('style');
styleAnim.innerHTML = `@keyframes fadeIn { from {opacity: 0;} to {opacity: 1;} }`;
document.head.appendChild(styleAnim);
