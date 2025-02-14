function initGlobe() {
  // Obtém o canvas e define suas dimensões
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) {
    console.error("Canvas 'globeCanvas' não encontrado!");
    return;
  }
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;

  // Cria a cena
  const scene = new THREE.Scene();

  // Configura a câmera
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7);

  // Cria o renderizador
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(width, height);

  // Configura o OrbitControls
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Carrega as texturas
  const textureLoader = new THREE.TextureLoader();

  // --- Globo Central (maior) ---
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralTexture = textureLoader.load('mapatoktok.png');
  const centralMaterial = new THREE.MeshStandardMaterial({ map: centralTexture });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true;
  centralSphere.receiveShadow = true;
  scene.add(centralSphere);

  // --- Globo Orbitante (menor) ---
  const orbitRadius = 3;          // distância do centro
  const orbitSphereRadius = 0.1;    // aproximadamente 1/10 do diâmetro do central
  const orbitGeometry = new THREE.SphereGeometry(orbitSphereRadius, 64, 64);
  const orbitTexture = textureLoader.load('mapattok.png');
  const orbitMaterial = new THREE.MeshStandardMaterial({ map: orbitTexture });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true;
  orbitSphere.receiveShadow = true;
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // --- Iluminação ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Variáveis para o movimento do globo orbitante
  let orbitAngle = 0;
  const orbitSpeed = -0.5; // radianos por segundo
  const clock = new THREE.Clock();

  // Expondo objetos para controle externo – define trackingOrbit inicialmente como false
  window.myGlobe = {
    camera: camera,
    controls: controls,
    centralSphere: centralSphere,
    orbitSphere: orbitSphere,
    trackingOrbit: false
  };

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Rotaciona lentamente o globo central
    centralSphere.rotation.y += 0.003;

    // Movimento circular do globo orbitante (no plano XZ)
    orbitAngle += orbitSpeed * delta;
    orbitSphere.position.x = centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
    orbitSphere.position.z = centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

    // Se o modo de tracking estiver ativo, atualiza continuamente a câmera e o alvo
    if (window.myGlobe.trackingOrbit) {
      // Offset desejado para posicionar a câmera em relação ao globo menor
      const offset = new THREE.Vector3(0, 0, 2);
      const desiredPos = orbitSphere.position.clone().add(offset);
      // Suaviza a transição com lerp (ajuste 0.1 conforme necessário)
      camera.position.lerp(desiredPos, 0.1);
      // Atualiza o alvo dos controles para sempre apontar para o globo orbitante
      controls.target.copy(orbitSphere.position);
    }

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Atualiza o renderer e a câmera ao redimensionar a janela
  window.addEventListener('resize', () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });
}

window.addEventListener('load', initGlobe);
