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
    const video = document.querySelector('.rec__vd video');

    if (vd) {
        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: ".rec",
                start: "top top",
                end: "bottom top",
                pin: true,
                pinSpacing: false,
                scrub: true,
                refreshPriority: -1,

                onUpdate: (self) => {
                    const rect = vd.getBoundingClientRect();

                    const isPartiallyVisible = rect.bottom > 0;

                    if (self.progress > 0 && isPartiallyVisible) {
                        if (video && video.paused) {
                            video.play().catch(e => console.warn('Play blocked:', e));
                        }
                    } else {
                        if (video && !video.paused) {
                            video.pause();
                        }
                    }
                },
                onRefresh: (self) => {
                    const rect = vd.getBoundingClientRect();
                    const isPartiallyVisible = rect.bottom > 0;
                    if (self.progress > 0 && isPartiallyVisible) {
                        if (video && video.paused) {
                            video.play().catch(e => console.warn('Play blocked:', e));
                        }
                    } else {
                        if (video && !video.paused) {
                            video.pause();
                        }
                    }
                }
            }
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
            // Выбираем transform-origin в зависимости от индекса фазы
            let origin = (i === 1) ? 'right bottom' 
                        : (i === 2) ? 'right top' 
                        : 'right center';
            
            gsap.set(el, { 
                scale, 
                opacity,
                transformOrigin: origin,
            });
        });
    }

    // Создаём таймлайн с повышенным приоритетом обновления
    const tl3 = gsap.timeline({
        scrollTrigger: {
            trigger: wrapper,
            start: 'top top',
            end: '+=200%',
            pin: true,
            pinSpacing: true,
            scrub: 1.5,
            anticipatePin: 1,
            refreshPriority: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const index = Math.min(2, Math.floor(progress * 3));
                updatePhases(index);
            },
            onEnter: () => console.log('pin начался'),
            onLeave: () => console.log('pin закончился')
        }
    });

    // устанавливаем начальное состояние (первая фаза активна)**
    updatePhases(0);   // <-- добавить эту строку

    // После всех инициализаций выполняем принудительный refresh
    requestAnimationFrame(() => {
        ScrollTrigger.refresh();
    });

    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });


    // ===== ВЫПЛЫВАНИЕ ТЕКСТА С ДВИЖЕНИЕМ (через обёртку) =====
    document.querySelectorAll(".msk").forEach(msk => {
        // 1. Убедимся, что маска скрывает переполнение
        msk.style.overflow = "hidden";

        // 2. Проходим по всем прямым дочерним элементам (ваш <h1>, <p> и т.д.)
        Array.from(msk.children).forEach(el => {
            // 3. Создаём внутреннюю обёртку, которую будем анимировать
            const wrapper = document.createElement("span");
            wrapper.className = "msk-anim-wrap";
            // Переносим всё содержимое el внутрь wrapper
            while (el.firstChild) {
            wrapper.appendChild(el.firstChild);
            }
            el.appendChild(wrapper);

            // 4. Устанавливаем начальное состояние для обёртки
            gsap.set(wrapper, {
            display: "block",          // чтобы transform работал
            y: "110%",
            opacity: 0
            });

            // 5. Наблюдатель за появлением родительского элемента (el)
            const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                // 6. Анимируем обёртку – выезжает вверх
                gsap.to(wrapper, {
                    y: "0%",
                    opacity: 1,
                    duration: 0.6,
                    ease: "power2.out",
                    overwrite: "auto",
                    force3D: true
                });
                observer.unobserve(el);
                }
            });
            }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30% 0px"
            });

            observer.observe(el);
        });
    });

    // ===== АНИМАЦИЯ КАРТИНОК (через класс .img-animated) =====
    document.querySelectorAll(".img-animated").forEach(img => {
        // Проверяем, не анимирована ли уже
        if (img.dataset.animated) return;

        // Начальное состояние уже задано через CSS, но для надёжности можно продублировать (необязательно)
        // gsap.set(img, { opacity: 0, scale: 0.92 });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
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
                }
                });
                img.dataset.animated = "true";
                observer.unobserve(img);
            }
            });
        }, {
            threshold: 0.1,
            rootMargin: "0px 0px -30% 0px" // тот же отступ, что и у текстов
        });

        observer.observe(img);
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

