window.addEventListener('load', () => {
    gsap.registerPlugin(ScrollTrigger);

    // горизонтальный слайдер с gsap зависит от скролла
    const wrappers = document.querySelectorAll(".h-slider-wrap");
    wrappers.forEach((wrap) => {
        const slider = wrap.querySelector(".h-slider");
        const originalSlide = wrap.querySelector(".h-slide");
        if (!slider || !originalSlide) return;
        const cloneCount = 15; // чем меньше тем медленнее
        for (let i = 0; i < cloneCount - 1; i++) {
            const clone = originalSlide.cloneNode(true);
            slider.appendChild(clone);
        }
        const slideWidth = originalSlide.offsetWidth + 39;
        const totalWidth = slideWidth * cloneCount;
        slider.style.width = totalWidth + "px";
        const wrapWidth = wrap.offsetWidth;
        const maxScroll = totalWidth - wrapWidth;
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
                },
            },
        );
    });
    ScrollTrigger.refresh();

    // появление слова ДолгОиграющий комфорт и расширение буквы О
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".km__title",
            start: "top 60%",
            end: "top 40%",
            scrub: 1,
        },
    });
    tl.fromTo(".km__title", 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power1.out" }
    )
    .to(".letter-o", { width: 167, duration: 1, ease: "power1.out" }, "<")
    .to(".o-fill", { width: 93.3473, duration: 1, ease: "power1.out" }, "<");

    //просветление картинки с подошвой
    gsap.to(".km6-end", {
        opacity: 1,
        filter: "brightness(1)",
        scrollTrigger: {
            trigger: ".km__changing-pic",
            start: "top 50%",   // верх блока на 50% высоты окна
            end: "top top",     // верх блока у верхнего края окна
            scrub: true,        // привязка к скроллу (плавно)
            //markers: true    // для отладки – покажет точки старта/финиша
        }
    });

    // анимация маски в блоке с видео
    const vd = document.querySelector(".rec__vd");
    if (vd) {
        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".rec",
                start: "top top",
                end: "bottom top",  // пин действует только пока блок виден
                pin: true,
                pinSpacing: false, // не добавлять дополнительное пространство
                scrub: true,
                refreshPriority: -1, // низкий приоритет – обновляется позже других
            },
        });
        tl2
            .to(vd, {
                "mask-size": "100% 100%",
                "-webkit-mask-size": "100% 100%",
                duration: 1,
                ease: "none",
            })
            .to(vd, {
                "mask-size": "1000% 1000%",
                "-webkit-mask-size": "1000% 1000%",
                duration: 1,
                ease: "none",
            });
    }

    //анимация переключения фаз
    const wrapper = document.querySelector('.tech__wrapper');
    const phases = document.querySelectorAll('.tech__phase');

    function updatePhases(activeIndex) {
        phases.forEach((el, i) => {
            el.classList.toggle('active', i === activeIndex);
            
            let scale = 1;
            let opacity = 1;
            
            if (i !== activeIndex) {
                if (activeIndex === 0) {
                    if (i === 1) { scale = 0.8; opacity = 0.8; }
                    else if (i === 2) { scale = 0.6; opacity = 0.6; }
                } else if (activeIndex === 1) {
                    if (i === 0) { scale = 0.8; opacity = 0.8; }
                    else if (i === 2) { scale = 0.8; opacity = 0.8; }
                } else if (activeIndex === 2) {
                    if (i === 0) { scale = 0.6; opacity = 0.6; }
                    else if (i === 1) { scale = 0.8; opacity = 0.8; }
                }
            }
            
            gsap.set(el, { 
                scale, 
                opacity,
                transformOrigin: 'right center',
                // force3D: true, // иногда помогает
            });
        });
    }

    // Создаём таймлайн с повышенным приоритетом обновления
    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=200%',           // увеличьте, если нужно
            pin: true,
            pinSpacing: true,
            scrub: 1.5,
            anticipatePin: 1,
            refreshPriority: 1,      // высокий приоритет – обновляется после остальных
            onUpdate: (self) => {
                const progress = self.progress;
                const index = Math.min(2, Math.floor(progress * 3));
                updatePhases(index);
            },
            onEnter: () => console.log('pin начался'),
            onLeave: () => console.log('pin закончился')
        }
    });

    // После всех инициализаций выполняем принудительный refresh
    // Но сначала дадим браузеру отрисоваться
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });

    // Также обновляем при ресайзе – уже есть, но можно оставить
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

});

