(function() {

    $(".header__burger").on("click", function () {
      $(this).toggleClass("menu-opened");
      $("body").toggleClass("ovh");
      $(".header__menu").fadeToggle("300");
    });

    $(".callback").on("click", function () {
      $("body").addClass("ovh");
      $(".modal-overlay, .modal").fadeIn("300");
    });

    $(".modal-overlay, .modal__close").on("click", function () {
      $("body").removeClass("ovh");
      $(".modal-overlay, .modal").fadeOut("300");
    });

    $(".sent__close").on("click", function () {
      $(".sent").fadeOut("300");
    });
    
    // masked input for phones in form
	  $(".mask").mask("+7(999) 999-99-99", { autoclear: true });

})(jQuery);

/* modify header on scroll */
window.addEventListener("scroll", function () {
    var windowOffset = window.pageYOffset;
    var header = document.querySelector("header");
    if(windowOffset > 300){
        header.classList.add("slide");
    }
    else{
        header.classList.remove("slide");
    }      
});
