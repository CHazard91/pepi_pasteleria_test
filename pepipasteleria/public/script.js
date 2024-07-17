document.getElementById('productForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita que el formulario se envíe de la manera tradicional
  
    const form = event.target;
    const formData = new FormData(form);
  
    fetch('/productos', {
      method: 'POST',
      body: new URLSearchParams(formData)
    })
    .then(response => response.text())
    .then(data => {
      // Mostrar el mensaje de éxito
      const messageDiv = document.getElementById('message');
      messageDiv.style.display = 'block';
      messageDiv.innerText = data;
  
      // Limpiar el formulario
      form.reset();
  
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        messageDiv.style.display = 'none';
      }, 3000);
    })
    .catch(error => {
      console.error('Error:', error);
    });
  });
  