const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);
const loader = new THREE.TextureLoader();
loader.load('https://pyrosoda.github.io/BA_model_viewer/Background.png', function(texture) {
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;

    // 이미지의 종횡비 계산
    const imgAspect = imgWidth / imgHeight;

    // 카메라의 비율에 맞춘 화면 비율 계산
    const screenAspect = window.innerWidth / window.innerHeight;

    let planeWidth, planeHeight;
    // 화면 비율에 맞게 이미지의 비율을 고정
    if (screenAspect > imgAspect) {
        planeHeight = 1;
        planeWidth = screenAspect / imgAspect;
    } else {
        planeWidth = 1;
        planeHeight = imgAspect / screenAspect;
    }
    // PlaneGeometry 생성 (종횡비에 맞게 조정)
    const geometry = new THREE.PlaneGeometry(planeWidth * 10, planeHeight * 10); // 크기를 조절할 수 있음
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const backgroundPlane = new THREE.Mesh(geometry, material);
    // 배경을 카메라 뒤로 배치
    backgroundPlane.position.z = -10;
    scene.add(backgroundPlane);
});
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);



function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();

// 창 크기가 변경될 때 렌더러와 카메라 업데이트
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
