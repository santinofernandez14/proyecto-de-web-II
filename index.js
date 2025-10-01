const express = require('express');
const path = require('path');
const fs = require('fs').promises;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

const traductor = require('node-google-translate-skidz');

async function traducir(texto) {
  try {
    const traduccion = await traductor({
      text: texto,
      source: 'en',
      target: 'es'
    });
    return traduccion.translation;
  } catch (error) {
    console.error('Error al traducir:', error);
    return texto; // Devuelve el texto original en caso de error
  }
}

async function traducirProductos(productos) {
  const productosTraducidos = [];
  for (let producto of productos) {
    const tituloTraducido = await traducir(producto.title);
    const descripcionTraducida = await traducir(producto.description);
    const categoriaTraducida = await traducir(producto.category);
    productosTraducidos.push({
      ...producto,
      title: tituloTraducido,
      description: descripcionTraducida,
      category: categoriaTraducida,
    });
  }
  return productosTraducidos;
}

async function aplicarDescuentos(productos, descuentos) {
  return productos.map(producto => {
    const desc = descuentos.find(descuento => descuento.id === producto.id);
    if (desc) {
      producto.descuento = desc.descuento;
      producto.priceWithDiscount = producto.price - (producto.price * (producto.descuento / 100));
    } else {
      producto.priceWithDiscount = producto.price; // Si no hay descuento
    }
    return producto;
  });
}

let descuentos = [];

// Cargar descuentos al iniciar la aplicación
async function cargarDescuentos() {
  try {
    const descuentosPath = path.join(__dirname, 'descuentos.json');
    const data = await fs.readFile(descuentosPath, 'utf8');
    descuentos = JSON.parse(data);
    console.log('Descuentos cargados:', descuentos);
  } catch (error) {
    console.error('Error al cargar descuentos:', error);
    // Manejar el error apropiadamente
  }
}

cargarDescuentos(); // Llamar a la función para cargar descuentos al iniciar la aplicación

app.get("/", async (req, res) => {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    let productos = await response.json();

    // Traducir productos
    productos = await traducirProductos(productos);

    // Aplicar descuentos
    productos = await aplicarDescuentos(productos, descuentos);

    res.render("index", { productos });

  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});

app.get('/cart', async (req, res) => {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    let productos = await response.json();

    // Traducir productos
    productos = await traducirProductos(productos);

    // Aplicar descuentos
    productos = await aplicarDescuentos(productos, descuentos);

    res.render('cart', { productos });
  } catch (error) {
    console.error('Error al obtener productos para el carrito:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.post('/comprar', async (req, res) => {
  const compras = req.body;
  console.log('Datos recibidos:', compras);

  if (!compras || compras.length === 0) {
    console.log('Carrito vacío');
    return res.status(400).json({ message: 'El carrito está vacío' });
  }

  const comprasPath = path.join(__dirname, 'compras.json');
  console.log('Ruta del archivo de compras:', comprasPath);

  try {
    let comprasExistentes = [];

    // Intentar leer el archivo de compras existente
    try {
      const data = await fs.readFile(comprasPath, 'utf8');
      if (data) {
        comprasExistentes = JSON.parse(data);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
      console.log('Archivo de compras no encontrado, se creará uno nuevo');
    }

    // Aplicar descuentos y traducir antes de guardar
    const comprasConDescuentoYTraducidas = await Promise.all(compras.map(async (producto) => {
      const descuento = descuentos.find(d => d.id === producto.id);
      const descuentoAplicado = descuento ? descuento.descuento : 0;
      const precioConDescuento = producto.price - (producto.price * (descuentoAplicado / 100));
      const tituloTraducido = await traducir(producto.title);

      return {
        title: tituloTraducido,
        price: precioConDescuento * producto.cantidad,
        descuento: descuentoAplicado,
        cantidad: producto.cantidad
      };
    }));

    // Agregar nuevas compras con descuento y traducción
    comprasExistentes.push(...comprasConDescuentoYTraducidas);

    // Escribir las compras actualizadas en el archivo
    await fs.writeFile(comprasPath, JSON.stringify(comprasExistentes, null, 2));
    console.log('Compra guardada exitosamente');
    res.status(200).json({ message: 'Compra guardada exitosamente' });

  } catch (error) {
    console.log('Error al manejar las compras:', error);
    res.status(500).json({ message: 'Error al guardar la compra' });
  }
});

app.post('/translate', async (req, res) => {
  const { text } = req.body;
  try {
    const translatedText = await traducir(text);
    res.json({ translatedText });
  } catch (error) {
    console.error('Error al traducir:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

app.get('/descuentos.json', async (req, res) => {
  try {
    const descuentosPath = path.join(__dirname, 'descuentos.json');
    const data = await fs.readFile(descuentosPath, 'utf8');
    const descuentos = JSON.parse(data);
    res.json(descuentos);
  } catch (error) {
    console.error('Error al leer descuentos.json:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});
