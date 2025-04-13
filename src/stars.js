export function createStarfield(scene) {
    const starCount = 7000; 
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3); // x, y, z for each star

    // Randomly distribute stars in a spherical volume
    for (let i = 0; i < starCount; i++) {
        // Generate spherical coordinates
        const theta = Math.random() * 2 * Math.PI; // Angle around y-axis
        const phi = Math.acos(2 * Math.random() - 1); // Angle from z-axis
        const radius = 500 + Math.random() * 500; // Distance from origin (500-1000 units, far from planets)

        positions[i * 3]     = radius * Math.sin(phi) * Math.cos(theta); // x
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta); // y
        positions[i * 3 + 2] = radius * Math.cos(phi); // z
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
        color: 'white',
        size: 2, // Pixel size of stars
        sizeAttenuation: true, // Stars shrink with distance
    });
    const stars = new THREE.Points(geometry, material);
    scene.add(stars);
    return stars;
}
