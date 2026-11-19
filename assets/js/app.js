
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

  // Пагинация
  pagination: {
      el: '.sls__slider-pagination',
      clickable: true,
  },

  // Стрелки
  navigation: {
      nextEl: '.sls__slider-prev',
      prevEl: '.sls__slider-next',
  },

  // Опционально: свайп/клавиатура
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
const playBtn = section.querySelector('.video-plays');

const VIDEO_DESKTOP = './assets/images/horizontal.mp4';
const VIDEO_MOBILE  = './assets/images/vertical.mp4';

const mq = window.matchMedia('(min-width: 1025px)');

function setVideoSrc() {
    const src = mq.matches ? VIDEO_DESKTOP : VIDEO_MOBILE;
    if (video.getAttribute('src') === src) return;

    const wasPlaying = !video.paused;

    video.src = src;
    video.load();

    if (wasPlaying) {
        video.play().catch(() => {});
    }
}

setVideoSrc();
mq.addEventListener('change', setVideoSrc);

// --- Play: включаем нативные controls и прячем кнопку ---
playBtn.addEventListener('click', () => {
    video.controls = true;          // появляются нативные контролы
    video.play().catch(() => {});
    section.classList.add('is-controls'); // для CSS: opacity: 0; z-index: -1
});