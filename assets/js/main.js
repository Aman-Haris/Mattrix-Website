import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

function initLogo() {
    const canvas = document.querySelector('#logo-canvas');
    canvas.width = 300;
    canvas.height = 80;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(24, canvas.width / canvas.height, 0.1, 1000);
    camera.position.z = 3;
    camera.position.y = 0.1;
    camera.position.x = 0.15;
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(canvas.width, canvas.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // Generate environment map
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;

    // Clear any existing lights
    scene.remove(...scene.children.filter(child => child.isLight));

    // Base ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    // Main front light
    const rectLight = new THREE.RectAreaLight(0xffffff, 3.0, 15, 15);
    rectLight.position.set(0, 0, 8);
    rectLight.lookAt(0, 0, 0);
    scene.add(rectLight);

    // Dramatic side lighting
    const rightLight = new THREE.SpotLight(0xffffff, 2.0);
    rightLight.position.set(3, 2, 4);
    rightLight.angle = Math.PI / 4;
    rightLight.penumbra = 0.5;
    scene.add(rightLight);

    const leftLight = new THREE.SpotLight(0xffffff, 1.5);
    leftLight.position.set(-3, -1, 4);
    leftLight.angle = Math.PI / 4;
    leftLight.penumbra = 0.5;
    scene.add(leftLight);

    const loader = new GLTFLoader();
    loader.load(
        '/assets/images/logo 3.gltf',
        function (gltf) {
            const model = gltf.scene;
            
            model.traverse((node) => {
                if (node.isMesh) {
                    const newMaterial = new THREE.MeshPhysicalMaterial({
                        color: node.material.color || 0xffffff,
                        transparent: true,
                        opacity: 1.0,
                        metalness: 0.7,
                        roughness: 0.2,
                        envMapIntensity: 1.5,
                        clearcoat: 0.5,
                        clearcoatRoughness: 0.2,
                        reflectivity: 1.0,
                        ior: 1.5,
                        emissive: node.material.color || 0xffffff,
                        emissiveIntensity: 0.2
                    });
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material = newMaterial;
                }
            });

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const scale = 5 / size.x;
            model.scale.set(scale, scale, scale);
            model.position.set(
                -center.x * scale,
                -center.y * scale - 0.1,
                0
            );

            scene.add(model);
            
            function animate() {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            }
            animate();
        },
        undefined,
        function (error) {
            console.error('An error occurred loading the GLTF model:', error);
        }
    );
}

// Document ready handler
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the 3D logo
    initLogo();

    // Cards hover effect
    const cards = document.querySelectorAll('.card');
    const cardsContainer = document.querySelector('.cards-container');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform += ` rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = card.style.transform.split('rotateX')[0];
        });
    });

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when a link is clicked
    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
});