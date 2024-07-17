document.addEventListener('DOMContentLoaded', function() {
    const recetasContainer = document.getElementById('recetasContainer');
    const confirmPopup = document.getElementById('confirmPopup');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    let recetaIdToDelete = null;

    function cargarRecetas() {
      fetch('/api/recetas')
        .then(response => response.json())
        .then(data => {
          const recetasMap = new Map();
  
          data.forEach(item => {
            const recetaId = item.receta_id;
            if (!recetasMap.has(recetaId)) {
              recetasMap.set(recetaId, {
                nombre: item.receta_nombre,
                productos: [],
                coste: 0
              });
            }
  
            const receta = recetasMap.get(recetaId);
            receta.productos.push({
              nombre: item.producto_nombre,
              cantidad: item.producto_cantidad,
              valor: item.producto_valor,
              cantidad_base: item.producto_cantidad_base
            });
  
            // Calcular valor unitario y coste del producto en la receta
            const valorUnitario = item.producto_valor / item.producto_cantidad_base;
            const cantidadProducto = item.producto_cantidad;
            const costeProducto = valorUnitario * cantidadProducto;
            receta.coste += costeProducto;
          });
  
          recetasContainer.innerHTML = '';
          recetasMap.forEach((receta, recetaId) => {
            const recetaDiv = document.createElement('div');
            recetaDiv.classList.add('receta');
  
            const nombreDiv = document.createElement('div');
            nombreDiv.classList.add('receta-nombre');
            nombreDiv.textContent = receta.nombre;
            recetaDiv.appendChild(nombreDiv);
  
            const productosUl = document.createElement('ul');
            receta.productos.forEach(producto => {
              const productoLi = document.createElement('li');
              productoLi.textContent = `${producto.cantidad} - ${producto.nombre}`;
              productosUl.appendChild(productoLi);
            });
            recetaDiv.appendChild(productosUl);
  
            const costeDiv = document.createElement('div');
            costeDiv.classList.add('receta-coste');
            costeDiv.textContent = `Coste: $ ${Math.round(receta.coste)}`;
            recetaDiv.appendChild(costeDiv);

            const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'x';
          deleteBtn.classList.add('delete-btn');
          deleteBtn.addEventListener('click', () => {
            recetaIdToDelete = recetaId;
            confirmPopup.style.display = 'flex';
          });
          recetaDiv.appendChild(deleteBtn);
  
            recetasContainer.appendChild(recetaDiv);
          });
        })
        .catch(error => {
          console.error('Error fetching recipes:', error);
        });
    }

    function eliminarReceta() {
      if (recetaIdToDelete) {
        fetch(`/api/recetas/${recetaIdToDelete}`, {
          method: 'DELETE'
        })
          .then(response => {
            if (response.ok) {
              cargarRecetas();
              confirmPopup.style.display = 'none';
              recetaIdToDelete = null;
            } else {
              console.error('Error deleting recipe');
            }
          })
          .catch(error => {
            console.error('Error deleting recipe:', error);
          });
      }
    }
  
    confirmDeleteBtn.addEventListener('click', eliminarReceta);
    cancelDeleteBtn.addEventListener('click', () => {
    confirmPopup.style.display = 'none';
      recetaIdToDelete = null;
    });
  
    cargarRecetas();
  });