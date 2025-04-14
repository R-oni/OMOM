// batedores.js

// 1) opcional: reinit do starfield/warp no automatonCanvas
window.initAutomaton = selector => {
  const canvas = document.querySelector(selector);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], numStars = 300, speed = 2, anim;
  function setup() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = [];
    for (let i=0; i<numStars; i++){
      const r = Math.random(), color = r<0.9?'white':r<0.95?'#FF5555':'#AAAAFF';
      stars.push({
        x: Math.random()*canvas.width - canvas.width/2,
        y: Math.random()*canvas.height - canvas.height/2,
        z: Math.random()*canvas.width,
        color
      });
    }
  }
  function update(){
    ctx.fillStyle='black'; ctx.fillRect(0,0,canvas.width,canvas.height);
    stars.forEach(s=>{
      s.z -= speed;
      if (s.z<=0) { s.x = Math.random()*canvas.width - canvas.width/2; s.y = Math.random()*canvas.height - canvas.height/2; s.z = canvas.width; }
      const p = 300/s.z, sx=s.x*p+canvas.width/2, sy=s.y*p+canvas.height/2, size=Math.max(2*p,0.5);
      ctx.fillStyle=s.color; ctx.beginPath(); ctx.arc(sx,sy,size,0,2*Math.PI); ctx.fill();
    });
    anim = requestAnimationFrame(update);
  }
  window.addEventListener('resize', setup);
  setup(); update();
};

// 2) globo
window.initGlobe = selector => {
  const canvas = document.querySelector(selector);
  if (!canvas) return console.warn('Canvas não encontrado:', selector);

  // texturas
  let loaded = 0, total = 2;
  const check = ()=>{ if (++loaded===total) document.dispatchEvent(new Event('globoCarregado')); };

  const w = canvas.clientWidth, h = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w/h, 0.1, 1000);
  camera.position.set(0,0,4);
  const renderer = new THREE.WebGLRenderer({canvas,antialias:true});
  renderer.setSize(w,h);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // céu de estrelas
  (()=>{
    const geom = new THREE.BufferGeometry();
    const pos=[],col=[];
    for(let i=0;i<20000;i++){
      const R=80,theta=Math.random()*Math.PI*2,phi=Math.acos(Math.random()*2-1);
      const x=R*Math.sin(phi)*Math.cos(theta), y=R*Math.sin(phi)*Math.sin(theta), z=R*Math.cos(phi);
      pos.push(x,y,z);
      const r=Math.random();
      col.push(r<0.9?1:1, r<0.9?1:0.6, r<0.9?1:r<0.95?0.6:1);
    }
    geom.setAttribute('position', new THREE.Float32BufferAttribute(pos,3));
    geom.setAttribute('color',    new THREE.Float32BufferAttribute(col,3));
    const mat = new THREE.PointsMaterial({ size:0.25, vertexColors:true });
    scene.add(new THREE.Points(geom,mat));
  })();

  const controls = new THREE.OrbitControls(camera,canvas);
  controls.enableDamping = true; controls.dampingFactor = 0.05;

  const loader = new THREE.TextureLoader();
  const central = new THREE.Mesh(
    new THREE.SphereGeometry(1,64,64),
    new THREE.MeshStandardMaterial({ map:loader.load('mapatoktok.png',check) })
  );
  central.castShadow=central.receiveShadow=true;
  scene.add(central);

  const orbitRadius = 3;
  const orbit = new THREE.Mesh(
    new THREE.SphereGeometry(0.1,64,64),
    new THREE.MeshStandardMaterial({ map:loader.load('mapattok.png',check) })
  );
  orbit.castShadow=orbit.receiveShadow=true;
  orbit.position.set(orbitRadius,0,0);
  scene.add(orbit);

  scene.add(new THREE.AmbientLight(0xffffff,0.2));
  const dir = new THREE.DirectionalLight(0xffffff,1);
  dir.position.set(3,3,5);
  dir.castShadow=true;
  scene.add(dir);

  const ray = new THREE.Raycaster(), mouse=new THREE.Vector2();
  const clickable=[central,orbit];
  let isTween=false;

  function focusOn(obj,dist,dur=600){
    isTween=true;
    const fromPos=camera.position.clone(), toPos=obj.position.clone().add(new THREE.Vector3(0,0,dist));
    const fromT=controls.target.clone(), toT=obj.position.clone();
    const t0=performance.now();
    (function tween(){
      const t=Math.min((performance.now()-t0)/dur,1);
      camera.position.lerpVectors(fromPos,toPos,t);
      controls.target.lerpVectors(fromT,toT,t);
      controls.update(); renderer.render(scene,camera);
      if(t<1) requestAnimationFrame(tween);
      else { isTween=false; window.myGlobe.trackingMode='none'; }
    })();
  }

  canvas.addEventListener('mousedown',e=>{
    const r=canvas.getBoundingClientRect();
    mouse.x=((e.clientX-r.left)/r.width)*2-1;
    mouse.y=-((e.clientY-r.top)/r.height)*2+1;
    ray.setFromCamera(mouse,camera);
    const hit=ray.intersectObjects(clickable,false)[0];
    if(!hit||isTween) return;
    if(hit.object===central){
      window.myGlobe.trackingMode='central';
      focusOn(central,2);
    } else {
      window.myGlobe.trackingMode='orbit';
      focusOn(orbit,0.6);
    }
  });

  let angle=0, speed=-0.5;
  const clock=new THREE.Clock();
  window.myGlobe={camera,controls,centralSphere:central,orbitSphere:orbit,trackingMode:'none'};

  (function animate(){
    requestAnimationFrame(animate);
    const d=clock.getDelta();
    central.rotation.y+=0.003;
    angle+=speed*d;
    orbit.position.set(orbitRadius*Math.cos(angle),0,orbitRadius*Math.sin(angle));
    if(!isTween){
      if(window.myGlobe.trackingMode==='orbit'){
        const desired=orbit.position.clone().add(new THREE.Vector3(0,0,0.6));
        camera.position.lerp(desired,0.1);
        controls.target.copy(orbit.position);
      } else if(window.myGlobe.trackingMode==='central'){
        const desired=central.position.clone().add(new THREE.Vector3(0,0,2));
        camera.position.lerp(desired,0.1);
        controls.target.copy(central.position);
      }
    }
    controls.update();
    renderer.render(scene,camera);
  })();

  window.addEventListener('resize',()=>{
    const w=canvas.clientWidth,h=canvas.clientHeight;
    renderer.setSize(w,h);
    camera.aspect=w/h; camera.updateProjectionMatrix();
  });
};

