import express from 'express';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve(path.dirname(''));
const app = express();
const port = process.env.PORT || 3000;

const AMOUNT_OF_PUZZLES = 500;

const getPuzzles = async () => {
  return new Promise(resolve => {
    fs.readFile('500_puzzles.txt', 'utf8', (error, data) => {
      if (error) {
        console.log(error)
      };

      resolve(data.split(","));
    })
  })
}

const getRandomPuzzle = async () => {
  const puzzles = await getPuzzles();
  const randomPuzzleIdx = Math.floor(Math.random() * (AMOUNT_OF_PUZZLES + 1)) + 0;

  return puzzles[randomPuzzleIdx].split("").map(numberString => numberString === "0" ? "." : numberString);
};

app.use('/', express.static(path.join(__dirname, 'client')));

app.get('/', function (req, res) {
  console.log(path.join(__dirname, 'client', 'index.html'))
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

app.get('/puzzle', async (req, res) => {
  res.status(200).json({
    message: await getRandomPuzzle()
  });
});

app.get('*', function (req, res) {
  res.status(404).json({
    message: 'Page Not Found'
  });
});

app.listen(port, () => {
  console.log(`Sudoku app listening at http://localhost:${port}`)
})

