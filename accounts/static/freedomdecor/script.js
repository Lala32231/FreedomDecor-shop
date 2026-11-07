/* Лічильник кошика (поки що лише демонстрація, справжній кошик буде в Django) */
let cartCount = 0;

document.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;

  cartCount++;
  document.getElementById('cart').textContent = `Кошик (${cartCount})`;

  button.textContent = 'Додано';
  setTimeout(() => { button.textContent = 'У кошик'; }, 1200);
});
