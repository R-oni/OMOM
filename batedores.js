window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/ttok/imagens/cap1/pagina1.webp',     // slide 1
    'mundos/ttok/imagens/cap1/pagina2.webp',     // slide 1
    'mundos/ttok/imagens/cap1/pagina3.webp', // slide 2
    'mundos/ttok/imagens/cap1/pagina4.webp', // slide 3
    'mundos/ttok/imagens/cap1/pagina5.webp', // slide 5
    'mundos/ttok/imagens/cap1/pagina6.webp', // slide 5
    'mundos/ttok/imagens/cap1/pagina7.webp', // slide 5
    'GLOBO',                                  // slide 4: globo
   
  
  ];
  slides.forEach(src => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    if (src === 'GLOBO') {
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else {
      slideEl.innerHTML = `<img src="${src}" style="max-width:100%;max-height:100%" draggable="false">`;
    }
    wrap.appendChild(slideEl);
  });
};

// Three.js globe init (completamente sem sombras e reflexos)
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;
  
  // Cena com fundo branco
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFFFFF');
  
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;
  
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  
  // IMPORTANTE: Desabilitar completamente o sistema de sombras
  renderer.shadowMap.enabled = false;
  
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  
  const loader = new THREE.TextureLoader();
  
  // Globo com material básico (sem reflexos nem sombras)
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/ttok/mapatoktok.png'),
      // Configurações para eliminar qualquer reflexo
      transparent: false,
      opacity: 1,
      // MeshBasicMaterial não reage à luz, eliminando reflexos
    })
  );
  
  scene.add(earth);
  
  // Iluminação mínima (apenas para caso seja necessária)
  // Como usamos MeshBasicMaterial, a luz não afeta o objeto
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  
  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    controls.update();
    renderer.render(scene, camera);
  })();
  
  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
};
