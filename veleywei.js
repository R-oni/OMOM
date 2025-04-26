// veleywei.js

// --- Injeção de CSS para ícones clicáveis no flipbook ---
;(function(){
  const style = document.createElement('style');
  style.textContent = `
  /* ---------- ÍCONES CLICÁVEIS NO FLIPBOOK (Velei'wey) ---------- */
  #cliqueyeroben,
  #cliquevoreyabaron,
  #cliquesazonalidade,
  #cliquepartenogenese,
  #cliquevitruviana,
  #cliquesapetyr {
    position: absolute;
    inset: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 10;
    animation: fadeInOut .7s infinite;
  }

  #botaosapetyr {
    position: absolute;
    inset: 0;
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: 10;
    animation: pulseAndFade 1.5s infinite;
  }

  @keyframes fadeInOut {
    0%   { opacity: 1; }
    50%  { opacity: 0; }
    100% { opacity: 1; }
  }

  @keyframes pulseAndFade {
    0%   { transform: scale(1); opacity: 1; }
    50%  { transform: scale(1.1); opacity: 0.6; }
    100% { transform: scale(1); opacity: 1; }
  }
  `;
  document.head.appendChild(style);
})();

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
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.outputEncoding = THREE.sRGBEncoding;

  // céu estrelado
  (function(){
    const geom = new THREE.BufferGeometry();
    const pos = [], col = [];
    for(let i=0; i<30000; i++){
      const R=80, θ=Math.random()*2*Math.PI, φ=Math.acos(Math.random()*2-1);
      const x=R*Math.sin(φ)*Math.cos(θ), y=R*Math.sin(φ)*Math.sin(θ), z=R*Math.cos(φ);
      pos.push(x,y,z);
      const r=Math.random();
      col.push(
        r<0.9?1:1,
        r<0.9?1:r<0.95?0.6:0.6,
        r<0.9?1:r<0.95?0.6:1
      );
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    geom.setAttribute('color',    new THREE.Float32BufferAttribute(col,3));
    scene.add(new THREE.Points(
      geom,
      new THREE.PointsMaterial({ size:0.08, vertexColors:true })
    ));
  })();

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // guarda referências para destruição
  window._Globe = window._Globe || {};
  window._Globe.scene    = scene;
  window._Globe.renderer = renderer;
  window._Globe.controls = controls;
  window.globeControls = controls;

  const loader = new THREE.TextureLoader();

  // globo principal
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/veleywei/imagens/mapaveleywei.webp', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  // camada de nuvens
  const cloudMat = new THREE.MeshPhongMaterial({
    map: loader.load('mundos/veleywei/imagens/nuvemveleywei.webp', check),
    transparent: true,
    opacity: 1,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(
    new THREE.SphereGeometry(1.01,64,64),
    cloudMat
  );
  scene.add(cloudMesh);

  // iluminação
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 3, 5);
  dir.castShadow = true;
  scene.add(dir);

  // pivôs e mini-globos orbitando
  const pivots = [new THREE.Object3D(), new THREE.Object3D(), new THREE.Object3D()];
  pivots.forEach(p => scene.add(p));

  const miniGeo   = new THREE.SphereGeometry(0.01,32,32);
  const miniCols  = [0xE0E0E0,0xC0C0C0,0xA0A0A0];
  const distances = [1.3,2.0,2.5];
  miniCols.forEach((col,i)=>{
    const mat  = new THREE.MeshStandardMaterial({ color: col });
    const mini = new THREE.Mesh(miniGeo, mat);
    mini.position.x = distances[i];
    pivots[i].add(mini);
  });

  const clock = new THREE.Clock();
  (function animate(){
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    central.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.0039;
    pivots[0].rotation.y += 0.03;
    pivots[1].rotation.y += 0.015;
    pivots[2].rotation.y += 0.01;
    controls.update();
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', ()=>{
    const ww = canvas.clientWidth, hh = canvas.clientHeight;
    renderer.setSize(ww, hh);
    camera.aspect = ww/ hh;
    camera.updateProjectionMatrix();
  });
};

// 2) Inicialização do Flipbook com cliques customizados
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Flipbook não encontrado:', selector);

  // Injeta toda a estrutura do flipbook
  $container.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/veleywei/imagens/cap1/capa.webp" alt="Capa" draggable="false">
        <img id="setaBtn" src="mundos/veleywei/imagens/seta.webp" alt="Seta" draggable="false">
      </div>
      <!-- demais páginas omitidas para brevidade, mantidas iguais -->
      <div class="page">
        <img src="mundos/veleywei/imagens/cap1/pagina27.webp" alt="Página 29" draggable="false">
        <img id="cliquesapetyr" src="mundos/veleywei/imagens/cap1/cliquesapetyr.webp" alt="Clique Sapetyr" draggable="false">
      </div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina28.webp" alt="Página 30" draggable="false"></div>
      <div class="page"><img src="mundos/veleywei/imagens/cap1/pagina29.webp" alt="Página 31" draggable="false"></div>
    </div>
  `);

  // configurações gerais (overlay, tamanhos, lazy-load, áudio, turn.js, responsivo, etc.)
  // ... (permanece igual ao original) ...

  // Clique Sapetyr: substitui o globo pela imagem
  const trocaSapetyr = function(){
    if (!$('#sapetyrGloboImage').length) {
      $('<img>',{
        id: 'sapetyrGloboImage',
        src: 'mundos/veleywei/imagens/cap1/sapetyr.png',
        css: { width: '100%', height: '100%', objectFit: 'contain' }
      }).appendTo('#globe-area');
    }
    $('#globeCanvas').hide();
  };

  // Mapeia apenas o Sapetyr
  const map = { 
    cliquesapetyr: trocaSapetyr
  };
  Object.keys(map).forEach(id=>{
    $container.on('click', `#${id}`, function(e){
      e.stopPropagation();
      map[id]();
    });
  });
};
