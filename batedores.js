window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/ttok/imagens/cap1/capa.webp',     // slide 1
    'mundos/ttok/imagens/cap1/pagina1.webp', // slide 2
    'mundos/ttok/imagens/cap1/pagina2.webp', // slide 3
    'GLOBO',                                  // slide 4: globo
    'mundos/ttok/imagens/cap1/pagina3.webp', // slide 5
    'mundos/ttok/imagens/cap1/pagina4.webp', // slide 6
    'mundos/ttok/imagens/cap1/pagina5.webp'  // slide 7
  ];

  slides.forEach(src=>{
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    if(src==='GLOBO'){
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else {
      slideEl.innerHTML = `<img src="${src}" style="max-width:100%;max-height:100%" draggable="false">`;
    }
    wrap.appendChild(slideEl);
  });
};

// Three.js globe init (simplificado)
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if(!canvas)return;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60,canvas.clientWidth/canvas.clientHeight,0.1,1000);
  camera.position.z=4;
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(canvas.clientWidth,canvas.clientHeight);
  const controls = new THREE.OrbitControls(camera,canvas);
  controls.enableDamping=true;

  const loader = new THREE.TextureLoader();
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1,32,32),
    new THREE.MeshStandardMaterial({map:loader.load('mundos/ttok/mapatoktok.png')})
  );
  scene.add(earth);
  scene.add(new THREE.AmbientLight(0xffffff,0.5));
  const dir = new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(5,5,5);
  scene.add(dir);

  (function animate(){
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    controls.update();
    renderer.render(scene,camera);
  })();
};
