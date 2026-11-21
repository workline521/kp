/* 
window.addEventListener("load", () => {
  gsap.registerPlugin(ScrollTrigger);  
});

 //  ГОРИЗОНТАЛЬНЫЙ СЛАЙДЕР
(function () {
"use strict";

// ===== НАСТРОЙКИ СКОРОСТИ =====
// Меньше число → медленнее (но не меньше 1.0)
const desktopSpeed = 1; // для экранов > 1024px
const mobileSpeed = 1; // для экранов <= 1024px
// ================================

function initSliders() {
    const wrappers = document.querySelectorAll(".h-slider-wrap");
    if (!wrappers.length) return;

    wrappers.forEach((wrap, idx) => {
    const slider = wrap.querySelector(".h-slider");
    const originalSlide = wrap.querySelector(".h-slide");
    if (!slider || !originalSlide) return;

    // Убиваем старые триггеры
    ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === wrap) st.kill();
    });

    // Очищаем клоны
    while (slider.children.length > 1) {
        slider.removeChild(slider.lastChild);
    }

    const isMobile = window.innerWidth <= 1024;
    const marginRight = isMobile ? 24 : 39;
    const speedFactor = isMobile ? mobileSpeed : desktopSpeed;

    // Начинаем с 1 клона (оригинал) и добавляем, пока не достигнем нужной длины
    let cloneCount = 1;
    let totalWidth, wrapWidth, maxScroll;

    function addClonesUntilEnough() {
        while (true) {
        // Пересчитываем ширину трека
        const slideWidth = originalSlide.offsetWidth + marginRight;
        totalWidth = slideWidth * slider.children.length;
        slider.style.width = totalWidth + "px";
        wrapWidth = wrap.offsetWidth;
        maxScroll = totalWidth - wrapWidth;

        // Нужная длина трека: высота окна * speedFactor
        const targetScroll = window.innerHeight * speedFactor;

        if (maxScroll >= targetScroll && maxScroll > 0) {
            break;
        }

        // Добавляем один клон
        const clone = originalSlide.cloneNode(true);
        slider.appendChild(clone);
        cloneCount++;
        }
    }

    // Добавляем базовый клон (оригинал уже есть)
    addClonesUntilEnough();

    // Если maxScroll всё ещё <= 0, пропускаем
    if (maxScroll <= 0) {
        console.warn(`⚠️ Слайдер ${idx} слишком короткий, пропускаем`);
        return;
    }

    gsap.killTweensOf(slider);

    // Направление: слева направо (отрицательный x к 0)
    gsap.fromTo(
        slider,
        { x: -maxScroll },
        {
        x: 0,
        ease: "none",
        scrollTrigger: {
            trigger: wrap,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true,
            refreshPriority: -10,
        },
        },
    );
    });

    ScrollTrigger.refresh();
}

  if (document.readyState === "complete") {
      initSliders();
  } else {
      window.addEventListener("load", initSliders);
  }

  let resizeTimer;
  window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
      initSliders();
      }, 300);
  });
})();

const slsSlider = new Swiper('.sls__slider', {
    slidesPerView: 1,
    spaceBetween: 10,
    loop: true,
    autoplay: {
        delay: 3000,
        disableOnInteraction: true, 
    },

    pagination: {
        el: '.sls__slider-pagination',
        clickable: true,
    },

    navigation: {
        nextEl: '.sls__slider-prev',
        prevEl: '.sls__slider-next',
    },

    keyboard: { enabled: true },
    grabCursor: true,

});

document.querySelectorAll('.sls__item').forEach((gallery) => {
    const mainEl   = gallery.querySelector('.sls__small-slider');
    const thumbsEl = gallery.querySelector('.sls__thumbs-slider');

    if (!mainEl || !thumbsEl) return;

    const thumbsSwiper = new Swiper(thumbsEl, {
        slidesPerView: "auto",
        spaceBetween: 0,
        watchSlidesProgress: true,
        slideToClickedSlide: true, 
        observer: true,
        observeParents: true,
    });

    const mainSwiper = new Swiper(mainEl, {
        slidesPerView: 1,
        spaceBetween: 0,
        thumbs: {
            swiper: thumbsSwiper,
        },
        grabCursor: true,
        keyboard: { enabled: true },
    });
});

const section = document.querySelector('.video');
const video   = section.querySelector('video');
const toggle  = section.querySelector('.video-toggle');

const VIDEO_DESKTOP = './assets/images/horizontal.mp4';
const VIDEO_MOBILE  = './assets/images/vertical.mp4';
const mq = window.matchMedia('(min-width: 1025px)');

function setVideoSrc() {
    const src = mq.matches ? VIDEO_DESKTOP : VIDEO_MOBILE;
    if (video.getAttribute('src') === src) return;

    const wasPlaying = !video.paused;
    video.src = src;
    video.load();
    if (wasPlaying) video.play().catch(() => {});
}
setVideoSrc();
mq.addEventListener('change', setVideoSrc);

let started = false;

toggle.addEventListener('click', () => {
    if (!started) {
        started = true;
        video.controls = true;              // появляются нативные контролы
        section.classList.add('is-controls'); // прячем .video-plays
        video.play().catch(() => {});
        return;
    }
    video.paused ? video.play().catch(() => {}) : video.pause();
});


// ===== ВЫПЛЫВАНИЕ ТЕКСТА С ДВИЖЕНИЕМ (через обёртку) =====
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true,
            });

            observer.unobserve(entry.target);
        });
    },
    {
        threshold: 0.1,
        rootMargin: "0px 0px -30% 0px",
    }
);

document.querySelectorAll(".msk").forEach((el) => {
    if (reduceMotion) return;

    gsap.set(el, { y: 40, opacity: 0 });
    observer.observe(el);
});

// ===== АНИМАЦИЯ КАРТИНОК (через класс .img-animated) =====
document.querySelectorAll(".img-animated").forEach((img) => {
    // Проверяем, не анимирована ли уже
    if (img.dataset.animated) return;

    // Начальное состояние уже задано через CSS, но для надёжности можно продублировать (необязательно)
    // gsap.set(img, { opacity: 0, scale: 0.92 });

    const observer = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                gsap.to(img, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true,
                onComplete: () => {
                    // Убираем класс, чтобы не мешать (опционально)
                    img.classList.remove("img-animated");
                },
            });
            img.dataset.animated = "true";
            observer.unobserve(img);
            }
        });
        },
        {
            threshold: 0.1,
            rootMargin: "0px 0px -30% 0px", // тот же отступ, что и у текстов
        },
    );

    observer.observe(img);
}); */


