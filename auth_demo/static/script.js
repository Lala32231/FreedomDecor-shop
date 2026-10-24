/* =========================================================
   FreedomDecor — логіка сайту
   1. Дані (категорії й товари)
   2. Допоміжні функції (збирають шматки HTML)
   3. Сторінки (головна, каталог, категорія)
   4. Навігація за адресою (#/catalog, #/c/dream ...)
   5. Кошик (поки що лише лічильник)
   ========================================================= */


/* ---------- 1. Дані ---------- */

// Категорії: назва, підпис, опис, css-клас теми, id малюнка
const CATEGORIES = {
  dream: {
    name: 'Ловці снів',
    tagline: 'Щоб снилося добре',
    text: 'Нічна колекція: нитки, пір’я та бісер для спокійного сну.',
    cls: 'dream',
    theme: 'theme-dream',
    symbol: 'dream',
  },
  sun: {
    name: 'Ловці сонця',
    tagline: 'Щоб у кімнаті було тепло',
    text: 'Денна колекція: скляні підвіски й промені, що ловлять світло з вікна.',
    cls: 'sun-c',
    theme: 'theme-sun',
    symbol: 'sun',
  },
  jewelry: {
    name: 'Прикраси',
    tagline: 'Маленькі речі з характером',
    text: 'Кулони, сережки та браслети ручної роботи на кожен день.',
    cls: 'jewelry',
    theme: 'theme-jewelry',
    symbol: 'jewel',
  },
};

// Товари. tree: true — товар належить до підкатегорії «Дерево життя»
const PRODUCTS = [
  { id: 1,  name: 'Місячна ніч',      category: 'dream',   tree: false, price: 650, type: 'Ловець снів, 25 см',                isNew: false },
  { id: 2,  name: 'Блакитний сон',    category: 'dream',   tree: false, price: 520, type: 'Ловець снів, 20 см',                isNew: false },
  { id: 3,  name: 'Зоряне небо',      category: 'dream',   tree: false, price: 780, type: 'Ловець снів, 30 см',                isNew: true  },
  { id: 4,  name: 'Нічне дерево',     category: 'dream',   tree: true,  price: 720, type: 'Ловець снів «Дерево життя», 22 см', isNew: true  },

  { id: 5,  name: 'Бурштиновий день', category: 'sun',     tree: false, price: 480, type: 'Ловець сонця, 18 см',               isNew: false },
  { id: 6,  name: 'Ранок біля моря',  category: 'sun',     tree: false, price: 560, type: 'Ловець сонця, 22 см',               isNew: false },
  { id: 7,  name: 'Теплий промінь',   category: 'sun',     tree: false, price: 420, type: 'Ловець сонця, 15 см',               isNew: false },
  { id: 8,  name: 'Сонячне дерево',   category: 'sun',     tree: true,  price: 540, type: 'Ловець сонця «Дерево життя», 20 см', isNew: true },

  { id: 9,  name: 'Місячний кулон',   category: 'jewelry', tree: false, price: 350, type: 'Кулон, 3 см',                       isNew: false },
  { id: 10, name: 'Пір’їнка',         category: 'jewelry', tree: false, price: 280, type: 'Сережки, 5 см',                     isNew: false },
  { id: 11, name: 'Дерево життя',     category: 'jewelry', tree: true,  price: 390, type: 'Кулон, 3 см',                       isNew: true  },
  { id: 12, name: 'Дерево рівноваги', category: 'jewelry', tree: true,  price: 450, type: 'Браслет «Дерево життя»',            isNew: false },
];

// Посилання-фільтри для сторінки «Каталог»
const CATALOG_FILTERS = [
  ['/catalog',      'Усі'],
  ['/c/dream',      'Ловці снів'],
  ['/c/sun',        'Ловці сонця'],
  ['/c/jewelry',    'Прикраси'],
  ['/catalog/tree', 'Дерево життя'],
];


/* ---------- 2. Допоміжні функції ---------- */

const app = document.getElementById('app');     // сюди вставляється вміст сторінки
const hero = document.getElementById('hero');   // великий блок головної
let cartCount = 0;

// Який малюнок показати для товару
function symbolFor(product) {
  return product.tree ? 'tree' : CATEGORIES[product.category].symbol;
}

// Картка одного товару
function productCard(product) {
  return `
    <article class="card">
      <div class="pic ${product.category}">
        <svg viewBox="0 0 300 480"><use href="#${symbolFor(product)}"/></svg>
      </div>
      <div class="body">
        <h3>${product.name}</h3>
        <small>${product.type}</small>
        <div class="price">${product.price} грн</div>
        <button class="btn" data-add>У кошик</button>
      </div>
    </article>`;
}

// Сітка карток із списку товарів
function productGrid(list) {
  return `<div class="grid">${list.map(productCard).join('')}</div>`;
}

