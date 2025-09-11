const socket = io();

function renderProducts(products) {
  const container = document.getElementById('productList');
  if (!container) return;

  container.innerHTML = '';

  products.forEach(p => {
    const id = p.id ?? p._id ?? '';
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.id = id;

    div.innerHTML = `
      <img src="${p.thumbnail}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <p>Precio: $${Number(p.price).toFixed(2)}</p>
      <button class="deleteBtn" data-id="${id}">Eliminar</button>
    `;

    container.appendChild(div);
  });

  attachDeleteHandlers();
}

function attachDeleteHandlers() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.onclick = () => {
      const id = btn.dataset.id;
      if (!id) return;
      socket.emit('deleteProduct', id);
    };
  });
}

socket.on('updateProducts', (products) => {
  renderProducts(products);
});

const form = document.getElementById('productForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const product = Object.fromEntries(fd.entries());
    if (product.price) product.price = Number(product.price);
    if (product.stock) product.stock = Number(product.stock);
    socket.emit('addProduct', product);
    form.reset();
  });
}  