// batedores.js

// 1) Globo
window.initGlobe = selector => {
  const canvas = document.querySelector(selector);
  if(!canvas) return;
  const w=canvas.clientWidth, h=canvas.clientHeight;
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(60,w/h,0.1,1000);
  camera.position.set(0,0,4);
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(w,h);

  const controls=new THREE.OrbitControls(camera,canvas);
  controls.enableDamping=true; controls.dampingFactor=0.05;

  const loader=new THREE.TextureLoader();
  loader.load('mundos/ttok/mapatoktok.png',tex=>{
    const sph=new THREE.Mesh(new THREE.SphereGeometry(1,64,64),new THREE.MeshStandardMaterial({map:tex}));
    scene.add(sph);
  });
  loader.load('mundos/ttok/mapattok.png',tex=>{
    const sph=new THREE.Mesh(new THREE.SphereGeometry(0.1,64,64),new THREE.MeshStandardMaterial({map:tex}));
    sph.position.set(3,0,0);
    scene.add(sph);
  });

  scene.add(new THREE.AmbientLight(0xffffff,0.2));
  const dir=new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(3,3,5);
  scene.add(dir);

  (function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene,camera);
  })();

  window.addEventListener('resize',()=>{
    const W=canvas.clientWidth, H=canvas.clientHeight;
    renderer.setSize(W,H);
    camera.aspect=W/H; camera.updateProjectionMatrix();
  });
};

// 2) Flipbook
window.initFlipbook = selector => {
  const $c=$(selector);
  if(!$c.length) return;

  // monta páginas
  let html='<div id="flipbook">';
  for(let i=1;i<=32;i++){
    if(i===1){
      html+=`<div class="page hard">
        <img src="mundos/ttok/imagens/cap1/capa.webp" draggable="false">
        <img id="setaBtn" src="mundos/ttok/imagens/seta.webp" draggable="false">
      </div>`;
    } else {
      html+=`<div class="page"><img src="mundos/ttok/imagens/cap1/pagina${i}.webp" draggable="false"></div>`;
    }
  }
  html+='</div>';
  html+=`<div id="overlayContainer">
    <img id="overlayImage" src="" draggable="false">
    <button id="btnSair">Voltar</button>
  </div>`;

  $c.html(html);

  // áudio
  const flipAudio=new Audio('mundos/ttok/sompagina.mp3');
  flipAudio.preload='auto'; flipAudio.volume=0.9;

  // Turn.js
  $('#flipbook').turn({autoCenter:false,display:'double'});

  function resizeFB(){
    const W=$c.width(), H=$c.height();
    $('#flipbook').turn('size',W,H);
  }
  $(window).on('resize',resizeFB);
  resizeFB();

  // som ao virar
  $('#flipbook').on('mousedown touchstart',()=>{
    flipAudio.currentTime=0; flipAudio.play().catch(()=>{});
  });

  // seta some
  $('#flipbook').bind('turning',(e,p)=>{ if(p>1) $('#setaBtn').fadeOut(300); });
  $c.on('click','#setaBtn',()=>$('#flipbook').turn('next'));

  // overlay de imagens
  const map={
    '#cliquemundo':'mundos/ttok/imagens/cap1/cliquemundo.webp',
    '#cliqueinversao':'mundos/ttok/imagens/cap1/cliqueinversao.webp',
    '#cliqueg':'mundos/ttok/imagens/cap1/cliqueg.webp',
    '#cliquerefracao':'mundos/ttok/imagens/cap1/cliquerefracao.webp',
    '#cliquemorse':'mundos/ttok/imagens/cap1/cliquemorse.webp',
    '#cliquecapacitor':'mundos/ttok/imagens/cap1/cliquecapacitor.webp',
    '#cliquesanguedomundo':'mundos/ttok/imagens/cap1/cliquesanguedomundo.webp'
  };
  Object.entries(map).forEach(([btn,src])=>{
    $c.on('click',btn,e=>{
      e.stopPropagation();
      $('#overlayImage').attr('src',src);
      $('#overlayContainer').fadeIn(300);
    });
  });
  $c.on('click','#btnSair',e=>{ e.preventDefault(); $('#overlayContainer').fadeOut(300); });
};
