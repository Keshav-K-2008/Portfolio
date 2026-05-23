// EmailJS Configuration - Update your Template ID here!
const EMAILJS_CONFIG = {
    PUBLIC_KEY: "ZfKhksj5il-dxEdzm",
    SERVICE_ID: "service_gxgqw3l",
    TEMPLATE_ID: "template_a0075bl" // Replace this with your Template ID from EmailJS (e.g. template_123xyz)
};

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileMenu();
    loadProjects();
    initCertificatesCarousel();
    initContactForm();
});

function initTheme() {
    const themeToggle = document.getElementById("themeToggle");
    const icon = themeToggle.querySelector("i");
    const savedTheme = localStorage.getItem("portfolio-theme");
    
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("dark-theme");
        icon.className = "fas fa-sun";
    }

    themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        const isDark = document.body.classList.contains("dark-theme");
        icon.className = isDark ? "fas fa-sun" : "fas fa-moon";
        localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
    });
}

function initMobileMenu() {
    const menuBtn = document.getElementById("menuBtn");
    const navLinks = document.getElementById("navLinks");
    const icon = menuBtn.querySelector("i");

    menuBtn.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        icon.className = navLinks.classList.contains("active") ? "fas fa-times" : "fas fa-bars";
    });

    document.querySelectorAll(".nav-item").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            icon.className = "fas fa-bars";
        });
    });
}

const fallbackProjects = [
  {
    "title": "CVortex",
    "ecosystem": "ai",
    "description": "An AI-powered resume analysis engine constructed using machine learning pipelines and NLP packages. Delivered real-time automated structural adjustment critiques to 10,000+ engineers, expanding end-user tracking optimization success marks by 40%.",
    "tags": ["Flask", "FastAPI", "NLP Libraries", "Python", "Machine Learning"],
    "github": "https://github.com/Keshav-K-2008",
    "live": "https://github.com/Keshav-K-2008",
    "image": "assets/cvortex.png"
  },
  {
    "title": "Digital Death Locker",
    "ecosystem": "fullstack",
    "description": "A high-security distribution platform built to house and systematically transition digital parameters. Encrypted data privacy layouts and access boundaries yielded 95% reliable architectural confirmation results.",
    "tags": ["MongoDB", "Express.js", "React.js", "Node.js"],
    "github": "https://github.com/Keshav-K-2008",
    "live": "https://github.com/Keshav-K-2008",
    "image": "assets/death_locker.png"
  }
];

async function loadProjects() {
    const grid = document.getElementById("projectsGrid");
    try {
        const response = await fetch("projects.json");
        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }
        const data = await response.json();
        renderProjectCards(data, grid);
        setupFilterLogic(data, grid);
    } catch (err) {
        console.warn("Using fallback local project data store due to CORS or load error:", err);
        renderProjectCards(fallbackProjects, grid);
        setupFilterLogic(fallbackProjects, grid);
    }
}

function renderProjectCards(projects, targetContainer) {
    targetContainer.innerHTML = projects.map(proj => `
        <div class="project-card">
            ${proj.image ? `
            <a href="${proj.live}" target="_blank" class="project-image-link">
                <div class="project-image-container">
                    <img src="${proj.image}" alt="${proj.title}" class="project-image">
                </div>
            </a>
            ` : ''}
            <div class="project-info">
                <h3>${proj.title}</h3>
                <p>${proj.description}</p>
                <div class="project-tags">
                    ${proj.tags.map(t => `<span>${t}</span>`).join("")}
                </div>
                <div class="project-links">
                    <a href="${proj.github}" target="_blank"><i class="fab fa-github"></i> Source</a>
                    <a href="${proj.live}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
                </div>
            </div>
        </div>
    `).join("");
}

function setupFilterLogic(allProjects, targetGrid) {
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            filterBtns.forEach(b => b.classList.remove("active"));
            e.target.classList.add("active");
            
            const selection = e.target.getAttribute("data-filter");
            if (selection === "all") {
                renderProjectCards(allProjects, targetGrid);
            } else {
                const filtered = allProjects.filter(p => p.ecosystem === selection);
                renderProjectCards(filtered, targetGrid);
            }
        });
    });
}

function initCertificatesCarousel() {
    const prevBtn = document.querySelector(".prev-btn");
    const nextBtn = document.querySelector(".next-btn");
    const slides = document.querySelectorAll(".cert-carousel .slide");
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove("active"));
        slides[index].classList.add("active");
    }

    if (prevBtn && nextBtn && slides.length > 0) {
        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex - 1 + slides.length) % slides.length;
            showSlide(currentIndex);
        });

        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        });
    }
}

function initContactForm() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    // Initialize EmailJS with Public Key
    if (typeof emailjs !== "undefined") {
        emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nameInput = form.querySelector("input[type='text']");
        const emailInput = form.querySelector("input[type='email']");
        const messageInput = form.querySelector("textarea");
        const submitBtn = form.querySelector("button[type='submit']");

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        if (!name || !email || !message) return;

        // Show loading state
        const originalBtnText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending...";

        if (typeof emailjs !== "undefined") {
            emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, {
                from_name: name,
                from_email: email,
                message: message,
                reply_to: email
            })
            .then(() => {
                showToast("Message sent successfully!");
                form.reset();
            })
            .catch((error) => {
                console.error("EmailJS Send Failed. Error details:", error);
                showToast("Direct send failed. Opening email client...");
                triggerMailtoFallback(name, email, message);
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalBtnText;
            });
        } else {
            console.warn("EmailJS library not loaded. Falling back to email client.");
            triggerMailtoFallback(name, email, message);
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        }
    });

    function triggerMailtoFallback(name, email, message) {
        const recipient = "5keshavpvt@gmail.com";
        const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
        const body = encodeURIComponent(`Hello Keshav,\n\n${message}\n\nBest regards,\n${name}\nEmail: ${email}`);
        
        setTimeout(() => {
            window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
        }, 1200);
        form.reset();
    }
}

function showToast(message) {
    let toast = document.getElementById("toast-notification");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast-notification";
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: var(--accent-gradient);
            color: #ffffff;
            padding: 16px 24px;
            border-radius: var(--border-radius-sm);
            box-shadow: 0 10px 25px var(--accent-glow);
            font-family: var(--font-body);
            font-weight: 600;
            font-size: 0.95rem;
            z-index: 9999;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    
    toast.textContent = message;
    // Show toast
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
    }, 100);

    // Hide toast
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
    }, 4000);
}