// ================= BMI + BMR =================
function calcBMI(){

let h = parseFloat(height.value);
let w = parseFloat(weight.value);
let ageVal = parseInt(age.value);
let genderVal = gender.value;

if(!h || !w){
alert("Enter values");
return;
}

h = h/100;

// BMI
let bmi = w/(h*h);

let category="";
if(bmi<18.5) category="Underweight";
else if(bmi<25) category="Normal";
else if(bmi<30) category="Overweight";
else category="Obese";

// BMR
let bmr = (genderVal==="male")
? 10*w + 6.25*(h*100) - 5*ageVal + 5
: 10*w + 6.25*(h*100) - 5*ageVal - 161;

bmiOut.innerHTML = `
<b>BMI:</b> ${bmi.toFixed(2)}<br>
<b>Category:</b> ${category}<br>
<b>BMR:</b> ${Math.round(bmr)} kcal/day
`;

dietOut.innerText =
category==="Normal"
? "Balanced diet recommended"
: category==="Underweight"
? "High calorie diet"
: "Low calorie + exercise";
}

// ================= PROTEIN ENGINE =================
let stage, component;
let spin=false;
let ligandOn=false;
let activeOn=false;

function init(){
stage = new NGL.Stage("viewer");
}

// LOAD PROTEIN
function loadProtein(){

document.getElementById("viewer").innerHTML="";
init();

let pdb = pdbInput.value || proteinList.value || "1CRN";

stage.loadFile("rcsb://" + pdb).then(comp=>{

component = comp;

// base view
component.addRepresentation(rep.value,{
colorScheme:"chainname"
});

component.addRepresentation("cartoon",{
colorScheme:"sstruc"
});

component.autoView();

fetchInfo(pdb);

}).catch(()=>{
alert("Protein load failed");
});
}

// ROTATE
function toggleSpin(){
spin=!spin;
stage.setSpin(spin);
}

// RESET
function resetView(){
component.autoView();
stage.setSpin(false);
}

// ================= LIGAND =================
function toggleLigand(){

if(!component) return;

if(!ligandOn){
component.addRepresentation("ball+stick",{
sele:"hetero",
color:"red"
});
ligandOn=true;
}else{
loadProtein();
ligandOn=false;
}
}

// ================= ACTIVE SITE =================
function toggleActiveSite(){

if(!component) return;

if(!activeOn){

component.addRepresentation("spacefill",{
sele:"within 5 of hetero",
color:"yellow"
});

activeOn=true;

}else{
loadProtein();
activeOn=false;
}
}

// ================= INFO =================
async function fetchInfo(pdb){

try{
let res = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdb}`);
let data = await res.json();

proteinInfo.innerHTML=`
<b>Title:</b> ${data.struct.title}<br>
<b>Method:</b> ${data.exptl[0].method}
`;

}catch{
proteinInfo.innerText="Info not available";
}
}
