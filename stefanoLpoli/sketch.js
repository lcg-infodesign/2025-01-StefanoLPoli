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
    text(displayedLines[i], chartX, 120 + i * 30);
  }
  
  // Se ci sono ancora linee da scrivere
  if (currentLine < lines.length) {
    let fullLine = lines[currentLine];
    let visible = fullLine.substring(0, charIndex);
    
    // Mostra la linea corrente in scrittura
    // Posizionala dopo l'ultima riga completata
    text(visible, chartX, 120 + displayedLines.length * 30);
    
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
    updateBarAnimations();
    drawBarChart();
  }

  pop();
}

//Crea un array con i testi che vanno scritti
function createArrayOfText(){
  lines.push("Colonna 0 - Media")
  lines.push(nf(mean0, 1, 2))
  lines.push("Colonna 4 - Media")
  lines.push(nf(mean4, 1, 2))
  lines.push("Colonna 4 - Deviazione Std.")
  lines.push(nf(std4, 1, 2))
  lines.push(" ")
  lines.push(" ")
  lines.push("Statistiche")
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







//Funzioni per disegnare il grafico
function updateBarAnimations() {
  // Animazione smooth verso i valori target
  animatedStd1 = lerp(animatedStd1, std1, animationSpeed);
  animatedMode2 = lerp(animatedMode2, mode2, animationSpeed);
  animatedMedian3 = lerp(animatedMedian3, median3, animationSpeed);
}

// Variabili per l'animazione
let animatedStd1 = 0;
let animatedMode2 = 0;
let animatedMedian3 = 0;
let animationSpeed = 0.1; // Velocità animazione (0-1)

// Configurazione del grafico
let chartX = 100;
let chartY = 540;
let chartWidth = 400;
let chartHeight = 200;
let barWidth = 80;
let maxValue = 100;

function drawBarChart() {  
  // Calcola le posizioni delle barre
  let bar1X = chartX + 50;
  let bar2X = chartX + 150;
  let bar3X = chartX + 250;
  
  // Array dei dati ANIMATI
  let data = [
    { 
      value: animatedStd1, 
      target: nf(std1,1,2),
      x: bar1X, 
      label: "Dev. Std.\nCol. 1", 
      color: [255, 100, 100] 
    },
    { 
      value: animatedMode2, 
      target: mode2,
      x: bar2X, 
      label: "Moda\nCol. 2", 
      color: [100, 255, 100] 
    },
    { 
      value: animatedMedian3, 
      target: median3,
      x: bar3X, 
      label: "Mediana\nCol. 3", 
      color: [100, 100, 255] 
    }
  ];
  
  // Disegna le barre animate
  for (let i = 0; i < data.length; i++) {
    let bar = data[i];
    let barHeight = map(abs(bar.value), 0, maxValue, 0, chartHeight);
    
    // Colore della barra
    fill(bar.color[0], bar.color[1], bar.color[2], 150);
    
    // Disegna barra (direzione in base al segno)
    if (bar.value >= 0) {
      // Valori positivi - barra che sale
      rect(bar.x, chartY - barHeight, barWidth, barHeight);
    } else {
      // Valori negativi - barra che scende
      rect(bar.x, chartY, barWidth, barHeight);
    }
    
    // Etichetta sotto alle barre
    fill("black");
    textSize(12);
    text(bar.label, bar.x + 10, chartY + 60);
    
    // Valore corrente sopra/sotto la barra
    if (bar.value >= 0) {
      text(nf(bar.value, 1, 1), bar.x + 25, chartY - barHeight - 10);
    } else {
      text(nf(bar.value, 1, 1), bar.x + 25, chartY + barHeight + 15);
    }
    
  }
  
  // Linea zero per valori negativi/positivi
  stroke(150);
  line(chartX, chartY, chartX + chartWidth, chartY);
  noStroke();
}
