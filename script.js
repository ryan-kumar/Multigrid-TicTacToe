import axios from 'https://cdn.jsdelivr.net/npm/axios@1.6.7/+esm';

const socket = io();
document.addEventListener("DOMContentLoaded", function () {
let gamemode = "";
let lobby = "";
StartScreen();
let showing = true;
let p1 = true;
let gridex = "9";
const loc = [ 
    "the Top-Left", "the Top-Middle", "the Top-Right", 
    "the Middle-Left", "the Middle-Middle", "the Middle-Right", 
    "the Bottom-Left", "the Bottom-Middle", "the Bottom-Right", "Any"];
let wins = ["0", "0", "0", 
            "0", "0", "0", 
            "0", "0", "0"];
ActiveGridMessage(gridex);

async function CreateLobby() {
    let status = "failed";
    let tries = 0;
    while (status === "failed" && tries < 15) {
        lobby = Math.random().toString(36).substring(2, 10).toUpperCase();
        status = await AttemptLobbyCreate(lobby);
        tries += 1;
    }
    console.log(`New lobby at ${lobby}, tries: ${tries}, creation: ${status}`);
}

function AttemptLobbyCreate(lobbycode) {
    return new Promise((resolve) => {
    socket.emit("create-lobby", lobbycode);
    socket.once("create-status", (response) => {
      resolve(response); 
    });
  });
}

function StartScreen() {
    const gameplay = document.getElementById("gameplay");
    gameplay.classList.add("info");
    
    const ss = document.getElementById("startscreen");
    ss.classList.remove("info");
    ss.classList.add("ss");
}
window.Mode = function(mode) {
    console.log(mode);  
    gamemode = mode;
    if (gamemode === "Online") {
        CreateLobby();
    }

    const ss = document.getElementById("startscreen");
    ss.classList.add("info");
    ss.classList.remove("ss");

    const gameplay = document.getElementById("gameplay");
    gameplay.classList.remove("info");
}


function TestCall() {
    axios.get('http://localhost:3500/test')
    .then(response => {
        const responseData = response.data;
        console.log(responseData);  
        document.getElementById("rb").innerHTML = `<b>${responseData}</b>`;

    })
    .catch(error => {
        console.log(error);
    });
}


function ActiveGridMessage(grid) {
    grid = parseInt(grid, 10);
    let message =  `Player ${p1 ? "one" : "two"}, Place your Symbol in ${loc[grid]} Grid!`;
    const prompt = document.getElementById("Direction");
    prompt.textContent = message;
}

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
    let index = cell.dataset.index;
    if (wins[index[0]] != "0" || (gridex != "9" && index[0] != gridex)) {
        return;
    }
    console.log(`Attempting to send over ${index} and ${lobby}`)
    socket.emit("mark-index", {index, lobby});
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
    CheckLocalWins(index[0]);
    CheckGlobalWins(index[0]);
    gridex = wins[index[1]] != "0" ? "9" : index[1];
    ActiveGridMessage(gridex);
}

function CheckLocalWins(prefix) {    
    let mark = "0";
    
    if (
        (document.querySelector(`[data-index="${prefix + (0)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (0)}"]`).textContent === document.querySelector(`[data-index="${prefix + (1)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (1)}"]`).textContent === document.querySelector(`[data-index="${prefix + (2)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (0)}"]`).textContent;}
    else if (
        (document.querySelector(`[data-index="${prefix + (3)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (3)}"]`).textContent === document.querySelector(`[data-index="${prefix + (4)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (4)}"]`).textContent === document.querySelector(`[data-index="${prefix + (5)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (3)}"]`).textContent;}
    else if (
        (document.querySelector(`[data-index="${prefix + (6)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (6)}"]`).textContent === document.querySelector(`[data-index="${prefix + (7)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (7)}"]`).textContent === document.querySelector(`[data-index="${prefix + (8)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (6)}"]`).textContent;}
    else if (
        (document.querySelector(`[data-index="${prefix + (0)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (0)}"]`).textContent === document.querySelector(`[data-index="${prefix + (3)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (3)}"]`).textContent === document.querySelector(`[data-index="${prefix + (6)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (0)}"]`).textContent;}
    else if (
        (document.querySelector(`[data-index="${prefix + (1)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (1)}"]`).textContent === document.querySelector(`[data-index="${prefix + (4)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (4)}"]`).textContent === document.querySelector(`[data-index="${prefix + (7)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (1)}"]`).textContent;}
    else if (
        (document.querySelector(`[data-index="${prefix + (2)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (2)}"]`).textContent === document.querySelector(`[data-index="${prefix + (5)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (5)}"]`).textContent === document.querySelector(`[data-index="${prefix + (8)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (2)}"]`).textContent;}
     else if (
        (document.querySelector(`[data-index="${prefix + (0)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (0)}"]`).textContent === document.querySelector(`[data-index="${prefix + (4)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (4)}"]`).textContent === document.querySelector(`[data-index="${prefix + (8)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (0)}"]`).textContent;}
    else if (
        (document.querySelector(`[data-index="${prefix + (2)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (2)}"]`).textContent === document.querySelector(`[data-index="${prefix + (4)}"]`).textContent 
        && document.querySelector(`[data-index="${prefix + (4)}"]`).textContent === document.querySelector(`[data-index="${prefix + (6)}"]`).textContent)
    ) {mark = document.querySelector(`[data-index="${prefix + (2)}"]`).textContent;}

    let count = 0;
    for (let i = 0; i < 9; i++) {
        if (!document.querySelector(`[data-index="${prefix + i}"]`)) {
            break;
        }
        count += 1; 
    }
    if (count == 8) mark = "I";
    wins[parseInt(prefix, 10)] = mark;
    DrawLocalWin(mark, prefix);
}

function CheckGlobalWins() {

    let mark = "0";

    if (wins[0] != "0" && wins[0] === wins[1] && wins[1] === wins[2]) {mark = wins[0];}
    else if (wins[3] != "0" && wins[3] === wins[4] && wins[4] === wins[5]) {mark = wins[3];}
    else if (wins[6] != "0" && wins[6] === wins[7] && wins[7] === wins[8]) {mark = wins[6];}

    else if (wins[0] != "0" && wins[0] === wins[3] && wins[3] === wins[6]) {mark = wins[0];}
    else if (wins[1] != "0" && wins[1] === wins[4] && wins[4] === wins[7]) {mark = wins[1];}
    else if (wins[2] != "0" && wins[2] === wins[5] && wins[5] === wins[8]) {mark = wins[2];}

    else if (wins[0] != "0" && wins[0] === wins[4] && wins[4] === wins[8]) {mark = wins[0];}
    else if (wins[2] != "0" && wins[2] === wins[4] && wins[4] === wins[6]) {mark = wins[2];}

    let count = 0;
    for (let i = 0; i < 9; i++) {
        if (wins[i] === "0") {
            break;
        }
        count += 1; 
    }
    if (count == 8) mark = "I";

    DrawGlobalWin(mark);
}

function DrawLocalWin(mark, prefix) {
    if (mark === "0") return;
    let grid = document.querySelector(`[data-index="${prefix}"]`);
    grid.classList.add(`grid${mark}`);
    grid.textContent = mark;
}

function DrawGlobalWin(mark) {
    if (mark === "0") return;
    let board = document.getElementById("br");
    board.classList.add(`board${mark}`);
    board.textContent = mark;
}



document.querySelector('.board').addEventListener('click', function (event) {
    if (event.target.classList.contains('cell')) {
        CellClick(event.target);
    }
});



});