document.querySelector( "#nav-toggle" ).addEventListener( "click", function() {
    this.classList.toggle( "active" );

    if (this.classList === "active") {
        document.querySelector(".nav-content").style.display = "block";
    } else {
        document.querySelector(".nav-content").style.display = "none";
    }
  });


const debounceHelperFunc = (callback, delay = 500) => {
	let timeOutId;
	// It returns a function which serves as a shield or better still, a wrapper around the function
	return (...args) => {
		// If timeout is defined as in if time out has a value, clear the time out.
		// This if statment prevents the function from saerching the aPI because it'll have cleared the interval 
		// before 1000 milliseconds
		if (timeOutId) {
			clearTimeout(timeOutId);
		}
		timeOutId = setTimeout(() => {
			callback.apply(null, args);
		}, delay);
	};
}