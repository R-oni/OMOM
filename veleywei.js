// veleywei.js

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
    geom.setAttribute('color', new THREE.Float32BufferAttribute(col,3));
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

  window.globeControls = controls; // expõe controles

  const loader = new THREE.TextureLoader();
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/veleywei/imagens/mapaveleywei.png', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/veleywei/imagens/mapaveleywei.webp', check) })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius, 0, 0);
  scene.add(orbit);
  window.globeOrbit = orbit; // expõe satélite

  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 3, 5);
  dir.castShadow = true;
  scene.add(dir);

  let angle = 0, speed = -0.5;
  const clock = new THREE.Clock();
  window.trackOrbit = false; // flag de tracking

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
    if(window.trackOrbit) {
      controls.target.copy(orbit.position);
      controls.update();
    }
    renderer.render(scene, camera);
  })();

  window.addEventListener('resize', ()=>{
    const ww = canvas.clientWidth, hh = canvas.clientHeight;
    renderer.setSize(ww, hh);
    camera.aspect = ww / hh;
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
        <img id="cliquevitruviana" src="mundos/veleywei/imagens/cap1/vitruviana.webp" alt="Clique Vitruviana" draggable="false">
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

  // CSS do overlay centralizado
  $('#overlayContainer').css({
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    'z-index': 9999,
    display: 'none'
  });
  $('#overlayImage').css({
    'max-width': '90vw',
    'max-height': '90vh',
    width: 'auto',
    height: 'auto'
  });

  // Ajuste de tamanho das páginas
  $container.find('#flipbook .page').css({ width: '80%', height: '80%' });
  $container.find('#flipbook .page img').css({ width: '100%', height: '100%', objectFit: 'contain' });

  // Lazy‑load
  $container.find('#flipbook .page').each(function(idx){
    const p = idx + 1;
    $(this).attr('data-page', p);
    $(this).find('img').each(function(){
      const realSrc = $(this).attr('src');
      $(this).attr('data-src', realSrc).removeAttr('src');
    });
  });
  function preloadPages(start, count) {
    for (let i = start; i < start + count; i++){
      const pg = $container.find(`#flipbook .page[data-page="${i}"]`);
      pg.find('img[data-src]').each(function(){
        const $img = $(this);
        if (!$img.attr('src')) $img.attr('src', $img.data('src'));
      });
    }
  }
  preloadPages(1,3);

  // Áudio de página
  const flipAudio = new Audio('mundos/veleywei/sompagina.mp3');
  flipAudio.preload = 'auto'; flipAudio.volume = 0.9;

  // Turn.js init
  $('#flipbook').turn({ autoCenter: false, display: 'double', when: { turned: (_, page)=> preloadPages(page+1,3) } });

  // Responsivo
  function resizeFB(){
    let w, h;
    if ($(window).width() < 1024) {
      w = $(window).width() * 0.9;
      h = w * (450/600);
    } else {
      w = $container.width(); h = $container.height();
    }
    $('#flipbook').turn('size', w, h);
  }
  resizeFB(); $(window).on('resize', resizeFB);

  // Evita drag
  $('.page img').on('dragstart', e=>e.preventDefault());

  // Som no mousedown
  $('#flipbook').on('mousedown touchstart', ()=>{
    flipAudio.currentTime = 0; flipAudio.play().catch(()=>{});
  });

  // Oculta seta ao virar
  $('#flipbook').bind('turning', (e, page)=>{
    if (page>1) $('#setaBtn').fadeOut(300, ()=>$('#setaBtn').remove());
  });
  $container.on('click','#setaBtn', ()=>$('#flipbook').turn('next'));

  // Clique Yeroben: tracking do satélite
  const focoYeroben = function(){
    window.trackOrbit = true;
    if(window.globeControls && window.globeOrbit){
      window.globeControls.target.copy(window.globeOrbit.position);
      window.globeControls.update();
    }
  };

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

  // Mapeia handlers
  const map = { cliqueyeroben: focoYeroben, cliquesapetyr: trocaSapetyr };
  Object.keys(map).forEach(id=>{
    $container.on('click','#'+id, function(e){ e.stopPropagation(); map[id].call(this); });
  });

  // Overlays centrais
  $container.on('click','#cliquevoreyabaron', e=>{
    e.stopPropagation();
    $('#overlayImage').attr('src','mundos/veleywei/imagens/cap1/voreyabaron.webp');
    $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliquesazonalidade', e=>{
    e.stopPropagation();
    $('#overlayImage').attr('src','mundos/veleywei/imagens/cap1/sazonalidade.webp');
    $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliquepartenogenese', e=>{
    e.stopPropagation();
    $('#overlayImage').attr('src','mundos/veleywei/imagens/cap1/partenogenese.webp');
    $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliquevitruviana', e=>{
    e.stopPropagation();
    $('#overlayImage').attr('src','mundos/veleywei/imagens/cap1/vitruviana.webp');
    $('#overlayContainer').fadeIn(500);
  });

  // Ao virar página, reseta globo, canvas e overlays
  $('#flipbook').bind('turning', ()=>{
    $('#globeCanvas').show();
    $('#sapetyrGloboImage').remove();
    window.trackOrbit = false;
    if(window.globeControls){
      window.globeControls.target.set(0,0,0);
      window.globeControls.update();
    }
  });
};
