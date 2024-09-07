import * as THREE from 'three';
import { FBXLoader } from 'FBXLoader';

const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87CEEB);
const loader = new THREE.TextureLoader();
let backgroundPlane;

loader.load('https://pyrosoda.github.io/BA_model_viewer/Background1.png', function(texture) {
    const imgWidth = texture.image.width;
    const imgHeight = texture.image.height;


    function updateBackground() {
        // 카메라의 비율에 맞춘 화면 비율 계산
        const screenAspect = window.innerWidth / window.innerHeight;
        // 이미지의 종횡비 계산
        const imgAspect = imgWidth / imgHeight;
        let planeWidth, planeHeight;

        // 이미지 비율에 맞춰 Plane 크기를 설정 (화면에 꽉 차도록)
        if (screenAspect > imgAspect) {
            // 화면이 더 넓을 때: 세로 크기를 고정하고 가로 크기를 맞춤
            planeHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
            planeWidth = planeHeight * imgAspect;
        } else {
            // 화면이 더 높을 때: 가로 크기를 고정하고 세로 크기를 맞춤
            planeWidth = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
            planeHeight = planeWidth / imgAspect;
        }

        // PlaneGeometry 생성 (배경으로 사용할 평면)
        const geometry = new THREE.PlaneGeometry(planeWidth * 1.5, planeHeight * 1.5);

        if (!backgroundPlane) {
            // 처음 로드할 때 메쉬를 추가
            const material = new THREE.MeshBasicMaterial({ map: texture });
            backgroundPlane = new THREE.Mesh(geometry, material);
            backgroundPlane.position.z = -camera.position.z; // 카메라 바로 뒤에 배치
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

//light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 방향광
directionalLight.position.set(1, 2, 1).normalize();
scene.add(directionalLight);

// TextureLoader

const textureLoader = new THREE.TextureLoader();

let mixer; // AnimationMixer 변수 선언

const clock = new THREE.Clock(); // 시간 경과를 계산하는 Clock

// FBXLoader로 모델 로드
const fbxLoader = new FBXLoader();
fbxLoader.load('https://pyrosoda.github.io/BA_model_viewer/Izuna_Original_Mesh.fbx', function(object) {
    if (object.animations.length > 0) {
        console.log('애니메이션 클립 목록:');
        object.animations.forEach((clip, index) => {
            console.log(`애니메이션 ${index + 1}: ${clip.name}`);
        });
    } else {
        console.log('애니메이션 클립이 없습니다.');
    }
    object.scale.set(1, 1, 1); // 모델 크기 조정
    const texture = textureLoader.load('https://pyrosoda.github.io/BA_model_viewer/Izuna_Original_Body.png');
    object.traverse(function(child) {
        if (child.isMesh) {
            child.material.needsUpdate = true; // 재질 업데이트
        }
    });
    object.rotation.x = Math.PI * 3 / 2; // 270도
    scene.add(object);
    console.log('FBX 모델이 로드되었습니다.');
    
    // AnimationMixer 생성 및 클립 재생
    
    const selectedClip = object.animations[3]; // 선택한 애니메이션 클립
    console.log(`재생할 애니메이션: ${selectedClip.name}`);
    mixer = new THREE.AnimationMixer(object);
    const action = mixer.clipAction(selectedClip);
     action.play(); // 애니메이션 재생
}, undefined, function(error) {
    console.error('FBX 로드 실패:', error);
});

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta(); // 시간 경과 계산
        if (mixer) {
            mixer.update(delta); // 애니메이션 업데이트
        }
    
    renderer.render(scene, camera);
}

animate();

// 창 크기가 변경될 때 렌더러와 카메라 업데이트
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
