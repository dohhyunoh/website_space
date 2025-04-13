function initCustomCursor(renderer) {
    // Create custom cursor element
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.backgroundImage = 'url("./images/cursor_rocket.png")';
    cursor.style.width = '64px';
    cursor.style.height = '64px';
    cursor.style.position = 'fixed';
    cursor.style.pointerEvents = 'none';
    cursor.style.backgroundSize = 'contain';
    cursor.style.backgroundRepeat = 'no-repeat';
    document.body.appendChild(cursor);

    // Hide the default cursor
    document.body.style.cursor = 'none';

    // Track mouse position for rotation
    let lastX = 0;
    let lastY = 0; // new variable for Y position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';

        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const angle = Math.atan2(dy, dx) * (180 / Math.PI); // compute angle in degrees
        cursor.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        lastX = e.clientX;
        lastY = e.clientY; // update lastY
    });

    // Set z-index for proper stacking order
    renderer.domElement.style.zIndex = '1'; // Canvas below cursor
    cursor.style.zIndex = '9999'; // Cursor on top
}

export { initCustomCursor };
