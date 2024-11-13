// 1. Assign values and attributes to each tile:

function generateTiles(rows, cols) {
  const tiles = [];
  const columnValues = [1, 1.6, 2.3, 3, 6, 9, 12, 15, 20, 25, 30, 35, 46, 57, 69, 82, 112, 140, 175, 207, 260, 320, 380, 440];

  // Define the coordinates for each attribute
  const intelligenceCoords = ["A1", "A4", "A9", "B3", "B6" /* ... all other Intelligence coordinates */ ];
  const leadershipCoords = ["A3", "A6", "B1", "B8" /* ... all other Leadership coordinates */ ];
  const strengthCoords = [ "A2", "A7", "B4", "B7" /* ... all Strength coordinates */ ];
  const charismaCoords = [ "A8", "B2", "B5", "B9" /* ... all Charisma coordinates */ ];



  for (let row = 1; row <= rows; row++) {
      for (let col = 0; col < cols; col++) {
          const colLetter = String.fromCharCode(65 + col);
          const coord = colLetter + row;
          const value = columnValues[col];

          if (coord === "A5") {
              tiles.push({ coord: "A5", value: 0, attribute: null });
              continue;
          }

          let attribute = null; // Default - no attribute

          if (intelligenceCoords.includes(coord)) {
              attribute = "Intelligence";
          } else if (leadershipCoords.includes(coord)) {
              attribute = "Leadership";
          } else if (strengthCoords.includes(coord)) {
              attribute = "Strength";
          } else if (charismaCoords.includes(coord)) {
              attribute = "Charisma";
          }

          tiles.push({ coord, value, attribute });
      }
  }
  return tiles;
}

const numRows = 9;      // Number of rows
const numCols = 24;     // Number of columns (from A to X, hence 24)
const tiles = generateTiles(numRows, numCols);

// 2. Create the grid dynamically:

const map = document.getElementById('map');
const results = document.getElementById('results');

function createGrid() {
    const gridContainer = document.getElementById('grid'); // Get the grid container

    for (let tile of tiles) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.id = tile.coord;
        tileElement.textContent = tile.coord;

        // Check if it's the Start tile (namely A5)
        if (tile.coord !== "A5") {
            tileElement.addEventListener('click', () => {
                handleTileClick(tileElement);
            });
        } else {
            // Special tile styling/behaviour
            tileElement.classList.add("start-tile");
            tileElement.textContent = "Start";
        }

        gridContainer.appendChild(tileElement); // Append to the grid container
    }
}

// 3. Handle tile selection:

function handleTileClick(tileElement) {
    tileElement.classList.toggle('selected');
    calculateTotals();
}

// 4. Calculate totals:

function calculateTotals() {
    let totals = { Intelligence: 0, Leadership: 0, Strength: 0, Charisma: 0 };
    const selectedTiles = document.querySelectorAll('.selected');

    selectedTiles.forEach(tileElement => {
        const tileId = tileElement.id;
        const tileData = tiles.find(tile => tile.coord === tileId);

        // Only include tiles with attributes in the calculation
        if (tileData && tileData.attribute) {  // Check if the attribute exists (only relevant for the Start tile...)
            totals[tileData.attribute] += tileData.value;
        }
    });

    displayResults(totals);
}

// 5. Display results:

function displayResults(totals) {
    results.innerHTML = ''; // Clear previous results
    for (let attribute in totals) {
        const p = document.createElement('p');
        p.textContent = `${attribute}: ${totals[attribute]}`;
        results.appendChild(p);
    }
}

// Create the grid when the page loads:
createGrid();
