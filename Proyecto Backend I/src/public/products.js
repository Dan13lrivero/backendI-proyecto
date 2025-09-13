const form = document.getElementById('filterForm');
const container = document.getElementById('productsContainer');
const pagination = document.getElementById('pagination');
let currentPage = 1;

async function loadProducts(page = 1) {
  const formData = new FormData(form);
  const category = formData.get('category');
  const sort = formData.get('sort');

  let query = [];
  if (category) query.push(`category:${category}`);
  const queryString = query.length ? `&query=${query.join(',')}` : '';

  const res = await fetch(`/api/products?limit=10&page=${page}${sort ? `&sort=${sort}` : ''}${queryString}`);
  const data = await res.json();

  container.innerHTML = '';
  data.payload.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.thumbnail}" alt="${p.title}">
        <h3>${p.title}</h3>
        <p>Precio: $${p.price}</p>
        <button class="addCartBtn" data-id="${p.id}">Agregar al carrito</button>
      </div>
    `;
  });

  pagination.innerHTML = `
    ${data.hasPrevPage ? '<button id="prevPage">Anterior</button>' : ''}
    <span>Página ${data.page} de ${data.totalPages}</span>
    ${data.hasNextPage ? '<button id="nextPage">Siguiente</button>' : ''}
  `;

  if (data.hasPrevPage) document.getElementById('prevPage').onclick = () => loadProducts(data.prevPage);
  if (data.hasNextPage) document.getElementById('nextPage').onclick = () => loadProducts(data.nextPage);

  document.querySelectorAll('.addCartBtn').forEach(btn => {
    btn.onclick = async () => {
      const productId = btn.getAttribute('data-id');
      let cartId = localStorage.getItem('cartId');
      if (!cartId) {
        const res = await fetch('/api/carts', { method: 'POST' });
        const data = await res.json();
        cartId = data._id;
        localStorage.setItem('cartId', cartId);
      }
      await fetch(`/api/carts/${cartId}/products/${productId}`, { method: 'POST' });
      alert('Producto agregado al carrito');
    };
  });
}

form.onsubmit = (e) => {
  e.preventDefault();
  loadProducts(1);
};

window.onload = () => loadProducts(currentPage);
