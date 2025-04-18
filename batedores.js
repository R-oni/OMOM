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
  
  // Armazena o modo de tracking atual
  window.myGlobe = {
    trackingMode: "central"
  };

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

  // Configuração dos estilos para as imagens clicáveis
  // Importante: adiciona CSS específico para as imagens clicáveis sobrepostas
  // Posicionamento e animação das imagens clicáveis
  $container.find('#cliquemundo, #cliqueinversao, #cliqueg, #cliquerefracao, #cliquemorse, #cliquecapacitor, #cliquesanguedomundo').css({
    position: 'absolute',
    cursor: 'pointer',
    bottom: '0',
    right: '0',
    width: '100%',
    height: '100%',
    zIndex: '10',
    left: '0',
    top: '0',
    animation: 'fadeInOut 0.7s infinite'
  });

  // Ajuste de tamanho das páginas
  $container.find('#flipbook .page').css({
    width: '80%',
    height: '80%',
    position: 'relative'  // Importante para posicionamento absoluto dos elementos filhos
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
      turning: function(event, page, pageObject) {
        flipAudio.currentTime = 0;
        flipAudio.play().catch(e => console.log('Áudio bloqueado:', e));
        
        // Precarrega as próximas páginas para evitar delay
        preloadPages(page, 4);
      }
    }
  });

  // Configuração do botão de seta para virar página
  $("#setaBtn").on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    $("#flipbook").turn('next');
  });

  // Configuração das imagens clicáveis para abrir overlays
  $("#cliquemundo").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/mundo.webp');
    $('#overlayContainer').fadeIn(300);
  });

  $("#cliqueinversao").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/inversao.webp');
    $('#overlayContainer').fadeIn(300);
  });

  $("#cliqueg").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/g.webp');
    $('#overlayContainer').fadeIn(300);
  });

  $("#cliquerefracao").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/refracao.webp');
    $('#overlayContainer').fadeIn(300);
  });

  $("#cliquemorse").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/morse.webp');
    $('#overlayContainer').fadeIn(300);
  });

  $("#cliquecapacitor").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/capacitor.webp');
    $('#overlayContainer').fadeIn(300);
  });

  $("#cliquesanguedomundo").on('click', function() {
    $('#overlayImage').attr('src', 'mundos/ttok/imagens/cap1/overlays/sanguedomundo.webp');
    $('#overlayContainer').fadeIn(300);
  });

  // Responsividade
  $(window).on('resize', function() {
    $("#flipbook").turn('size', $container.width(), $container.height());
  });
};

// 3) Inicialização do autômato celular (fundo pixelado)
window.initAutomaton = function(selector) {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas autômato não encontrado:', selector);

  const ctx = canvas.getContext('2d');
  
  // Configurações do autômato celular
  const cellSize = 8;
  const cols = Math.ceil(window.innerWidth / cellSize);
  const rows = Math.ceil(window.innerHeight / cellSize);
  let grid = createGrid(cols, rows);
  
  // Ajusta o tamanho do canvas
  canvas.width = cols * cellSize;
  canvas.height = rows * cellSize;
  
  // Cria o grid inicial
  function createGrid(cols, rows) {
    const arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows);
      for (let j = 0; j < rows; j++) {
        arr[i][j] = Math.random() < 0.08 ? 1 : 0; // Inicialização esparsa
      }
    }
    return arr;
  }
  
  // Calcula a próxima geração do autômato
  function computeNextGen(grid) {
    const nextGen = createGrid(cols, rows);
    
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        // Contagem de vizinhos vivos (regra de Moore)
        let neighbors = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const col = (x + i + cols) % cols;
            const row = (y + j + rows) % rows;
            neighbors += grid[col][row];
          }
        }
        
        // Regras do Jogo da Vida de Conway
        if (grid[x][y] === 1) {
          if (neighbors < 2 || neighbors > 3) {
            nextGen[x][y] = 0; // Morte: solidão ou superpopulação
          } else {
            nextGen[x][y] = 1; // Sobrevive
          }
        } else {
          if (neighbors === 3) {
            nextGen[x][y] = 1; // Nascimento
          } else {
            nextGen[x][y] = 0; // Continua morto
          }
        }
      }
    }
    
    return nextGen;
  }
  
  // Renderiza o grid
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        if (grid[x][y] === 1) {
          // Células vivas em azul ciano com brilho
          ctx.fillStyle = 'rgba(0, 255, 231, 0.7)';
          ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          
          // Brilho interno
          ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
          ctx.fillRect(
            x * cellSize + cellSize/4, 
            y * cellSize + cellSize/4, 
            cellSize/2, 
            cellSize/2
          );
        }
      }
    }
  }
  
  // Loop de animação
  let frameCount = 0;
  function animate() {
    frameCount++;
    
    if (frameCount % 5 === 0) { // Atualiza a cada 5 frames para deixar mais lento
      grid = computeNextGen(grid);
    }
    
    render();
    requestAnimationFrame(animate);
  }
  
  // Inicia a animação
  animate();
  
  // Responsividade
  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
};