//slider
document.addEventListener("DOMContentLoaded", function () {
    const swipers = [];

    // Инициализация Swiper для каждой карточки
    document.querySelectorAll(".card .swiper").forEach((swiperEl) => {
        const card = swiperEl.closest('.card');
        const countContainer = card.querySelector('.slider-count');
        const currentSpan = countContainer?.querySelector('.current-slide');
        const totalSpan = countContainer?.querySelector('.total-slides');

        const swiper = new Swiper(swiperEl, {
            effect: "fade",
            fadeEffect: { crossFade: true },
            pagination: {
                el: swiperEl.querySelector(".swiper-pagination"),
                clickable: true,
            },
            navigation: {
                nextEl: swiperEl.querySelector(".swiper-button-next"),
                prevEl: swiperEl.querySelector(".swiper-button-prev"),
            },
            on: {
                init: function () {
                    if (totalSpan) totalSpan.textContent = this.slides.length;
                    if (currentSpan) currentSpan.textContent = this.activeIndex + 1;
                },
                slideChange: function () {
                    if (currentSpan) currentSpan.textContent = this.activeIndex + 1;
                }
            }
        });

        swipers.push(swiper);
    });

    // Принудительно обновляем все слайдеры после инициализации (чтобы они знали свои размеры)
    swipers.forEach(swiper => swiper.update());

    // Обработка кликов по карточкам
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        card.addEventListener("click", function (e) {
            // Игнорируем клики по элементам управления слайдером
            if (e.target.closest(".swiper-button-next, .swiper-button-prev, .swiper-pagination-bullet")) {
                return;
            }

            // Переключаем активный класс
            cards.forEach(c => c.classList.remove("active"));
            this.classList.add("active");

            const swiperInstance = swipers[index];
            if (!swiperInstance) return;

            // Собираем все изображения внутри слайдов этой карточки
            const images = this.querySelectorAll('.swiper-slide img');
            let loaded = 0;
            const total = images.length;

            // Функция, которая вызовет update после загрузки всех изображений
            const updateSwiper = () => {
                loaded++;
                if (loaded === total) {
                    swiperInstance.update();
                }
            };

            if (total === 0) {
                // Если нет изображений, обновляем сразу
                swiperInstance.update();
                return;
            }

            images.forEach(img => {
                if (img.complete) {
                    // Уже загружено (или ошибка)
                    updateSwiper();
                } else {
                    img.addEventListener('load', updateSwiper);
                    img.addEventListener('error', updateSwiper); // на случай ошибки
                }
            });

            // Страховочный таймаут (если изображения зависнут)
            setTimeout(() => {
                // Если не все загрузились, принудительно обновим через 1.5 сек
                if (loaded < total) {
                    swiperInstance.update();
                }
            }, 1500);
        });
    });

    // Активация первой карточки
    if (cards.length) {
        cards[0].classList.add("active");
        // Дожидаемся загрузки изображений в первой карточке
        const firstCard = cards[0];
        const images = firstCard.querySelectorAll('.swiper-slide img');
        let loaded = 0;
        const total = images.length;
        const updateFirst = () => {
            loaded++;
            if (loaded === total && swipers[0]) {
                swipers[0].update();
            }
        };
        if (total === 0) {
            if (swipers[0]) swipers[0].update();
        } else {
            images.forEach(img => {
                if (img.complete) updateFirst();
                else {
                    img.addEventListener('load', updateFirst);
                    img.addEventListener('error', updateFirst);
                }
            });
            setTimeout(() => {
                if (loaded < total && swipers[0]) swipers[0].update();
            }, 1500);
        }
    }
});


