let stage, component;
let spinning=false;

// ================= BMI =================
function calcBMI(){

let h_cm = parseFloat(height.value);
let w = parseFloat(weight.value);

if(!h_cm || !w){
alert("Enter values");
return;
}

let h = h_cm/100;
let bmi = w/(h*h);

let category="";

if(bmi<18.5) category="Underweight";
else if(bmi<25) category="Normal";
else if(bmi<30) category="Overweight";
else category="Obese";

let min=(18.5*h*h).toFixed(1);
let max=(24.9*h*h).toFixed(1);

bmiOut.innerHTML=`
<b>BMI:</b> ${bmi.toFixed(2)}<br>
<b>Category:</b> ${category}<br>
<b>Ideal Weight:</b> ${min} - ${max} kg
`;

dietOut.innerText =
category==="Normal"
? "Balanced diet recommended"
: category==="Underweight"
? "High calorie diet required"
: "Low calorie + exercise required";
}

// ================= PROTEIN VIEWER =================
function init(){
stage = new NGL.Stage("viewer");
}

async function loadProtein(){

document.getElementById("viewer").innerHTML="";
init();

let pdb = pdbInput.value || pdbSelect.value;

try{

component = await stage.loadFile("rcsb://" + pdb);

// MAIN REPRESENTATION
component.addRepresentation(rep.value,{
colorScheme: color.value
});

// STRUCTURE CARTOON
component.addRepresentation("cartoon",{
colorScheme:"sstruc"
});

component.autoView();

fetchInfo(pdb);

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
}

// ================= LIGANDS =================
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

// ================= ANALYSIS =================
function analyzeStructure(){

let helix=0, sheet=0, total=0;

component.structure.eachResidue(r=>{
total++;
if(r.sstruc==="h") helix++;
else if(r.sstruc==="e") sheet++;
});

let h=(helix/total*100).toFixed(1);
let s=(sheet/total*100).toFixed(1);
let c=(100-h-s).toFixed(1);

analysis.innerHTML=`
<b>Helix:</b> ${h}%<br>
<b>Sheet:</b> ${s}%<br>
<b>Coil:</b> ${c}%<br>
`;
}

// ================= PROTEIN INFO =================
async function fetchInfo(pdb){

try{
let res=await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdb}`);
let d=await res.json();

proteinInfo.innerHTML=`
<b>Title:</b> ${d.struct.title}<br>
<b>Method:</b> ${d.exptl[0].method}
`;

}catch{
proteinInfo.innerText="Info not available";
}
}
