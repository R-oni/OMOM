window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/ttok/imagens/cap1/pagina1.webp', // slide 3 - Lorem Ipsum
    'mundos/ttok/imagens/cap1/pagina2.webp', // slide 3                                // slide 2 - Lorem Ipsum  
    'mundos/ttok/imagens/cap1/pagina4.webp', // slide 4
    'mundos/ttok/imagens/cap1/pagina5.webp', // slide 5
    'LOREM_1', // slide 6
    'LOREM_2', // slide 6
    'GLOBO',                                  // slide 8: globo
    'LOREM_3', // slide 6
    'LOREM_4', // slide 6
    'LOREM_5', // slide 6
    'LOREM_6', // slide 6
    'mundos/ttok/imagens/cap1/pagina12.webp', // slide 13
    'mundos/ttok/imagens/cap1/pagina13.webp', // slide 14
    'mundos/ttok/imagens/cap1/pagina14.webp', // slide 15
    'mundos/ttok/imagens/cap1/pagina15.webp', // slide 16
    'mundos/ttok/imagens/cap1/pagina16.webp', // slide 17
    'LOREM_6.5', // slide 6
    'LOREM_7', // slide 6
    'mundos/ttok/imagens/cap1/mergulhador.webp',
    'LOREM_8', // slide 6
    'mundos/ttok/imagens/cap1/pagina19.webp', // slide 21
    'mundos/ttok/imagens/cap1/pagina20.webp', // slide 22
    'mundos/ttok/imagens/cap1/pagina21.webp', // slide 23
    'mundos/ttok/imagens/cap1/sanguedomundo.webp',
    'mundos/ttok/imagens/cap1/pagina22.webp', // slide 25
    'mundos/ttok/imagens/cap1/pagina23.webp', // slide 26
    'mundos/ttok/imagens/cap1/pagina24.webp', // slide 27
    'mundos/ttok/imagens/cap1/pagina25.webp', // slide 28
  ];

  // Textos Lorem Ipsum para as duas primeiras páginas
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page">
        <p>pela manhã de dois sóis</p>
        <p>caminha um grupo brilhante pelas areias.</p>
        <p>ouve-se estalos entre eles,</p>
        <p>pois é assim que se comunicam.</p>
        <p>No início das auroras</p>
        <p>muitos dos que saltam pelo deserto</p>
        <p>são abatidos por aqueles que</p>
        <p>dançam nos céus</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page">
        <h2>CAPÍTULO I</h2>
          <p>Durante 95 dias</p>
          <p>o mundo de TT'Tok'Tak'Tak'T parece</p>
          <p>estéril à primeira vista. Poucos habitantes</p>
          <p>se arriscam na superfície, onde a temperatura</p>
          <p>atinge 125ºC no lado claro.</p>
          <p>O ciclo ecológico gira em torno da interação</p>
          <p>magnética com TT'Tok'Tok'T, o gigante gasoso.</p>
      </div>
    `,
    'LOREM_3': `
      <div class="lorem-page">
          <p>Seu campo magnético passa por <span style="color: red;">inversões</span></p>
          <p>periódicas: 95 dias sem atividade,</p>
          <p>seguidos por 10 dias de fortalecimento,</p>
          <p>atingindo seu ápice no quinto dia.</p>
          <p>Durante esse período, auroras</p>
          <p>intensas tomam conta dos céus. A limpidez</p>
          <p>do mundo impressiona; a atmosfera</p>
          <p>azul esverdeada sugere micropartículas</p>
          <p>de silício e metano.</p>
      </div>
    `,
    'LOREM_4': `
      <div class="lorem-page">
          <p>As areias são de silicatos puros, formando</p>
          <p>um deserto branco como neve.</p>
          <p>Há uma concentração de cavernas nos polos.</p>
          <p>O planeta gasoso faz parte de um sistema</p>
          <p>circumbinário, ou seja, orbita duas estrelas.</p>
          <p>Tak'T'Tak'T</p>
          <p>e</p>
          <p>Tak'T'Tok'T</p>
          <p>Ambas do tipo <span style="color: red;">G</span></p>
      </div>
    `,
    'LOREM_5': `
      <div class="lorem-page">
        <p>O satélite natural, TT'Tok'Tak'Tak'T</p>
        <p>orbita o planeta a cada 71 horas em rotação</p>
        <p><span style="color: red;">síncrona</span>, logo, o gigante gasoso fica</p>
        <p>visível na mesma posição do céu.</p>
        <div style="height: 48px;"></div>
        <p>OS BATEDORES</p>
        <div style="height: 48px;"></div>
        <p>Os habitantes vivem em coletivos divididos</p>
        <p>entre prudentes e imprudentes.</p>
        <p>O nome "<span style="color: red;">batedor</span>" vem do som característico</p>
      </div>
    `,
    'LOREM_6': `
      <div class="lorem-page">
        <p>de sua comunicação: uma placa móvel em</p>
        <p>suas cabeças bate contra o exoesqueleto, </p>
        <p>emitindo um som rítmico e estridente.</p>
        <div style="height: 32px;"></div>
        <p>Também usam fotocomunicação, refratando <span style="color: red;">luz</span></p>
        <p>através de um arco translúcido de</p>
        <p>silicato em suas cabeças.</p>
        <p>Dentro dele, o fluido de Kernel-Torres</p>
        <p>se expande e contrai nos canais de</p>
        <p>Matir-Torres, alternando a opacidade da coroa e</p>
      </div>
    `,
    'LOREM_6.5': `
      <div class="lorem-page">
        <p>OS MERGULHADORES</p>
        <div style="height: 32px;"></div>
        <p>Os únicos predadores dos batedores são os </p>
        <p>mergulhadores, elegantes criaturas aéreas de </p>
        <p>três olhos e dois pares de asas. Passam cerca de </p>
        <p>90 dias voando acima das nuvens e nunca descem</p>
        <p>exceto na alta magnética.</p>
      </div>
    `,
    'LOREM_7': `
      <div class="lorem-page">
        <p>Na baixa magnética, capturam pequenas criaturas</p>
        <p>voadoras e quase nunca descem. Mas quando a </p>
        <p>alta começa, ficam agitados; a radiação extrema </p>
        <p>os força a abandonar os céus. Então, realizam um </p>
        <p>único voo vertical até a areia, com o objetivo de</p>
        <p>capturar um batedor.</p>
      </div>
    `,
    'LOREM_8': `
      <div class="lorem-page">
        <p>Se bem sucedidos, hibernam por dez dias com</p>
        <p>a energia adquirida, se falham, morrem.</p>
        <p>Sua linguagem é complexa e me lembra pássaros.</p>
        <div style="height: 48px;"></div>
        <p>Preciso retornar aqui.</p>
      </div>
    `,
  };

  slides.forEach(src => {
    const slideEl = document.createElement('div');
    slideEl.className = 'swiper-slide';
    
    if (src === 'GLOBO') {
      // canvas para o globo
      slideEl.innerHTML = `<canvas id="globeCanvas" style="width:100%;height:100%"></canvas>`;
    } else if (loremTexts[src]) {
      // Corrigido: agora aceita qualquer LOREM_X
      slideEl.innerHTML = loremTexts[src];
    } else {
      // imagens normais
      slideEl.innerHTML = `<img src="${src}" style="max-width:100%;max-height:100%" draggable="false">`;
    }
    wrap.appendChild(slideEl);
  });
};

// Three.js globe init (completamente sem sombras e reflexos)
window.initGlobe = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return;

  // Ajusta o tamanho do canvas para a resolução real da tela (HiDPI)
  function resizeRendererToDisplaySize(renderer, camera) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const pixelRatio = window.devicePixelRatio || 1;
    const displayWidth = Math.floor(width * pixelRatio);
    const displayHeight = Math.floor(height * pixelRatio);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      renderer.setSize(width, height, false);
      renderer.setPixelRatio(pixelRatio);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }

  // Cena com fundo branco
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#FFFFFF');

  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    preserveDrawingBuffer: false
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
  renderer.setPixelRatio(window.devicePixelRatio || 1);

  // IMPORTANTE: Desabilitar completamente o sistema de sombras
  renderer.shadowMap.enabled = false;

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;

  const loader = new THREE.TextureLoader();

  // Globo com material básico (sem reflexos nem sombras)
  const earth = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64), // Aumenta a resolução da esfera
    new THREE.MeshBasicMaterial({
      map: loader.load('mundos/ttok/mapatoktok.png'),
      transparent: false,
      opacity: 1,
    })
  );

  scene.add(earth);

  // Iluminação mínima (apenas para caso seja necessária)
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);

  // Animação
  (function animate() {
    requestAnimationFrame(animate);
    earth.rotation.y += 0.002;
    controls.update();
    resizeRendererToDisplaySize(renderer, camera); // Garante alta resolução sempre
    renderer.render(scene, camera);
  })();

  // Redimensionamento responsivo
  window.addEventListener('resize', () => {
    resizeRendererToDisplaySize(renderer, camera);
  });
};
