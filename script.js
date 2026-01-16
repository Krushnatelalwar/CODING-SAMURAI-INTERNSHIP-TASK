document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Matrix Rain Animation ---
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    // Set canvas to full screen
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const characters = '01'; // Binary rain
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
        drops[i] = 1;
    }

    function drawMatrix() {
        // Semi-transparent black to create trail effect
        // Use standard clear for corporate mode if needed, but display:none handles it
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0'; // Green text (Matrix style) or #00f3ff for Cyan
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            // Randomly switch between Cyan and Green for variety
            if (Math.random() > 0.5) ctx.fillStyle = '#00f3ff';
            else ctx.fillStyle = '#00ff9d';

            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    // Run animation loop
    setInterval(drawMatrix, 50);

    // --- 2. 3D Tilt Effect ---
    const tiltElements = document.querySelectorAll('.data-tilt');

    tiltElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position
            const xPct = x / rect.width;
            const yPct = y / rect.height;

            const xRot = (0.5 - yPct) * 10; // Max 10 deg rotation
            const yRot = (xPct - 0.5) * 10;

            el.style.transform = `perspective(1000px) rotateX(${xRot}deg) rotateY(${yRot}deg) scale(1.02)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });

    // --- 3. Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');

    themeBtn.addEventListener('click', () => {
        const body = document.body;
        if (body.getAttribute('data-theme') === 'corporate') {
            body.removeAttribute('data-theme');
            icon.classList.remove('fa-briefcase');
            icon.classList.add('fa-sun');
        } else {
            body.setAttribute('data-theme', 'corporate');
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-briefcase');
        }
    });

    // --- 4. Existing Typewriter Effect ---
    const textElement = document.getElementById('typing-text');
    const texts = ["COMPUTER ENGINEER", "WEB DEVELOPER", "PROBLEM SOLVER"];
    let count = 0;
    let index = 0;
    let currentText = "";
    let letter = "";
    let isDeleting = false;
    let typeSpeed = 100;

    (function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
            typeSpeed = 50;
        } else {
            letter = currentText.slice(0, ++index);
            typeSpeed = 100;
        }

        textElement.textContent = letter;

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    })();

    // --- 5. Intersection Observer (Fade In) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // --- 6. Smooth Scroll ---
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

    // --- 7. Contact Form Handler ---
    const contactForm = document.querySelector('.contact-form');
    // PASTE YOUR GOOGLE APPS SCRIPT URL HERE
    const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzPedh9RnUipeh5IOykdz0A933Rf9ECXLBsMyWM_tzo4sYUdsxrCodGv1OochFAldAG_A/exec";

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            // Collect Data
            const formData = {
                name: contactForm.querySelector('input[type="text"]').value,
                email: contactForm.querySelector('input[type="email"]').value,
                message: contactForm.querySelector('textarea').value
            };

            // Basic Validation
            if (GOOGLE_SCRIPT_URL === "PUT_YOUR_URL_HERE" || GOOGLE_SCRIPT_URL === "") {
                btn.innerText = "Error: Setup Required (See Guide)";
                btn.style.background = "red";
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.style.background = "";
                }, 3000);
                return;
            }

            // UI Feedback
            btn.innerText = "Sending Data...";
            btn.disabled = true;

            // Send to Google Apps Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                mode: "no-cors", // Important for Google Apps Script
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
                .then(() => {
                    // Success (no-cors mode doesn't return JSON, so we assume success if no network error)
                    btn.innerText = "Packet Sent!";
                    btn.style.background = "#00ff9d";
                    btn.style.color = "#000";
                    contactForm.reset();

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = "";
                        btn.style.color = "";
                        btn.disabled = false;
                    }, 3000);
                })
                .catch(error => {
                    console.error("Error:", error);
                    btn.innerText = "Transmission Failed";
                    btn.style.background = "red";

                    setTimeout(() => {
                        btn.innerText = originalText;
                        btn.style.background = "";
                        btn.disabled = false;
                    }, 3000);
                });
        });
    }

    console.log("%c System Online ", "background: #00f3ff; color: #000; font-size: 20px; font-weight: bold; border-radius: 4px; padding: 4px;");
});