/* ===== app.js ===== */

// Регистрация плагина — на верхнем уровне, с проверкой, что библиотеки загружены
if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
}

document.addEventListener("DOMContentLoaded", () => {
    initHorizontalSliders();
    initSwiperSliders();
    initVideo();
    initRevealAnimations();
});

/* ============================================================
ГОРИЗОНТАЛЬНЫЙ СЛАЙДЕР (скролл-анимация)
============================================================ */
function initHorizontalSliders() {
    const wrappers = document.querySelectorAll(".h-slider-wrap");
    if (!wrappers.length) return;

    // Скорости
    const desktopSpeed = 1;
    const mobileSpeed = 1;

    function build() {
        wrappers.forEach((wrap, idx) => {
            const slider = wrap.querySelector(".h-slider");
            const originalSlide = wrap.querySelector(".h-slide");
            if (!slider || !originalSlide) return;

            // Убиваем старые триггеры именно этого контейнера
            ScrollTrigger.getAll().forEach((st) => {
                if (st.trigger === wrap) st.kill();
            });

            // Очищаем клоны, оставляя оригинал
            while (slider.children.length > 1) {
                slider.removeChild(slider.lastChild);
            }

            const isMobile = window.innerWidth <= 1024;
            const marginRight = isMobile ? 24 : 39;
            const speedFactor = isMobile ? mobileSpeed : desktopSpeed;

            let totalWidth, wrapWidth, maxScroll;

            function addClonesUntilEnough() {
                while (true) {
                    const slideWidth = originalSlide.offsetWidth + marginRight;
                    totalWidth = slideWidth * slider.children.length;
                    slider.style.width = totalWidth + "px";
                    wrapWidth = wrap.offsetWidth;
                    maxScroll = totalWidth - wrapWidth;

                    const targetScroll = window.innerHeight * speedFactor;

                    if (maxScroll >= targetScroll && maxScroll > 0) break;

                    slider.appendChild(originalSlide.cloneNode(true));
                }
            }

            addClonesUntilEnough();

            if (maxScroll <= 0) {
                console.warn(`⚠️ Слайдер ${idx} слишком короткий, пропускаем`);
                return;
            }

            gsap.killTweensOf(slider);

            gsap.fromTo(
                slider,
                { x: -maxScroll },
                {
                    x: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: wrap,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 1,
                        invalidateOnRefresh: true,
                        refreshPriority: -10,
                    },
                }
            );
        });

        ScrollTrigger.refresh();
    }

    // Первый запуск — после полной загрузки страницы (картинки влияют на ширину)
    if (document.readyState === "complete") {
        build();
    } else {
        window.addEventListener("load", build, { once: true });
    }

    // Пересборка при ресайзе
    let resizeTimer;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 300);
    });
}

