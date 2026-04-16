// ================= BMI =================
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

// ================= PROTEIN VIEWER =================
let stage, component;
let spinning=false;

function initViewer(){
stage = new NGL.Stage("viewer");
}

async function loadProtein(){

document.getElementById("viewer").innerHTML="";
initViewer();

let pdb = pdbInput.value || pdbSelect.value;

try{

component = await stage.loadFile("rcsb://" + pdb);

component.addRepresentation(rep.value,{
colorScheme: color.value
});

component.addRepresentation("cartoon",{
colorScheme:"sstruc"
});

component.autoView();

fetchProteinInfo(pdb);

}catch(e){
alert("Protein load failed");
}
}

// ROTATE
function toggleSpin(){
spinning=!spinning;
stage.setSpin(spinning);
}

// RESET
function resetView(){
component.autoView();
stage.setSpin(false);
spinning=false;
}

// ================= PROTEIN INFO =================
async function fetchProteinInfo(pdb){

try{
let res = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdb}`);
let data = await res.json();

proteinInfo.innerHTML = `
<b>Title:</b> ${data.struct.title}<br>
<b>Method:</b> ${data.exptl[0].method}
`;

}catch{
proteinInfo.innerText="Info not available";
}
}

// ================= STRUCTURE ANALYSIS =================
function analyzeStructure(){

let helix=0, sheet=0, total=0;

component.structure.eachResidue(r=>{
total++;
if(r.sstruc==="h") helix++;
else if(r.sstruc==="e") sheet++;
});

let hp=(helix/total*100).toFixed(1);
let sp=(sheet/total*100).toFixed(1);
let cp=(100-hp-sp).toFixed(1);

analysis.innerHTML=`
<b>Helix:</b> ${hp}%<br>
<b>Sheet:</b> ${sp}%<br>
<b>Coil:</b> ${cp}%<br>
`;
}

// ================= ALIGNMENT (BLAST STYLE) =================
function score(a,b){
if(a===b) return 2;
if(a==="-"||b==="-") return -2;
return -1;
}

function alignSeq(){

let q = seq1.value.toUpperCase().replace(/\s+/g,"");
let s = seq2.value.toUpperCase().replace(/\s+/g,"");

let qA="", m="", sA="";
let scoreTotal=0, matches=0;

let len=Math.max(q.length,s.length);

for(let i=0;i<len;i++){

let a=q[i]||"-";
let b=s[i]||"-";

scoreTotal += score(a,b);

if(a===b && a!=="-"){
qA+=a; m+="|"; sA+=b; matches++;
}
else{
qA+=a;
m+=" ";
sA+=b;
}
}

let identity=((matches/len)*100).toFixed(2);

alignOut.innerText =
"Query  1  "+qA+"\n"+
"        "+m+"\n"+
"Sbjct  1  "+sA;

alignStats.innerHTML=`
<b>Score:</b> ${scoreTotal}<br>
<b>Identity:</b> ${identity}%
`;
}
