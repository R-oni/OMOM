// porojka.js

// 1) Inicialização do Globo (igual ao batedores.js)
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

  // guarda referências
  window._Globe         = window._Globe || {};
  window._Globe.scene   = scene;
  window._Globe.renderer= renderer;
  window._Globe.controls= controls;
  window.globeControls  = controls;
  window.trackOrbit     = false;

  const loader = new THREE.TextureLoader();
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/os artesaos/kora-jskpa.png', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/os artesaos/mapaporojka.png', check) })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius, 0, 0);
  scene.add(orbit);
  window.globeOrbit = orbit;

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3,3,5);
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
    if(window.trackOrbit){
      controls.target.copy(orbit.position);
      controls.update();
    }
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', ()=>{
    const ww = canvas.clientWidth, hh = canvas.clientHeight;
    renderer.setSize(ww, hh);
    camera.aspect = ww/hh;
    camera.updateProjectionMatrix();
  });
};

// 2) Inicialização do Flipbook até a página 10 (igual ao batedores.js)
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Flipbook não encontrado:', selector);

  // Injeta toda a estrutura do flipbook
  $container.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/os artesaos/imagens/cap1/capa.webp" alt="Capa" draggable="false">
        <img id="setaBtn" src="mundos/os artesaos/imagens/cap1/seta.webp" alt="Seta" draggable="false">
      </div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/capa2.webp" alt="Página 1" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/contracapa.webp" alt="Página 2" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina1.webp" alt="Página 3" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina2.webp" alt="Página 4" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina3.webp" alt="Página 5" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina4.webp" alt="Página 6" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina5.webp" alt="Página 7" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina6.webp" alt="Página 8" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina7.webp" alt="Página 9" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina8.webp" alt="Página 10" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina9.webp" alt="Página 9" draggable="false"></div>
      <div class="page"><img src="mundos/os artesaos/imagens/cap1/pagina10.webp" alt="Página 10" draggable="false"></div>
    </div>
  `);

  // CSS do overlay centralizado (se precisar)
  $('#overlayContainer').css({
    position:'fixed', top:'50%', left:'50%',
    transform:'translate(-50%, -50%)',
    'z-index':9999, display:'none'
  });
  $('#overlayImage').css({
    'max-width':'90vw', 'max-height':'90vh',
    width:'auto', height:'auto'
  });

  // Ajuste de tamanho das páginas
  $container.find('#flipbook .page').css({ width:'80%', height:'80%' });
  $container.find('#flipbook .page img').css({ width:'100%', height:'100%', objectFit:'contain' });

  // Turn.js init
  $('#flipbook').turn({
    autoCenter: false,
    display: 'double',
    when: {
      turned: (e, page) => {
        if (page > 1) {
          $('#setaBtn').fadeOut(300, () => $('#setaBtn').remove());
        }
      }
    }
  });

  // Responsivo
  function resizeFB(){
    const w = $container.width(), h = $container.height();
    $('#flipbook').turn('size', w, h);
  }
  resizeFB();
  $(window).on('resize', resizeFB);

  // Avança página ao clicar na seta
  $container.on('click', '#setaBtn', () => {
    $('#flipbook').turn('next');
  });
};
