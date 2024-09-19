// Define la clase Producto
class Producto {
  constructor(nombre, precios, imagen) {
    this.nombre = nombre;
    this.precios = precios; // Objeto que contiene los precios 
    this.imagen = imagen;
  }
}

// Array de productos 
const productos = [
  new Producto('Allure Home Sport Chanel', { '3ml': 10, '5ml': 15, '10ml': 22 }, 'assets/images/allure home sport.jpg'),
  new Producto('Acqua di Gio', { '3ml': 9, '5ml': 13, '10ml': 20 }, 'assets/images/Acqua di Gio Profumo.jpg'),
  new Producto('Bad Boy Carolina Herrera', { '3ml': 11, '5ml': 16, '10ml': 23 }, 'assets/images/bad boy.jpg'),
  new Producto('Ombré Leather Tom Ford ', { '3ml': 8, '5ml': 16, '10ml': 22 }, 'assets/images/tom ford ombré leather.jpg'),
  new Producto('Eros Versace', { '3ml': 10, '5ml': 14, '10ml': 21 }, 'assets/images/Eros Versace.jpg'),
  new Producto('Starwalker Mont Blanc ', { '3ml': 11, '5ml': 16, '10ml': 23 }, 'assets/images/mont blanc starwalker.jpg'),
  new Producto('Oud wood Tom Ford', { '3ml': 14, '5ml': 22, '10ml': 28 }, 'assets/images/Oud Wood Tom Ford.jpg'),
  new Producto('Cedrat Boise Mancera', { '3ml': 15, '5ml': 23, '10ml': 30 }, 'assets/images/Mancera Cedrat Boise.jpg')
];

// Carrito de compras
let carrito = [];

// Elementos del DOM
const listaCarrito = document.getElementById('lista-carrito');
const totalCarrito = document.getElementById('total-carrito');
const listaProductos = document.getElementById('lista-productos');
const mensajeCompra = document.getElementById('mensaje-compra');
const mensajeError = document.getElementById('mensaje-error');

// Función guardar el carrito en localStorage
function guardarCarritoEnStorage() {
  localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función cargar el carrito desde localStorage
function cargarCarritoDeStorage() {
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    carrito = JSON.parse(carritoGuardado);
    actualizarCarrito();
  }
}

// Función Mostrar los productos en la página
function mostrarProductos() {
  productos.forEach((producto, indice) => {
    const productoHTML = document.createElement('li');
    productoHTML.classList.add('producto');
    productoHTML.innerHTML = `
      <img src="${producto.imagen}" alt="${producto.nombre}" width="100" class="imagen-producto"> 
      <h3>${producto.nombre}</h3>
      <select id="tamaño-${indice}">
        <option value="" disabled selected>Seleccionar tamaño</option>
        ${Object.keys(producto.precios).map(tamaño => `<option value="${tamaño}">${tamaño} - $${producto.precios[tamaño]}</option>`).join('')}
      </select>
      <button onclick="agregarAlCarrito(${indice})">Agregar al carrito</button>
    `;
    listaProductos.appendChild(productoHTML);
  });
}

// Agrega producto al carrito
function agregarAlCarrito(indice) {
  const tamañoSeleccionado = document.getElementById(`tamaño-${indice}`).value;
  if (tamañoSeleccionado) {
    const producto = productos[indice];
    carrito.push({ nombre: producto.nombre, tamaño: tamañoSeleccionado, precio: producto.precios[tamañoSeleccionado] });
    guardarCarritoEnStorage();
    actualizarCarrito();
    mensajeError.style.display = 'none'; // Oculta mensaje de error si hay una compra exitosa
    mensajeCompra.innerText = ''; // Limpia el mensaje de compra
    //Se restablece el selector a "Seleccionar tamaño"
    document.getElementById(`tamaño-${indice}`).selectedIndex = 0;
  } else {
    mensajeError.innerText = 'Selecciona un tamaño antes de agregar al carrito.';
    mensajeError.style.display = 'block'; // Mensaje de error si no hay una selección
  }
}

// Actualiza el contenido del carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = '';
  let total = 0;
  carrito.forEach((item, index) => {
    const itemHTML = document.createElement('li');
    itemHTML.innerHTML = `
      <span>${item.nombre} - ${item.tamaño} - $${item.precio}</span>
      <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
    `;
    listaCarrito.appendChild(itemHTML);
    total += item.precio;
  });
  totalCarrito.innerText = `Total: $${total.toFixed(2)}`;
}

// Elimina producto del carrito
function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  guardarCarritoEnStorage();
  actualizarCarrito();
}

// Efectúala compra
function realizarCompra() {
  if (carrito.length > 0) {
    const total = carrito.reduce((acc, item) => acc + item.precio, 0).toFixed(2);
    const fecha = new Date().toLocaleDateString();
    mensajeCompra.innerText = `Compra realizada con éxito por un total de $${total} el ${fecha}`;
    carrito = []; // Vacia carrito después de la compra
    guardarCarritoEnStorage();
    actualizarCarrito();
  } else {
    mensajeCompra.innerText = 'Tu carrito está vacío.';
  }
}

// Inicializa la página
function inicializar() {
  mostrarProductos();
  cargarCarritoDeStorage();
  document.getElementById('realizar-compra').addEventListener('click', realizarCompra);
}

// Ejecuta inicialización directamente
inicializar();
