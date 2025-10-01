const listaP=document.getElementById("productos-container")
   
   
   
    const enlace="https://fakestoreapi.com/products"
   function crearTarjetas(enlace){
    fetch(`${enlace}`)
    .then((response)=>response.json())
    .then((enlace)=>{
    enlace.forEach(producto => {
      const nuevoProducto=document.getElementById("tarjeta-producto");
    
    listaP.appendChild(nuevoProducto)
    
    console.log(nuevoProducto)
    nuevoProducto.getElementsByTagName("button")[0].addEventListener("click",()=>agregarAlCarrito(producto))
    
  
    })
  
    })
   
  
  }

  crearTarjetas(enlace);

  document.addEventListener('DOMContentLoaded', () => {
    const tarjetasProducto = document.querySelectorAll('.tarjeta-producto');
  
    tarjetasProducto.forEach(tarjeta => {
      const descripcionElement = tarjeta.querySelector('.a');
      const descripcionCompleta = descripcionElement.getAttribute('data-full-description');
      const descripcionCorta = descripcionElement.innerText;
  
      tarjeta.addEventListener('mouseover', () => {
        descripcionElement.innerText = descripcionCompleta;
      });
  
      tarjeta.addEventListener('mouseout', () => {
        descripcionElement.innerText = descripcionCorta;
      });
    });
  });
  
  
  
