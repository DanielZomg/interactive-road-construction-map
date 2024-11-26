// Toggle dark mode on/off:

function darkModeToggle() {
    const toggleButton = document.getElementById('darkModeToggle');
    toggleButton.onclick = () => {
        document.body.classList.toggle('dark-mode');
        // Save the preference locally
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkMode);
    };
}

let isPlacingCity = false; // Track whether we're in city placement mode

// Toggle city placement on/off:

function cityModeToggle() {
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Switch to city placement mode';
    toggleButton.onclick = () => {
        isPlacingCity = !isPlacingCity;
        toggleButton.textContent = isPlacingCity ?
            'Exit city placement mode' :
            'Switch to city placement mode';
    };
    document.body.insertBefore(toggleButton, map);
}

// Assign values and attributes to each tile:

function generateTiles(rows, cols) {
  const tiles = [];
  const columnValues = [1, 1.6, 2.3, 3, 6, 9, 12, 15, 20, 25, 30, 35, 46, 57, 69, 82, 112, 140, 175, 207, 260, 320, 380, 440];

  // Define the coordinates for each attribute
  const charismaCoords = [ "A8", "B2", "B5", "B9", "C4", "D1", "D7", "D9", "E1", "E2", "E6", "F2",
                          "F3", "G7", "H3", "H6", "H9", "I2", "I9", "J2", "J4", "J7", "K6", "L1",
                          "L5", "L9", "M2", "M8", "N6", "N9", "O5", "O8", "P1", "P6", "P9", "Q5",
                          "Q7", "R1", "R3", "R7", "S1", "S6", "T4", "T5", "U4", "V2", "V4", "V6",
                          "W4", "W5", "W8", "W9", "X4"];
  const intelligenceCoords = ["A1", "A4", "A9", "B3", "B6", "C3", "C5", "C8", "D3", "D6", "E3", "E9", 
                              "F5", "F8", "G3", "G4", "G8", "H1", "H7", "I5", "I7", "J5", "J8", "K3", 
                              "K4", "K8", "L2", "L7", "M5", "M6", "N1", "N3", "N7", "O3", "O6", "P4", 
                              "P7", "Q4", "Q8", "R4", "R9", "S3", "S5", "S8", "T2", "T7", "U8", "V5", 
                              "V8", "W2", "W7", "X1", "X6", "X8"];
  const leadershipCoords = ["A3", "A6", "B1", "B8", "C1", "C7", "D4", "D8", "E5", "E7", "F1", "F4", 
                            "F9", "G1","G5", "H2", "H5", "I1", "I4", "I8", "J1", "J3", "K1", "K7", 
                            "L4", "L6", "M3", "M9", "N4", "N8", "O2", "O7", "O9", "P3","P8", "Q3", 
                            "Q9", "R2", "R5", "R8", "S2", "S4", "T1", "T6", "U1", "U3", "U6", "U7", 
                            "U9", "V7", "V9", "X3", "X7", "X9"];
  const strengthCoords = [ "A2", "A7", "B4", "B7", "C2", "C6", "C9", "D2", "D5", "E4", "E8", "F6",
                          "F7", "G2", "G6", "G9","H4", "H8", "I3", "I6", "J6", "J9", "K2", "K5",
                          "K9", "L3", "L8", "M1", "M4", "M7", "N2", "N5", "O1", "O4", "P2", "P5",
                          "Q1", "Q2", "Q6", "R6", "S7", "S9", "T3", "T8", "T9", "U2", "U5", "V1",
                          "V3", "W1", "W3", "W6", "X2", "X5"];
  


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

          if (charismaCoords.includes(coord)) {
              attribute = "Charisma";
          } else if (intelligenceCoords.includes(coord)) {
              attribute = "Intelligence";
          } else if (leadershipCoords.includes(coord)) {
              attribute = "Leadership";
          } else if (strengthCoords.includes(coord)) {
              attribute = "Strength";
          }

          tiles.push({ coord, value, attribute });
      }
  }
  return tiles;
}

const numRows = 9;      // Number of rows
const numCols = 24;     // Number of columns (from A to X, hence 24)
const tiles = generateTiles(numRows, numCols);

// Create the grid dynamically:

