function agregarAlCarrito(producto) {
  const memoria = JSON.parse(localStorage.getItem("carrito"))

  var cuenta = 0;
  if (!memoria) {
    const nuevoProducto = getNuevoProductoParaMemoria(producto);
    localStorage.setItem("carrito", JSON.stringify([nuevoProducto]))
    cuenta = 1;
  } else {
    const indiceProducto = memoria.findIndex(c => c.id === producto.id);
    //console.log(indiceProducto)
    const nuevaMemoria = memoria;

    if (indiceProducto === -1) {

      nuevaMemoria.push(getNuevoProductoParaMemoria(producto))

      cuenta = 1;
    } else {
      nuevaMemoria[indiceProducto].cantidad++;
      cuenta = nuevaMemoria[indiceProducto].cantidad;
    }
    localStorage.setItem("carrito", JSON.stringify(nuevaMemoria))

  }
  actualizarNumeroCarrito();
  return cuenta;
}
function restarAlCarrito(producto) {
  const memoria = JSON.parse(localStorage.getItem("carrito"));
  const indiceProducto = memoria.findIndex(c => c.id === producto.id);
  if (memoria[indiceProducto].cantidad === 1) {
    memoria.splice(indiceProducto, 1)


  } else {
    memoria[indiceProducto].cantidad--;
  }
  localStorage.setItem("carrito", JSON.stringify(memoria))
  actualizarNumeroCarrito();
}

function getNuevoProductoParaMemoria(producto) {
  const nuevoProducto = producto;
  nuevoProducto.cantidad = 1;
  nuevoProducto.descuento = 0;
  return nuevoProducto;
}

const cuentaCarritoElement = document.getElementById("cantidadCarrito")
function actualizarNumeroCarrito() {
  const memoria = JSON.parse(localStorage.getItem("carrito"))
  if (memoria && memoria != 0) {
    const cuenta = memoria.reduce((acum, current) => acum + current.cantidad, 0)
    cuentaCarritoElement.innerText = cuenta;
  } else {
    cuentaCarritoElement.innerText = 0;

  }
}

actualizarNumeroCarrito(); 



// Función para traducir un texto usando una solicitud al servidor
async function traducirTexto(texto) {
  try {
    const response = await fetch('/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: texto }),
    });

    if (!response.ok) {
      throw new Error('Error al traducir el texto');
    }

    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error('Error al traducir:', error);
    return texto; // Devuelve el texto original en caso de error
  }
}

// Función para actualizar elementos HTML con texto traducido
async function actualizarElementosTraducidos() {
  const elementos = document.querySelectorAll('.elemento-traducir');

  elementos.forEach(async elemento => {
    const textoOriginal = elemento.textContent;
    const textoTraducido = await traducirTexto(textoOriginal);
    elemento.textContent = textoTraducido;
  });
}

// Llamada inicial para actualizar los elementos al cargar la página
actualizarElementosTraducidos();
