$(document).ready(function () {

    // --- GSAP Init ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero Animations
    const tl = gsap.timeline();

    tl.from('.hero-subtitle', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        delay: 0.2
    })
        .from('.hero-title', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        }, "-=0.4")
        .from('.btn-group', {
            y: 20,
            opacity: 0,
            duration: 0.8
        }, "-=0.6");

    // Scroll Animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            y: 30,
            opacity: 0,
            duration: 1
        });
    });

    gsap.utils.toArray('.glass-panel, .card').forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.2
        });
    });

    // --- Mobile Nav ---
    $('.menu-btn').click(function () {
        $('.nav-links').toggleClass('active');
        const icon = $(this).find('i');
        if ($('.nav-links').hasClass('active')) {
            icon.removeClass('fa-bars').addClass('fa-times');
            gsap.fromTo('.nav-links a',
                { x: -50, opacity: 0 },
                { x: 0, opacity: 1, stagger: 0.1, duration: 0.4 }
            );
        } else {
            icon.removeClass('fa-times').addClass('fa-bars');
        }
    });

    // Close menu when clicking a link
    $('.nav-links a').click(function () {
        if ($(window).width() <= 900) {
            $('.nav-links').removeClass('active');
            $('.menu-btn i').removeClass('fa-times').addClass('fa-bars');
        }
    });

    // --- Resume Tabs ---
    $('.tab-btn').click(function () {
        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        const target = $(this).data('target');
        $('.resume-content').hide();
        $(target).fadeIn(400);

        // Re-trigger animation for content
        gsap.fromTo(target + ' .timeline-item, ' + target + ' .skill-card',
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 }
        );
    });

    // --- Particle Background System ---
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2;
                this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, ' : 'rgba(188, 19, 254, ';
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;
            }

            draw() {
                ctx.fillStyle = this.color + this.alpha + ')';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Create initial particles
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }

        // Connect particles
        function connect() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 100) {
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - dist / 1000})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(p => {
                p.update();
                p.draw();
            });

            connect();
            requestAnimationFrame(animate);
        }

        animate();
    }
});