/* ============================================================
   SWIPER-СЛАЙДЕРЫ
   ============================================================ */
function initSwiperSliders() {
    // Основной горизонтальный слайдер
    if (document.querySelector(".sls__slider")) {
        new Swiper(".sls__slider", {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: true,
            },
            pagination: {
                el: ".sls__slider-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".sls__slider-prev",
                prevEl: ".sls__slider-next",
            },
            keyboard: { enabled: true },
            grabCursor: true,
        });
    }

    // Пары «основной + thumbs»
    document.querySelectorAll(".sls__item").forEach((gallery) => {
        const mainEl = gallery.querySelector(".sls__small-slider");
        const thumbsEl = gallery.querySelector(".sls__thumbs-slider");
        if (!mainEl || !thumbsEl) return;

        const thumbsSwiper = new Swiper(thumbsEl, {
            slidesPerView: "auto",
            spaceBetween: 0,
            watchSlidesProgress: true,
            slideToClickedSlide: true,
            observer: true,
            observeParents: true,
        });

        new Swiper(mainEl, {
            slidesPerView: 1,
            spaceBetween: 0,
            thumbs: { swiper: thumbsSwiper },
            grabCursor: true,
            keyboard: { enabled: true },
        });
    });
}

/* ============================================================
   ВИДЕО
   ============================================================ */
function initVideo() {
    const section = document.querySelector(".video");
    const video = section?.querySelector("video");
    const toggle = section?.querySelector(".video-toggle");
    if (!section || !video || !toggle) return;

    const VIDEO_DESKTOP = "./assets/images/horizontal.mp4";
    const VIDEO_MOBILE = "./assets/images/vertical.mp4";
    const mq = window.matchMedia("(min-width: 1025px)");

    function setVideoSrc() {
        const src = mq.matches ? VIDEO_DESKTOP : VIDEO_MOBILE;
        if (video.getAttribute("src") === src) return;

        const wasPlaying = !video.paused;
        video.src = src;
        video.load();
        if (wasPlaying) video.play().catch(() => {});
    }

    setVideoSrc();
    mq.addEventListener("change", setVideoSrc);

    let started = false;

    toggle.addEventListener("click", () => {
        if (!started) {
            started = true;
            video.controls = true;
            section.classList.add("is-controls");
            video.play().catch(() => {});
            return;
        }
        video.paused ? video.play().catch(() => {}) : video.pause();
    });
}

/* ============================================================
   АНИМАЦИИ ПОЯВЛЕНИЯ (.msk — текст, .img-animated — картинки)
   ============================================================ */
function initRevealAnimations() {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Если пользователь просит уменьшить движение — показываем всё сразу
    if (reduceMotion) {
        document.querySelectorAll(".msk").forEach((el) => {
            el.style.opacity = 1;
            el.style.transform = "none";
        });
        document.querySelectorAll(".img-animated").forEach((img) => {
            img.style.opacity = 1;
            img.style.transform = "none";
            img.classList.remove("img-animated");
        });
        return;
    }

    const OBS_OPTIONS = { threshold: 0.1, rootMargin: "0px 0px -30% 0px" };

    // --- Тексты ---
    const textObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            gsap.to(entry.target, {
                y: 0,
                opacity: 1,
                duration: 0.6,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true,
            });

            textObserver.unobserve(entry.target);
        });
    }, OBS_OPTIONS);

    document.querySelectorAll(".msk").forEach((el) => {
        gsap.set(el, { y: 40, opacity: 0 });
        textObserver.observe(el);
    });

    // --- Картинки ---
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            gsap.to(entry.target, {
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: "power2.out",
                overwrite: "auto",
                force3D: true,
                onComplete: () => entry.target.classList.remove("img-animated"),
            });

            imageObserver.unobserve(entry.target);
        });
    }, OBS_OPTIONS);

    document.querySelectorAll(".img-animated").forEach((img) => {
        // Начальное состояние задано в CSS (opacity: 0; transform: scale(.92))
        imageObserver.observe(img);
    });
}