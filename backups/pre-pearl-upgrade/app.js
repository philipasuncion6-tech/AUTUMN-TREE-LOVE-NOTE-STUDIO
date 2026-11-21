const $ = id => document.getElementById(id);

const templates = {
 love:"May your day bloom with happiness, warmth, and beautiful moments. Sending you love, wrapped in tulips. ❤️",
 birthday:"May your birthday bloom with joy, laughter, and countless blessings. Wishing you a beautiful year ahead! 🌷",
 anniversary:"Every moment with you is a beautiful flower in the garden of my life. Happy anniversary! ❤️",
 thankyou:"Thank you for bringing kindness and beauty into my world. May life return that goodness to you many times over. 🌷",
 missyou:"Even when we are apart, you are always in my thoughts. Sending you warm hugs and a garden of tulips. 💗",
 friendship:"A true friend makes life bloom brighter. Thank you for being a beautiful part of my journey. 🌷"
};

function updatePreview(){
 const name=$("recipient").value.trim() || "Someone Special";
 const message=$("message").value.trim() || templates[$("occasion").value];
 $("previewTo").textContent="To "+name;
 $("previewMessage").textContent=message;
 $("count").textContent=$("message").value.length;
}
$("occasion").addEventListener("change",()=>{
 if(!$("message").value.trim()) updatePreview();
});
$("message").addEventListener("input",updatePreview);
$("recipient").addEventListener("input",updatePreview);
$("previewBtn").addEventListener("click",updatePreview);

function completeMessage(){
 const name=$("recipient").value.trim() || "Someone Special";
 const message=$("message").value.trim() || templates[$("occasion").value];
 return `To ${name}\n\n${message}\n\nWith love, always 💗`;
}
$("copyBtn").addEventListener("click",async()=>{
 try{
  await navigator.clipboard.writeText(completeMessage());
  $("copyBtn").textContent="✓ Copied!";
 }catch(e){
  const box=document.createElement("textarea");
  box.value=completeMessage();document.body.appendChild(box);
  box.select();document.execCommand("copy");box.remove();
  $("copyBtn").textContent="✓ Copied!";
 }
 setTimeout(()=>$("copyBtn").textContent="📋 Copy Message",1800);
});
$("downloadBtn").addEventListener("click",()=>{
 const blob=new Blob([completeMessage()],{type:"text/plain;charset=utf-8"});
 const url=URL.createObjectURL(blob);
 const a=document.createElement("a");
 a.href=url;a.download="My-Love-Note.txt";a.click();
 URL.revokeObjectURL(url);
});

const canvas=$("autumnLeaves");
const ctx=canvas.getContext("2d");
let leaves=[];
const leafSymbols=["🍁","🍂","🍃"];
function resize(){
 canvas.width=window.innerWidth*devicePixelRatio;
 canvas.height=window.innerHeight*devicePixelRatio;
 ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
function newLeaf(randomY=true){
 return {x:Math.random()*window.innerWidth,y:randomY?Math.random()*window.innerHeight:-25,
 size:14+Math.random()*17,speed:.7+Math.random()*1.5,
 drift:Math.random()*1.2-.6,rotation:Math.random()*6.28,
 spin:(Math.random()-.5)*.025,symbol:leafSymbols[Math.floor(Math.random()*leafSymbols.length)]};
}
function animate(){
 ctx.clearRect(0,0,window.innerWidth,window.innerHeight);
 for(const leaf of leaves){
  leaf.y+=leaf.speed;leaf.x+=Math.sin(leaf.y*.012)*.7+leaf.drift;
  leaf.rotation+=leaf.spin;
  ctx.save();ctx.translate(leaf.x,leaf.y);ctx.rotate(leaf.rotation);
  ctx.font=`${leaf.size}px serif`;ctx.globalAlpha=.8;ctx.fillText(leaf.symbol,0,0);
  ctx.restore();
  if(leaf.y>window.innerHeight+30){Object.assign(leaf,newLeaf(false));}
 }
 requestAnimationFrame(animate);
}
window.addEventListener("resize",resize);
resize();
for(let i=0;i<22;i++) leaves.push(newLeaf());
animate();
updatePreview();