// 3) flipbook + overlay + áudio + tracking + warning
window.initFlipbook = selector => {
  const $c = $(selector);
  if(!$c.length) return;
  // insere HTML base
  $c.html(`
    <div id="flipbook">
      <div class="page hard">
        <img src="imagens/cap1/capa.webp" draggable="false">
        <img id="setaBtn" src="imagens/seta.webp" draggable="false">
      </div>
      <div class="page"><img src="imagens/cap1/capa2.webp" draggable="false"></div>
      <!-- copie todas as suas <div class="page"> do HTML original aqui -->
      <!-- ... até a página 32 ... -->
    </div>
    <div id="overlayContainer">
      <img id="overlayImage" src="" draggable="false">
      <button id="btnSair">Voltar</button>
    </div>
    <div id="warning-modal">
      <div class="warning-content">
        <h1 class="warning-title">ATENÇÃO!</h1>
        <h1 class="warning-note">ESTA É UMA OBRA DE FICÇÃO</h1>
        <p>Os ambientes, fenômenos e tecnologias presentes...</p>
        <button id="compreendo-btn" class="warning-btn">COMPREENDO</button>
      </div>
    </div>
  `);

  // áudio flip
  const flipAudio=new Audio('sompagina.mp3');
  flipAudio.preload='auto'; flipAudio.volume=0.9;

  // init turn.js
  $('#flipbook').turn({ autoCenter:false, display:'double' });

  function resizeFB(){
    const w=$(selector).width(), h=$(selector).height();
    $('#flipbook').turn('size', w, h);
  }
  $(window).on('resize', resizeFB); resizeFB();

  // handlers
  $('#flipbook').on('mousedown touchstart',()=>{
    flipAudio.currentTime=0; flipAudio.play().catch(()=>{});
  });
  $('#flipbook').bind('turning',(e,p)=>{ if(p>1) $('#setaBtn').fadeOut(300); });
  $c.on('click','#setaBtn',()=>$('#flipbook').turn('next'));

  // overlay images
  $c.on('click','#btnSair',e=>{ e.preventDefault(); $('#overlayContainer').fadeOut(300); });
  const mapping = {
    '#cliquebatedor':'batedor.png',
    '#cliquemergulhador':'mergulhador.png',
    '#cliquesangue':'sanguedomundo.png',
    '#cliqueinversao':'imagens/cap1/inversao.webp',
    '#cliqueg':'imagens/cap1/estrelag.webp',
    '#cliquerefracao':'imagens/cap1/refracao.webp',
    '#cliquemorse':'imagens/cap1/morse.webp',
    '#cliquecapacitor':'imagens/cap1/capacitor.webp',
    '#cliquesanguedomundo':'imagens/cap1/sanguedomundo.png'
  };
  Object.entries(mapping).forEach(([btn,src])=>{
    $c.on('click',btn,e=>{
      e.stopPropagation();
      $('#overlayImage').attr('src',src);
      $('#overlayContainer').fadeIn(500);
    });
  });

  // tracking buttons
  $c.on('click','#cliquemundo',e=>{ e.stopPropagation(); window.myGlobe.trackingMode='orbit'; });
  $c.on('click','#cliquemaior',e=>{ e.stopPropagation(); window.myGlobe.trackingMode='central'; });

  // animate globe arrows (opcional, copie sua lógica)
  let cycle=true;
  function arrowAnim(){
    if(!cycle) return;
    $('#globeSeta1').css({opacity:1,bottom:'30%',left:'30%'});
    $('#globeSeta2').css({opacity:1,top:'30%',right:'30%'});
    $('#globeSeta1').animate({bottom:'20%',left:'20%'},800);
    $('#globeSeta2').animate({top:'20%',right:'20%'},800,()=>{
      $('#globeSeta1,#globeSeta2').animate({opacity:0},400,()=>{
        if(cycle) setTimeout(arrowAnim,500);
      });
    });
  }
  arrowAnim();
  $('#globeCanvas').on('mousedown touchstart click',()=>{
    cycle=false;
    $('#globeSeta1,#globeSeta2').stop(true).fadeOut(300);
  });

  // warning modal
  $('#warning-modal').show();
  $('#compreendo-btn').on('click',()=>{
    $('#warning-modal').hide();
    const bg=document.getElementById('bgMusic');
    if(bg){ bg.volume=0.9; bg.play().catch(()=>{}); }
  });
};