//wk block
document.addEventListener('DOMContentLoaded', () => {
    // --- Блок wk ---
    const wkWrapper = document.querySelector('.wk');
    if (!wkWrapper) return;

    const bg = wkWrapper.querySelector('.wk__bg');
    const rain = wkWrapper.querySelector('.wk__rain');
    const container = wkWrapper.querySelector('.container');

    if (!bg || !rain || !container) {
        console.warn('Не найдены все слои wk');
        return;
    }

    // Убедимся, что перспектива задана (если нет в CSS)
    wkWrapper.style.perspective = '1000px';

    const CONFIG = {
        bg: { translate: 20 },
        rain: { translate: 40 },
        container: { translate: 30, rotate: 10 }
    };

    // --- Функция плавного обновления (gsap.to) ---
    function updateWkLayers(x, y) {
        gsap.to(bg, {
            x: x * CONFIG.bg.translate,
            y: y * CONFIG.bg.translate,
            duration: 0.2,
            ease: 'power1.out',
            overwrite: 'auto'
        });
        gsap.to(rain, {
            x: x * CONFIG.rain.translate,
            y: y * CONFIG.rain.translate,
            duration: 0.2,
            ease: 'power1.out',
            overwrite: 'auto'
        });
        gsap.to(container, {
            x: x * CONFIG.container.translate,
            y: y * CONFIG.container.translate,
            rotationX: y * -CONFIG.container.rotate,
            rotationY: x * CONFIG.container.rotate,
            duration: 0.2,
            ease: 'power1.out',
            overwrite: 'auto'
        });
    }

    // --- Функция плавного возврата ---
    function resetWkLayers() {
        gsap.to(bg, {
            x: 0, y: 0,
            duration: 0.9,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
        });
        gsap.to(rain, {
            x: 0, y: 0,
            duration: 0.9,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
        });
        gsap.to(container, {
            x: 0, y: 0, rotationX: 0, rotationY: 0,
            duration: 0.9,
            ease: 'elastic.out(1, 0.3)',
            overwrite: 'auto'
        });
    }

    // --- Обработчик движения мыши ---
    wkWrapper.addEventListener('mousemove', (e) => {
        const rect = wkWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        updateWkLayers(x, y);
    });

    // --- Уход мыши ---
    wkWrapper.addEventListener('mouseleave', resetWkLayers);

    // --- IntersectionObserver для скролла ---
    const observerWk = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                resetWkLayers();
            }
        });
    }, { threshold: 0.1 });

    observerWk.observe(wkWrapper);
});

//intro block
document.addEventListener("DOMContentLoaded", () => {
    const introWrapper = document.querySelector(".intro");
    if (!introWrapper) return;

    const rock = introWrapper.querySelector(".intro__rock");
    const sign = introWrapper.querySelector(".intro__sign");
    const glow = introWrapper.querySelector(".intro__glow");
    const container = introWrapper.querySelector(".container.container--first");

    if (!rock || !sign || !glow || !container) {
        console.warn("Не найдены все слои intro");
        return;
    }

    // Добавляем перспективу
    introWrapper.style.perspective = "1000px";

    const CONFIG = {
        rock: { translate: 15 },
        sign: { translate: 30 },
        glow: { translate: 45 },
        container: { translate: 20, rotate: 8 },
    };

    // --- Вспомогательная функция для плавного обновления ---
    function updateIntroLayers(x, y) {
        // Используем gsap.to с небольшой длительностью для плавности
        gsap.to(rock, {
        x: x * CONFIG.rock.translate,
        y: y * CONFIG.rock.translate,
        duration: 0.2,
        ease: "power1.out",
        overwrite: "auto",
        });
        gsap.to(sign, {
        x: x * CONFIG.sign.translate,
        y: y * CONFIG.sign.translate,
        duration: 0.2,
        ease: "power1.out",
        overwrite: "auto",
        });
        gsap.to(glow, {
        x: x * CONFIG.glow.translate,
        y: y * CONFIG.glow.translate,
        duration: 0.2,
        ease: "power1.out",
        overwrite: "auto",
        });
        gsap.to(container, {
        x: x * CONFIG.container.translate,
        y: y * CONFIG.container.translate,
        rotationX: y * -CONFIG.container.rotate,
        rotationY: x * CONFIG.container.rotate,
        duration: 0.2,
        ease: "power1.out",
        overwrite: "auto",
        });
    }

    // --- Функция плавного возврата ---
    function resetIntroLayers() {
        gsap.to(rock, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
        });
        gsap.to(sign, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
        });
        gsap.to(glow, {
        x: 0,
        y: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
        });
        gsap.to(container, {
        x: 0,
        y: 0,
        rotationX: 0,
        rotationY: 0,
        duration: 0.9,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
        });
    }

    // --- Обработчик движения мыши ---
    introWrapper.addEventListener("mousemove", (e) => {
        const rect = introWrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        updateIntroLayers(x, y);
    });

    // --- Уход мыши ---
    introWrapper.addEventListener("mouseleave", resetIntroLayers);

    // --- IntersectionObserver для скролла ---
    const observerIntro = new IntersectionObserver(
        (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
            resetIntroLayers();
            }
        });
        },
        { threshold: 0.1 },
    );

    observerIntro.observe(introWrapper);
});