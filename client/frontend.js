const NUMBER_OF_ELEMENTS = 81;
const NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN = 9;
const NUMBER_DIV_TO_NUMBER_ELEMENT_RATIO = 0.70;
const FIRST_ROW_OR_COLUMN_OFFSET_START = 1;
const FIRST_ROW_OR_COLUMN_OFFSET_END = 2;
const SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_START = 2;
const SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_END = 3;
const THIRD_ROW_OR_COLUMN_OFFSET_START = 3;
const THIRD_ROW_OR_COLUMN_OFFSET_END = 4;
const AUDIO_DELAY = 750;

let br = false;
let grid = null;
let currentPuzzle = null;

const createAndAppendNumberElement = (number, i, j) => {
  const existingElement = grid.querySelector(`#row-col-${i}-${j}`);

  if (existingElement) {
    existingElement.remove();
  }

  const numberElementContainer = document.createElement("DIV");

  numberElementContainer.classList.add("number-element-container");
  numberElementContainer.setAttribute("id", `row-col-${i}-${j}`);

  numberElementContainer.style.gridColumnEnd = j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (1 / 3) ? j + FIRST_ROW_OR_COLUMN_OFFSET_END : j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (2 / 3) ? j + SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_END : j + THIRD_ROW_OR_COLUMN_OFFSET_END
  numberElementContainer.style.gridColumnStart = j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (1 / 3) ? j + FIRST_ROW_OR_COLUMN_OFFSET_START : j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (2 / 3) ? j + SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_START : j + THIRD_ROW_OR_COLUMN_OFFSET_START;
  numberElementContainer.style.gridRowEnd = i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (1 / 3) ? i + FIRST_ROW_OR_COLUMN_OFFSET_END : i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (2 / 3) ? i + SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_END : i + THIRD_ROW_OR_COLUMN_OFFSET_END;
  numberElementContainer.style.gridRowStart = i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (1 / 3) ? i + FIRST_ROW_OR_COLUMN_OFFSET_START : i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN * (2 / 3) ? i + SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_START : i + THIRD_ROW_OR_COLUMN_OFFSET_START;

  const numberElement = document.createElement("DIV");

  numberElement.classList.add("number-element");

  const numberDiv = document.createElement("DIV");

  numberDiv.classList.add('number');
  numberDiv.innerText = number > 0 ? number : "";

  grid.appendChild(numberElementContainer);
  numberElementContainer.appendChild(numberElement);
  numberDiv.style.fontSize = `${NUMBER_DIV_TO_NUMBER_ELEMENT_RATIO * document.querySelector('.number-element').clientWidth}px`
  numberElement.appendChild(numberDiv);
}

const populateGrid = (puzzleMatrix) => {
  for (let i = 0; i < puzzleMatrix.length; i++) {
    const row = puzzleMatrix[i];

    for (let j = 0; j < row.length; j++) {
      const number = row[j];
      createAndAppendNumberElement(number, i, j);
    }
  }
};

const convertStringToMatrix = (puzzleArray) => {
  const puzzleMatrix = [];

  let i = 0;
  let j = 0;
  let row = [];

  while (i < NUMBER_OF_ELEMENTS) {
    if (j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN) {
      row.push(puzzleArray[i]);
      i++;
      j++;
    } else {
      puzzleMatrix.push(row);
      row = [];
      j = 0;
    }
  };

  puzzleMatrix.push(row)

  return puzzleMatrix;
}

const recurse = async (row, col) => {
  for (let i = row; i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; i++, col = 0) {
    if (br) {
      br = false;

      break;
    }
    for (let j = col; j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; j++) {
      if (currentPuzzle[i][j] != '.') {
        continue;
      }
      if (br) {
        br = false;

        break;
      }
      for (let num = 1; num <= NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; num++) {
        if (br) {
          br = false;

          break;
        }
        if (isValid(i, j, num)) {
          currentPuzzle[i][j] = num.toString();

          createAndAppendNumberElement(num, i, j);

          await sleep(250);

          if (await recurse(i, j + 1)) {
            return true;
          }

          currentPuzzle[i][j] = '.';
        }
      }

      return false;
    }
  }

  return true;
}


