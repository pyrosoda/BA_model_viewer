const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);
const loader = new THREE.TextureLoader();
loader.load('https://pyrosoda.github.io/BA_model_viewer/Background.png', function(texture) {
    scene.background = texture; // 씬의 배경을 텍스처로 설정
});
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
