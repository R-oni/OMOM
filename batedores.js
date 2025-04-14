// batedores.js

// 1) globo
window.initGlobe = selector => {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

  let loaded = 0, total = 2;
  const check = () => { if (++loaded === total) document.dispatchEvent(new Event('globoCarregado')); };

  const w = canvas.clientWidth, h = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 1000);
  camera.position.set(0,0,4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias:true });
  renderer.setSize(w,h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // sky
  (()=>{
    const geom = new THREE.BufferGeometry();
    const pos=[], col=[];
    for(let i=0;i<20000;i++){
      const R=80, th=Math.random()*2*Math.PI, ph=Math.acos(Math.random()*2-1);
      const x=R*Math.sin(ph)*Math.cos(th), y=R*Math.sin(ph)*Math.sin(th), z=R*Math.cos(ph);
      pos.push(x,y,z);
      const r=Math.random();
      col.push(r<0.9?1:1, r<0.9?1:r<0.95?0.6:0.6, r<0.9?1:r<0.95?0.6:1);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    geom.setAttribute('color',    new THREE.Float32BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({ size:0.25, vertexColors:true });
    scene.add(new THREE.Points(geom,mat));
  })();

  const controls = new THREE.OrbitControls(camera,canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  const loader = new THREE.TextureLoader();

  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mundos/ttok/mapatoktok.png', check) })
  );
  central.castShadow = central.receiveShadow = true;
  scene.add(central);

  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,64,64),
    new THREE.MeshStandardMaterial({ map: loader.load('mapattok.png', check) })
  );
  orbit.castShadow = orbit.receiveShadow = true;
  orbit.position.set(orbitRadius,0,0);
  scene.add(orbit);

  scene.add(new THREE.AmbientLight(0xffffff,0.2));
  const dir = new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(3,3,5);
  dir.castShadow = true;
  scene.add(dir);

  let angle=0, speed=-0.5;
  const clock = new THREE.Clock();

  (function animate(){
    requestAnimationFrame(animate);
    const d = clock.getDelta();
    central.rotation.y += 0.003;
    angle += speed*d;
    orbit.position.set(
      orbitRadius*Math.cos(angle),
      0,
      orbitRadius*Math.sin(angle)
    );
    controls.update();
    renderer.render(scene,camera);
  })();

  window.addEventListener('resize', () => {
    const ww = canvas.clientWidth, hh = canvas.clientHeight;
    renderer.setSize(ww,hh);
    camera.aspect = ww/hh;
    camera.updateProjectionMatrix();
  });
};

// 2) flipbook apenas
window.initFlipbook = selector => {
  const $c = $(selector);
  if (!$c.length) return console.warn('Container flipbook não encontrado:', selector);

  // monta o flipbook
  $c.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="mundos/ttok/imagens/cap1/capa.webp" draggable="false">
        <img id="setaBtn" src="mundos/ttok/imagens/seta.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/capa2.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/contracapa.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina1.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina2.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina3.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina4.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina5.webp" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina6.webp" draggable="false">
        <img id="cliquemundo" src="mundos/ttok/imagens/cap1/cliquemundo.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina7.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina8.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina9.webp" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina10.webp" draggable="false">
        <img id="cliqueinversao" src="mundos/ttok/imagens/cap1/cliqueinversao.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina11.webp" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina12.webp" draggable="false">
        <img id="cliqueg" src="mundos/ttok/imagens/cap1/cliqueg.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina13.webp" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina14.webp" draggable="false">
        <img id="cliquerefracao" src="mundos/ttok/imagens/cap1/cliquerefracao.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina15.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina16.webp" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina17.webp" draggable="false">
        <img id="cliquemorse" src="mundos/ttok/imagens/cap1/cliquemorse.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina18.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina19.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina20.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina21.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina22.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina23.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina24.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina25.webp" draggable="false"></div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina26.webp" draggable="false">
        <img id="cliquecapacitor" src="mundos/ttok/imagens/cap1/cliquecapacitor.webp" draggable="false">
      </div>
      <div class="page">
        <img src="mundos/ttok/imagens/cap1/pagina27.webp" draggable="false">
        <img id="cliquesanguedomundo" src="mundos/ttok/imagens/cap1/cliquesanguedomundo.webp" draggable="false">
      </div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina28.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina29.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina30.webp" draggable="false"></div>
      <div class="page"><img src="imagens/cap1/pagina31.webp" draggable="false"></div>
      <div class="page"><img src="mundos/ttok/imagens/cap1/pagina32.webp" draggable="false"></div>
    </div>
    <div id="overlayContainer">
      <img id="overlayImage" src="" draggable="false">
      <button id="btnSair">Voltar</button>
    </div>
  `);

  // áudio flip
  const flipAudio = new Audio('sompagina.mp3');
  flipAudio.preload = 'auto';
  flipAudio.volume = 0.9;

  // init turn.js
  $('#flipbook').turn({ autoCenter:false, display:'double' });

  // responsivo
  function resizeFB(){
    const w = $(selector).width(), h = $(selector).height();
    $('#flipbook').turn('size', w, h);
  }
  $(window).on('resize', resizeFB);
  resizeFB();

  // som ao virar
  $('#flipbook').on('mousedown touchstart', ()=>{
    flipAudio.currentTime = 0;
    flipAudio.play().catch(()=>{});
  });

  // seta da capa some
  $('#flipbook').bind('turning', (e, p)=>{
    if(p>1) $('#setaBtn').fadeOut(300);
  });

  // clique na seta avança
  $(selector).on('click','#setaBtn', ()=>$('#flipbook').turn('next'));

  // overlay imagens
  $(selector).on('click','#btnSair', e=>{
    e.preventDefault();
    $('#overlayContainer').fadeOut(300);
  });
  const map = {
    '#cliquemundo':'imagens/cap1/cliquemundo.webp',
    '#cliqueinversao':'imagens/cap1/inversao.webp',
    '#cliqueg':'imagens/cap1/estrelag.webp',
    '#cliquerefracao':'imagens/cap1/refracao.webp',
    '#cliquemorse':'imagens/cap1/morse.webp',
    '#cliquecapacitor':'imagens/cap1/capacitor.webp',
    '#cliquesanguedomundo':'imagens/cap1/sanguedomundo.png'
  };
  Object.entries(map).forEach(([btn,src])=>{
    $(selector).on('click', btn, e=>{
      e.stopPropagation();
      $('#overlayImage').attr('src', src);
      $('#overlayContainer').fadeIn(500);
    });
  });
};
