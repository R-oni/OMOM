window.initFlipbook = function(wrapperSelector) {
  const wrap = document.querySelector(wrapperSelector);
  const slides = [
    'mundos/os artesaos/imagens/cap1/pagina1.webp', // slide 3 - Lorem Ipsum
    'mundos/os artesaos/imagens/cap1/pagina2.webp', // slide 3                                // slide 2 - Lorem Ipsum  
    'mundos/os artesaos/imagens/cap1/pagina3.webp', // slide 4
    'mundos/os artesaos/imagens/cap1/pagina4.webp', // slide 5
    'LOREM_1', // slide 6
    'LOREM_2', // slide 6
    'LOREM_3', // slide 6
    'LOREM_4', // slide 6
    'GLOBO',  
    'LOREM_5', // slide 6
    'LOREM_6', // slide 6
    'LOREM_7', // slide 6
    'LOREM_8', // slide 6
    'LOREM_9', // slide 6
    'LOREM_10', // slide 6
    'LOREM_11', // slide 6
    'LOREM_12', // slide 6
    'LOREM_13', // slide 6
    'LOREM_14',
    'LOREM_15', // slide 6
    'LOREM_16', // slide 6
    'LOREM_17', // slide 6
    'LOREM_18', // slide 6
    'LOREM_19', // slide 6
    'LOREM_20', // slide 6
    'LOREM_21', // slide 6
    'LOREM_22', // slide 6
    'LOREM_23'

  ];

  // Textos Lorem Ipsum para as duas primeiras páginas
  const loremTexts = {
    'LOREM_1': `
      <div class="lorem-page">
        <p>A dança de dois mundos molda sua cultura.</p>
        <p>Na maré alta trocam... trocam de tudo,</p>
        <p>desde comida à música.</p>
        <p>Sua principal moeda é o barro, trabalhado.</p>
        <p>Pois na baixa-maré é que este se amostra,</p>
        <p>antes escondido nas inúmeras veias do mundo,</p>
        <p>que pulsam a cada translação.</p>
        <p>Até as casas precisam descansar aqui.</p>
      </div>
    `,
    'LOREM_2': `
      <div class="lorem-page">
        <p>O som que se assemelha ao de madeiras rangendo</p>
        <p>se mistura com o do movimento da água sendo</p>
        <p>cortada rio abaixo. É assim que se movem os Brlejkaoe,</p>
        <p>peculiares criaturas de meio metro e exímios</p>
        <p>nadadores.</p>
        <p>O brilho de Bpraso-ki é forte; trata de uma estrela</p>
        <p>do tipo <span style="color: red;">F</span></p>
      </div>
    `,
    'LOREM_3': `
      <div class="lorem-page">
        <p>luminosa o suficiente para clarear em um branco</p>
        <p>difuso, a paisagem que consiste em tons de verde</p>
        <p>claro das tipo-árvore espalhadas por toda porojka.</p>
      </div>
    `,
    'LOREM_4': `
      <div class="lorem-page">
        <p>O satélite natural orbita Kora-Jskpa,</p>
        <p>um gigante gasoso de coloração avermelhada -</p>
        <p>ou talvez rosa...</p>
      </div>
    `,
    'LOREM_5': `
      <div class="lorem-page">
        <p>Toda cultura do povo brlejkaoe é centrada</p>
        <p>nas fortes marés causadas pela dança de</p>
        <p>Kora-Jskpa e Porojka.</p>
        <p>A órbita é <span style="color: red;">excêntrica</span> o suficiente para que,</p>
        <p>no <span style="color: red;">apogeu</span>(),</p>
      </div>
    `,
    'LOREM_6': `
      <div class="lorem-page">
        <p>as águas se distribuam pelo mundo,</p>
        <p>dando profundidade para aqueles que moram n'água</p>
        <p>e no perigeu, a força gravitacional dobra os rios</p>
        <p>ao ponto de mostrar seu leito.</p>
      </div>
    `,
    'LOREM_7': `
      <div class="lorem-page">
        <p>Os Brlejkaoe são seres anfíbios, ou seja,</p>
        <p>vivem tanto na terra quanto na água.</p>
        <p>Constroem suas moradas com material biológico</p>
        <p>fibroso semelhante a galhos extraídos das</p>
        <p>Pbrejaktea Tód.</p>
      </div>
    `,
    'LOREM_8': `
      <div class="lorem-page">
        <p>As Jskeksebt, suas casas-cidade, são construídas</p>
        <p>com os troncos de Pbrejakteas Tód entrelaçados</p>
        <p>e untadas com cera de Splekjat, pequenos</p>
        <p>organismos coloniais que vivem nos manguezais</p>
        <p>de Porojka, e é utilizada para</p>
      </div>
    `,
    'LOREM_9': `
      <div class="lorem-page">
        <p>impermeabilizar as estruturas submersas e impedir</p>
        <p>que a água penetre nas câmaras internas, onde</p>
        <p>os Brlejkaoe vivem, socializam e guardam seus</p>
        <p>relicários.</p>
      </div>
    `,
    'LOREM_10': `
      <div class="lorem-page">
        <p>Possuem diversas câmaras e galerias em sua parte</p>
        <p>submersa. Apenas uma fração é exposta ao ar e sol.</p>
      </div>
    `,
    'LOREM_11': `
      <div class="lorem-page">
        <p>Essa alternância rítmica entre terra e água</p>
        <p>molda a estrutura social dos Brlejkaoe.</p>
        <p>Em baixa-mar as casas encalham e os membros</p>
        <p>se preparam o trabalho.</p>
      </div>
    `,
    'LOREM_12': `
      <div class="lorem-page">
        <p>É quando podem tocar o barro fundo que iniciam</p>
        <p>o ciclo artesanal. Ali, extraem seu sustento</p>
        <p>e deposição para seu afeto.</p>
      </div>
    `,
    'LOREM_13': `
      <div class="lorem-page">
        <p>Fazem as mais variadas formas argilosas,</p>
        <p>desde recipientes a itens ritualísticos</p>
        <p>como os encantadores Jksipta-Jkepóm.</p>
      </div>
    `,
    'LOREM_14': `
      <div class="lorem-page">
        <h2 style="color:#00FFE7; margin-bottom: 32px;">TRANSITORIEDADE</h2>
        <div style="height: 32px;"></div>
        <p>Os Brlejkaoe são completamente imersos na impermanência</p>
        <p>e esta move sua conduta. Sua civilização é baseada</p>
        <p>na ideia de transitoriedade, um reflexo direto dos</p>
        <p>ciclos naturais de seu mundo.</p>
      </div>
    `,
    'LOREM_15': `
      <div class="lorem-page">
        <p>Não firmam laços duradouros. Se tocam e se enrolam</p>
        <p>tempo suficiente para uma órbita de 63 horas.</p>
        <p>Depois, trocam de parceiros, amigos, família, casa e roupa.</p>
      </div>
    `,
    'LOREM_16': `
      <div class="lorem-page">
        <p>Construções, moradias e até mesmo objetos pessoais</p>
        <p>são projetados para serem temporários (exceto as Jskeksebt),</p>
        <p>facilmente transportáveis e dissolúveis em Jaktaporogka,</p>
        <p>as águas do mundo.</p>
      </div>
    `,
    'LOREM_17': `
      <div class="lorem-page">
        <h2 style="color:#00FFE7; margin-bottom: 32px;">BRLEJKAOE</h2>
        <div style="height: 32px;"></div>
        <p>Possuem tamanho-foca, com seis membros, dentre estes,</p>
        <p>quatro voltados à natação. Os membros dianteiros foram</p>
        <p>adaptados por milhares de anos para manipulação geral de objetos.</p>
      </div>
    `,
    'LOREM_18': `
      <div class="lorem-page">
        <p>Quando as águas recuam e revelam o leito argiloso,</p>
        <p>as criaturas descem das Jskeksebt e iniciam o processo de coleta.</p>
      </div>
    `,
    'LOREM_19': `
      <div class="lorem-page">
        <p>Levam entao o material até as plataformas, onde a argila fresca</p>
        <p>é moldada. Dos vários fabricados, por hora cito os mais importantes:</p>
        <p>os potes e as máscaras, Sprejktet e Zobkjabót respectivamente.</p>
      </div>
    `,
    'LOREM_20': `
      <div class="lorem-page">
        <p>É principalmente nos Sprejktets que marcam sua língua escrita:</p>
        <p>o Korjka.</p>
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
      map: loader.load('mundos/os artesaos/kora-jskpa.png'),
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
