const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);
const loader = new THREE.TextureLoader();
loader.load('https://pyrosoda.github.io/BA_model_viewer/Background.png', function(texture) {
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;


    function updateBackground() {
        // 카메라의 비율에 맞춘 화면 비율 계산
        const screenAspect = window.innerWidth / window.innerHeight;
        // 이미지의 종횡비 계산
        const imgAspect = imgWidth / imgHeight;
        let planeWidth, planeHeight;

        // 창 비율에 따라 이미지 비율을 유지하면서 조정
        if (screenAspect > imgAspect) {
            // 화면이 더 넓을 때: 세로 크기를 기준으로 맞춤
            planeHeight = 10; // 세로 크기 고정
            planeWidth = planeHeight * imgAspect; // 비율에 따라 가로 크기 조정
        } else {
            // 화면이 더 높을 때: 가로 크기를 기준으로 맞춤
            planeWidth = 10; // 가로 크기 고정
            planeHeight = planeWidth / imgAspect; // 비율에 따라 세로 크기 조정
        }

        // PlaneGeometry 생성 (종횡비에 맞게 조정)
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight); // 크기를 조절할 수 있음
        if (!backgroundPlane) {
            // 처음 로드할 때 메쉬를 추가
            const material = new THREE.MeshBasicMaterial({ map: texture });
            backgroundPlane = new THREE.Mesh(geometry, material);
            backgroundPlane.position.z = -10; // 카메라 뒤쪽에 배치
            scene.add(backgroundPlane);
        } else {
            // 이후 리사이즈 시 PlaneGeometry만 업데이트
            backgroundPlane.geometry.dispose(); // 이전 지오메트리 제거
            backgroundPlane.geometry = geometry;
        }
    }
    // 초기 배경 설정
    updateBackground();

    // 창 크기 변경 시 배경 업데이트
    window.addEventListener('resize', updateBackground);
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
