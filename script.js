const root=document.documentElement;
const picker=document.getElementById('colorPicker');
const swatches=document.getElementById('swatches');
const countButtons=document.querySelectorAll('#countButtons button');
const speed=document.getElementById('speed');
const speedValue=document.getElementById('speedValue');
const orbs=[...document.querySelectorAll('.orb')];

let colors=['#ffc6b2','#ffb49e','#ffd7c8','#f6b7ad','#ffe6da','#ffccb9'];
let activeColor=0;
let visibleCount=6;

function renderSwatches(){
 swatches.innerHTML='';
 colors.forEach((color,index)=>{
   const b=document.createElement('button');
   b.className='swatch'+(index===activeColor?' selected':'');
   b.style.background=color;
   b.title=`Edit ${color}`;
   b.addEventListener('click',()=>{
     activeColor=index;
     picker.value=normalizeColor(color);
     renderSwatches();
     picker.click();
   });
   swatches.appendChild(b);
 });
 applyColors();
}
function normalizeColor(hex){
 return /^#[0-9a-f]{6}$/i.test(hex)?hex:'#ffffff';
}
function applyColors(){
 for(let i=0;i<8;i++){
   const color=colors[i]||colors[colors.length-1]||'#ffffff';
   root.style.setProperty(`--c${i+1}`,color);
 }
 orbs.forEach((orb,i)=>orb.classList.toggle('hidden',i>=visibleCount));
}
function addColor(){
 const newColor='#'+Math.floor(Math.random()*16777215).toString(16).padStart(6,'0');
 colors.push(newColor);
 activeColor=colors.length-1;
 if(colors.length>8) colors=colors.slice(-8);
 activeColor=Math.min(activeColor,colors.length-1);
 renderSwatches();
 picker.value=normalizeColor(colors[activeColor]);
 picker.click();
}
document.getElementById('addColor').addEventListener('click',addColor);

picker.addEventListener('input',e=>{
 colors[activeColor]=e.target.value;
 renderSwatches();
});

countButtons.forEach(btn=>{
 btn.addEventListener('click',()=>{
   visibleCount=Number(btn.dataset.count);
   countButtons.forEach(x=>x.classList.toggle('active',x===btn));
   applyColors();
 });
});
countButtons[5].classList.add('active');

function setSpeed(v){
 v=Math.max(.15,Math.min(2,Number(v)));
 speed.value=v;
 speedValue.textContent=v.toFixed(2);
 root.style.setProperty('--speed',v);
}
speed.addEventListener('input',e=>setSpeed(e.target.value));

document.querySelectorAll('.switch').forEach(btn=>{
 btn.addEventListener('click',()=>{
   const on=btn.classList.toggle('active');
   btn.setAttribute('aria-pressed',on);
   const feature=btn.dataset.feature;
   if(feature==='noise')document.querySelector('.noise').classList.toggle('off',!on);
   if(feature==='vignette')document.querySelector('.vignette').classList.toggle('off',!on);
   if(feature==='motion')document.body.classList.toggle('paused',!on);
 });
});

let mx=0,my=0,cx=0,cy=0;
window.addEventListener('pointermove',e=>{
 mx=(e.clientX/innerWidth-.5)*2;
 my=(e.clientY/innerHeight-.5)*2;
});
function pointer(){
 cx+=(mx-cx)*.012;cy+=(my-cy)*.012;
 orbs.forEach((orb,i)=>{
   const f=(i+1)*.22;
   orb.style.marginLeft=`${cx*f}vw`;
   orb.style.marginTop=`${cy*f}vh`;
 });
 requestAnimationFrame(pointer);
}
renderSwatches();
setSpeed(.7);
pointer();
