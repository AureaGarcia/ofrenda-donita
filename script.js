const boton = document.querySelector('#boton-vela');
const ofrenda = document.querySelector('#ofrenda');
boton.addEventListener('click', () => {
  const encendida = ofrenda.classList.toggle('encendida');
  boton.setAttribute('aria-pressed', String(encendida));
  boton.textContent = encendida ? 'Apagar la vela' : 'Encender la vela';
});
const escenario = document.querySelector('#escenario');
const huesito = document.querySelector('#huesito');
const dibujo = document.querySelector('#donita-dibujo');
const mensajeBaile = document.querySelector('#mensaje-baile');
const mensajeJuego = document.querySelector('#mensaje-juego');
const siesta = document.querySelector('#siesta');
let bailando = false, dormida = false, arrastre = null, ignorarClick = false;
function dormir(estado) {
  dormida = estado;
  ofrenda.classList.toggle('durmiendo', estado);
  siesta.setAttribute('aria-pressed', String(estado));
  siesta.textContent = estado ? 'Despertar a Donita' : 'Hora de la siesta';
}
function bailar(estado) {
  if (estado) dormir(false);
  bailando = estado;
  escenario.classList.toggle('bailando', estado);
  huesito.setAttribute('aria-pressed', String(estado));
  mensajeBaile.textContent = estado ? '¡Ese huesito merece el baile de Donita! Patitas juntas y un saltito más. ♡' : 'Acércale el huesito y descubre su baile.';
}
huesito.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  arrastre = { id: event.pointerId, x: event.clientX, y: event.clientY, movido: false };
  ignorarClick = false;
  huesito.setPointerCapture(event.pointerId);
  huesito.classList.add('arrastrando');
});
huesito.addEventListener('pointermove', event => {
  if (!arrastre || event.pointerId !== arrastre.id) return;
  if (Math.hypot(event.clientX-arrastre.x,event.clientY-arrastre.y)<5 && !arrastre.movido) return;
  arrastre.movido = true;
  const area = escenario.getBoundingClientRect(), margen = huesito.offsetWidth/2+4;
  const x = Math.max(margen,Math.min(area.width-margen,event.clientX-area.left));
  const y = Math.max(margen,Math.min(area.height-margen,event.clientY-area.top));
  huesito.style.left = `${x/area.width*100}%`;
  huesito.style.top = `${y/area.height*100}%`;
  const perro = dibujo.getBoundingClientRect();
  bailar(Math.hypot(area.left+x-perro.left-perro.width*.5,area.top+y-perro.top-perro.height*.43)<perro.width*.47);
});
function terminarArrastre(event) {
  if (!arrastre || event.pointerId!==arrastre.id) return;
  ignorarClick = arrastre.movido;
  arrastre = null;
  huesito.classList.remove('arrastrando');
}
huesito.addEventListener('pointerup',terminarArrastre);
huesito.addEventListener('pointercancel',event=>{ terminarArrastre(event); bailar(false); });
huesito.addEventListener('lostpointercapture',terminarArrastre);
huesito.addEventListener('click',event=>{
  if(ignorarClick && event.detail!==0){ ignorarClick=false; return; }
  ignorarClick=false;
  bailar(!bailando);
  huesito.style.left=bailando?'55%':'79%';
  huesito.style.top=bailando?'35%':'47%';
});
document.querySelector('#premio').addEventListener('click',()=>{
  const plato=document.querySelector('#plato');
  plato.textContent='🍖';
  plato.classList.remove('premio-servido'); void plato.offsetWidth; plato.classList.add('premio-servido');
  mensajeJuego.textContent='¡Platito servido! 🐾 Para Donita, con todo el cariño y cero regateos.';
  bailar(true);
});
siesta.addEventListener('click',()=>{
  const estado=!dormida;
  bailar(false); dormir(estado);
  mensajeJuego.textContent=estado?'Shhh… Donita está recargando energía para su siguiente travesura. ✨':'¡Buenos días, Donita! ¿Primero el desayuno o la travesura?';
  mensajeBaile.textContent=estado?'Soñando con croquetitas… Un huesito puede despertarla.':'Acércale el huesito y descubre su baile.';
});
const frases=['¡Ñam! Inspección de dedos completada. 🦷','Donita dice: la comida sí se comparte; la manita, bajo tu propio riesgo.','Chiquita, rizada y con carácter. ¡Esa era Donita!'];
let mordidas=0;
document.querySelector('#mordida').addEventListener('click',()=>{
  const icono=document.querySelector('#mordida-icono');
  icono.classList.remove('mordidita'); void icono.offsetWidth; icono.classList.add('mordidita');
  mensajeJuego.textContent=frases[mordidas++%frases.length];
});
