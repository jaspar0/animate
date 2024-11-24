const totalFrames = 20;
const trailLength = 3;
const framesContainer = document.getElementById('frames-container');
let lastScrollY = window.scrollY;

// Generate frames
for (let i = 0; i < totalFrames; i++) {
    const frame = document.createElement('div');
    frame.className = 'frame';
    
    const radius = 20 + (80 * i / (totalFrames - 1));
    
    frame.innerHTML = `
        <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="${radius}" fill="#FF6B6B"/>
        </svg>
    `;
    
    framesContainer.appendChild(frame);
}

const frames = document.querySelectorAll('.frame');
const progressElement = document.querySelector('.scroll-progress');
let ticking = false;

// Keep track of total scroll progress
let accumulatedProgress = 0;

function updateAnimation() {
    const currentScrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update accumulated progress based on scroll direction
    if (currentScrollY !== lastScrollY) {
        const scrollDiff = (currentScrollY - lastScrollY) / maxScroll;
        accumulatedProgress += scrollDiff * totalFrames;
        lastScrollY = currentScrollY;
    }

    // Reset scroll position when reaching extremes
    if (currentScrollY <= 0 || currentScrollY >= maxScroll) {
        window.scrollTo(0, maxScroll / 2);
        lastScrollY = maxScroll / 2;
    }
    
    requestAnimationFrame(() => {
        // Convert accumulated progress to current frame
        const wrappedProgress = ((accumulatedProgress % totalFrames) + totalFrames) % totalFrames;
        const exactFrame = wrappedProgress;
        const currentFrame = Math.floor(wrappedProgress);
        
        frames.forEach((frame, index) => {
            // Calculate shortest distance considering wrap-around
            let distance = index - wrappedProgress;
            
            // Adjust distance to always use shortest path
            if (distance > totalFrames / 2) distance -= totalFrames;
            if (distance < -totalFrames / 2) distance += totalFrames;
            
            if (Math.abs(distance) <= trailLength) {
                let opacity;
                if (distance === 0) {
                    opacity = 1;
                } else if (distance > 0) {
                    opacity = 1 - (distance / trailLength);
                } else {
                    opacity = 1 - (Math.abs(distance) / trailLength);
                }
                frame.style.opacity = Math.max(0, opacity);
            } else {
                frame.style.opacity = 0;
            }
        });
        
        // Update progress display
        const displayFrame = ((currentFrame % totalFrames) + totalFrames) % totalFrames + 1;
        progressElement.textContent = `Frame: ${displayFrame}/${totalFrames}`;
        
        ticking = false;
    });
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        ticking = true;
        updateAnimation();
    }
}, { passive: true });

// Set initial scroll position to middle of page
window.addEventListener('load', () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo(0, maxScroll / 2);
    lastScrollY = maxScroll / 2;
    updateAnimation();
});
