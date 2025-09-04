document.addEventListener("DOMContentLoaded", function () {
    //запуск видео по клику в статичных блоках
    const videos = document.querySelectorAll(".video");
    const videoBtns = document.querySelectorAll(".play-btn");
    if (videos) {
        videos.forEach((video) => {
            video.addEventListener("click", function () {
                let parent = video.parentNode;
                if (video.paused) {
                    video.play();
                    parent.classList.add("active");
                } else {
                    video.pause();
                    parent.classList.remove("active");
                }			
            });
        });
    }

    //запуск видео по клику на кнопку в статичных блоках
    if (videoBtns) {
        videoBtns.forEach((videoBtn) => {
            videoBtn.addEventListener("click", function () {
                let parent = videoBtn.parentNode;
                let vid = parent.querySelector(".video");
                if (vid.paused) {
                    vid.play();
                    parent.classList.add("active");
                } else {
                    vid.pause();
                    parent.classList.remove("active");
                }			
            });
        });
    }

    //инициализация слайдера
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 20,
        slideToClickedSlide: false,
        watchSlidesProgress: true,
        preventInteractionOnTransition: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            450: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 3,
            },
            1024: {
                slidesPerView: 4,
                spaceBetween: 32,
            },
        },
    });

    // Обработчики для кнопок переключения
    const stopAllVideos = () => {
        document.querySelectorAll('.slider__video').forEach(video => {
            video.pause();
            video.currentTime = 0;
            video.removeAttribute('controls');
        });
        document.querySelectorAll('.play').forEach(btn => {
            btn.style.display = 'block';
        });
    };

    // Добавляем обработчики на кнопки навигации
    document.querySelector('.swiper-button-next').addEventListener('click', stopAllVideos);
    document.querySelector('.swiper-button-prev').addEventListener('click', stopAllVideos);

    // Обработчик для кнопок play
    document.querySelectorAll('.play').forEach(button => {
        button.addEventListener('click', function(e) {
            const video = this.nextElementSibling;
            document.querySelectorAll('.slider__video').forEach(v => {
                if (v !== video) {
                    v.pause();
                    v.currentTime = 0;
                    v.removeAttribute('controls');
                }
            });
            video.setAttribute('controls', 'true');
            video.play();
            this.style.display = 'none';
            e.stopPropagation();
        });
    });

    // Блокируем переключение при клике на слайд
    document.querySelectorAll('.swiper-slide').forEach(slide => {
        slide.addEventListener('click', function(e) {
            if (!e.target.closest('.play') && 
                !e.target.closest('.swiper-button-next') && 
                !e.target.closest('.swiper-button-prev')) {
                e.stopPropagation();
            }
        });
    });

    //открываем попап регистрации 
    const modalBtns = document.querySelectorAll(".modal");
    const body = document.querySelector("body");
    if (modalBtns) {
        modalBtns.forEach((modalBtn) => {
            modalBtn.addEventListener("click", function () {
                body.classList.add("active");			
            });
        });
    }
    //закрываем попап регистрации   
    const closeBtn = document.querySelector(".popup__close");
    closeBtn.addEventListener("click", () => {
        body.classList.remove("active");
    });

    //закрываем попап смс   
    const closeBtn2 = document.querySelector(".sms__close");
    const smsPopup = document.querySelector(".sms");
    closeBtn2.addEventListener("click", () => {
        smsPopup.classList.add("hidden");
    });

    // Появления элементов при прокрутке
    function setupScrollAnimation() {
        const infoBlocks = document.querySelectorAll('.animate');                
        const options = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.2
        };
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (entry.target.classList.contains('animate')) {
                        entry.target.classList.add('visible');
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        infoBlocks.forEach(block => observer.observe(block));                
    }
    window.addEventListener('DOMContentLoaded', setupScrollAnimation);
});
