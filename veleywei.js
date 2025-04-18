// veleywei.js

// 1) Inicialização do Globo com órbitas e texturas avançadas
window.initGlobe = function(selector) {
  // Obtém o canvas e esconde até o carregamento das texturas
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);
  canvas.style.visibility = 'hidden';

  // Cena e câmera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 3;

  // Renderizador com sRGB e sombras
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputEncoding = THREE.sRGBEncoding;
  resizeRenderer();

  // Controles
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Geometria do globo
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // Carregamento de texturas
  const loader = new THREE.TextureLoader();
  let texturesLoaded = 0;
  function checkLoaded() {
    if (++texturesLoaded === 2) {
      canvas.style.visibility = 'visible';
      document.dispatchEvent(new Event('globoCarregado'));
    }
  }

  // Textura principal
  const globeMap = loader.load(
    './imagens/mapaveleywei.webp',
    checkLoaded,
    undefined,
    err => console.error('Erro ao carregar mapaveleywei.webp', err)
  );
  globeMap.encoding = THREE.sRGBEncoding;
  globeMap.needsUpdate = true;

  // Mesh principal
  const material = new THREE.MeshStandardMaterial({ map: globeMap });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;
  sphere.receiveShadow = true;
  scene.add(sphere);

  // Camada de nuvens
  const cloudMap = loader.load(
    './imagens/nuvemveleywei.webp',
    checkLoaded,
    undefined,
    err => console.error('Erro ao carregar nuvemveleywei.webp', err)
  );
  cloudMap.encoding = THREE.sRGBEncoding;
  cloudMap.needsUpdate = true;

  const cloudMat = new THREE.MeshPhongMaterial({
    map: cloudMap,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.01, 64, 64),
    cloudMat
  );
  scene.add(cloudMesh);

  // Iluminação
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 3, 5);
  dir.castShadow = true;
  scene.add(dir);

  // Órbitas com 3 mini-globos
  const pivots = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];
  pivots.forEach(p => scene.add(p));

  const miniGeo = new THREE.SphereGeometry(0.01, 32, 32);
  const miniColors = [0xE0E0E0, 0xC0C0C0, 0xA0A0A0];
  const distances = [1.3, 2.0, 2.5];
  miniColors.forEach((color, i) => {
    const mat = new THREE.MeshStandardMaterial({ color });
    const mini = new THREE.Mesh(miniGeo, mat);
    mini.position.x = distances[i];
    pivots[i].add(mini);
  });

  // Animação
  const clock = new THREE.Clock();
  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    sphere.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.0039;
    pivots[0].rotation.y += 0.03;
    pivots[1].rotation.y += 0.015;
    pivots[2].rotation.y += 0.01;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', resizeRenderer);
  function resizeRenderer() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    if (window.matchMedia('(orientation: landscape)').matches) {
      camera.position.z = 2.5;
    } else {
      camera.position.z = 3;
    }
    camera.updateProjectionMatrix();
  }
};

// 2) Inicialização do Flipbook com cliques customizados (idem ao original)
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Flipbook não encontrado:', selector);

  $container.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/veleywei/imagens/cap1/capa.webp" alt="Capa" draggable="false">
        <img id="setaBtn" src="mundos/veleywei/imagens/seta.webp" alt="Seta" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/capa2.webp" alt="Página 1" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/contracapa.webp" alt="Página 2" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina1.webp" alt="Página 3" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina2.webp" alt="Página 4" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina3.webp" alt="Página 5" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina4.webp" alt="Página 6" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina5.webp" alt="Página 7" draggable="false"></div>
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina6.webp" alt="Página 8" draggable="false">
        <img id="cliqueyeroben" src="mundos/veleywei/imagens/cap1/cliqueyeroben.webp" alt="Clique Yeroben" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina7.webp" alt="Página 9" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina8.webp" alt="Página 10" draggable="false"></div>
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina9.webp" alt="Página 11" draggable="false">
        <img id="cliquevoreyabaron" src="mundos/veleywei/imagens/cap1/cliquevoreyabaron.webp" alt="Clique Voreyabaron" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina10.webp" alt="Página 12" draggable="false"></div>
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina11.webp" alt="Página 13" draggable="false">
        <img id="cliquesazonalidade" src="mundos/veleywei/imagens/cap1/cliquesazonalidade.webp" alt="Clique Sazonalidade" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina12.webp" alt="Página 14" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina13.webp" alt="Página 15" draggable="false"></div>
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina14.webp" alt="Página 16" draggable="false">
        <img id="cliquepartenogenese" src="mundos/veleywei/imagens/cap1/cliquepartenogenese.webp" alt="Clique Partenogênese" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina15.webp" alt="Página 17" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina16.webp" alt="Página 18" draggable="false"></div>
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina17.webp" alt="Página 19" draggable="false">
        <img id="cliquevitruviana" src="mundos/veleywei/imagens/cap1/cliquevitruviana.webp" alt="Clique Vitruviana" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina18.webp" alt="Página 20" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina19.webp" alt="Página 21" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina20.webp" alt="Página 22" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina21.webp" alt="Página 23" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina22.webp" alt="Página 24" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina23.webp" alt="Página 25" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina24.webp" alt="Página 26" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina25.webp" alt="Página 27" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina26.webp" alt="Página 28" draggable="false"></div>
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina27.webp" alt="Página 29" draggable="false">
        <img id="cliquesapetyr" src="mundos/veleywei/imagens/cap1/cliquesapetyr.webp" alt="Clique Sapetyr" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina28.webp" alt="Página 30" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina29.webp" alt="Página 31" draggable="false"></div>
    </div>
  `);

  // ... (o restante do initFlipbook: CSS overlay, lazy-load, áudio, Turn.js, handlers) ...
};
