/* mobile menu */

const body = document.querySelector('body')
const burger = document.querySelector('.header__burger')

burger.addEventListener('click', () => {
	body.classList.toggle('show')
	burger.classList.toggle('show')
})