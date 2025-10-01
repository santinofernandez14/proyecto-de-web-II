/*const listaP = document.getElementById("productos-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");
const reiniciarCarritoElement = document.getElementById("reiniciar");
const comprarElement = document.getElementById("comprar");

let descuentos = [];



fetch('descuentos.json')
  .then(response => response.json())
  .then(data => {
    descuentos = data;
    crearTarjetas();
    actualizarTotales();
  })
  .catch(error => {
    console.error('Error al obtener descuentos:', error);
    // Manejar el error apropiadamente
  });
  function crearTarjetas() {
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  
    listaP.innerHTML = "";
  
    if (productos.length > 0) {
      productos.forEach(producto => {
        const descuento = descuentos.find(d => d.id === producto.id);
        const precioConDescuento = descuento ? (producto.price * (1 - descuento.descuento / 100)).toFixed(2) : producto.price;
  
        const nuevoProducto = document.createElement("div");
        nuevoProducto.classList = "tarjeta-producto";
        nuevoProducto.innerHTML = `
          <img src=${producto.image}>
          <h4>${producto.title}</h4>
          <p>Precio original: $${producto.price}</p>
          ${descuento ? `<p>Precio con descuento: $${precioConDescuento}</p>` : ''}
          <div>
            <button id="menos">-</button>
            <span class="cantidad">${producto.cantidad}</span>
            <button id="mas">+</button>
          </div>
        `;
  
        listaP.appendChild(nuevoProducto);
  
        nuevoProducto.querySelector("button#mas").addEventListener("click", (e) => {
          const cuentaElement = e.target.parentElement.querySelector("span.cantidad");
          cuentaElement.innerText = agregarAlCarrito(producto);
          crearTarjetas();
          actualizarTotales();
        });
        nuevoProducto.querySelector("button#menos").addEventListener("click", (e) => {
          restarAlCarrito(producto);
          crearTarjetas();
          actualizarTotales();
        });
      });
    }
  }
  
  function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];
    let unidades = 0;
    let precio = 0;
    productos.forEach(producto => {
      unidades += producto.cantidad;
      const descuento = descuentos.find(d => d.id === producto.id);
      const precioConDescuento = descuento ? producto.price * (1 - descuento.descuento / 100) : producto.price;
      precio += precioConDescuento * producto.cantidad;
    });
    unidadesElement.innerText = unidades;
    precioElement.innerText = precio.toFixed(2);
    revisarCarritoVacio();
  }
  
  
function revisarCarritoVacio() {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoVacioElement.classList.toggle("escondido", productos.length > 0);
  totalesElement.classList.toggle("escondido", productos.length === 0);
}

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existeProducto = carrito.find(item => item.id === producto.id);
  if (existeProducto) {
    existeProducto.cantidad++;
  } else {
    const descuento = descuentos.find(d => d.id === producto.id);
    const nuevoProducto = {
      ...producto,
      cantidad: 1,
      descuento: descuento ? descuento.descuento : 0
    };
    carrito.push(nuevoProducto);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarTotales();
  return existeProducto ? existeProducto.cantidad : 1;
}

document.getElementById("comprar").addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  console.log('Carrito a enviar:', carrito);

  fetch('/comprar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carrito),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      reiniciarCarrito();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error al guardar la compra');
    });
});


function restarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existeProducto = carrito.find(item => item.id === producto.id);
  if (existeProducto && existeProducto.cantidad > 1) {
    existeProducto.cantidad--;
  } else if (existeProducto) {
    carrito = carrito.filter(item => item.id !== producto.id);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarTotales();
}

reiniciarCarritoElement.addEventListener("click", reiniciarCarrito);

function reiniciarCarrito() {
  localStorage.removeItem("carrito");
  actualizarTotales();
  crearTarjetas();
}





crearTarjetas();
actualizarTotales();*/




const listaP = document.getElementById("productos-container");
const cantidadCarrito = document.getElementById("cantidadCarrito");
const unidadesElement = document.getElementById("unidades");
const precioElement = document.getElementById("precio");
const carritoVacioElement = document.getElementById("carrito-vacio");
const totalesElement = document.getElementById("totales");
const reiniciarCarritoElement = document.getElementById("reiniciar");
const comprarElement = document.getElementById("comprar");

