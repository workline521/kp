document.addEventListener('DOMContentLoaded', () => {
  const thumbsSwiper = new Swiper('.t-detail__slider', {
    slidesPerView: 4,
    spaceBetween: 10,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
  });
  const mainSwiper = new Swiper(".p-detail__slider", {
    effect: "fade",
    fadeEffect: {
      crossFade: true, 
    },
    speed: 600, 
    thumbs: {
      swiper: thumbsSwiper,
    },
  });

  Fancybox.bind("[data-fancybox]", {
    backFocus: false,
    Thumbs: false,
  });

  document.querySelectorAll(".p-detail__item").forEach((item) => {
    const cart = item.querySelector(".p-detail__cart");
    const counter = cart?.querySelector("span");
    if (!cart || !counter) return;
    const minusBtn = document.createElement("button");
    minusBtn.type = "button";
    minusBtn.className = "p-detail__qty-btn p-detail__qty-btn--minus";
    minusBtn.textContent = "−";
    const plusBtn = document.createElement("button");
    plusBtn.type = "button";
    plusBtn.className = "p-detail__qty-btn p-detail__qty-btn--plus";
    plusBtn.textContent = "+";
    cart.append(minusBtn, plusBtn);
    const getCount = () => parseInt(counter.textContent, 10) || 0;
    const setCount = (n) => {
      n = Math.max(0, n);
      counter.textContent = n > 0 ? n : "";
      cart.classList.toggle("has-items", n > 0);
    };
    item.addEventListener("click", (e) => {
      if (e.target.closest(".p-detail__qty-btn")) return;
      setCount(getCount() + 1);
    });
    plusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setCount(getCount() + 1);
    });
    minusBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      setCount(getCount() - 1);
    });
    setCount(getCount());
  });

  const wrap = document.querySelector(".similar__wrap");
  if (!wrap) return;
  const sliderEl = wrap.querySelector(".similar__slider");
  const nextEl = wrap.querySelector(".swiper-button-next");
  const prevEl = wrap.querySelector(".swiper-button-prev");
  new Swiper(sliderEl, {
    slidesPerView: 1,
    spaceBetween: 10,
    autoplay: {
      delay: 3000,
      disableOnInteraction: true,
      pauseOnMouseEnter: true,
    },
    loop: true,
    navigation: {
      nextEl,
      prevEl,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1024: {
        slidesPerView: 3,
      },
    },
  });

  document.querySelectorAll(".tabs").forEach((tabs) => {
    const buttons = tabs.querySelectorAll(".tabs__btn");
    const items = tabs.querySelectorAll(".tabs__item");

    buttons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        buttons.forEach((b) => b.classList.remove("active"));
        items.forEach((it) => it.classList.remove("active"));
        btn.classList.add("active");
        items[index]?.classList.add("active");
      });
    });
  });
});
