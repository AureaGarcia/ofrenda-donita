const $=selector=>document.querySelector(selector);
const ofrenda=$('#ofrenda'),vela=$('#boton-vela');
vela.addEventListener('click',()=>{
 const activa=ofrenda.classList.toggle('encendida');
 vela.setAttribute('aria-pressed',String(activa));
 vela.textContent=activa?'Apagar la vela':'Encender la vela';
});
const assets={comer:['plato.png','perro comiendo.png'],dormir:['dormir.png','despertar.png'],morder:['acariciar.png','morder.png'],pedir:['pedir hueso.png','perro con hueso.png']};
const estado={comer:false,dormir:false,morder:false,pedir:false};
const controles={comer:$('#premio'),dormir:$('#siesta'),morder:$('#mano'),pedir:$('#huesito')};
const descripciones={comer:['Platito de comida para Donita','Donita comiendo de su platito'],dormir:['Donita dormida','Donita despierta'],morder:['Donita esperando una caricia','Donita dando una mordidita'],pedir:['Donita pidiendo un huesito','Donita feliz con su hueso']};
function cambiar(accion,activo){
 estado[accion]=activo;
 const imagen=$('#imagen-'+accion);
 imagen.src=assets[accion][Number(activo)];
 imagen.alt=descripciones[accion][Number(activo)];
 controles[accion].setAttribute('aria-pressed',String(activo));
 if(accion==='dormir')controles.dormir.setAttribute('aria-label',activo?'Dejar dormir a Donita':'Despertar a Donita');
 const mensajes={comer:activo?'¡Buen provecho, Donita!':'Su platito está listo para otra vez.',dormir:activo?'¡Donita ya despertó!':'Shhh… Donita está durmiendo.',morder:activo?'¡Ñam! Esa manita necesitaba una inspección.':'Donita espera otra caricia.',pedir:activo?'¡Premio conseguido! Donita ya tiene su huesito.':'Acércale el huesito a Donita.'};
 $(accion==='pedir'?'#mensaje-baile':'#mensaje-juego').textContent=mensajes[accion];
}
controles.comer.addEventListener('click',()=>cambiar('comer',!estado.comer));
controles.dormir.addEventListener('click',()=>cambiar('dormir',!estado.dormir));
function arrastrable(accion,zonaId){
 const objeto=controles[accion],zona=$(zonaId),perro=$('#imagen-'+accion);
 let drag=null,suprimirClick=false;
 const resetPosicion=()=>{objeto.style.left='';objeto.style.top='';};
 objeto.addEventListener('pointerdown',event=>{
  if(event.button!==0||drag)return;
  drag={id:event.pointerId,x:event.clientX,y:event.clientY,movido:false};
  suprimirClick=false;
  objeto.setPointerCapture(event.pointerId);
  objeto.classList.add('arrastrando');
 });
 objeto.addEventListener('pointermove',event=>{
  if(!drag||drag.id!==event.pointerId)return;
  if(!drag.movido&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)<5)return;
  drag.movido=true;
  const z=zona.getBoundingClientRect(),m=objeto.offsetWidth/2;
  const x=Math.max(m,Math.min(z.width-m,event.clientX-z.left));
  const y=Math.max(m,Math.min(z.height-m,event.clientY-z.top));
  objeto.style.left=(x/z.width*100)+'%';objeto.style.top=(y/z.height*100)+'%';
  const p=perro.getBoundingClientRect();
  const cerca=Math.hypot(z.left+x-(p.left+p.width*.5),z.top+y-(p.top+p.height*.5))<Math.min(p.width,p.height)*.38;
  if(cerca!==estado[accion])cambiar(accion,cerca);
 });
 function terminar(event,cancelado=false){
  if(!drag||drag.id!==event.pointerId)return;
  suprimirClick=drag.movido;drag=null;objeto.classList.remove('arrastrando');
  if(cancelado){cambiar(accion,false);resetPosicion();}
 }
 objeto.addEventListener('pointerup',event=>terminar(event));
 objeto.addEventListener('pointercancel',event=>terminar(event,true));
 objeto.addEventListener('lostpointercapture',event=>terminar(event));
 objeto.addEventListener('click',event=>{
  if(suprimirClick&&event.detail!==0){suprimirClick=false;return;}
  suprimirClick=false;cambiar(accion,!estado[accion]);resetPosicion();
 });
}
arrastrable('morder','#zona-morder');arrastrable('pedir','#escenario');
for(const archivos of Object.values(assets))for(const src of archivos){const imagen=new Image();imagen.src=src;}

