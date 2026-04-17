// ================= BMI =================
function calcBMI(){

let h_cm = parseFloat(height.value);
let w = parseFloat(weight.value);
let ageVal = parseInt(age.value);
let genderVal = gender.value;

if(!h_cm || !w){
alert("Enter valid values");
return;
}

let h = h_cm / 100;
let bmi = w / (h*h);

// CATEGORY
let category="";
if(bmi < 18.5) category="Underweight";
else if(bmi < 25) category="Normal";
else if(bmi < 30) category="Overweight";
else category="Obese";

// IDEAL WEIGHT
let min = (18.5*h*h).toFixed(1);
let max = (24.9*h*h).toFixed(1);

// BMR
let bmr=0;
if(genderVal==="male"){
bmr = 10*w + 6.25*h_cm - 5*ageVal + 5;
}else{
bmr = 10*w + 6.25*h_cm - 5*ageVal - 161;
}

bmiOut.innerHTML = `
<b>BMI:</b> ${bmi.toFixed(2)}<br>
<b>Category:</b> ${category}<br>
<b>Ideal Weight:</b> ${min} - ${max} kg<br>
<b>BMR:</b> ${Math.round(bmr)} kcal/day
`;

dietOut.innerText =
category==="Normal"
? "Balanced diet recommended"
: category==="Underweight"
? "High calorie diet required"
: "Calorie deficit + exercise required";
}

// ================= PROTEIN VIEWER =================
let stage, component;
let spinning=false;

function initViewer(){
stage = new NGL.Stage("viewer");
}

function loadProtein(){

document.getElementById("viewer").innerHTML="";
initViewer();

let pdb = pdbInput.value || proteinList.value || "1CRN";

stage.loadFile("rcsb://" + pdb).then(comp=>{

component = comp;

// MAIN STRUCTURE
component.addRepresentation(rep.value,{
colorScheme:"chainname"
});

// CARTOON OVERLAY
component.addRepresentation("cartoon",{
colorScheme:"sstruc"
});

component.autoView();

fetchInfo(pdb);

}).catch(()=>{
alert("Protein not found");
});
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
}

// ================= LIGAND =================
function showLigand(){
component.addRepresentation("ball+stick",{
sele:"hetero",
color:"red"
});
}

// ================= ACTIVE SITE =================
function showActiveSite(){
component.addRepresentation("spacefill",{
sele:"within 5 of ligand",
color:"yellow"
});
}

// ================= INFO =================
async function fetchInfo(pdb){

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
