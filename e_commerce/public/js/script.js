// navbar scroll

window.addEventListener("scroll", () => {
    var navbar = document.getElementById("navbar");
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

