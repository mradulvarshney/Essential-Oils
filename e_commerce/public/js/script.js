// navbar scroll

window.addEventListener("scroll", () => {
    var navbar = document.getElementById("navu");
    var height = window.scrollY;
    if(height >80){
        navbar.style.background = "rgb(225 217 217 / 100%)";
        navbar.style.boxShadow = "rgba(0,0,0,0.1) 0px 4px 12px";
    }
    else{
        navbar.style.background = "transparent";
        navbar.style.boxShadow = "none";
    }
});

const cart = document.querySelector(".cart");
const mycart = document.querySelector(".my-cart");
const cart_close = document.querySelector(".my-cart .heading i");

cart.addEventListener("click", () => {
    mycart.style.display = "flex";
})

cart_close.addEventListener("click", () => {
    mycart.style.display = "none";
})


let searchForm = document.querySelector('.search-form');

document.querySelector('#search-btn').onclick = () =>{
    searchForm.classList.toggle('active');
    navbar.classList.remove('active');
}

let navbar = document.querySelector('.navbar');

document.querySelector('#menu-btn').onclick = () =>{
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
}

var images = ['bg.jpg', '1.jpeg', '2.jpeg', '3.jpeg'];
var i=0;
function nextImage()
{
    if(i<images.length-1)
    {
        i++;
    }
    else
    {
        i=0;
    }
    document.querySelector(".home").style.background = `url('../uploads/${images[i]}') no-repeat center/cover`;
    console.log(i);
}

// setInterval("nextImage()", 4000);

function prevImage()
{
    console.log(i);
    document.querySelector(".home").style.background = `url('../uploads/${images[i]}') no-repeat center/cover`;
    if(i<images.length && i>0)
    {
        i--;
    }
    else
    {
        i=images.length-1;
    }
}