const isValid = (row, col, num) => {
  num = num.toString();

  const blkrow = Math.floor(row / 3) * 3, blkcol = Math.floor(col / 3) * 3; // Block no. is i/3, first element is i/3*3

  for (let i = 0; i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; i++) {
    if (currentPuzzle[i][col] === num || currentPuzzle[row][i] === num || currentPuzzle[blkrow + Math.floor(i / 3)][blkcol + i % 3] === num) {
      return false;
    }
  }

  return true;
}

const sleep = async (timeMs) => {
  return new Promise(resolve => {
    setTimeout(() => resolve(), timeMs);
  });
}

const windowResizeCallback = () => {
  const grid = document.querySelector("#sodoku-board");
  const container = document.querySelector('.container');

  const containerHeight = container.clientHeight;
  const containerWidth = container.clientWidth;
  const gridWidthAndHeight = Math.min(containerHeight, containerWidth) * 0.8;

  grid.style.width = `${gridWidthAndHeight}px`;
  grid.style.height = `${gridWidthAndHeight}px`;

  const numberDivs = Array.from(document.querySelectorAll(".number"));
  const numberElementWidth = document.querySelector('.number-element').clientWidth;

  numberDivs.forEach(numberDiv => {
    numberDiv.style.fontSize = `${NUMBER_DIV_TO_NUMBER_ELEMENT_RATIO * numberElementWidth}px`
  });
}

const newPuzzle = async () => {
  const puzzleObj = await fetch('/puzzle');
  const puzzleMessage = await puzzleObj.json();
  const puzzleArray = puzzleMessage.message;
  const puzzleMatrix = convertStringToMatrix(puzzleArray);

  populateGrid(puzzleMatrix);

  return puzzleMatrix;
}

document.addEventListener('DOMContentLoaded', async () => {
  grid = document.querySelector("#sodoku-board");

  const controlButtons = Array.from(document.querySelectorAll('.control-button'));

  controlButtons.forEach(controlButton => {
    controlButton.addEventListener('mousedown', () => {
      controlButton.style.backgroundColor = "#016485";
    });

    controlButton.addEventListener('mouseup', () => {
      controlButton.style.backgroundColor = "#B0E0E6";
    });

    controlButton.addEventListener('mouseleave', () => {
      controlButton.style.backgroundColor = "white";
    });

    controlButton.addEventListener('mouseenter', () => {
      controlButton.style.backgroundColor = "white";
      controlButton.style.border = "0.1rem solid #008CBA;"
      controlButton.style.backgroundColor = "#B0E0E6";
    })
  })

  const [startButton, stopButton, newPuzzleButton] = controlButtons;

  currentPuzzle = await newPuzzle();

  let recursing = false;

  const audio = document.querySelector("audio");

  const startCallback = async () => {
    if (recursing === false) {
      recursing = true;
      br = false;
      audio.currentTime = 0;
      audio.play();
      setTimeout(async () => {
        await recurse(0, 0);
        recursing = false;
      }, AUDIO_DELAY);
    }
  }

  const stopCallback = async () => {
    recursing = false;
    br = true;
    audio.pause();
  }

  startButton.addEventListener("click", startCallback);
  stopButton.addEventListener('click', stopCallback);

  let fetchingPuzzle = false;

  newPuzzleButton.addEventListener('click', async () => {
    if (fetchingPuzzle === false) {
      stopCallback();

      fetchingPuzzle = true;
      currentPuzzle = await newPuzzle();
      fetchingPuzzle = false;
    }
  });

  window.onresize = windowResizeCallback

  windowResizeCallback();
})

