const slides = document.getElementById('slides');
const slideCount = slides.children.length;
let currentSlide = 0;

function ChangeSlide(slideId) {
	router.setRoute('/' + slideId);
}

function ShowSlide(slideId) {
	currentSlide = Math.min(Math.max(slideId, 1), slideCount);
	const index = currentSlide - 1;
	slides.getElementsByClassName('active')[0].classList.remove('active');
	slides.children[index].classList.add('active');
	document.getElementById('nazad').disabled = index <= 0;
	document.getElementById('dalee').disabled = index >= slideCount - 1;

	var shetchik_slaydov = document.getElementById('shetchik');
	shetchik_slaydov.innerHTML = 'Страница № ' + currentSlide +' из ' + slideCount;
}

ShowSlide(1);

const routes = {
	'/:slideId': ShowSlide,
};

const router = new Router(routes);
router.init();
