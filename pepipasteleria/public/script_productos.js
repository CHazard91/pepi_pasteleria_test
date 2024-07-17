document.addEventListener('DOMContentLoaded', function() {
    const productosContainer = document.getElementById('productosContainer');
    const editPopup = document.getElementById('editPopup');
    const editProductoForm = document.getElementById('editProductoForm');
    const cancelEditBtn = document.getElementById('cancelEditBtn');
  
    let productoIdToEdit = null;
  
    function cargarProductos() {
      fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
          productosContainer.innerHTML = '';
          data.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');
            productoDiv.textContent = `${producto.nombre} - ${producto.valor} - ${producto.cantidad}`;
  
            const editBtn = document.createElement('button');
            editBtn.textContent = 'Modificar';
            editBtn.addEventListener('click', () => {
              productoIdToEdit = producto.id;
              document.getElementById('editNombre').value = producto.nombre;
              document.getElementById('editValor').value = producto.valor;
              document.getElementById('editCantidadBase').value = producto.cantidad_base;
              editPopup.style.display = 'flex';
            });
  
            productoDiv.appendChild(editBtn);
            productosContainer.appendChild(productoDiv);
          });
        })
        .catch(error => {
          console.error('Error fetching products:', error);
        });
    }
  
    editProductoForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const valor = document.getElementById('editValor').value;
      const cantidad_base = document.getElementById('editCantidadBase').value;
  
      fetch(`/api/productos/${productoIdToEdit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ valor, cantidad_base })
      })
        .then(response => {
          if (response.ok) {
            cargarProductos();
            editPopup.style.display = 'none';
            productoIdToEdit = null;
          } else {
            console.error('Error updating product');
          }
        })
        .catch(error => {
          console.error('Error updating product:', error);
        });
    });
  
    cancelEditBtn.addEventListener('click', () => {
      editPopup.style.display = 'none';
      productoIdToEdit = null;
    });
  
    cargarProductos();
  });
  
  