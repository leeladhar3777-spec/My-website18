let historyData = JSON.parse(localStorage.getItem("bmiHistory")) || [];

// BMI
function calcBMI(){
  let h = parseFloat(document.getElementById("height").value);
  let w = parseFloat(document.getElementById("weight").value);

  if(!h || !w) return alert("Enter valid values");

  let bmi = w/(h*h);

  document.getElementById("bmiResult").innerText = "BMI: " + bmi.toFixed(2);

  historyData.push(bmi);
  localStorage.setItem("bmiHistory", JSON.stringify(historyData));

  updateHistory();

  new Chart(document.getElementById("chart"), {
    type: "line",
    data: {
      labels: historyData.map((_,i)=>i+1),
      datasets: [{ label:"BMI Trend", data: historyData }]
    }
  });
}

// HISTORY
function updateHistory(){
  let list = document.getElementById("history");
  list.innerHTML = "";

  historyData.forEach(v=>{
    let li = document.createElement("li");
    li.innerText = v.toFixed(2);
    list.appendChild(li);
  });
}

updateHistory();

// AI Prediction
function predict(){
  let age = document.getElementById("age").value;
  let sym = document.getElementById("symptom").value.toLowerCase();

  let result = "Low Risk";

  if(age > 50 || sym.includes("fever")) result = "Moderate Risk";
  if(sym.includes("chest pain") || sym.includes("breathing")) result = "High Risk";

  document.getElementById("prediction").innerText = result;
}

// Protein Viewer
let stage;

function loadProtein(){
  stage = new NGL.Stage("viewer");

  let pdb = document.getElementById("pdb").value;

  stage.loadFile("rcsb://" + pdb).then(o=>{
    o.addRepresentation("cartoon");
    o.autoView();
  });
}

// Chatbot
function chat(){
  let q = document.getElementById("chatInput").value.toLowerCase();
  let ans = "Ask biology topic";

  if(q.includes("cell")) ans = "Cell is the basic unit of life";
  else if(q.includes("dna")) ans = "DNA stores genetic information";
  else if(q.includes("protein")) ans = "Proteins perform vital biological functions";
  else if(q.includes("immunity")) ans = "Immunity protects against diseases";

  document.getElementById("chatOutput").innerText = ans;
}
