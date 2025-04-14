// batedores.js

// 1) Globo
window.initGlobe = selector => {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

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

  // sky
  (() => {
    const geom = new THREE.BufferGeometry();
    const pos = [], col = [];
    for(let i=0; i<20000; i++){
      const R = 80,
            th = Math.random()*2*Math.PI,
            ph = Math.acos(Math.random()*2-1),
            x = R*Math.sin(ph)*Math.cos(th),
            y = R*Math.sin(ph)*Math.sin(th),
            z = R*Math.cos(ph),
            r = Math.random();
      pos.push(x,y,z);
      col.push(r<0.9?1:1, r<0.9?1:r<0.95?0.6:0.6, r<0.9?1:r<0.95?0.6:1);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    geom.setAttribute('color',    new THREE.Float32BufferAttribute(col,3));
    scene.add(new THREE.Points(geom, new THREE.PointsMaterial({ size:0.25, vertexColors:true })));
  })();

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const loader = new THREE.TextureLoader();
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/ttok/mapatoktok.png', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mapattok.png', check) })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius,0,0);
  scene.add(orbit);

  scene.add(new THREE.AmbientLight(0xffffff,0.2));
  const dir = new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(3,3,5);
  dir.castShadow = true;
  scene.add(dir);

  let angle = 0, speed = -0.5;
  const clock = new THREE.Clock();
  (function animate(){
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
  if (!$c.length) return console.warn('Container flipbook não encontrado:', selector);

  // 1) Injeta o HTML
  $c.html(`
    <div id="flipbook">
      <div class="page hard"><img src="mundos/ttok/imagens/cap1/capa.webp" draggable="false"><img id="setaBtn" src="mundos/ttok/imagens/seta.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/capa2.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/contracapa.webp" draggable="false"></div>
      <!-- resto das páginas... -->
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina32.webp" draggable="false"></div>
    </div>
    <div id="overlayContainer">
      <img id="overlayImage" src="" draggable="false">
      <button id="btnSair">Voltar</button>
    </div>
  `);

  // 2) Inicializa o Turn.js
  $('#flipbook').turn({
    autoCenter: false,
    display: 'double'
  });

  // 3) Responsividade
  function resizeFB(){
    const w = $c.width(), h = $c.height();
    $('#flipbook').turn('size', w, h);
  }
  $(window).on('resize', resizeFB);
  resizeFB();

  // 4) Áudio
  const flipAudio = new Audio('sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;
  $('#flipbook').on('mousedown touchstart', () => {
    flipAudio.currentTime = 0;
    flipAudio.play().catch(()=>{});
  });

  // 5) Interações
  $('#flipbook').bind('turning', (e, p) => {
    if (p > 1) $('#setaBtn').fadeOut(300);
  });
  $c.on('click', '#setaBtn', () => $('#flipbook').turn('next'));
  $c.on('click', '#btnSair', e => { e.preventDefault(); $('#overlayContainer').fadeOut(300); });

  const map = {
    '#cliquemundo':'imagens/cap1/cliquemundo.webp',
    '#cliqueinversao':'imagens/cap1/inversao.webp',
    '#cliqueg':'imagens/cap1/estrelag.webp',
    '#cliquerefracao':'imagens/cap1/refracao.webp',
    '#cliquemorse':'imagens/cap1/morse.webp',
    '#cliquecapacitor':'imagens/cap1/capacitor.webp',
    '#cliquesanguedomundo':'imagens/cap1/sanguedomundo.png'
  };
  Object.entries(map).forEach(([btn,src])=>{
    $c.on('click', btn, e=>{
      e.stopPropagation();
      $('#overlayImage').attr('src', src);
      $('#overlayContainer').fadeIn(500);
    });
  });
};
