function initGlobe() {
  // Obtém o canvas e define suas dimensões
  var canvas = document.getElementById('globeCanvas');
  if (!canvas) {
    console.error("Canvas 'globeCanvas' não encontrado!");
    return;
  }
  var width = canvas.clientWidth;
  var height = canvas.clientHeight;

  // Cria a cena
  var scene = new THREE.Scene();

  // Configura a câmera
  var camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.set(0, 0, 7);

  // Cria o renderizador e define o tamanho
  var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.setSize(width, height);

  // Configura o OrbitControls (usando o canvas como elemento de evento)
  var controls = new THREE.OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  // Carrega as texturas
  var textureLoader = new THREE.TextureLoader();

  // --- Globo Central (maior) ---
  var centralGeometry = new THREE.SphereGeometry(1, 64, 64);
  var centralTexture = textureLoader.load('mapatoktok.png');
  var centralMaterial = new THREE.MeshStandardMaterial({ map: centralTexture });
  var centralSphere = new THREE.Mesh(centralGeometry, centralMaterial);
  centralSphere.castShadow = true;
  centralSphere.receiveShadow = true;
  scene.add(centralSphere);

  // --- Globo Orbitante (menor) ---
  var orbitRadius = 3;          // distância do centro
  var orbitSphereRadius = 0.1;    // aproximadamente 1/10 do diâmetro do central
  var orbitGeometry = new THREE.SphereGeometry(orbitSphereRadius, 64, 64);
  var orbitTexture = textureLoader.load('mapattok.png');
  var orbitMaterial = new THREE.MeshStandardMaterial({ map: orbitTexture });
  var orbitSphere = new THREE.Mesh(orbitGeometry, orbitMaterial);
  orbitSphere.castShadow = true;
  orbitSphere.receiveShadow = true;
  orbitSphere.position.set(orbitRadius, 0, 0);
  scene.add(orbitSphere);

  // --- Iluminação ---
  var ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(3, 3, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Variáveis para o movimento do globo orbitante
  var orbitAngle = 0;
  var orbitSpeed = -0.5; // radianos por segundo
  var clock = new THREE.Clock();

  // Função de animação
  function animate() {
    requestAnimationFrame(animate);
    var delta = clock.getDelta();

    // Rotação lenta do globo central
    centralSphere.rotation.y += 0.003;

    // Atualiza a posição do globo orbitante (movimento circular no plano XZ)
    orbitAngle += orbitSpeed * delta;
    orbitSphere.position.x = centralSphere.position.x + orbitRadius * Math.cos(orbitAngle);
    orbitSphere.position.z = centralSphere.position.z + orbitRadius * Math.sin(orbitAngle);

    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // Ajusta o tamanho do renderer e da câmera ao redimensionar a janela
  window.addEventListener('resize', function () {
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  // Expondo objetos para controle externo (como o botão de foco)
  window.myGlobe = {
    camera: camera,
    controls: controls,
    centralSphere: centralSphere,
    orbitSphere: orbitSphere,
  };
}

window.addEventListener('load', initGlobe);
