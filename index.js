let gameActive;
let gameState;
let turn;
let boxesFilled;
let gameWonBy;

// Initialise game state
init();

function resetDOMState() {
  document.querySelectorAll(".cell").forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("winner");
  });
  document.getElementById("winningMessageText").innerHTML = "";
}

function changeTurn() {
  turn = turn === "X" ? "O" : "X";
}

function strikeThrough(states) {
  states.forEach((state) => {
    const node = document.getElementById(`cell-${state}`);
    node.classList.add("winner");
  });
}

function getPlayer() {
    return turn === "X" ? 1 : 2
}

function displayGameWon() {
  document.getElementById("winningMessageText").append(`Player ${getPlayer()} wins! `);
}

function findGameWonBy(xState, oState) {
  const checkStates = turn === "X" ? xState : oState;
  for (let i = 0; i < WINNING_STATES.length; i++) {
    const state = WINNING_STATES[i];
    stateFiltered = state.filter((ind) => {
      return checkStates.indexOf(ind) !== -1 ? true : false;
    });
    if (stateFiltered.length === 3) {
      gameActive = false;
      gameWonBy = turn;
      displayGameWon();
      strikeThrough(state);
      return turn;
    }
  }
  return "";
}

function displayGameDraw() {
  document
    .getElementById("winningMessageText")
    .append(`Game Draw. Please restart again.`);
}

function checkRoundDraw() {
  if (boxesFilled === 9 && gameWonBy === "") {
    gameActive = false;
    displayGameDraw();
  }
}

function checkGameState() {
  const xState = [];
  const oState = [];
  Object.keys(gameState).forEach((key) => {
    let obj = gameState[key];
    if (obj.clicked) {
      obj.clickedBy === "X"
        ? xState.push(Number(key))
        : oState.push(Number(key));
    }
  });
  findGameWonBy(xState, oState);
  checkRoundDraw();
}

function handleCellClick(e) {
  e.stopPropagation();
  e.preventDefault();
  if (gameActive) {
    const cellClicked = e.target;
    const cellIndex = cellClicked.getAttribute("data-cell-index");
    const cellClickedState = gameState[cellIndex];
    if (!cellClickedState.clicked) {
      boxesFilled++;
      cellClickedState.clicked = true;
      cellClickedState.clickedBy = turn;
      cellClicked.append(turn);
      checkGameState();
      if (gameActive) {
        changeTurn();
      }
    }
  }
  return;
}

function restartGame(e) {
  e.stopPropagation();
  e.preventDefault();
  //   empty out the filled cells
  resetDOMState();
  init();
}

function registerEventHandlers() {
  document.querySelectorAll(".cell").forEach(function (e) {
    e.addEventListener("click", handleCellClick);
  });
  document.getElementById("restart").addEventListener("click", restartGame);
}

function init() {
  gameState = JSON.parse(JSON.stringify(INITIATL_STATE));
  gameActive = true;
  turn = "X";
  boxesFilled = 0;
  gameWonBy = "";
  registerEventHandlers();
}
