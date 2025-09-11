let cartId = localStorage.getItem('cartId');

async function initCart() {
  if (!cartId) {
    const res = await fetch('/api/carts', { method: 'POST' });
    const data = await res.json();
    cartId = data._id;
    localStorage.setItem('cartId', cartId);
  }
  await loadCart();
}

async function loadCart() {
  const res = await fetch(`/api/carts/${cartId}`);
  const cart = await res.json();

  const cartContainer = document.getElementById('cartContainer');
  cartContainer.innerHTML = '';

  if (!cart.products || cart.products.length === 0) {
    cartContainer.innerHTML = '<p>El carrito está vacío</p>';
    return;
  }

  cart.products.forEach(p => {
    cartContainer.innerHTML += `
      <div class="cart-item">
        <img src="${p.product.thumbnail || '/img/default.png'}" alt="${p.product.title}" />
        <h3>${p.product.title}</h3>
        <p>Precio: $${p.product.price}</p>
        <p>Cantidad: ${p.quantity}</p>
        <button class="removeBtn" data-id="${p.product._id}">Eliminar</button>
      </div>
    `;
  });

  document.querySelectorAll('.removeBtn').forEach(btn => {
    btn.onclick = async () => {
      const productId = btn.getAttribute('data-id');
      await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'DELETE' });
      await loadCart();
    };
  });
}

window.onload = initCart;  