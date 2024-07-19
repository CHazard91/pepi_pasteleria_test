const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./config/db');
const bodyParser = require('body-parser');

// Conectar a la base de datos
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// Configurar body-parser para manejar datos POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para mostrar productos.html

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'productos.html'));
});


//Ruta para mostrar recetas.html
app.get('/recetas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'recetas.html'));
});

// Ruta para obtener todas las recetas y sus productos
app.get('/api/recetas', (req, res) => {
  const sql = `
    SELECT r.id AS receta_id, r.nombre AS receta_nombre, 
           p.nombre AS producto_nombre, p.valor AS producto_valor, 
           p.cantidad AS producto_cantidad_base, 
           dr.cantidad AS producto_cantidad
    FROM recetas r
    JOIN detalle_receta dr ON r.id = dr.id_receta
    JOIN productos p ON dr.id_producto = p.id
    ORDER BY r.id;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching recipes:', err);
      res.status(500).send('Error fetching recipes');
      return;
    }
    res.json(results);
  });
});


// Ruta para manejar la creación de productos
app.post('/productos', (req, res) => {
    const { nombre, valor, cantidad } = req.body;
  
    // Insertar el producto en la base de datos
    const sql = 'INSERT INTO productos (nombre, valor, cantidad) VALUES (?, ?, ?)';
    db.query(sql, [nombre, valor, cantidad], (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
        res.status(500).send('Error inserting product');
        return;
      }
      res.status(200).send('Product added successfully');
    });
  });

  // Ruta para obtener productos desde la base de datos
app.get('/api/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.json(results);
  });
});

// Ruta para manejar la creación de recetas
app.post('/api/recetas', (req, res) => {
  const { nombreReceta, productos } = req.body;

  // Insertar la nueva receta en la base de datos
  const sqlReceta = 'INSERT INTO recetas (nombre) VALUES (?)';
  db.query(sqlReceta, [nombreReceta], (err, result) => {
    if (err) {
      console.error('Error inserting recipe:', err);
      res.status(500).send('Error inserting recipe');
      return;
    }
    const recetaId = result.insertId;

    // Insertar productos asociados a la receta en la tabla intermedia detalle_receta
    const sqlDetalleReceta = 'INSERT INTO detalle_receta (id_receta, id_producto, cantidad) VALUES ?';
    const values = productos.map(p => [recetaId, p.id, p.cantidad]);

    db.query(sqlDetalleReceta, [values], (err, result) => {
      if (err) {
        console.error('Error inserting recipe products:', err);
        res.status(500).send('Error inserting recipe products');
        return;
      }
      res.status(200).send('Receta añadida exitosamente');
    });
  });
});

app.delete('/api/recetas/:id', (req, res) => {
  const recetaId = req.params.id;
  
  // Elimina los registros de la tabla intermedia primero
  const deleteDetalleSql = 'DELETE FROM detalle_receta WHERE id_receta = ?';
  db.query(deleteDetalleSql, [recetaId], (err, result) => {
    if (err) {
      console.error('Error deleting recipe details:', err);
      res.status(500).send('Error deleting recipe details');
      return;
    }
    
    // Luego elimina la receta
    const deleteRecetaSql = 'DELETE FROM recetas WHERE id = ?';
    db.query(deleteRecetaSql, [recetaId], (err, result) => {
      if (err) {
        console.error('Error deleting recipe:', err);
        res.status(500).send('Error deleting recipe');
        return;
      }
      res.sendStatus(200);
    });
  });
});

// Traer todos los productos desde la bd

app.get('/api/productos', (req, res) => {
  const sql = 'SELECT * FROM productos';
  db.query(sql, (err, result) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }
    res.json(result);
  });
});

// manejar modificacion de productos

app.put('/api/productos/:id', (req, res) => {
  const productoId = req.params.id;
  const { valor, cantidad_base} = req.body;

  const sql = 'UPDATE productos SET valor = ?, cantidad = ? WHERE id = ?';
  db.query(sql, [valor, cantidad_base, productoId], (err, result) => {
    if (err) {
      console.error('Error updating product:', err);
      res.status(500).send('Error updating product');
      return;
    }
    res.sendStatus(200);
  });
});





  // Iniciar el servidor
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
  
