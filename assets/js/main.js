import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function initLogo() {
    const canvas = document.querySelector('#logo-canvas');
    canvas.width = 280;
    canvas.height = 80;

    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(28, canvas.width / canvas.height, 0.1, 1000);
    camera.position.z = 1.5;
    camera.position.y = 0.2;
    camera.position.x = 0.1;
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
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    // Clear any existing lights
    scene.remove(...scene.children.filter(child => child.isLight));

    // Stronger ambient light for base uniform illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
    scene.add(ambientLight);

    // Main front light
    const frontLight = new THREE.DirectionalLight(0xffffff, 2.5);
    frontLight.position.set(0, 0, 3);
    scene.add(frontLight);

    // Balanced side lights for uniform coverage
    const leftLight = new THREE.DirectionalLight(0xffffff, 1.5);
    leftLight.position.set(-2, 0, 2);
    scene.add(leftLight);

    const rightLight = new THREE.DirectionalLight(0xffffff, 1.5);
    rightLight.position.set(2, 0, 2);
    scene.add(rightLight);

    // Soft top light
    const topLight = new THREE.DirectionalLight(0xffffff, 1.0);
    topLight.position.set(0, 2, 1);
    scene.add(topLight);

    const loader = new GLTFLoader();
    loader.load(
        '/assets/images/logo 3.gltf',
        function (gltf) {
            const model = gltf.scene;
            
            model.traverse((node) => {
                if (node.isMesh) {
                    const newMaterial = new THREE.MeshStandardMaterial({
                        color: node.material.color || 0xffffff,
                        transparent: true,
                        opacity: 1.0,
                        metalness: 0.25,
                        roughness: 0.15,
                        envMapIntensity: 2.0,
                        emissive: node.material.color || 0xffffff,
                        emissiveIntensity: 0.25
                    });
                    node.castShadow = true;
                    node.receiveShadow = true;
                    node.material = newMaterial;
                }
            });

            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            const scale = 3 / size.x;
            model.scale.set(scale, scale, scale);
            model.position.set(-center.x * scale, -center.y * scale, 0);

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