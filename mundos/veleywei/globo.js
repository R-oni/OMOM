// Função principal para inicializar o globo
function initGlobe() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    1,        // Aspect ratio será ajustado depois no resize
    0.1,
    1000
  );
  camera.position.z = 3; // Valor inicial; será ajustado no resize

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
  // Oculta o canvas até o carregamento completo
  canvas.style.visibility = "hidden";
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true 
  });
  
  // Ativa sombras
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Ajusta o tamanho inicial do renderer e configura a câmera conforme a orientação
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // Geometria com resolução maior
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // Carregamento das texturas
  const textureLoader = new THREE.TextureLoader();
  let texturesLoaded = 0;
  function checkLoaded() {
    texturesLoaded++;
    if (texturesLoaded === 2) {
      // Quando ambas as texturas estiverem carregadas:
      canvas.style.visibility = "visible"; // Mostra o globo
      document.dispatchEvent(new Event("globoCarregado"));
    }
  }

  // (2) Carregar textura principal do globo
  const texture = textureLoader.load('./imagens/mapaveleywei.webp', checkLoaded);

  // (3) Material que reage à luz
  const material = new THREE.MeshStandardMaterial({
    map: texture
  });

  // (4) Mesh do globo principal
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;  
  sphere.receiveShadow = true; 
  scene.add(sphere);

  // Adicionando a camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64); 
  const cloudTexture = textureLoader.load('./imagens/nuvemveleywei.webp', checkLoaded); 
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,
    opacity: 1,
    depthWrite: false
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // (5) Luz ambiente + direcional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // =========================================
  // Criando 3 globos menores orbitando
  // =========================================

  const pivot1 = new THREE.Object3D();
  const pivot2 = new THREE.Object3D();
  const pivot3 = new THREE.Object3D();
  scene.add(pivot1, pivot2, pivot3);

  const miniGeo = new THREE.SphereGeometry(0.01, 32, 32);

  const miniMat1 = new THREE.MeshStandardMaterial({ color: 0xE0E0E0 });
  const miniSphere1 = new THREE.Mesh(miniGeo, miniMat1);
  miniSphere1.position.x = 1.3;
  pivot1.add(miniSphere1);

  const miniMat2 = new THREE.MeshStandardMaterial({ color: 0xC0C0C0 });
  const miniSphere2 = new THREE.Mesh(miniGeo, miniMat2);
  miniSphere2.position.x = 2.0;
  pivot2.add(miniSphere2);

  const miniMat3 = new THREE.MeshStandardMaterial({ color: 0xA0A0A0 });
  const miniSphere3 = new THREE.Mesh(miniGeo, miniMat3);
  miniSphere3.position.x = 2.5;
  pivot3.add(miniSphere3);

  // (6) Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação contínua do globo principal e das nuvens
    sphere.rotation.y += 0.003;
    cloudMesh.rotation.y += 0.0039;

    // Rotação dos pivôs (orbitas)
    pivot1.rotation.y += 0.03;
    pivot2.rotation.y += 0.015;
    pivot3.rotation.y += 0.01;

    renderer.render(scene, camera);
  }
  animate();

  // Redimensiona o renderer e ajusta a câmera conforme a janela muda
  window.addEventListener('resize', resizeRenderer);
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    
    // Se estiver em orientação horizontal, aproxima a câmera
    if (window.matchMedia("(orientation: landscape)").matches) {
      camera.position.z = 2; // Mais próximo (planeta fica maior)
    } else {
      camera.position.z = 3; // Posição padrão para vertical
    }
    camera.updateProjectionMatrix();
  }
}

// Inicia o globo quando a página carrega
window.onload = () => {
  initGlobe();
};