let descuentos = [];

async function traducir(texto) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=es&dt=t&q=${encodeURIComponent(texto)}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Error al traducir el texto');
    }
    const data = await response.json();
    return data[0][0][0]; // El primer resultado de la traducción
  } catch (error) {
    console.error('Error al traducir:', error);
    return texto; // Devuelve el texto original en caso de error
  }
}

fetch('descuentos.json')
  .then(response => response.json())
  .then(data => {
    descuentos = data;
    crearTarjetas();
    actualizarTotales();
  })
  .catch(error => {
    console.error('Error al obtener descuentos:', error);
    // Manejar el error apropiadamente
  });
  async function crearTarjetas() {
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  
    listaP.innerHTML = "";
  
    if (productos.length > 0) {
      for (const producto of productos) {
        const descuento = descuentos.find(d => d.id === producto.id);
        const precioConDescuento = descuento ? (producto.price * (1 - descuento.descuento / 100)).toFixed(2) : producto.price;
  
        const tituloTraducido = await traducir(producto.title);

    const nuevoProducto = document.createElement("div");
    nuevoProducto.classList = "tarjeta-producto";
    nuevoProducto.innerHTML = `
      <img src="${producto.image}">
      <h4>${tituloTraducido}</h4>
      <p>Precio original: $${producto.price}</p>
      ${descuento ? `<p>Precio con descuento: $${precioConDescuento}</p>` : ''}
      <div>
        <button id="menos" data-id="${producto.id}">-</button>
        <span class="cantidad">${producto.cantidad}</span>
        <button id="mas" data-id="${producto.id}">+</button>
      </div>
    `;
        listaP.appendChild(nuevoProducto);
  
        nuevoProducto.querySelector("button#mas").addEventListener("click", (e) => {
          const cuentaElement = e.target.parentElement.querySelector("span.cantidad");
          cuentaElement.innerText = agregarAlCarrito(producto);
          crearTarjetas();
          actualizarTotales();
        });
        nuevoProducto.querySelector("button#menos").addEventListener("click", (e) => {
          restarAlCarrito(producto);
          crearTarjetas();
          actualizarTotales();
        });
      };
    }
  }
  
  function actualizarTotales() {
    const productos = JSON.parse(localStorage.getItem("carrito")) || [];
    let unidades = 0;
    let precio = 0;
    productos.forEach(producto => {
      unidades += producto.cantidad;
      const descuento = descuentos.find(d => d.id === producto.id);
      const precioConDescuento = descuento ? producto.price * (1 - descuento.descuento / 100) : producto.price;
      precio += precioConDescuento * producto.cantidad;
    });
    unidadesElement.innerText = unidades;
    precioElement.innerText = precio.toFixed(2);
    revisarCarritoVacio();
  }
  
  
function revisarCarritoVacio() {
  const productos = JSON.parse(localStorage.getItem("carrito")) || [];
  carritoVacioElement.classList.toggle("escondido", productos.length > 0);
  totalesElement.classList.toggle("escondido", productos.length === 0);
}

function agregarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existeProducto = carrito.find(item => item.id === producto.id);
  if (existeProducto) {
    existeProducto.cantidad++;
  } else {
    const descuento = descuentos.find(d => d.id === producto.id);
    const nuevoProducto = {
      ...producto,
      cantidad: 1,
      descuento: descuento ? descuento.descuento : 0
    };
    carrito.push(nuevoProducto);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarTotales();
  return existeProducto ? existeProducto.cantidad : 1;
}

document.getElementById("comprar").addEventListener("click", () => {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  console.log('Carrito a enviar:', carrito);

  fetch('/comprar', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(carrito),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      reiniciarCarrito();
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('Error al guardar la compra');
    });
});


function restarAlCarrito(producto) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  const existeProducto = carrito.find(item => item.id === producto.id);
  if (existeProducto && existeProducto.cantidad > 1) {
    existeProducto.cantidad--;
  } else if (existeProducto) {
    carrito = carrito.filter(item => item.id !== producto.id);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarTotales();
}

reiniciarCarritoElement.addEventListener("click", reiniciarCarrito);

function reiniciarCarrito() {
  localStorage.removeItem("carrito");
  actualizarTotales();
  crearTarjetas();
}






actualizarTotales();




