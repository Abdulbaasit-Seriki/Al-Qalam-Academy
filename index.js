document.querySelector( "#nav-toggle" ).addEventListener("click", event => {

	document.querySelector("#nav-toggle").classList.toggle("active");
	document.body.classList.toggle("show-nav");
});

document.querySelector(".dropbtn").addEventListener("click", event => {
	document.querySelector(".dropdown-content").style.display = "block";
});

