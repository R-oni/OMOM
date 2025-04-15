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
      col.push(
        r < 0.9 ? 1 : 1,
        r < 0.9 ? 1 : r < 0.95 ? 0.6 : 0.6,
        r < 0.9 ? 1 : r < 0.95 ? 0.6 : 1
      );
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

// 2) Inicialização do Flipbook com lazy‑load, seta mobile e botões de página
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Container flipbook não encontrado:', selector);

  // Injeta toda a estrutura do flipbook
  $container.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/veleywei/imagens/cap1/capa.webp" alt="Capa" draggable="false">
        <img id="setaBtn" src="mundos/veleywei/imagens/seta.webp" alt="Seta" draggable="false">
      </div>
      <!-- repita para cada página -->
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina1.webp" alt="Página 1" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina2.webp" alt="Página 2" draggable="false"></div>
      <!-- ... até a última página -->
    </div>
  `);

  // Ajuste de tamanho das páginas
  $container.find('#flipbook .page').css({
    width: '80%',
    height: '80%'
  });
  $container.find('#flipbook .page img').css({
    width: '100%',
    height: '100%',
    'object-fit': 'contain'
  });

  // Lazy‑load setup
  $container.find('#flipbook .page').each(function(idx){
    const p = idx + 1;
    $(this).attr('data-page', p);
    $(this).find('img').each(function(){
      const realSrc = $(this).attr('src');
      $(this).attr('data-src', realSrc).removeAttr('src');
    });
  });
  function preloadPages(startPage, count) {
    for (let i = startPage; i < startPage + count; i++) {
      const pageDiv = $container.find(`#flipbook .page[data-page="${i}"]`);
      pageDiv.find('img[data-src]').each(function(){
        const $img = $(this);
        if (!$img.attr('src')) {
          $img.attr('src', $img.data('src'));
        }
      });
    }
  }
  preloadPages(1, 3);

  // Áudio de virar página
  const flipAudio = new Audio('sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;

  // Inicializa o turn.js
  $("#flipbook").turn({
    autoCenter: false,
    display: 'double',
    when: {
      turned: function(e, page) {
        preloadPages(page + 1, 3);
      }
    }
  });

  // Responsivo
  function resizeFlipbook(){
    let newW, newH;
    if ($(window).width() < 1024) {
      newW = $(window).width() * 0.9;
      newH = newW * (450/600);
    } else {
      newW = $container.width();
      newH = $container.height();
    }
    $("#flipbook").turn("size", newW, newH);
  }
  resizeFlipbook();
  $(window).on('resize', resizeFlipbook);

  // Evita drag
  $(".page img").on("dragstart", e => e.preventDefault());

  // Toca áudio no mousedown
  $("#flipbook").on("mousedown touchstart", () => {
    flipAudio.currentTime = 0;
    flipAudio.play().catch(()=>{});
  });

  // Setinha mobile: some após virar a primeira página
  $("#flipbook").bind("turning", (e, page) => {
    if (page > 1) {
      $("#setaBtn").fadeOut(300, () => $("#setaBtn").remove());
    }
  });
  // Clique na setinha avança página
  $container.on("click", "#setaBtn", () => $("#flipbook").turn("next"));

  // Botões de página (apenas visuais; implemente comportamento aqui)
  const pageButtons = [
    "cliquemundo",
    "cliqueinversao",
    "cliqueg",
    "cliquerefracao",
    "cliquemorse",
    "cliquecapacitor",
    "cliquesanguedomundo"
  ];
  pageButtons.forEach(id => {
    $container.on("click", `#${id}`, e => {
      e.stopPropagation();
      // Aqui você pode chamar sua função, ex:
      // console.log("Botão", id, "clicado");
    });
  });
};
