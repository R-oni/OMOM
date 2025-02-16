
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
  const texture = textureLoader.load('./imagens/mapaveleywei.webp'); // seu arquivo

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
  const cloudTexture = textureLoader.load('./imagens/nuvemveleywei.webp'); 
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
