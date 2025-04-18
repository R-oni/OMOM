// batedores.js

// 1) Inicialização do Globo
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

  let loaded = 0, total = 2;
  const check = () => { if (++loaded === total) document.dispatchEvent(new Event('globoCarregado')); };

  const w = canvas.clientWidth, h = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 1000);
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
      const newWidth = canvas.clientWidth;
      const newHeight = canvas.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
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
