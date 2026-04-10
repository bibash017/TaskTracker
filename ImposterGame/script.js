let playerCount = 4; 
let mode = null; 
let playerNames = []; 
let editingIndex = 1; 

// ── Difficulty descriptions ──
const modeDescs = {
  easy:   'common, familiar words — great for mixed groups',
  medium: 'a bit trickier, vague hints',
  hard:   'abstract words, barely-there hints'
};

// ── Fill playerNames array up to n players ──
// If n grows, add new default names. If n shrinks, trim the array.
function initNames(n) {
  while (playerNames.length < n) {
    playerNames.push('player ' + (playerNames.length + 1));
  }
  playerNames = playerNames.slice(0, n);
}

// ── Build the 2–10 player count buttons ──
function buildCountButtons() {
  const row = document.getElementById('countRow');
  row.innerHTML = '';
 
  for (let i = 2; i <= 10; i++) {
    const btn = document.createElement('button');
    btn.className = 'count-btn' + (i === playerCount ? ' active' : '');
    btn.textContent = i;
    btn.onclick = () => {
      playerCount = i;
      initNames(i);
      buildCountButtons();
      renderPlayers();
    };
    row.appendChild(btn);
  }
}