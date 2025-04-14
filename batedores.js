// batedores.js

// 1) Inicialização do Globo
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

  let loaded = 0, total = 2;
  const check = () => { if (++loaded === total) document.dispatchEvent(new Event('globoCarregado')); };

  const w = canvas.clientWidth, h = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 1000);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Criação de um céu estrelado
  (function(){
    const geom = new THREE.BufferGeometry();
    const pos = [], col = [];
    for(let i = 0; i < 20000; i++){
      const R = 80, th = Math.random()*2*Math.PI, ph = Math.acos(Math.random()*2-1);
      const x = R * Math.sin(ph) * Math.cos(th);
      const y = R * Math.sin(ph) * Math.sin(th);
      const z = R * Math.cos(ph);
      pos.push(x, y, z);
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

  // Esfera central
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/ttok/mapatoktok.png', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  // Objeto em órbita
  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/ttok/mapattok.png', check) })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius, 0, 0);
  scene.add(orbit);

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 3, 5);
  dir.castShadow = true;
  scene.add(dir);

  let angle = 0, speed = -0.5;
  const clock = new THREE.Clock();

  (function animate(){
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    central.rotation.y += 0.003;
    angle += speed * delta;
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
    camera.aspect = ww / hh;
    camera.updateProjectionMatrix();
  });
};

// 2) Inicialização do Flipbook com lógica completa
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Container flipbook não encontrado:', selector);

  // Injeta toda a estrutura do flipbook
  $container.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/ttok/imagens/cap1/capa.webp" alt="Capa" draggable="false">
        <img id="setaBtn" src="mundos/ttok/imagens/seta.webp" alt="Seta" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/capa2.webp" alt="Página 1" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/contracapa.webp" alt="Página 2" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina1.webp" alt="Página 3" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina2.webp" alt="Página 4" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina3.webp" alt="Página 5" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina4.webp" alt="Página 6" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina5.webp" alt="Página 7" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina6.webp" alt="Página 8" draggable="false">
        <img id="cliquemundo" src="mundos/ttok/imagens/cap1/cliquemundo.webp" alt="Clique Mundo" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina7.webp" alt="Página 9" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina8.webp" alt="Página 10" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina9.webp" alt="Página 11" draggable="false">
        <img id="cliqueinversao" src="mundos/ttok/imagens/cap1/cliqueinversao.webp" alt="Clique Inversão" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina10.webp" alt="Página 12" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina11.webp" alt="Página 13" draggable="false">
        <img id="cliqueg" src="mundos/ttok/imagens/cap1/cliqueg.webp" alt="Clique G" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina12.webp" alt="Página 14" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina13.webp" alt="Página 15" draggable="false">
        <img id="cliquerefracao" src="mundos/ttok/imagens/cap1/cliquerefracao.webp" alt="Clique Refracão" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina14.webp" alt="Página 16" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina15.webp" alt="Página 17" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina16.webp" alt="Página 18" draggable="false">
        <img id="cliquemorse" src="mundos/ttok/imagens/cap1/cliquemorse.webp" alt="Clique Morse" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina17.webp" alt="Página 19" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina18.webp" alt="Página 20" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina19.webp" alt="Página 21" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina20.webp" alt="Página 22" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina21.webp" alt="Página 23" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina22.webp" alt="Página 24" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina23.webp" alt="Página 25" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina24.webp" alt="Página 26" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina25.webp" alt="Página 27" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina26.webp" alt="Página 28" draggable="false">
        <img id="cliquecapacitor" src="mundos/ttok/imagens/cap1/cliquecapacitor.webp" alt="Clique Capacitor" draggable="false">
      </div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina27.webp" alt="Página 29" draggable="false">
        <img id="cliquesanguedomundo" src="mundos/ttok/imagens/cap1/cliquesanguedomundo.webp" alt="Clique Sangue do Mundo" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina28.webp" alt="Página 30" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina29.webp" alt="Página 31" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina30.webp" alt="Página 32" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina31.webp" alt="Página 33" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina32.webp" alt="Página 34" draggable="false"></div>
    </div>

  `);
  // ── AQUI: aplica o tamanho das páginas ──
  // Cada página com 50% de largura e 50% de altura do flipbook
  $container.find('#flipbook .page').css({
    width: '80%',
    height: '80%'
  });
  // Garante que as imagens preencham a página
  $container.find('#flipbook .page img').css({
    width: '100%',
    height: '100%',
    'object-fit': 'contain'
  });
  // ────────────────────────────────────────

  
  // Áudio para virar páginas
  const flipAudio = new Audio('sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;

  // Inicializa o flipbook com turn.js
  $("#flipbook").turn({
    autoCenter: false,
    display: 'double'
  });

  // Função de redimensionamento responsivo
  function resizeFlipbook(){
    let newWidth, newHeight;
    if ($(window).width() < 1024) {
      newWidth = $(window).width() * 0.9;
      newHeight = newWidth * (450 / 600);
    } else {
      newWidth = $container.width();
      newHeight = $container.height();
    }
    $("#flipbook").turn("size", newWidth, newHeight);
  }
  resizeFlipbook();
  $(window).on('resize', resizeFlipbook);

  // Previne o arrasto das imagens
  $(".page img").on("dragstart", function(e) {
    e.preventDefault();
  });

  // Toca o áudio ao iniciar o giro da página
  $("#flipbook").on("mousedown touchstart", function(){
    flipAudio.currentTime = 0;
    flipAudio.play().catch(() => {});
  });

  // Ao virar a página, remove a seta da capa se a página for maior que 1
  $("#flipbook").bind("turning", function(e, page){
    if(page > 1){
      $("#setaBtn").fadeOut(300, function(){ $(this).remove(); });
    }
  });

  // Clique na seta para avançar a página
  $container.on("click", "#setaBtn", function(){
    $("#flipbook").turn("next");
  });



  // Mapeia os botões que exibem o overlay com imagens
  const overlayMap = {
    '#cliquemundo': 'mundos/ttok/imagens/cap1/cliquemundo.webp',
    '#cliqueinversao': 'mundos/ttok/imagens/cap1/inversao.webp',
    '#cliqueg': 'mundos/ttok/imagens/cap1/estrelag.webp',
    '#cliquerefracao': 'mundos/ttok/imagens/cap1/refracao.webp',
    '#cliquemorse': 'mundos/ttok/imagens/cap1/morse.webp',
    '#cliquecapacitor': 'mundos/ttok/imagens/cap1/cliquecapacitor.webp',
    '#cliquesanguedomundo': 'mundos/ttok/imagens/cap1/sanguedomundo.webp'
  };
  $.each(overlayMap, function(btn, src){
    $container.on('click', btn, function(e){
      e.stopPropagation();
      $("#overlayImage").attr("src", src);
      $("#overlayContainer").fadeIn(500);
    });
  });
};
