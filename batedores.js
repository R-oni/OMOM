// batedores.js

// 1) Globo
window.initGlobe = selector => {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  let loaded = 0, total = 2;
  const check = () => { if (++loaded === total) document.dispatchEvent(new Event('globoCarregado')); };

  const w = canvas.clientWidth, h = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 1000);
  camera.position.set(0,0,4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
  renderer.setSize(w,h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Céu estrelado
  (() => {
    const geom = new THREE.BufferGeometry();
    const pos = [], col = [];
    for(let i = 0; i < 20000; i++) {
      const R = 80, th = Math.random() * 2 * Math.PI, ph = Math.acos(Math.random() * 2 - 1);
      const x = R * Math.sin(ph) * Math.cos(th);
      const y = R * Math.sin(ph) * Math.sin(th);
      const z = R * Math.cos(ph);
      pos.push(x,y,z);
      const r = Math.random();
      col.push(r < 0.9 ? 1 : 1, r < 0.9 ? 1 : r < 0.95 ? 0.6 : 0.6, r < 0.9 ? 1 : r < 0.95 ? 0.6 : 1);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.25, vertexColors: true });
    scene.add(new THREE.Points(geom, mat));
  })();

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const loader = new THREE.TextureLoader();

  // Planeta central
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/ttok/mapatoktok.png', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  // Satélite orbitando
  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/ttok/mapattok.png', check) })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius, 0, 0);
  scene.add(orbit);

  // Iluminação
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 3, 5);
  dir.castShadow = true;
  scene.add(dir);

  // Animação
  let angle = 0, speed = -0.5;
  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const d = clock.getDelta();
    central.rotation.y += 0.003;
    angle += speed * d;
    orbit.position.set(
      orbitRadius * Math.cos(angle),
      0,
      orbitRadius * Math.sin(angle)
    );
    controls.update();
    renderer.render(scene, camera);
  })();

  // Responsividade
  window.addEventListener('resize', () => {
    const ww = canvas.clientWidth, hh = canvas.clientHeight;
    renderer.setSize(ww, hh);
    camera.aspect = ww/hh;
    camera.updateProjectionMatrix();
  });
};

// 2) Flipbook
window.initFlipbook = selector => {
  const $c = $(selector);
  if (!$c.length) return;

  // Estrutura do flipbook
  $c.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/ttok/imagens/cap1/capa.webp" draggable="false">
        <img id="setaBtn" src="mundos/ttok/imagens/seta.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/capa2.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/contracapa.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina1.webp" draggable="false"></div>
      <!-- Páginas subsequentes com elementos interativos -->
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina6.webp" draggable="false">
        <img id="cliquemundo" src="mundos/ttok/imagens/cap1/cliquemundo.webp" draggable="false">
      </div>
      <!-- ... outras páginas ... -->
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina26.webp" draggable="false">
        <img id="cliquecapacitor" src="mundos/ttok/imagens/cap1/cliquecapacitor.webp" draggable="false">
      </div>
    </div>
    <div id="overlayContainer">
      <img id="overlayImage" src="" draggable="false">
      <button id="btnSair">Voltar</button>
    </div>
  `);

  // Áudio de virada
  const flipAudio = new Audio('mundos/ttok/sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;

  // Inicialização do Turn.js
  $('#flipbook').turn({
    autoCenter: false,
    display: 'double',
    acceleration: true,
    elevation: 50,
    gradients: true,
    duration: 1000
  });

  // Ajuste de tamanho
  function resizeFB() {
    const W = $c.width(), H = $c.height();
    $('#flipbook').turn('size', W, H);
  }
  $(window).on('resize', resizeFB);
  resizeFB();

  // Eventos de interação
  $('#flipbook')
    .on('mousedown touchstart', () => {
      flipAudio.currentTime = 0;
      flipAudio.play().catch(() => {});
    })
    .bind('turning', (e, page) => {
      if(page > 1) $('#setaBtn').fadeOut(300);
    });

  // Overlay de imagens
  const overlayMap = {
    '#cliquemundo': 'mundos/ttok/imagens/cap1/cliquemundo.webp',
    '#cliqueinversao': 'mundos/ttok/imagens/cap1/inversao.webp',
    '#cliqueg': 'mundos/ttok/imagens/cap1/estrelag.webp',
    '#cliquerefracao': 'mundos/ttok/imagens/cap1/refracao.webp',
    '#cliquemorse': 'mundos/ttok/imagens/cap1/morse.webp',
    '#cliquecapacitor': 'mundos/ttok/imagens/cap1/capacitor.webp',
    '#cliquesanguedomundo': 'mundos/ttok/imagens/cap1/sanguedomundo.png'
  };

  Object.entries(overlayMap).forEach(([selector, src]) => {
    $c.on('click', selector, (e) => {
      e.stopPropagation();
      $('#overlayImage').attr('src', src);
      $('#overlayContainer').fadeIn(300);
    });
  });

  $('#btnSair').on('click', (e) => {
    e.preventDefault();
    $('#overlayContainer').fadeOut(300);
  });
};
