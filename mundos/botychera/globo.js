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
  camera.position.z = 4; // Zoom inicial

  // Renderizador
  const canvas = document.getElementById('globeCanvas');
  // Oculta o canvas até o carregamento completo
  canvas.style.visibility = "hidden";
  const renderer = new THREE.WebGLRenderer({ 
    canvas, 
    antialias: true 
  });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  resizeRenderer();

  // Controles de órbita
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // (1) Geometria do globo principal
  const geometry = new THREE.SphereGeometry(1, 64, 64);

  // (2) Carregar textura do planeta
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
  const texture = textureLoader.load('mapabotychera.png', checkLoaded); // seu arquivo
  const material = new THREE.MeshStandardMaterial({ map: texture });

  // (3) Mesh do globo principal
  const sphere = new THREE.Mesh(geometry, material);
  sphere.castShadow = true;  
  sphere.receiveShadow = true; 
  scene.add(sphere);

  // Adicionando a camada de nuvem
  const cloudGeometry = new THREE.SphereGeometry(1.01, 64, 64); 
  const cloudTexture = textureLoader.load('mapabotychera.png', checkLoaded); 
  const cloudMaterial = new THREE.MeshPhongMaterial({
    map: cloudTexture,
    transparent: true,  
    opacity: 1,        
    depthWrite: false  
  });
  const cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
  scene.add(cloudMesh);

  // Inclinação para melhorar a visualização do anel
  sphere.rotation.x = Math.PI / 8; // ~30° de inclinação
  cloudMesh.rotation.x = Math.PI / 8; // Acompanha a inclinação

  // (4) Luz ambiente + direcional
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // =========================================
  // Criando um anel de pequenas esferas orbitando o globo
  // =========================================
  const ringGroup = new THREE.Group();
  const numRingSpheres = 1024;   // Número de esferas no anel
  const rInner = 1.8;           // Raio interno do anel
  const rOuter = 1.9;           // Raio externo do anel
  const ringSphereGeo = new THREE.SphereGeometry(0.005, 4, 4); // Esferas menores
  const ringSphereMat = new THREE.MeshStandardMaterial({ color: 0xF0F0F0 }); // Quase branco

  for (let i = 0; i < numRingSpheres; i++) {
    // Distribuição aleatória no ângulo (0 a 2π)
    const angle = Math.random() * Math.PI * 2;
    // Distribuição uniforme na área do anel
    const radius = Math.sqrt(Math.random() * (rOuter * rOuter - rInner * rInner) + rInner * rInner);
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const sphereMesh = new THREE.Mesh(ringSphereGeo, ringSphereMat);
    sphereMesh.position.set(x, 0, z); // No plano XZ
    ringGroup.add(sphereMesh);
  }

  // Inclina o anel para seguir o mesmo eixo do globo
  ringGroup.rotation.x = Math.PI / 6;

  scene.add(ringGroup);



  // =========================================
  // Criando 1 globo orbitando
  // =========================================

  const pivot1 = new THREE.Object3D();

  scene.add(pivot1);

  const miniGeo = new THREE.SphereGeometry(0.1, 32, 32);

  const miniMat1 = new THREE.MeshStandardMaterial({ color: 0x654321 });
  const miniSphere1 = new THREE.Mesh(miniGeo, miniMat1);
  miniSphere1.position.x = 4;
  pivot1.add(miniSphere1);

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

  // (5) Função de animação
  function animate() {
    requestAnimationFrame(animate);

    // Rotação lenta do globo principal e das nuvens
    sphere.rotation.y += 0.003;  
    cloudMesh.rotation.y += 0.0039;

    // Rotaciona o anel para criar o efeito de órbita
    ringGroup.rotation.y += 0.005;


    // Rotação dos pivôs (orbitas)
    pivot1.rotation.y += 0.02;

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Redimensiona conforme a janela muda
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
