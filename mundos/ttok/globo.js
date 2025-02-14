(function () {
  // Obtém o canvas; se não existir, encerra
  const canvas = document.getElementById('globeCanvas');
  if (!canvas) {
    console.error("Canvas 'globeCanvas' não encontrado!");
    return;
  }

  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 7);

  // Renderizador
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);

  // OrbitControls
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Texturas
  const textureLoader = new THREE.TextureLoader();

  // --- Globo Central (maior) ---
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('mapatoktok.png'),
  });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true;
  centralSphere.receiveShadow = true;
  scene.add(centralSphere);

  // --- Globo Orbitante (menor) ---
  const orbitRadius = 3; // distância do centro
  const orbitSphereRadius = 0.1; // 1/10 do tamanho do central
  const orbitGeometry = new THREE.SphereGeometry(orbitSphereRadius, 64, 64);
  const orbitMaterial = new THREE.MeshStandardMaterial({
    map: textureLoader.load('mapattok.png'),
  });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true;
  orbitSphere.receiveShadow = true;
  // Posição inicial
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // --- Iluminação ---
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // --- Animação ---
  let orbitAngle = 0;
  const orbitSpeed = -0.5; // radianos por segundo
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();

    // Rotaciona levemente o globo central
    centralSphere.rotation.y += 0.003;

    // Atualiza a posição do globo orbitante (movimento circular no plano XZ)
    orbitAngle += orbitSpeed * delta;
    orbitSphere.position.x =
      centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
    orbitSphere.position.z =
      centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Ajuste de tamanho ao redimensionar a janela
  window.addEventListener('resize', () => {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  });

  // Expondo variáveis necessárias para a função de foco
  window.myGlobe = {
    camera: camera,
    controls: controls,
    orbitSphere: orbitSphere,
    centralSphere: centralSphere,
  };
})();
