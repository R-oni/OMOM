// batedores.js

// 1) Inicialização do Globo
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

  const globeArea = document.querySelector('#globe-area');
  if (globeArea) {
    // cria container do overlay (escondido inicialmente)
    const overlay = document.createElement('div');
    overlay.id = 'titleOverlay';
    Object.assign(overlay.style, {
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.9)',
      display: 'none',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    });

    const img = document.createElement('img');
    img.src = 'mundos/ttok/imagens/titulottok.webp';
    img.style.width = '50%';
    img.style.marginBottom = '10px';
    overlay.appendChild(img);

    const title = document.createElement('div');
    title.textContent = "os batedores de tt'tok'tak'tak't";
    title.style.fontFamily = "'Press Start 2P', monospace";
    title.style.color = '#00ffe7';
    title.style.fontSize = '8px';
    overlay.appendChild(title);

    globeArea.appendChild(overlay);
  }

  let loaded = 0, total = 2;
  const check = () => {
    if (++loaded === total) document.dispatchEvent(new Event('globoCarregado'));
  };

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
    for (let i = 0; i < 30000; i++) {
      const R = 80,
            θ = Math.random() * 2 * Math.PI,
            φ = Math.acos(Math.random() * 2 - 1);
      const x = R * Math.sin(φ) * Math.cos(θ),
            y = R * Math.sin(φ) * Math.sin(θ),
            z = R * Math.cos(φ);
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
    scene.add(new THREE.Points(
      geom,
      new THREE.PointsMaterial({ size: 0.08, vertexColors: true })
    ));
  })();

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  window._Globe = window._Globe || {};
  window._Globe.scene    = scene;
  window._Globe.renderer = renderer;
  window._Globe.controls = controls;
  window.globeControls   = controls;

  const loader = new THREE.TextureLoader();
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({
      map: loader.load('mundos/ttok/mapatoktok.png', check)
    })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 64, 64),
    new THREE.MeshStandardMaterial({
      map: loader.load('mundos/ttok/mapattok.png', check)
    })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius, 0, 0);
  scene.add(orbit);
  window.globeOrbit = orbit;

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

// 2) Inicialização do Flipbook com cliques customizados
window.initFlipbook = function(selector) {
  const $container = $(selector);
  if (!$container.length) return console.warn('Flipbook não encontrado:', selector);

  // Injeta toda a estrutura do flipbook
  $container.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/ttok/imagens/cap1/capa.webp" alt="Capa" draggable="false">
        <img id="setaBtn" src="mundos/ttok/imagens/cap1/seta.webp" alt="Seta" draggable="false">
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
        <img id="cliqueinversao" src="mundos/ttok/imagens/cap1/inversao.webp" alt="Clique Inversão" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina10.webp" alt="Página 12" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina11.webp" alt="Página 13" draggable="false">
        <img id="cliqueg" src="mundos/ttok/imagens/cap1/estrelag.webp" alt="Clique G" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina12.webp" alt="Página 14" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina13.webp" alt="Página 15" draggable="false">
        <img id="cliquerefracao" src="mundos/ttok/imagens/cap1/refracao.webp" alt="Clique Refracão" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina14.webp" alt="Página 16" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina15.webp" alt="Página 17" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina16.webp" alt="Página 18" draggable="false">
        <img id="cliquemorse" src="mundos/ttok/imagens/cap1/morse.webp" alt="Clique Morse" draggable="false">
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
        <img id="cliquecapacitor" src="mundos/ttok/imagens/cap1/capacitor.webp" alt="Clique Capacitor" draggable="false">
      </div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina27.webp" alt="Página 29" draggable="false">
        <img id="cliquesanguedomundo" src="mundos/ttok/imagens/cap1/sanguedomundo.webp" alt="Clique Sangue do Mundo" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina28.webp" alt="Página 30" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina29.webp" alt="Página 31" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina30.webp" alt="Página 32" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina31.webp" alt="Página 33" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina32.webp" alt="Página 34" draggable="false"></div>
    </div>
  `);

  // Ajuste de tamanho e lazy-load
  $container.find('#flipbook .page').css({ width: '80%', height: '80%' });
  $container.find('#flipbook .page img').css({ width: '100%', height: '100%', objectFit: 'contain' });
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

  // Turn.js init e responsivo
  $('#flipbook').turn({
    autoCenter: false,
    display: 'double',
    when: { turned: (_, page) => preloadPages(page+1,3) }
  });
  $(window).on('resize', ()=>$('#flipbook').turn('size',$container.width(),$container.height()));

  // Som de página
  const flipAudio = new Audio('mundos/ttok/sompagina.mp3');
  flipAudio.preload = 'auto'; flipAudio.volume = 0.9;
  $('#flipbook').on('mousedown touchstart', ()=>{
    flipAudio.currentTime = 0; flipAudio.play().catch(()=>{});
  });

  // Oculta seta inicial
  $('#flipbook').bind('turning', (e, page)=>{
    if (page > 1) $('#setaBtn').fadeOut(300, ()=>$('#setaBtn').remove());
  });
  $container.on('click','#setaBtn', ()=>$('#flipbook').turn('next'));

  // Clique Mundo: exibe título + imagem por 3s
  $container.on('click','#cliquemundo', function(e){
    e.stopPropagation();
    const overlay = document.getElementById('titleOverlay');
    const globeCanvas = document.querySelector('#globe-area canvas');
    if (overlay && globeCanvas) {
      overlay.style.display = 'flex';
      globeCanvas.style.display = 'none';
      setTimeout(()=>{
        overlay.style.display = 'none';
        globeCanvas.style.display = '';
      }, 3000);
    }
  });

  // Mapeia demais handlers originais (sangue, inversão, etc.)
  $container.on('click','#cliquesanguedomundo', function(e){
    e.stopPropagation();
    if (!$('#sangueGloboImage').length) {
      $('<img>',{
        id: 'sangueGloboImage',
        src: 'mundos/ttok/imagens/cap1/sanguedomundo.webp',
        css: { width: '100%', height: '100%', objectFit: 'contain' }
      }).appendTo('#globe-area');
    }
    $('#globe-area canvas').hide();
    setTimeout(()=>{
      $('#sangueGloboImage').remove();
      $('#globe-area canvas').show();
    }, 3000);
  });
  $container.on('click','#cliqueinversao', e=>{
    e.stopPropagation(); $('#overlayImage').attr('src','mundos/ttok/imagens/cap1/inversao.webp'); $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliqueg', e=>{
    e.stopPropagation(); $('#overlayImage').attr('src','mundos/ttok/imagens/cap1/estrelag.webp'); $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliquerefracao', e=>{
    e.stopPropagation(); $('#overlayImage').attr('src','mundos/ttok/imagens/cap1/refracao.webp'); $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliquemorse', e=>{
    e.stopPropagation(); $('#overlayImage').attr('src','mundos/ttok/imagens/cap1/morse.webp'); $('#overlayContainer').fadeIn(500);
  });
  $container.on('click','#cliquecapacitor', e=>{
    e.stopPropagation(); $('#overlayImage').attr('src','mundos/ttok/imagens/cap1/capacitor.webp'); $('#overlayContainer').fadeIn(500);
  });

  // Ao virar página, reseta globo e overlays
  $('#flipbook').bind('turning', ()=>{
    $('#globe-area canvas').show();
    $('#sangueGloboImage').remove();
    $('#overlayContainer').fadeOut(200);
  });
};
