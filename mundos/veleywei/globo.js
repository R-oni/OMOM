// Função principal para inicializar o globo
function initGlobe() {
  // Cena
  const scene = new THREE.Scene();

  // Câmera
  const camera = new THREE.PerspectiveCamera(
    60,
    1,        // Aspect ratio ajustado depois no resize
    0.1,
    1000
  );
  camera.position.z = 3;

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true 
  });
  
  // Permite sombras (se quiser projetar em um plano, por exemplo)
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Ajusta o tamanho inicial do renderer
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // (1) Geometria com resolução maior
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // (2) Carregar textura
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load('OMOM/mundos/imagens/mapaveleywei.png'); // seu arquivo

  // (3) Material que reage a luz
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
  const cloudTexture = textureLoader.load('OMOM/mundos/imagens/nuvemveleywei.png'); 
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
  // (NOVO) Criando 3 globos menores orbitando
  // =========================================

  // Criamos pivôs (ou "groups") onde cada globo menor fica preso.
  // Isso facilita girar cada pivô em vez de girar o globo em si.
  const pivot1 = new THREE.Object3D();
  const pivot2 = new THREE.Object3D();
  const pivot3 = new THREE.Object3D();
  scene.add(pivot1, pivot2, pivot3);

  // Geometria das luas (10x menor => raio=0.1)
  const miniGeo = new THREE.SphereGeometry(0.01, 32, 32);

  // Primeiro globo menor
  const miniMat1 = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const miniSphere1 = new THREE.Mesh(miniGeo, miniMat1);
  miniSphere1.position.x = 1.5; // Distância do "centro"
  pivot1.add(miniSphere1);

  // Segundo globo menor
  const miniMat2 = new THREE.MeshStandardMaterial({ color: 0x808080 });
  const miniSphere2 = new THREE.Mesh(miniGeo, miniMat2);
  miniSphere2.position.x = 2.0; 
  pivot2.add(miniSphere2);

  // Terceiro globo menor
  const miniMat3 = new THREE.MeshStandardMaterial({ color: 0x555555 });
  const miniSphere3 = new THREE.Mesh(miniGeo, miniMat3);
  miniSphere3.position.x = 2.5; 
  pivot3.add(miniSphere3);

  // (6) Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação contínua do globo principal e das nuvens
    sphere.rotation.y += 0.003;  
    cloudMesh.rotation.y += 0.0039;

    // Orbitas (rotacionando pivôs)
    pivot1.rotation.y += 0.03;
    pivot2.rotation.y += 0.015;
    pivot3.rotation.y += 0.01;

    renderer.render(scene, camera);
  }
  animate();

  // Redimensionar conforme a janela muda
  window.addEventListener('resize', resizeRenderer);
  function resizeRenderer() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

// Inicia o globo quando a página carrega
window.onload = () => {
  initGlobe();
};
