(function () {
    "use strict";

    // Home has its own loader and hero animation system.
    if (document.querySelector("#page-loader")) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.body.classList.add("site-motion-page");

    const progress = document.createElement("div");
    progress.className = "site-scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.appendChild(progress);

    const revealCandidates = [
        ...document.querySelectorAll(".fade-up"),
        ...document.querySelectorAll("main > *, body > section, body > footer, body > .max-w-5xl, body > .relative.fade-up")
    ];
    const revealElements = [...new Set(revealCandidates)];

    revealElements.forEach((element, index) => {
        element.classList.add("site-reveal");
        element.style.setProperty("--site-reveal-delay", `${Math.min(index * 75, 450)}ms`);
    });

    document.querySelectorAll(".grid").forEach((grid) => {
        Array.from(grid.children).forEach((card, index) => {
            card.classList.add("site-reveal", "site-card");
            card.style.setProperty("--site-reveal-delay", `${index * 100}ms`);
        });
    });

    document.querySelectorAll("main form, main .glass, .max-w-5xl > div.mt-10").forEach((card) => {
        card.classList.add("site-card");
    });

    document.querySelectorAll("h1, h2").forEach((heading) => {
        heading.classList.add("site-section-heading");
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("site-visible", "visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealElements.forEach((element) => {
        if (reducedMotion) {
            element.classList.add("site-visible", "visible");
        } else {
            observer.observe(element);
        }
    });

    document.querySelectorAll("h1, h2").forEach((heading) => {
        if (reducedMotion) heading.classList.add("site-visible");
        else observer.observe(heading);
    });

    const updateProgress = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    if (!reducedMotion) {
        document.querySelectorAll(".site-card").forEach((card) => {
            card.addEventListener("pointermove", (event) => {
                const bounds = card.getBoundingClientRect();
                const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3.5;
                const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3.5;
                card.style.setProperty("--site-rotate-x", `${rotateX}deg`);
                card.style.setProperty("--site-rotate-y", `${rotateY}deg`);
            });
            card.addEventListener("pointerleave", () => {
                card.style.setProperty("--site-rotate-x", "0deg");
                card.style.setProperty("--site-rotate-y", "0deg");
            });
        });

        const glow = document.createElement("div");
        glow.className = "site-cursor-glow";
        glow.setAttribute("aria-hidden", "true");
        document.body.appendChild(glow);

        document.addEventListener("pointermove", (event) => {
            if (event.pointerType === "touch") return;
            glow.style.opacity = "1";
            glow.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
        });
    }
}());
