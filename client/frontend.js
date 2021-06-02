const NUMBER_OF_ELEMENTS = 81;
const NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN = 9;
const NUMBER_DIV_TO_NUMBER_ELEMENT_RATIO = 0.70;
const FIRST_ROW_OR_COLUMN_OFFSET_START = 1;
const FIRST_ROW_OR_COLUMN_OFFSET_END = 2;
const SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_START = 2;
const SECOND_MIDDLE_ROW_OR_COLUMN_OFFSET_END = 3;
const THIRD_ROW_OR_COLUMN_OFFSET_START = 3;
const THIRD_ROW_OR_COLUMN_OFFSET_END = 4;
const SLEEP_TIME_GRID = 250;
const SLEEP_TIME_VOLUME = 150;
const AUDIO_DELAY = 0.5;
const VOLUME_REDUCTION_STEP = 0.2;

let br = false;
let working = false;
let createNewPuzzle = false;
let endingRecursion = false;
let stoppingRecursion = false;
let grid = null;
let currentPuzzle = null;
let originalPuzzle = null;

const mobileCheck = () => {
  let check = false;

  (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);

  return check;
};

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

const handleStackDetph = async (stackDepth) => {
  if (stackDepth === 0) {
    await endOfRecursionCallback();
  }
}

const addNumberToGridAndSleep = async (num, i, j) => {
  createAndAppendNumberElement(num, i, j);

  await sleep(SLEEP_TIME_GRID);
}

const recurse = async (row, col, stackDepth = 0) => {
  for (let i = row; i < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; i++, col = 0) {
    if (br) {
      break;
    }

    for (let j = col; j < NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; j++) {
      if (currentPuzzle[i][j] != '.') {
        continue;
      } else if (br) {
        break;
      }

      for (let num = 1; num <= NUMBER_OF_ELEMENTS_PER_ROW_OR_COLUMN; num++) {
        if (br) {
          break;
        }

        if (isValid(i, j, num)) {
          currentPuzzle[i][j] = num.toString();

          if (!br) {
            await addNumberToGridAndSleep(num, i, j);
          }

          if (await recurse(i, j + 1, stackDepth + 1)) {
            await handleStackDetph(stackDepth);

            return true;
          } else {
            currentPuzzle[i][j] = '.';

            if (!br) {
              await addNumberToGridAndSleep(0, i, j);
            }
          }
        }
      }

      await handleStackDetph(stackDepth);

      return false;
    }
  }

  await endOfRecursionCallback();

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

const startCallback = async () => {
  const audio = document.querySelector("audio");

  if (working === false) {
    working = true;
    br = false;
    currentPuzzle = deepCopy(originalPuzzle);
    populateGrid(currentPuzzle);
    audio.volume = 1;
    audio.currentTime = AUDIO_DELAY;
    audio.play();
    await recurse(0, 0);
  }
}

const stopCallback = async () => {
  br = true;
}

const cleanup = async () => {
  const audio = document.querySelector("audio");

  const fadeOut = async () => {
    if (audio.volume <= 0) {
      return;
    }

    const volumeReduction = Math.min(VOLUME_REDUCTION_STEP, Math.abs(0 - audio.volume));

    audio.volume -= volumeReduction;

    await sleep(SLEEP_TIME_VOLUME);
    await fadeOut();
  }

  if (!mobileCheck()) {
    await fadeOut();
  }

  audio.pause();
}

const newPuzzleButtonCallback = async () => {
  if (working === true) {
    createNewPuzzle = true;
    br = true;
  } else {
    working = true;
    await createAndAssignNewPuzzle();
    working = false; 
  }
}

const newPuzzle = async () => {
  const puzzleObj = await fetch('/puzzle');
  const puzzleMessage = await puzzleObj.json();
  const puzzleArray = puzzleMessage.message;
  const puzzleMatrix = convertStringToMatrix(puzzleArray);

  return puzzleMatrix;
}

const createAndAssignNewPuzzle = async () => {
  originalPuzzle = await newPuzzle();
  currentPuzzle = deepCopy(originalPuzzle);

  populateGrid(originalPuzzle);
}

const deepCopy = (arr) => {
  let copy = [];

  arr.forEach(elem => {
    if (Array.isArray(elem)) {
      copy.push(deepCopy(elem))
    } else {
      copy.push(elem);
    }
  });

  return copy;
}

const endOfRecursionCallback = async () => {
  if (endingRecursion === false) {
    endingRecursion = true;

    await cleanup();

    if (createNewPuzzle === true) {
      await createAndAssignNewPuzzle();

      createNewPuzzle = false;
    }

    endingRecursion = false;
    working = false;
  }
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

  await createAndAssignNewPuzzle();

  startButton.addEventListener("click", startCallback);
  stopButton.addEventListener('click', stopCallback);
  newPuzzleButton.addEventListener('click', newPuzzleButtonCallback);

  window.onresize = windowResizeCallback;

  windowResizeCallback();
})