//tilt parallax для блоков  intro, wk
document.addEventListener("DOMContentLoaded", () => {
    // ========== БЛОК intro ==========
    function initIntro(wrapper) {
        const rock = wrapper.querySelector(".intro__rock");
        const sign = wrapper.querySelector(".intro__sign");
        const glow = wrapper.querySelector(".intro__glow");
        const container = wrapper.querySelector(".container.container--first");

        if (!rock || !sign || !glow || !container) return null;

        wrapper.style.perspective = "1000px";

        const CONFIG = {
        rock: { translate: 15 },
        sign: { translate: 30 },
        glow: { translate: 45 },
        container: { translate: 20, rotate: 8 },
        };

        function updateLayers(x, y) {
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

        function resetLayers() {
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

        const handleMouseMove = (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        updateLayers(x, y);
        };

        const handleMouseLeave = resetLayers;

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (!entry.isIntersecting) resetLayers();
            });
        },
        { threshold: 0.1 },
        );
        observer.observe(wrapper);

        return {
        addEvents() {
            wrapper.addEventListener("mousemove", handleMouseMove);
            wrapper.addEventListener("mouseleave", handleMouseLeave);
        },
        removeEvents() {
            wrapper.removeEventListener("mousemove", handleMouseMove);
            wrapper.removeEventListener("mouseleave", handleMouseLeave);
            observer.disconnect();
            resetLayers();
        },
        };
    }

    // ========== БЛОК wk ==========
    function initWk(wrapper) {
        const bg = wrapper.querySelector(".wk__bg");
        const rain = wrapper.querySelector(".wk__rain");
        const wrap = wrapper.querySelector(".wk__wrap"); // обёртка карточек, заголовок не трогаем

        if (!bg || !rain || !wrap) return null;

        wrapper.style.perspective = "1000px";

        const CONFIG = {
        bg: { translate: 20 },
        rain: { translate: 40 },
        wrap: { translate: 30, rotate: 10 },
        };

        function updateLayers(x, y) {
        gsap.to(bg, {
            x: x * CONFIG.bg.translate,
            y: y * CONFIG.bg.translate,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
        });
        gsap.to(rain, {
            x: x * CONFIG.rain.translate,
            y: y * CONFIG.rain.translate,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
        });
        gsap.to(wrap, {
            x: x * CONFIG.wrap.translate,
            y: y * CONFIG.wrap.translate,
            rotationX: y * -CONFIG.wrap.rotate,
            rotationY: x * CONFIG.wrap.rotate,
            duration: 0.2,
            ease: "power1.out",
            overwrite: "auto",
        });
        }

        function resetLayers() {
        gsap.to(bg, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
        });
        gsap.to(rain, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
        });
        gsap.to(wrap, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.3)",
            overwrite: "auto",
        });
        }

        const handleMouseMove = (e) => {
        const rect = wrapper.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        updateLayers(x, y);
        };

        const handleMouseLeave = resetLayers;

        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (!entry.isIntersecting) resetLayers();
            });
        },
        { threshold: 0.1 },
        );
        observer.observe(wrapper);

        return {
        addEvents() {
            wrapper.addEventListener("mousemove", handleMouseMove);
            wrapper.addEventListener("mouseleave", handleMouseLeave);
        },
        removeEvents() {
            wrapper.removeEventListener("mousemove", handleMouseMove);
            wrapper.removeEventListener("mouseleave", handleMouseLeave);
            observer.disconnect();
            resetLayers();
        },
        };
    }

    // ========== УПРАВЛЕНИЕ ==========
    let introController = null;
    let wkController = null;

    function initParallax() {
        if (introController) {
        introController.removeEvents();
        introController = null;
        }
        if (wkController) {
        wkController.removeEvents();
        wkController = null;
        }

        const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
        if (window.innerWidth <= 1024 || isTouchDevice) return;

        const introWrapper = document.querySelector(".intro");
        if (introWrapper) {
        introController = initIntro(introWrapper);
        if (introController) introController.addEvents();
        }

        const wkWrapper = document.querySelector(".wk");
        if (wkWrapper) {
        wkController = initWk(wkWrapper);
        if (wkController) wkController.addEvents();
        }
    }

    initParallax();

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(initParallax, 200);
    });
});

// воспроизведение видео:
document.addEventListener("DOMContentLoaded", () => {
    const video = document.querySelector('.vd video');

    // Создаём ScrollTrigger
    ScrollTrigger.create({
        trigger: '.vd',               // элемент-триггер
        start: 'top 70%',             // верх триггера на 70% от верха окна
        end: 'bottom top',            // низ триггера касается верха окна (блок полностью скрылся)
        toggleActions: 'play pause play pause',
        // play   – при входе (сверху вниз)
        // pause  – при выходе (скролл дальше вниз)
        // play   – при входе назад (скролл вверх)
        // pause  – при выходе назад (скролл вверх, блок снова уходит за верх)
        onEnter: () => {
            video.play().catch(e => console.warn('Автовоспроизведение заблокировано:', e));
        },
        onLeave: () => {
            video.pause();
        },
        onEnterBack: () => {
            video.play().catch(e => console.warn('Автовоспроизведение заблокировано:', e));
        },
        onLeaveBack: () => {
            video.pause();
        }
    });

});
