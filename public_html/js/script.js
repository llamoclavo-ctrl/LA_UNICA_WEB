    let carrito = [];

    document.addEventListener('DOMContentLoaded', () => {
      const botonesAgregar = document.querySelectorAll('.btn-agregar');

      botonesAgregar.forEach(boton => {
        boton.addEventListener('click', () => {
          const nombre = boton.dataset.nombre;
          const precio = parseFloat(boton.dataset.precio);
          agregarAlCarrito(nombre, precio);
        });
      });
    });

    function agregarAlCarrito(nombre, precio) {
      const productoExistente = carrito.find(item => item.nombre === nombre);

      if (productoExistente) {
        productoExistente.cantidad += 1;
      } else {
        carrito.push({ nombre: nombre, precio: precio, cantidad: 1 });
      }

      renderizarCarrito();
    }

    function eliminarDelCarrito(nombre) {
      carrito = carrito.filter(item => item.nombre !== nombre);
      renderizarCarrito();
    }
    
    function cambiarCantidad(nombre, nuevaCantidad) {
        const cantidad = parseInt(nuevaCantidad);
        const item = carrito.find(p => p.nombre === nombre);

        if (item) {
          if (cantidad <= 0 || isNaN(cantidad)) {
            eliminarDelCarrito(nombre);
          } else {
            item.cantidad = cantidad;
            renderizarCarrito();
          }
        }
    }


    function renderizarCarrito() {
      const cuerpoCarrito = document.getElementById('cuerpo-carrito');
      const totalPedido = document.getElementById('total-pedido');

      cuerpoCarrito.innerHTML = '';
      let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');
        fila.innerHTML = `
          <td>${item.nombre}</td>
          <td>
            <input 
              type="number" 
              class="input-cantidad" 
              value="${item.cantidad}" 
              min="1" 
              onchange="cambiarCantidad('${item.nombre}', this.value)"
            >
          </td>
          <td>S/ ${subtotal.toFixed(2)}</td>
          <td><button class="btn-eliminar" onclick="eliminarDelCarrito('${item.nombre}')">✕</button></td>
        `;
                
        cuerpoCarrito.appendChild(fila);
    });

      totalPedido.textContent = total.toFixed(2);
    }

    document.getElementById('btn-confirmar').addEventListener('click', () => {
        if (carrito.length === 0) {
          alert('Tu carrito está vacío. Agrega algún producto primero.');
          return;
        }
        if (tipoEntrega === null) {
          alert('Por favor selecciona si deseas Recojo en tienda o Delivery.');
          return;
        }
        if (tipoEntrega === 'delivery') {
          const direccion = document.getElementById('direccion-entrega').value.trim();
          if (direccion === '') {
            alert('Por favor ingresa tu dirección de entrega o usa el botón GPS.');
            return;
          }
        }
        alert('¡Pedido confirmado! Gracias por tu compra en La Única.');
        carrito = [];
        renderizarCarrito();
     }); 


    // ===== ENTREGA: Recojo en tienda vs Delivery =====
    // ===== ENTREGA: Recojo en tienda vs Delivery =====
    let tipoEntrega = null; // null = nada seleccionado aún

    function seleccionarEntrega(tipo) {
      tipoEntrega = tipo;

      document.getElementById('btn-recojo').classList.toggle('activo', tipo === 'recojo');
      document.getElementById('btn-delivery').classList.toggle('activo', tipo === 'delivery');

      document.getElementById('mensaje-recojo').classList.toggle('oculto', tipo !== 'recojo');
      document.getElementById('campo-delivery').classList.toggle('oculto', tipo !== 'delivery');
    }

    function obtenerUbicacion() {
      const estado = document.getElementById('estado-gps');

      if (!navigator.geolocation) {
        estado.textContent = '❌ Tu navegador no soporta geolocalización.';
        return;
      }

      estado.textContent = '📡 Obteniendo tu ubicación...';

      navigator.geolocation.getCurrentPosition(
        async (posicion) => {
          const { latitude, longitude } = posicion.coords;

          try {
            const respuesta = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const datos = await respuesta.json();
            document.getElementById('direccion-entrega').value = datos.display_name || `${latitude}, ${longitude}`;
            estado.textContent = '✅ Ubicación detectada correctamente.';
          } catch (error) {
            document.getElementById('direccion-entrega').value = `Lat: ${latitude}, Lon: ${longitude}`;
            estado.textContent = '✅ Ubicación detectada (solo coordenadas).';
          }
        },
        (error) => {
          estado.textContent = '❌ No se pudo obtener tu ubicación. Escríbela manualmente.';
        }
      );
    }

