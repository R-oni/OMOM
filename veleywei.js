window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/veleywei/imagens/cap1/pagina1.webp',     // slide 1
    'mundos/veleywei/imagens/cap1/pagina2.webp',     // slide 1
    'mundos/veleywei/imagens/cap1/pagina3.webp', // slide 2
    'mundos/veleywei/imagens/cap1/pagina4.webp', // slide 3
    'mundos/veleywei/imagens/cap1/pagina5.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina6.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina7.webp', // slide 5
    'GLOBO',                                  // slide 4: globo
    'mundos/veleywei/imagens/cap1/pagina8.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina9.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina10.webp',     // slide 1
    'mundos/veleywei/imagens/cap1/pagina11.webp',     // slide 1
    'mundos/veleywei/imagens/cap1/pagina12.webp', // slide 2
    'mundos/veleywei/imagens/cap1/pagina13.webp', // slide 3
    'mundos/veleywei/imagens/cap1/pagina14.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina15.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina16.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina17.webp',     // slide 1
    'mundos/veleywei/imagens/cap1/pagina18.webp',     // slide 1
    'mundos/veleywei/imagens/cap1/pagina19.webp', // slide 2
    'mundos/veleywei/imagens/cap1/pagina20.webp', // slide 3
    'mundos/veleywei/imagens/cap1/pagina21.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina22.webp', // slide 5
    'mundos/veleywei/imagens/cap1/pagina23.webp', // slide 5
   
  

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

// Three.js globe init (sem sombra, fundo bege claro)
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;
  
  // Cena com fundo bege claro
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFFFFF'); // cor de papel

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

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const loader = new THREE.TextureLoader();
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshStandardMaterial({
      map: loader.load('mundos/ttok/mapatoktok.png')
    })
  );
  // Sem sombras: não habilitamos shadowMap nem caster/receiver
  scene.add(earth);

  // Iluminação sem gerar sombras
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(5, 5, 5);
  scene.add(dir);

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
