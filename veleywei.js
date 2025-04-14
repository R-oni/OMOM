// veleywei.js

// 1) Inicialização do Globo para Veley'wey
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

  // Variáveis para controle de carregamento de texturas
  let loaded = 0, total = 2;
  const check = () => { if (++loaded === total) document.dispatchEvent(new Event('globoCarregado')); };

  const w = canvas.clientWidth, h = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(w, h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Criação de um céu estrelado (baseado na lógica do batedores.js)
  (function(){
    const geom = new THREE.BufferGeometry();
    const pos = [], col = [];
    for (let i = 0; i < 20000; i++) {
      const R = 80, th = Math.random() * 2 * Math.PI, ph = Math.acos(Math.random() * 2 - 1);
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

  // Controles de câmera
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const loader = new THREE.TextureLoader();

  // Esfera central com textura para o globo – atualize o caminho conforme seus assets
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('imagens/veleywei/globe_central.jpg', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  // Objeto em órbita – atualize o caminho da textura conforme necessário
  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('imagens/veleywei/globe_orbit.jpg', check) })
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

// 2) Inicialização do Flipbook para Veley'wey
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Container flipbook não encontrado:', selector);

  // Configura lazy‑load: remove o atributo src inicial e armazena em data-src
  $container.find('.page').each(function(idx) {
    const p = idx + 1;
    $(this).attr('data-page', p);
    $(this).find('img').each(function() {
      const realSrc = $(this).attr('src');
      $(this).attr('data-src', realSrc).removeAttr('src');
    });
  });

  // Função para pré-carregar páginas
  function preloadPages(startPage, count) {
    for (let i = startPage; i < startPage + count; i++) {
      const pageDiv = $container.find(`.page[data-page="${i}"]`);
      pageDiv.find('img[data-src]').each(function() {
        const $img = $(this);
        if (!$img.attr('src')) {
          $img.attr('src', $img.data('src'));
        }
      });
    }
  }
  preloadPages(1, 3);

  // Áudio para virar página
  const flipAudio = new Audio('sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;

  // Inicializa o turn.js (flipbook)
  $container.find("#flipbook").turn({
    autoCenter: false,
    display: 'double',
    when: {
      turned: function(e, page) {
        preloadPages(page + 1, 3);
      }
    }
  });

  // Ajusta o tamanho do flipbook conforme a tela
  function resizeFlipbook() {
    let newW, newH;
    if ($(window).width() < 1024) {
      newW = $(window).width() * 0.9;
      newH = newW * (450/600);
    } else {
      newW = $container.width();
      newH = $container.height();
    }
    $container.find("#flipbook").turn("size", newW, newH);
  }
  resizeFlipbook();
  $(window).on('resize', resizeFlipbook);

  // Impede o drag das imagens
  $container.find(".page img").on("dragstart", e => e.preventDefault());

  // Toca áudio ao interagir com o flipbook
  $container.find("#flipbook").on("mousedown touchstart", () => {
    flipAudio.currentTime = 0;
    flipAudio.play().catch(() => {});
  });

  // Remove a setinha mobile após virar a primeira página
  $container.find("#flipbook").bind("turning", (e, page) => {
    if (page > 1) {
      $container.find("#setaBtn").fadeOut(300, () => { $(this).remove(); });
    }
  });

  // Clique na setinha avança a página
  $container.on("click", "#setaBtn", () => $container.find("#flipbook").turn("next"));

  // Handlers para os botões interativos do flipbook (contexto Veley'wey)
  $container.on("click", "#veleyweiBtn", e => {
    e.stopPropagation();
    $("#overlayImage").attr("src", "imagens/corpoyeroben.png");
    $("#overlayContainer").fadeIn(500);
    $("#overlayImage").css("transform", "translate(-50%, -50%) scale(1)");
  });
  $container.on("click", "#veleyweiBtn2", e => {
    e.stopPropagation();
    $("#overlayImage").attr("src", "imagens/sazonalidade.webp");
    $("#overlayContainer").fadeIn(500);
    $("#overlayImage").css("transform", "translate(-50%, -50%) scale(1)");
  });
  $container.on("click", "#veleyweiBtn3", e => {
    e.stopPropagation();
    $("#overlayImage").attr("src", "imagens/cliquevoreyabaron.webp");
    $("#overlayContainer").fadeIn(500);
    $("#overlayImage").css("transform", "translate(-50%, -50%) scale(1)");
  });
  $container.on("click", "#veleyweiBtn4", e => {
    e.stopPropagation();
    $("#overlayImage").attr("src", "imagens/sketch1.png");
    $("#overlayContainer").fadeIn(500);
    $("#overlayImage").css("transform", "translate(-50%, -50%) scale(1)");
  });
  $container.on("click", "#veleyweiBtn5", e => {
    e.stopPropagation();
    $("#overlayImage").attr("src", "imagens/sketch2.png");
    $("#overlayContainer").fadeIn(500);
    $("#overlayImage").css("transform", "translate(-50%, -50%) scale(1)");
  });
  $container.on("click", "#botaosapetyr", e => {
    e.stopPropagation();
    $("#overlayImage").attr("src", "imagens/cap1/cliquesapetyr.webp");
    $("#overlayContainer").fadeIn(500);
    $("#overlayImage").css("transform", "translate(-50%, -50%) scale(1)");
  });
};

// Inicialização automática (opcional)
document.addEventListener("DOMContentLoaded", () => {
  // Inicializa o globo no canvas com id "globeCanvas"
  window.initGlobe("#globeCanvas");
  // Inicializa o flipbook dentro do container (pode ser "#flipbook-wrapper" ou outro que contenha o #flipbook)
  window.initFlipbook("#flipbook-wrapper");
});
