document.getElementById('form-reserva').addEventListener('submit', function(e) {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const sede = document.getElementById('sede').value;

  alert(`¡Gracias ${nombre}! Tu mesa fue reservada para el ${fecha} a las ${hora} en la sede ${sede}.`);

  this.reset();
});