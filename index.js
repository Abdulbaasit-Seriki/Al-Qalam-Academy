document.querySelector( "#nav-toggle" ).addEventListener( "click", function() {
    this.classList.toggle( "active" );

    if (this.classList === "active") {
        document.querySelector(".nav-content").style.display = "block";
    } else {
        document.querySelector(".nav-content").style.display = "none";
    }
  });