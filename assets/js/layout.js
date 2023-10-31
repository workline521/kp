(function() {

    $(".header__burger").on("click", function () {
      $(this).toggleClass("menu-opened");
      $("body, html").toggleClass("ovh");
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

