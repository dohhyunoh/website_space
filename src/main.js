// --- Basic Setup (Scene, Renderer, Camera - slightly modified camera setup) ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Store the initial 'overview' position
const overviewPosition = new THREE.Vector3(0, 5, 25); // Start slightly above and back
const overviewLookAt = new THREE.Vector3(0, 0, 0); // Look at the center initially
camera.position.copy(overviewPosition);
camera.lookAt(overviewLookAt);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add global resume PDF download button with centered positioning
const resumeBtn = document.createElement('a');
resumeBtn.href = '/resume.pdf'; // Adjust path if needed
resumeBtn.download = 'resume.pdf';
resumeBtn.textContent = 'Download Resume';
resumeBtn.style.display = 'none'; // Initially hidden
resumeBtn.style.position = 'absolute';
resumeBtn.style.bottom = '70px'; // changed positioning to bottom
resumeBtn.style.left = '50%'; // place in middle horizontally
resumeBtn.style.transform = 'translateX(-50%)'; // center the element
resumeBtn.style.padding = '10px';
resumeBtn.style.backgroundColor = '#000'; // changed from '#fff'
resumeBtn.style.color = 'green'; // changed from '#000'
document.body.appendChild(resumeBtn);

// Add global GitHub link button with centered positioning at the bottom
const githubBtn = document.createElement('a');
githubBtn.href = 'https://github.com/dohhyunoh?tab=repositories'; 
githubBtn.textContent = 'Visit GitHub';
githubBtn.style.display = 'none'; // Initially hidden
githubBtn.style.position = 'absolute';
githubBtn.style.bottom = '50px';
githubBtn.style.left = '50%'; // center horizontally
githubBtn.style.transform = 'translateX(-50%)';
githubBtn.style.padding = '10px';
githubBtn.style.backgroundColor = '#000';
githubBtn.style.color = 'green';
githubBtn.target = '_blank'; // Open in new tab
document.body.appendChild(githubBtn);

// NEW: Add global contact information element with centered positioning
const contactInfo = document.createElement('div');
contactInfo.innerHTML = "Contact: dohhyunoh@vt.edu<br/>Phone: 571-549-9184"; // replace with your info
contactInfo.style.display = 'none';
contactInfo.style.position = 'absolute';
contactInfo.style.bottom = '50px';
contactInfo.style.left = '50%';
contactInfo.style.transform = 'translateX(-50%)';
contactInfo.style.padding = '10px';
contactInfo.style.backgroundColor = '#000';
contactInfo.style.color = 'green';
document.body.appendChild(contactInfo);

// NEW: Add global profile text element with centered positioning
const profileText = document.createElement('div');
// Replace textContent with innerHTML and add extra text below the profile title
profileText.innerHTML = "click on planets for more info";
profileText.style.position = 'absolute';
profileText.style.top = '0'; // adjust vertical positioning as needed
profileText.style.left = '50%';
profileText.style.transform = 'translateX(-50%)';
profileText.style.padding = '10px';
profileText.style.color = 'white'; // color for contrast
document.body.appendChild(profileText);

import { initCustomCursor } from './cursor.js';
import { createStarfield } from './stars.js'; // Added import for starfield

// Initialize custom cursor
initCustomCursor(renderer);

const textureLoader = new THREE.TextureLoader();

// --- Store Planets for Raycasting ---
const interactivePlanets = []; // Array to hold clickable planets

