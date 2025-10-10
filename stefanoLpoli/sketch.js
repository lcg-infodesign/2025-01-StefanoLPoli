let table;
let arrayCol0 = [];
let arrayCol1= [];
let arrayCol2= [];
let arrayCol3= [];
let arrayCol4= [];
let rowToKeep;
let mean0
let std1
let mode2
let median3
let mean4
let std4
let xFirstText = -100;
let sizeFirstNo = 0;

let currentLine = 0;
let charIndex = 0;
let displayedLines = [];
let typingSpeed = 3; // più grande = più lenta
let lines = [];


function preload(){
  table = loadTable("dataset.csv","csv","header");
}

function setup() {
  createCanvas(800, 900);

  pushArraysFromTable(table.getRowCount());

  calcStatistics();

  createArrayOfText();
}

function draw() {
  //drawBackgroung(0, 0, width, height, color(20, 25, 35), color(100, 150, 255), 'X');
  background("#dfebb6ff");
  drawBcgLines(30);
  
  push();

  textFont('Courier New');
  textSize(24);

// Mostra le linee già completate
  for (let i = 0; i < displayedLines.length; i++) {
    text(displayedLines[i], 50, 120 + i * 30);
  }
  
  // Se ci sono ancora linee da scrivere
  if (currentLine < lines.length) {
    let fullLine = lines[currentLine];
    let visible = fullLine.substring(0, charIndex);
    
    // Mostra la linea corrente in scrittura
    // Posizionala dopo l'ultima riga completata
    text(visible, 50, 120 + displayedLines.length * 30);
    
    // Animazione della scrittura
    if (frameCount % typingSpeed === 0) {
      charIndex++;
      
      // Se abbiamo finito la riga corrente
      if (charIndex > fullLine.length) {
        displayedLines.push(fullLine);  // aggiungi alla lista completata
        currentLine++;                  // passa alla prossima riga
        charIndex = 0;                  // reset indice caratteri
      }
    } 
  } else {
    // tutte le righe completate → mostra grafico
    drawGraph();
  }

  pop();
}

function drawGraph() {
  let values = [23.5, 45.2, 12.8];
  let labels = ["Media C0", "Media C4", "Dev.Std C4"];

  let graphStart = 100;
  let spacing = 150;

  for (let i = 0; i < values.length; i++) {
    let x = graphStart + i * spacing;
    let targetHeight = map(values[i], 0, 50, 0, 200);
    let grow = constrain((frameCount - 400) / 60, 0, 1);
    let currentHeight = lerp(0, targetHeight, grow);

    fill("black");
    //noStroke();  
    rect(x, height - currentHeight - 100, 50, currentHeight, 10);

    fill("black");
    textAlign(CENTER);
    text(labels[i], x + 25, height - 60);
  }
}

//Crea un array con i testi che vanno scritti
function createArrayOfText(){
  lines.push("Colonna 0 - Media")
  lines.push(nf(mean0, 1, 2))
  lines.push("Colonna 4 - Media")
  lines.push(nf(mean4, 1, 2))
  lines.push("Colonna 4 - Deviazione Std.")
  lines.push(nf(std4, 1, 2))
}

//Faccio le medie, deviazioni, mediane e mode degli array
function calcStatistics(){
  mean0 = mean(arrayCol0);
  std1 = standardDeviation(arrayCol1);
  mode2 = mode(arrayCol2);
  median3 = median(arrayCol3);
  mean4 = mean(arrayCol4);
  std4 = standardDeviation(arrayCol4);
}

//Creo righe di sfondo per effetto "foglio"
function drawBcgLines(lineHeight){
  push();
  for (let y = 0; y < height; y += lineHeight) {
    stroke(40, 50, 60, 50);
    line(0, y, width, y);
  }
  pop();
}

//Riempio gli array con i valori delle righe corrette
function pushArraysFromTable(rowNo){
  rowToKeep = 0;
  
  for(let i=0; i<rowNo; i++){
    if (table.getNum(i, "column2") < 0){
      if (table.getNum(i, "column4")%7 === 0) {
        arrayCol0.push(table.getNum(i, "column0"));
        arrayCol1.push(table.getNum(i, "column1"));
        arrayCol2.push(table.getNum(i, "column2"));
        arrayCol3.push(table.getNum(i, "column3"));
        arrayCol4.push(table.getNum(i, "column4"));
        rowToKeep = rowToKeep+1;
      }
    }
  }
  return rowToKeep;
}

function writeText(xFirstText){
  push();
  textSize(15);
  fill("white");
  noStroke();
  text("Colonna 0 - Media", xFirstText,70);
  text("Colonna 4 - Media", xFirstText,210);
  text("Colonna 4 - Deviazione Std.", xFirstText,350);
  pop();
}

function writeNumber(sizeFirstNo)
{
  push();
  //textAlign(CENTER, CENTER);
  textSize(sizeFirstNo);
  textStyle(BOLD);
  fill(0, 0); // testo trasparente
  // Effetto "bordo sfumato"
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = color("#ffffff"); // colore e trasparenza del bordo
  stroke("#b7b7b7ff"); // contorno
  strokeWeight(3);
  text(nf(mean0, 1, 2), 50, 150);
  text(nf(mean4, 1, 2), 50, 290);
  text(nf(std4, 1, 2), 50, 430);
  pop();
}

// --- Funzioni statistiche ---

//Media
function mean(arr) {
  let sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}

//Deviazione standard
function standardDeviation(arr) {
  let m = mean(arr);
  let variance = mean(arr.map(x => (x - m) ** 2));
  return sqrt(variance);
}

//Moda
function mode(arr) {
  let freq = {};
  arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
  let maxFreq = max(Object.values(freq));
  let modes = Object.keys(freq).filter(k => freq[k] === maxFreq);
  return modes.join(', ');
}

//Mediana
function median(arr) {
  arr = [...arr].sort((a, b) => a - b);
  let mid = floor(arr.length / 2);
  if (arr.length % 2 === 0) return (arr[mid - 1] + arr[mid]) / 2;
  else return arr[mid];
}