$(document).ready(function(){
	$('.slick').slick({
		infinite: true,
		slidesToShow: 6,
		slidesToScroll: 6,
		padding: '60px',
		dots: true,
		arrows: false,
		responsive: [
		{
			breakpoint: 1024,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 4,
				arrows: false
			}
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3,
				arrows: false
			}
		}
		]
	});
});

img = document.getElementsByClassName("imgBox");
linkImgFull = document.getElementById("linkImgFull");
imgFull = document.getElementById("imgFull");
for(var i = 0; i < img.length; i++){
	img[i].addEventListener('click', function(){
		imgFull.src = this.src;
		linkImgFull.href = this.src;
		refreshFsLightbox();
	});
}