const harmburger = document.querySelector(".harmburger");
const navContent = document.querySelector(".nav-content");
const navItem = document.querySelectorAll(".nav-item");

harmburger.addEventListener("click", () => {
	navContent.classList.toggle("open");
	navItem.forEach( link => {
		link.classList.toggle('fade');
	})
})
// [...document.querySelectorAll(".dropdown-content")].forEach(drop => {
// 	document.querySelector("")
// })

