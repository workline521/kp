/* mobile menu */

const body = document.querySelector('body');
const burger = document.querySelector('.header__burger');
const modalBtns = document.querySelectorAll(".modal");
const modal = document.querySelector(".popup");
const closeBtn = document.querySelector(".popup__close");

burger.addEventListener('click', () => {
	body.classList.toggle('show');
	burger.classList.toggle('show');
})

closeBtn.addEventListener("click", () => {
	modal.classList.remove("active");
	body.classList.remove("active");
});

if (modalBtns) {
	modalBtns.forEach((modalBtn) => {
		modalBtn.addEventListener("click", function () {
			modal.classList.add("active");
			body.classList.add("active");			
		});
	});
}   