// Ряд кнопок-фільтрів; current — адреса активного фільтра
function chips(items, current) {
  const links = items.map(([href, title]) => {
    const active = href === current ? ' on' : '';
    return `<a class="chip${active}" href="#${href}">${title}</a>`;
  });
  return `<div class="chips">${links.join('')}</div>`;
}

// Кольоровий верх сторінки: хлібні крихти, заголовок, опис, малюнок
function pageBand(themeClass, crumbs, title, text, symbol) {
  return `
    <section class="band ${themeClass}">
      <div class="wrap">
        <div class="crumbs">${crumbs}</div>
        <h1>${title}</h1>
        <p>${text}</p>
        <svg viewBox="0 0 300 480" aria-hidden="true"><use href="#${symbol}"/></svg>
      </div>
    </section>`;
}


/* ---------- 3. Сторінки ---------- */

// Головна сторінка
function homePage() {
  // великий блок зверху (зайвий на інших сторінках)
  hero.innerHTML = `
    <div class="hero">
      <div class="moon"></div>
      <div class="wrap hero-grid">
        <div>
          <h1>Ручна робота, що береже твій сон</h1>
          <p>Ловці снів, ловці сонця та прикраси з ниток, пір’я й бісеру.
             Кожна річ плететься вручну, двох однакових не буває.</p>
          <div class="btns">
            <a class="btn sun" href="#/catalog">Дивитися каталог</a>
            <a class="btn ghost" href="#/contacts">Написати в Instagram</a>
          </div>
        </div>
        <svg class="hero-art" viewBox="0 0 300 480" role="img" aria-label="Ловець снів">
          <use href="#dream"/>
        </svg>
      </div>
      <svg class="wave" viewBox="0 0 1200 56" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 56V28C150 0 300 0 450 20s300 38 450 16 210-28 300-6V56z" fill="currentColor"/>
      </svg>
    </div>`;

  // три плитки категорій
  const categoryTiles = Object.entries(CATEGORIES).map(([key, c]) => `
    <a class="cat ${c.cls}" href="#/c/${key}">
      <svg viewBox="0 0 300 480" aria-hidden="true"><use href="#${c.symbol}"/></svg>
      <h3>${c.name}</h3>
      <p>${c.tagline}</p>
    </a>`).join('');

  return `
    <section>
      <div class="wrap">
        <h2 class="t">Три колекції</h2>
        <p class="sub">Ніч, день і щось нейтральне, що пасує до будь-якого настрою.</p>
        <div class="cats">${categoryTiles}</div>
      </div>
    </section>

    <section style="padding-top:0">
      <div class="wrap">
        <div class="tree">
          <svg viewBox="0 0 300 300" aria-hidden="true"><use href="#tree" y="-10"/></svg>
          <div>
            <h2 class="t" style="font-size:2.2rem">Дерево життя</h2>
            <p>Символ, що поєднує небо й землю. Є в кожній колекції, обирайте свою.</p>
            <div class="chips" style="margin:0">
              <a class="chip" href="#/c/dream/tree">Ловці снів</a>
              <a class="chip" href="#/c/sun/tree">Ловці сонця</a>
              <a class="chip" href="#/c/jewelry/tree">Прикраси</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section style="padding-top:8px">
      <div class="wrap">
        <h2 class="t">Новинки</h2>
        <p class="sub">Назви й ціни тут для прикладу, потім підставляться з адмінки.</p>
        ${productGrid(PRODUCTS.filter(p => p.isNew))}
      </div>
    </section>

    <section id="about">
      <div class="wrap about">
        <div class="art">
          <svg viewBox="0 0 300 480" aria-hidden="true"><use href="#dream"/></svg>
        </div>
        <div>
          <h2 class="t">Як це робиться</h2>
          <p>Усе починається з обруча й ниток. Плетіння павутинки займає від двох годин
             до цілого вечора, потім додаються пір’я, намистини та підвіски.</p>
          <p>Тут буде коротка історія майстрині: чому вона почала й що для неї означає кожна робота.</p>
        </div>
      </div>
    </section>`;
}

// Каталог: усі товари або тільки «Дерево життя» (onlyTree = true)
function catalogPage(onlyTree) {
  const crumbs = '<a href="#/">Головна</a> / Каталог' + (onlyTree ? ' / Дерево життя' : '');
  const title = onlyTree ? 'Дерево життя' : 'Каталог';
  const text = onlyTree ? 'Символ життя в кожній колекції.' : 'Усі роботи в одному місці.';
  const list = onlyTree ? PRODUCTS.filter(p => p.tree) : PRODUCTS;
  const currentFilter = onlyTree ? '/catalog/tree' : '/catalog';

  return pageBand('blue', crumbs, title, text, 'tree') + `
    <section style="padding-top:34px">
      <div class="wrap">
        ${chips(CATALOG_FILTERS, currentFilter)}
        ${productGrid(list)}
      </div>
    </section>`;
}

