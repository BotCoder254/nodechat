// Initialize GSAP
gsap.registerPlugin(ScrollTrigger, TextPlugin);

// Hero section animations
const heroTimeline = gsap.timeline({ defaults: { duration: 1, ease: 'power3.out' } });

heroTimeline
    .from('.nav-item', {
        y: -50,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8
    })
    .from('#hero-text h1', {
        y: 50,
        opacity: 0,
        duration: 1.2
    }, '-=0.5')
    .from('#hero-text p', {
        y: 30,
        opacity: 0,
        duration: 1
    }, '-=0.8')
    .from('#hero-text .cta-buttons', {
        y: 30,
        opacity: 0,
        duration: 0.8
    }, '-=0.6')
    .from('#hero-image', {
        x: 100,
        opacity: 0,
        duration: 1.2,
        rotate: 5
    }, '-=1');

// Floating animation for background elements
gsap.to('.floating-circle', {
    y: 'random(-20, 20)',
    x: 'random(-20, 20)',
    duration: 'random(2, 4)',
    repeat: -1,
    yoyo: true,
    ease: 'none',
    stagger: {
        amount: 1,
        from: 'random'
    }
});

// Feature cards animation
gsap.from('.feature-card', {
    scrollTrigger: {
        trigger: '#features',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
    },
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'back.out(1.7)'
});

// Statistics counter animation
const stats = document.querySelectorAll('.stat-number');
stats.forEach(stat => {
    const target = parseInt(stat.getAttribute('data-target'));
    gsap.to(stat, {
        scrollTrigger: {
            trigger: stat,
            start: 'top center+=100'
        },
        innerHTML: target,
        duration: 2,
        snap: { innerHTML: 1 },
        ease: 'power1.inOut'
    });
});

// Testimonial cards animation
gsap.from('.testimonial-card', {
    scrollTrigger: {
        trigger: '#testimonials',
        start: 'top center+=100'
    },
    y: 40,
    opacity: 0,
    duration: 0.6,
    stagger: 0.15,
    ease: 'power2.out'
});

// CTA section animation
gsap.from('#cta-section', {
    scrollTrigger: {
        trigger: '#cta-section',
        start: 'top center+=100'
    },
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
});

// Text reveal animation for headings
document.querySelectorAll('.section-heading').forEach(heading => {
    gsap.from(heading, {
        scrollTrigger: {
            trigger: heading,
            start: 'top center+=100'
        },
        duration: 1,
        opacity: 0,
        y: 30,
        ease: 'power2.out'
    });
});

// Parallax effect for background elements
document.querySelectorAll('.parallax').forEach(element => {
    gsap.to(element, {
        scrollTrigger: {
            trigger: element,
            scrub: true
        },
        y: (i, target) => -ScrollTrigger.maxScroll(window) * target.dataset.speed,
        ease: 'none'
    });
}); 