function createPlanet(radius, texturePath, position, name) { // Added name parameter
    const geometry = new THREE.SphereGeometry(radius, 64, 64);
    const texture = textureLoader.load(texturePath);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshStandardMaterial({
        map: texture
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(...position);
    planet.name = name; // Assign a name for easier identification (optional)
    scene.add(planet);
    interactivePlanets.push(planet); // Add to our clickable array
    return planet;
}

// NEW: Helper function to create a text sprite (modified to accept an optional color)
function createTextSprite(message, color = 'white') {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'Bold 50px Arial';
    const metrics = context.measureText(message);
    const textWidth = metrics.width;
    canvas.width = textWidth;
    canvas.height = 50;
    context.font = 'Bold 50px Arial';
    context.fillStyle = color;
    context.fillText(message, 0, 40);
  
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
  
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(canvas.width / 100, canvas.height / 100, 1);
    return sprite;
}

// --- Create Rings Function ---
function createRings(planet, innerRadius, outerRadius, texturePath) {
    const geometry = new THREE.RingGeometry(innerRadius, outerRadius, 64); // Inner radius, outer radius, segments
    const texture = textureLoader.load(texturePath);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.rotation = Math.PI / 2; // Adjust if texture alignment is off
    texture.wrapS = THREE.RepeatWrapping; // Allow texture repeating if needed
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 1); // Example: repeat texture twice along the ring

    const material = new THREE.MeshStandardMaterial({
        map: texture,
        side: THREE.DoubleSide, // Render both sides of the ring
        transparent: true,     // Enable transparency (use a PNG with alpha)
        // opacity: 0.8,       // Optional: Adjust overall ring opacity
        // alphaTest: 0.1,     // Optional: discard pixels below a certain alpha
    });

    const ringMesh = new THREE.Mesh(geometry, material);

    // Position relative to the planet (0,0,0) as it's a child
    ringMesh.position.set(0, 0, 0);

    // Tilt the rings (rotate around the X-axis)
    ringMesh.rotation.x = Math.PI / 2.5; // Adjust tilt angle as needed

    // Add the rings as a child of the planet
    planet.add(ringMesh);

    return ringMesh; // Return if needed, though not strictly necessary here
}

// Add planets with names
const earth = createPlanet(1, '/cosmic.jpg', [0, 0, 0], 'Earth');
// NEW: Add text sprite on top of Earth and store reference
const earthText = createTextSprite("download resume", "green");
earthText.position.set(0, 1.5, 0); // Adjust vertical offset relative to Earth's center
earth.add(earthText);
earth.userData.textSprite = earthText;

// NEW: Add text sprite on top of Mars and store reference
const mars = createPlanet(1.5, '/red.jpg', [8, 7, 0], 'Mars');
const marsText = createTextSprite("github link", "green");
marsText.position.set(0, 2.0, 0); // Adjust vertical offset relative to Earth's center
mars.add(marsText);
mars.userData.textSprite = marsText;

const jupiter = createPlanet(1.8, '/dreamy.avif', [-15, -2, 0], 'Jupiter');
// NEW: Create text sprite, store reference (using white color)
const jupiterText = createTextSprite("contact info", "green");
jupiterText.position.set(0, 4.3, 0);
jupiter.add(jupiterText);
jupiter.userData.textSprite = jupiterText;

// NEW: Create text sprite for the Sun and store reference
const sun = createPlanet(2.5, '/sun_texture.jpeg', [15, -2, 0], 'Sun');
const sunText = createTextSprite("Don't click", "green");
sunText.position.set(0, 3.0, 0); // Adjust vertical offset relative to Earth's center
sun.add(sunText);
sun.userData.textSprite = sunText;

// --- Add Rings to Jupiter ---
const jupiterRadius = jupiter.geometry.parameters.radius;
// First ring - tilted one way
const ring1 = createRings(jupiter, jupiterRadius * 1.2, jupiterRadius * 1.8, '/ring_texture.jpg');
ring1.rotation.x = Math.PI / 4; // 45 degrees tilt

// Second ring - tilted the opposite way
const ring2 = createRings(jupiter, jupiterRadius * 1.2, jupiterRadius * 1.8, '/ring_texture.jpg');
ring2.rotation.x = -Math.PI / 4; // -45 degrees tilt

// --- Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Increased ambient slightly
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(10, 5, 15);
scene.add(directionalLight);

// --- Raycasting and Click Handling ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let currentTarget = null; // Track which planet is currently focused

function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates (-1 to +1)
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(interactivePlanets); // Check only planets

    // Stop any previous tweens
    TWEEN.removeAll();

    if (intersects.length > 0) {
        // Clicked on a planet
        const targetPlanet = intersects[0].object;
        currentTarget = targetPlanet; // Set the current target

        // NEW: Remove text sprite(s) from the clicked planet
        targetPlanet.children.forEach(child => {
            if (child instanceof THREE.Sprite) {
                targetPlanet.remove(child);
            }
        });

        console.log("Clicked on:", targetPlanet.name); // Log clicked planet name

        // Toggle resume download button for Earth and GitHub button for Mars
        if (targetPlanet.name === 'Earth') {
            resumeBtn.style.display = 'block';
        } else {
            resumeBtn.style.display = 'none';
        }
        if (targetPlanet.name === 'Mars') {
            githubBtn.style.display = 'block';
        } else {
            githubBtn.style.display = 'none';
        }
        // NEW: Toggle contact info for Jupiter
        if (targetPlanet.name === 'Jupiter') {
            contactInfo.style.display = 'block';
        } else {
            contactInfo.style.display = 'none';
        }
        // Handle Sun click
        if (targetPlanet.name === 'Sun') {
          // Change background to white
          scene.background = new THREE.Color(0xffffff);
          // Revert back to black after 1 second
          setTimeout(() => {
              scene.background = new THREE.Color(0x000000);
          }, 1000);
      }

        // NEW: Change profile text on planet click
        profileText.innerHTML = "click background to revert";

        // Calculate target position: slightly in front of the planet
        const planetPosition = new THREE.Vector3();
        targetPlanet.getWorldPosition(planetPosition); // Get world position of the planet

        const cameraOffset = targetPlanet.geometry.parameters.radius * 3.7; // Distance from planet surface
        const direction = new THREE.Vector3().subVectors(camera.position, planetPosition).normalize(); // Direction from planet to camera
        const targetCamPosition = new THREE.Vector3().addVectors(planetPosition, direction.multiplyScalar(cameraOffset)); // Position camera along this direction

        // Smoothly move camera position
        new TWEEN.Tween(camera.position)
            .to(targetCamPosition, 1500) // Target position, duration 1.5s
            .easing(TWEEN.Easing.Quadratic.InOut) // Smooth easing
            .start();

        // Smoothly change camera lookAt target
        // We tween a temporary object and update camera.lookAt in the animation loop
        const targetLookAt = planetPosition.clone(); // Look directly at the planet's center
        new TWEEN.Tween(cameraLookAtTarget) // Use a global variable for the lookAt target
            .to(targetLookAt, 1500)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .start();

    } else {
        // Hide both buttons/info on background click
        resumeBtn.style.display = 'none';
        githubBtn.style.display = 'none';
        contactInfo.style.display = 'none';

        // NEW: Bring back text sprites for all planets if not attached
        interactivePlanets.forEach(planet => {
            if (planet.userData.textSprite && !planet.children.includes(planet.userData.textSprite)) {
                planet.add(planet.userData.textSprite);
            }
        });

        // NEW: Revert profile text when clicking background
        profileText.innerHTML = "click on planets for more info";

        // Clicked on the background - Go back to overview
        if (currentTarget) { // Only go back if currently focused
            currentTarget = null;
            console.log("Clicked background - Returning to overview");

            // Go back to overview position
            new TWEEN.Tween(camera.position)
                .to(overviewPosition, 1500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();

            // Go back to looking at the center
            new TWEEN.Tween(cameraLookAtTarget)
                .to(overviewLookAt, 1500)
                .easing(TWEEN.Easing.Quadratic.InOut)
                .start();
        }
    }
}

// Add event listener to the renderer's canvas
renderer.domElement.addEventListener('click', onMouseClick, false);

// --- Window Resize ---
window.addEventListener('resize', () => {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;

    // Dynamically adjust FOV for smaller screens
    if (window.innerWidth < 768) { // Example: Adjust for mobile screens
        camera.fov = 90; // Increase FOV for a wider view
    } else {
        camera.fov = 75; // Default FOV for larger screens
    }
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
// --- Global variable for LookAt target (needed for tweening) ---
let cameraLookAtTarget = overviewLookAt.clone();

// --- Animation Loop ---
function animate(time) { // Pass time for TWEEN
    requestAnimationFrame(animate);

    // Rotate planets
    earth.rotation.x += 0.005;
    earth.rotation.y += 0.005;
    mars.rotation.x += 0.001;
    mars.rotation.y += 0.005;
    jupiter.rotation.x += 0.003;
    jupiter.rotation.y += 0.005;
    sun.rotation.y -= 0.005;

    // Subtle starfield movement (simulate cosmic drift)
    stars.rotation.y += 0.0001; // Slow rotation around y-axis

    // Update TWEEN animations
    TWEEN.update(time); // Pass the current time to TWEEN

    // Update camera lookAt based on the tweened target
    camera.lookAt(cameraLookAtTarget);

    renderer.render(scene, camera);
}

const stars = createStarfield(scene); // Now passing 'scene' as parameter

animate(); // Start the loop