// document.addEventListener("DOMContentLoaded", function () {

let showing = true;
window.dropdown = function() {
    let info = document.getElementById("instructions");

    if (showing) {
        console.log("hello");
        info.classList.remove("visible");
        info.classList.add("info");
        showing = false;
    } else {
        info.classList.remove("info");
        info.classList.add("visible");
        showing = true;
    }
};
//});