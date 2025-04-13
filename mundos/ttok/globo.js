function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) return;

  // Controle de carregamento de texturas
  let texturesLoaded = 0;
  const totalTextures = 2;

  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 4);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true; // Adicionado
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Adicionado

  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05; // Adicionado

  const textureLoader = new THREE.TextureLoader();

  function checkTexturesLoaded() {
    texturesLoaded++;
    if (texturesLoaded === totalTextures) {
      document.dispatchEvent(new Event('globoCarregado'));
    }
  }

  // Globo Central
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralTexture = textureLoader.load('mapatoktok.png', checkTexturesLoaded);
  const centralMaterial = new THREE.MeshStandardMaterial({ map: centralTexture });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true; // Adicionado
  centralSphere.receiveShadow = true; // Adicionado
  scene.add(centralSphere);

  // Globo Orbitante
  const orbitRadius = 3;
  const orbitGeometry = new THREE.SphereGeometry(0.1, 64, 64);
  const orbitTexture = textureLoader.load('mapattok.png', checkTexturesLoaded);
  const orbitMaterial = new THREE.MeshStandardMaterial({ map: orbitTexture });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true; // Adicionado
  orbitSphere.receiveShadow = true; // Adicionado
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // Iluminação (Essencial para visualização)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Animação e Controles
  let orbitAngle = 0;
  const orbitSpeed = -0.5;
  const clock = new THREE.Clock();

  window.myGlobe = {
    camera: camera,
    controls: controls,
    centralSphere: centralSphere,
    orbitSphere: orbitSphere,
    trackingMode: "none"
  };

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    centralSphere.rotation.y += 0.003;

    orbitAngle += orbitSpeed * delta;
    orbitSphere.position.x = centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
    orbitSphere.position.z = centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

    if (window.myGlobe.trackingMode === "orbit") {
      const offset = new THREE.Vector3(0, 0, 0.6);
      const desiredPos = orbitSphere.position.clone().add(offset);
      camera.position.lerp(desiredPos, 0.1);
      controls.target.copy(orbitSphere.position);
    } else if (window.myGlobe.trackingMode === "central") {
      const offset = new THREE.Vector3(0, 0, 2);
      const desiredPos = centralSphere.position.clone().add(offset);
      camera.position.lerp(desiredPos, 0.1);
      controls.target.copy(centralSphere.position);
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

window.addEventListener('load', initGlobe);
