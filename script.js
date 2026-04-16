let stage, component;

// ---------------- BMI ----------------
function calcBMI(){

let h_cm = parseFloat(height.value);
let w = parseFloat(weight.value);
let age = parseInt(ageBMI.value);
let gender = document.getElementById("gender").value;

if(!h_cm || !w || !age){
  alert("Enter all values");
  return;
}

// convert cm → meters
let h = h_cm / 100;

// BMI
let bmi = w / (h * h);

// Category
let category="",risk="";
if(bmi < 18.5){category="Underweight";risk="Nutritional deficiency";}
else if(bmi < 25){category="Normal";risk="Low risk";}
else if(bmi < 30){category="Overweight";risk="Moderate risk";}
else{category="Obese";risk="High risk";}

// Ideal weight range
let minWeight = (18.5 * h * h).toFixed(1);
let maxWeight = (24.9 * h * h).toFixed(1);

// BMR (calories)
let bmr=0;
if(gender==="male"){
  bmr = 10*w + 6.25*h_cm - 5*age + 5;
}else{
  bmr = 10*w + 6.25*h_cm - 5*age - 161;
}

// Diet
let diet="";
if(category==="Underweight"){
  diet="🍽️ High calorie diet: milk, rice, eggs, nuts";
}
else if(category==="Normal"){
  diet="🥗 Balanced diet: veggies, protein, fruits";
}
else{
  diet="🔥 Fat loss: low calorie, exercise";
}

// Output
bmiResult.innerHTML = `<h3>BMI: ${bmi.toFixed(2)}</h3>`;

bmiDetails.innerHTML = `
<p><b>Category:</b> ${category}</p>
<p><b>Health Risk:</b> ${risk}</p>
<p><b>Ideal Weight:</b> ${minWeight}kg - ${maxWeight}kg</p>
<p><b>Daily Calories:</b> ${Math.round(bmr)} kcal</p>
`;

dietPlan.innerHTML = `<p>${diet}</p>`;
}

// ---------------- PROTEIN VIEWER ----------------
async function loadProtein(){

document.getElementById("viewer").innerHTML = "";

stage = new NGL.Stage("viewer");

let pdb = document.getElementById("pdb").value 
       || document.getElementById("pdbSelect").value;

try{
component = await stage.loadFile("rcsb://" + pdb);

component.addRepresentation("cartoon", {
colorScheme: "chainname"
});

component.autoView();

fetchProteinInfo(pdb);

}catch(e){
alert("Protein load failed. Check PDB ID or internet.");
}
}

// rotate
function toggleSpin(){
if(stage){
stage.setSpin(!stage.spin);
}
}

// ---------------- PROTEIN INFO ----------------
async function fetchProteinInfo(pdb){

try{
let res = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdb}`);
let data = await res.json();

document.getElementById("proteinInfo").innerHTML = `
<b>Title:</b> ${data.struct.title}<br>
<b>Method:</b> ${data.exptl[0].method}
`;

}catch{
document.getElementById("proteinInfo").innerText = "Info not available";
}
}

// ---------------- ALIGNMENT ----------------
function alignSeq(){

let s1 = seq1.value.toUpperCase().replace(/\s+/g,"");
let s2 = seq2.value.toUpperCase().replace(/\s+/g,"");

let match="",score=0,matchCount=0;

for(let i=0;i<Math.max(s1.length,s2.length);i++){

let a=s1[i]||"-";
let b=s2[i]||"-";

if(a===b){
match+="|";
score+=2;
matchCount++;
}
else{
match+=" ";
score-=1;
}
}

let identity = ((matchCount/Math.max(s1.length,s2.length))*100).toFixed(2);

alignOutput.innerText =
s1 + "\n" + match + "\n" + s2;

alignStats.innerHTML = `
<b>Score:</b> ${score}<br>
<b>Identity:</b> ${identity}%
`;
  }
