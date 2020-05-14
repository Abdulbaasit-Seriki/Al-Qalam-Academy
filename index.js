document.querySelector( "#nav-toggle" ).addEventListener("click", event => {

	document.querySelector("#nav-toggle").classList.toggle("active");
	document.body.classList.toggle("show-nav");
});
