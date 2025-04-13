function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return console.warn('Canvas #globeCanvas não encontrado');

  // Carregamento de texturas
  let texturesLoaded = 0;
  const totalTextures = 2;
  function checkTexturesLoaded() {
    texturesLoaded++;
    if (texturesLoaded === totalTextures) {
      document.dispatchEvent(new Event('globoCarregado'));
    }
  }

  // Tamanhos
  const width  = canvas.clientWidth;
  const height = canvas.clientHeight;

  // Cena, câmera, renderer
  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, width/height, 0.1, 1000);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap;

  // Controles
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping    = true;
  controls.dampingFactor    = 0.05;

  // Loader
  const loader = new THREE.TextureLoader();

  // Globo central
  const centralSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('mapatoktok.png', checkTexturesLoaded) })
  );
  centralSphere.castShadow = centralSphere.receiveShadow = true;
  scene.add(centralSphere);

  // Globo orbitante
  const orbitRadius  = 3;
  const orbitSphere  = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 64, 64),
    new THREE.MeshStandardMaterial({ map: loader.load('mapattok.png', checkTexturesLoaded) })
  );
  orbitSphere.castShadow = orbitSphere.receiveShadow = true;
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // Luzes
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(3,3,5);
  dirLight.castShadow = true;
  scene.add(dirLight);

  // Raycaster e clique
  const raycaster = new THREE.Raycaster();
  const mouse     = new THREE.Vector2();
  const clickable = [ centralSphere, orbitSphere ];

  function focusOn(obj, zoomDist, duration=600) {
    const fromPos    = camera.position.clone();
    const toPos      = obj.position.clone().add(new THREE.Vector3(0,0,zoomDist));
    const fromTarget = controls.target.clone();
    const toTarget   = obj.position.clone();
    const t0         = performance.now();

    (function tween(){
      const t = Math.min((performance.now()-t0)/duration, 1);
      camera.position.lerpVectors(fromPos, toPos, t);
      controls.target.lerpVectors(fromTarget, toTarget, t);
      controls.update();
      renderer.render(scene, camera);
      if (t < 1) requestAnimationFrame(tween);
    })();
  }

  canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((e.clientX-rect.left)/rect.width)*2 -1;
    mouse.y = -((e.clientY-rect.top)/rect.height)*2 +1;
    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(clickable, false)[0];
    if (!hit) return;
    if (hit.object === centralSphere) {
      window.myGlobe.trackingMode = 'central';
      focusOn(centralSphere, 2);
    } else {
      window.myGlobe.trackingMode = 'orbit';
      focusOn(orbitSphere, 0.6);
    }
  });

  // Animar
  let angle=0, speed=-0.5;
  const clock = new THREE.Clock();
  window.myGlobe = { camera, controls, centralSphere, orbitSphere, trackingMode:'none' };

  (function animate(){
    requestAnimationFrame(animate);
    const d = clock.getDelta();
    centralSphere.rotation.y += 0.003;
    angle += speed*d;
    orbitSphere.position.set(
      orbitRadius*Math.cos(angle),
      0,
      orbitRadius*Math.sin(angle)
    );
    if (window.myGlobe.trackingMode==='orbit') {
      const desired = orbitSphere.position.clone().add(new THREE.Vector3(0,0,0.6));
      camera.position.lerp(desired, 0.1);
      controls.target.copy(orbitSphere.position);
    } else if (window.myGlobe.trackingMode==='central') {
      const desired = centralSphere.position.clone().add(new THREE.Vector3(0,0,2));
      camera.position.lerp(desired, 0.1);
      controls.target.copy(centralSphere.position);
    }
    controls.update();
    renderer.render(scene, camera);
  })();

  // Resize
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w,h);
    camera.aspect = w/h;
    camera.updateProjectionMatrix();
  });
}

window.addEventListener('load', initGlobe);