// Сторінка категорії; onlyTree = true — підкатегорія «Дерево життя»
function categoryPage(key, onlyTree) {
  const c = CATEGORIES[key];
  const base = '/c/' + key;
  const list = PRODUCTS.filter(p => p.category === key && (!onlyTree || p.tree));

  const crumbs = onlyTree
    ? `<a href="#/">Головна</a> / <a href="#/catalog">Каталог</a> / <a href="#${base}">${c.name}</a> / Дерево життя`
    : `<a href="#/">Головна</a> / <a href="#/catalog">Каталог</a> / ${c.name}`;
  const title = onlyTree ? 'Дерево життя' : c.name;
  const text = onlyTree ? `${c.name}: ${c.tagline.toLowerCase()}` : c.text;

  const filters = [[base, 'Усі'], [base + '/tree', 'Дерево життя']];
  const currentFilter = onlyTree ? base + '/tree' : base;

  return pageBand(c.cls, crumbs, title, text, c.symbol) + `
    <section style="padding-top:34px">
      <div class="wrap">
        ${chips(filters, currentFilter)}
        ${productGrid(list)}
      </div>
    </section>`;
}


/* ---------- 4. Навігація за адресою ---------- */

// Підсвічує активний пункт меню
function markActiveLink() {
  const current = location.hash || '#/';
  document.querySelectorAll('.links a').forEach(link => {
    const href = link.getAttribute('href');
    const isCart = link.id === 'cart';
    const active = current === href || current.startsWith(href + '/');
    link.classList.toggle('on', active && !isCart);
  });
}

// Показує потрібну сторінку залежно від адреси
function route() {
  // "#/c/dream/tree" -> ["c", "dream", "tree"]
  const parts = location.hash.replace(/^#\/?/, '').split('/');
  const [page, arg1, arg2] = parts;
  let html;
  let title = 'FreedomDecor';

  // «Написати в директ» просто прокручує до підвалу
  if (page === 'contacts') {
    document.getElementById('contacts').scrollIntoView();
    return;
  }

  hero.innerHTML = '';                       // великий блок потрібен тільки на головній
  document.documentElement.className = '';   // скидаємо тему (за замовчуванням — синя)

  if (page === 'catalog') {
    html = catalogPage(arg1 === 'tree');
  } else if (page === 'c' && CATEGORIES[arg1]) {
    html = categoryPage(arg1, arg2 === 'tree');
    title = CATEGORIES[arg1].name + ' — ' + title;
    document.documentElement.className = CATEGORIES[arg1].theme;   // тема сторінки
  } else {
    html = homePage();
  }

  app.innerHTML = html;

  if (page === 'about') {
    document.getElementById('about').scrollIntoView();
  } else {
    window.scrollTo(0, 0);
  }

  markActiveLink();
  document.title = title;
}

window.addEventListener('hashchange', route);
route();


/* ---------- 5. Кошик (поки що лише лічильник) ---------- */

document.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;

  cartCount++;
  document.getElementById('cart').textContent = `Кошик (${cartCount})`;

  button.textContent = 'Додано';
  setTimeout(() => { button.textContent = 'У кошик'; }, 1200);
});
// document.addEventListener('DOMContentLoaded', function() {

//   document.querySelectorAll('.buy-btn').forEach(function(btn) {
//     btn.addEventListener('click', function() {
//       document.getElementById('modal-product-name').textContent = this.dataset.name;
//       document.getElementById('modal-price').textContent = this.dataset.price + ' ₴';
//       document.getElementById('modal-img').src = this.dataset.image;
//       document.getElementById('modal-qty').textContent = '1';
//       document.getElementById('step-confirm').style.display = 'block';
//       document.getElementById('step-success').style.display = 'none';
//       document.getElementById('modal').style.display = 'flex';
//       document.body.style.overflow = 'hidden';
//     });
//   });

//   document.querySelector('.qty-minus').addEventListener('click', function() {
//     var el = document.getElementById('modal-qty');
//     var newVal = parseInt(el.textContent) - 1;
//     if (newVal >= 1) el.textContent = newVal;
//   });

//   document.querySelector('.qty-plus').addEventListener('click', function() {
//     var el = document.getElementById('modal-qty');
//     el.textContent = parseInt(el.textContent) + 1;
//   });

//   document.querySelector('.pay-btn').addEventListener('click', function() {
//     document.getElementById('step-confirm').style.display = 'none';
//     document.getElementById('step-success').style.display = 'block';
//   });

//   document.querySelectorAll('.close-btn').forEach(function(btn) {
//     btn.addEventListener('click', function() {
//       document.getElementById('modal').style.display = 'none';
//       document.body.style.overflow = '';
//     });
//   });

//   document.getElementById('modal').addEventListener('click', function(e) {
//     if (e.target === this) {
//       this.style.display = 'none';
//       document.body.style.overflow = '';
//     }
//   });

// });