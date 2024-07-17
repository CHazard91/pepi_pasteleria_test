document.addEventListener('DOMContentLoaded', function() {
    const productosContainer = document.getElementById('productosContainer');
  
    // Función para cargar productos desde la base de datos
    function cargarProductos() {
      fetch('/api/productos')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Productos obtenidos:', data); // Verifica si los datos se obtienen correctamente
          productosContainer.innerHTML = '';
          data.forEach(producto => {
            const productoItem = document.createElement('div');
            productoItem.classList.add('producto-item');
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'productos';
            checkbox.value = producto.id;
            checkbox.addEventListener('change', function() {
              if (this.checked) {
                cantidadInput.style.display = 'inline-block';
              } else {
                cantidadInput.style.display = 'none';
              }
            });
            
            const label = document.createElement('label');
            label.textContent = producto.nombre; // Mostrar solo el nombre del producto
            
            const cantidadInput = document.createElement('input');
            cantidadInput.type = 'number';
            cantidadInput.name = `cantidad_${producto.id}`;
            cantidadInput.placeholder = 'Cantidad';
            cantidadInput.style.display = 'none';
            
            productoItem.appendChild(checkbox);
            productoItem.appendChild(label);
            productoItem.appendChild(cantidadInput);
            
            productosContainer.appendChild(productoItem);
          });
        })
        .catch(error => {
          console.error('Error:', error); // Verifica si hay algún error en la obtención de productos
        });
    }
  
    cargarProductos();
  
    // Manejar el envío del formulario
    document.getElementById('recetaForm').addEventListener('submit', function(event) {
      event.preventDefault();
  
      const formData = new FormData(this);
      const selectedProducts = [];
  
      document.querySelectorAll('input[name="productos"]:checked').forEach(checkbox => {
        const id = checkbox.value;
        const cantidad = formData.get(`cantidad_${id}`);
        selectedProducts.push({ id, cantidad });
      });
  
      const data = {
        nombreReceta: formData.get('nombreReceta'),
        productos: selectedProducts
      };
  
      fetch('/api/recetas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(response => response.text())
      .then(data => {
        const messageDiv = document.getElementById('message');
        messageDiv.style.display = 'block';
        messageDiv.innerText = data;
  
        // Limpiar el formulario
        this.reset();
  
        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
          messageDiv.style.display = 'none';
        }, 3000);
      })
      .catch(error => console.error('Error:', error));
    });
  });
  
  