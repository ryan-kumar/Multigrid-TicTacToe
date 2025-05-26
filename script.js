document.addEventListener("DOMContentLoaded", function () {

let showing = true;
let p1 = true;

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

function CellClick(cell) {
    if (p1 && !cell.classList.contains("ptwo")) {
        cell.classList.remove("visible");
        cell.classList.add("pone");
        cell.textContent = 'X';
        p1 = false;
    } else if (!p1 && !cell.classList.contains("pone")) {
        cell.classList.remove("visible");
        cell.classList.add("ptwo");
        cell.textContent = 'O';
        p1 = true;
    }
}

document.querySelector('.board').addEventListener('click', function (event) {
    if (event.target.classList.contains('cell')) {
        CellClick(event.target);
    }
});


});