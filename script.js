// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Throttle function for better performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Header background change on scroll & Cube scaling effect
window.addEventListener('scroll', throttle(() => {
    const header = document.querySelector('.header');
    const cubeContainer = document.querySelector('.cube-container');
    const scrollY = window.scrollY;
    
    // Header background change
    if (scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
    }
    
        // Cube scaling effect
    if (cubeContainer) {
        const shaderDemo = document.querySelector('.shader-demo');
        
        // 스크롤 진행도 계산 (0 ~ 1)
        const maxScroll = 800; // 최대 스크롤 거리 (조금 더 빠르게)
        const scrollProgress = Math.min(scrollY / maxScroll, 1);
        
        // 이징 함수 적용 (부드러운 가속)
        const easeOutQuart = 1 - Math.pow(1 - scrollProgress, 4);
        
        // 스케일 계산 (1에서 시작해서 최대 3배까지)
        const minScale = 1;
        const maxScale = 3;
        const scale = minScale + (maxScale - minScale) * easeOutQuart;
        
        // 회전 속도도 스크롤에 따라 변화 (최대 2.5배속까지)
        const baseSpeed = 1;
        const maxSpeedMultiplier = 2.5;
        const rotationSpeed = Math.min(baseSpeed + scrollProgress * 2, maxSpeedMultiplier);
        
        // 스타일 적용 - shader-demo에 스케일 적용, cube-container는 회전만
        if (shaderDemo) {
            shaderDemo.style.transform = `scale(${scale})`;
            shaderDemo.style.opacity = '1'; // 항상 완전히 보임
            shaderDemo.style.transition = 'transform 0.1s ease-out';
        }
        cubeContainer.style.animationDuration = `${20 / rotationSpeed}s`;
        
        // z-index는 건드리지 않음 - 큐브가 항상 보이도록
    }
}, 16)); // 60fps에 맞춰 16ms throttle

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all toc items for animation
document.querySelectorAll('.toc-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.5s ease';
});

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here
    console.log('Unity Shader Programming Guide loaded successfully!');
}); 