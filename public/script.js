let hamburger = document.querySelector('.hamburger')
let navMenu = document.querySelector('.navigation')

hamburger.addEventListener("click", () => { 
 navMenu.classList.toggle('nav-active');
 navMenu.classList.toggle('navigation');
 hamburger.classList.toggle('active-bar');
});

const prevButton = document.querySelector("#prevBtn");
const nextButton = document.querySelector("#nextBtn");
const carrousel = document.querySelector(".Carrousel");
const padding = 2 * parseFloat(getComputedStyle(carrousel).paddingInline); // Get the padding and convert it to a numeric value
const slideWidth = carrousel.offsetWidth - padding; // Adjust the slide width to account for padding

prevButton.addEventListener('click', function() {
    carrousel.scrollBy({
        left: -slideWidth, // Scroll back by one slide width
        behavior: 'smooth'
    });
});

nextButton.addEventListener('click', function() {
    carrousel.scrollBy({
        left: slideWidth, // Scroll forward by one slide width
        behavior: 'smooth'
    });
});

let forms = document.querySelectorAll('form.like-playlist');

forms.forEach(function(form) {
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        let data = new FormData(this);
        data.append('enhanced', true);

        let actionUrl = this.getAttribute('action');

        fetch(actionUrl, {
            method: this.method,
            body: new URLSearchParams(data)
        })
        
    });
});

















