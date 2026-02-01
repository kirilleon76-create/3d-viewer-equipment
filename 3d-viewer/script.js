// Элементы
const intro = document.getElementById('intro');
const viewerContainer = document.getElementById('viewer-container');
const fullscreenBtn = document.getElementById('fullscreen');
const resetBtn = document.getElementById('reset');

// Three.js сцена
let scene, camera, renderer, controls, model;

initThreeJS();
showIntro();

// 1. Приветственный экран
function showIntro() {
  setTimeout(() => {
    intro.style.transition = 'opacity 1s ease-out';
    intro.style.opacity = '0';
    setTimeout(() => {
      intro.style.display = 'none';
      viewerContainer.style.display = 'block';
      animate();
    }, 1000);
  }, 3000); // 3 секунды логотип
}

// 2. Инициализация Three.js
function initThreeJS() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x222222);

  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 1, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  viewerContainer.appendChild(renderer.domElement);

  // Освещение
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Управление
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Загрузка модели
  const loader = new THREE.GLTFLoader();
  loader.load('model.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(0.01, 0.01, 0.01); // Подстройте под вашу модель!
    model.position.y = -0.5; // Центрирование по высоте
    scene.add(model);
  }, undefined, (error) => console.error('Ошибка загрузки модели:', error));

  // События
  window.addEventListener('resize', onWindowResize);
  fullscreenBtn.addEventListener('click', toggleFullscreen);
  resetBtn.addEventListener('click', () => controls.reset());
}

// 3. Анимация
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// 4. Полноэкранный режим
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
