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
  camera.position.set(0, 0, 4);

  // Cria o renderizador
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(width, height);

  // Configura o OrbitControls
  const controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // --- Iluminação (adicionando antes para garantir que a cena seja visível) ---
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
  
  // Globo Central e Orbitante (temporários com cores sólidas)
  const centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  const centralMaterial = new THREE.MeshStandardMaterial({ color: 0x1a75ff });
  const centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true;
  centralSphere.receiveShadow = true;
  scene.add(centralSphere);

  const orbitRadius = 3;
  const orbitSphereRadius = 0.1;
  const orbitGeometry = new THREE.SphereGeometry(orbitSphereRadius, 64, 64);
  const orbitMaterial = new THREE.MeshStandardMaterial({ color: 0xff4d4d });
  const orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true;
  orbitSphere.receiveShadow = true;
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // Variável para definir o modo de tracking:
  // "none" = nenhum tracking, "orbit" = seguir globo orbitante, "central" = seguir globo central
  window.myGlobe = {
    camera: camera,
    controls: controls,
    centralSphere: centralSphere,
    orbitSphere: orbitSphere,
    trackingMode: "none" // modo inicial
  };
  
  // Inicia a animação imediatamente com os objetos temporários
  startAnimation();
  
  // Carrega as texturas posteriormente
  const textureLoader = new THREE.TextureLoader();
  
  // Carrega a textura do globo central
  textureLoader.load('mapatoktok.png', function(centralTexture) {
    centralSphere.material.map = centralTexture;
    centralSphere.material.needsUpdate = true;
  }, undefined, function(err) {
    console.error("Erro ao carregar mapatoktok.png:", err);
  });
  
  // Carrega a textura do globo orbitante
  textureLoader.load('mapattok.png', function(orbitTexture) {
    orbitSphere.material.map = orbitTexture;
    orbitSphere.material.needsUpdate = true;
  }, undefined, function(err) {
    console.error("Erro ao carregar mapattok.png:", err);
  });

  function startAnimation() {
    function animate() {
      requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Rotação lenta do globo central
      centralSphere.rotation.y += 0.003;

      // Movimento circular do globo orbitante (no plano XZ)
      orbitAngle += orbitSpeed * delta;
      orbitSphere.position.x = centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
      orbitSphere.position.z = centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

      // Atualiza a câmera de acordo com o modo de tracking
      if (window.myGlobe.trackingMode === "orbit") {
        // Para o globo orbitante, usamos um offset menor para mais zoom (ex.: 0.6 unidades)
        const offset = new THREE.Vector3(0, 0, 0.6);
        const desiredPos = orbitSphere.position.clone().add(offset);
        camera.position.lerp(desiredPos, 0.1);
        controls.target.copy(orbitSphere.position);
      } else if (window.myGlobe.trackingMode === "central") {
        // Para o globo central, usamos um offset maior (ex.: 2 unidades)
        const offset = new THREE.Vector3(0, 0, 2);
        const desiredPos = centralSphere.position.clone().add(offset);
        camera.position.lerp(desiredPos, 0.1);
        controls.target.copy(centralSphere.position);
      }

      controls.update();
      renderer.render(scene, camera);
    }
    animate();
  }

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