const map = document.getElementById('map');
const results = document.getElementById('results');

// Map attributes to emojis
const attributeEmojis = {
    'Charisma': '🚩',
    'Intelligence': '📚',
    'Leadership': '🤝',
    'Strength': '⚔️'
};

function createGrid() {
    const gridContainer = document.getElementById('grid'); // Get the grid container

    for (let tile of tiles) {
        const tileElement = document.createElement('div');
        tileElement.className = 'tile';
        tileElement.id = tile.coord;

        // Create and style the coordinate text
        const coordText = document.createElement('div');
        coordText.textContent = tile.coord;
        coordText.style.fontSize = '0.8em'; // Making the coordinate text a bit smaller

        // Create and style the attribute emoji (if it exists)
        const attrText = document.createElement('div');
        if (tile.attribute) {
            attrText.textContent = attributeEmojis[tile.attribute];
            attrText.style.fontSize = '1.5em';
        }

        // Add coordinate and attribute emoji to the tile
        tileElement.appendChild(coordText);
        tileElement.appendChild(attrText);

        // Update the tile CSS to stack the text vertically
        tileElement.style.flexDirection = 'column';

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

// Handle tile selection:

function handleTileClick(tileElement) {
    const tileId = tileElement.id;

    // Don't allow clicking the start tile
    if (tileId === "A5") return;

    if (isPlacingCity) {
        // Remove any existing selection (if present!)
        tileElement.classList.remove('selected');
        // Toggle city status
        tileElement.classList.toggle('city');
        if (tileElement.classList.contains('city')) {
            tileElement.textContent = '🏰'; // Isn't it nice? :-)
            tileElement.style.fontSize = '1.5em';
        } else {
            // Restore original coordinate text and attribute emoji
            const tileData = tiles.find(tile => tile.coord === tileId);
            tileElement.textContent = tileId;
            tileElement.style.fontSize = '0.8em'; // Reset font size
            const attrText = document.createElement('div');
            if (tileData && tileData.attribute) {
                attrText.textContent = attributeEmojis[tileData.attribute];
                attrText.style.fontSize = '1.5em';
            }
            tileElement.appendChild(attrText);
        }
    } else {
        // Only allow selection if not a city
        if (!tileElement.classList.contains('city')) {
            tileElement.classList.toggle('selected');
        }
    }
    calculateTotals();
}

// Calculate totals:

function calculateTotals() {
    let totals = { Charisma: 0, Intelligence: 0, Leadership: 0, Strength: 0 };
    let subtotalWithoutStrength = 0;
    let overallTotal = 0;
    const selectedTiles = document.querySelectorAll('.selected');

    selectedTiles.forEach(tileElement => {
        // Skip if the tile is a city
        if (tileElement.classList.contains('city')) return;

        const tileId = tileElement.id;
        const tileData = tiles.find(tile => tile.coord === tileId);

        if (tileData && tileData.attribute) {
            totals[tileData.attribute] += tileData.value;
        }
    });

    // Calculate the subtotal without Strength
    subtotalWithoutStrength = totals.Charisma + totals.Intelligence + totals.Leadership;

    // Calculate the overall total
    overallTotal = subtotalWithoutStrength + totals.Strength;

    displayResults(totals, subtotalWithoutStrength, overallTotal);
}

// Display results:

function displayResults(totals, subtotalWithoutStrength, overallTotal) {
    results.innerHTML = ''; // Clear previous results
    for (let attribute in totals) {
        const p = document.createElement('p');
        p.textContent = `${attribute}: ${totals[attribute].toFixed(1)}M`;
        results.appendChild(p);
    }

    const subtotalP = document.createElement('p');
    subtotalP.innerHTML = `<em>Subtotal without Strength</em>: ${subtotalWithoutStrength.toFixed(1)}M`;
    results.appendChild(subtotalP);

    const overallP = document.createElement('p');
    overallP.innerHTML = `<strong>Overall total</strong>: ${overallTotal.toFixed(1)}M`;
    results.appendChild(overallP);
}

// Initialise all UI elements:
function initialiseUI() {
    darkModeToggle();
    cityModeToggle();
    createGrid();

    // Restore the previous dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
    }
}

// Call initialiseUI when the page loads:
initialiseUI();
