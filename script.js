// ================= BMI =================
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

bmiOut.innerHTML=`
<b>BMI:</b> ${bmi.toFixed(2)}<br>
<b>Category:</b> ${category}<br>
<b>BMR:</b> ${Math.round(bmr)} kcal/day
`;

dietOut.innerText =
category==="Normal"
? "Balanced diet recommended"
: category==="Underweight"
? "High calorie diet needed"
: "Low calorie + exercise required";
}

// ================= PROTEIN ENGINE =================
let stage, component;
let spin=false;
let ligand=false;

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

// BASE VIEW
component.addRepresentation(rep.value,{
colorScheme:"chainname"
});

// CARTOON
component.addRepresentation("cartoon",{
colorScheme:"sstruc"
});

component.autoView();

fetchInfo(pdb);

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

if(!ligand){

component.addRepresentation("ball+stick",{
sele:"hetero and not water",
color:"red"
});

ligand=true;

}else{
loadProtein();
ligand=false;
}
}

// ================= ACTIVE SITE =================
function toggleActiveSite(){

if(!component) return;

component.removeAllRepresentations();

// base
component.addRepresentation(rep.value,{
colorScheme:"chainname"
});

component.addRepresentation("cartoon",{
colorScheme:"sstruc"
});

// ligand
component.addRepresentation("ball+stick",{
sele:"hetero and not water",
color:"red"
});

// active site pocket
component.addRepresentation("spacefill",{
sele:"within 4 of (hetero and not water)",
color:"yellow",
opacity:0.7
});

component.autoView();
}

// ================= ANALYSIS =================
function analyzeProtein(){

if(!component){
alert("Load protein first");
return;
}

let residues=0, atoms=0, ligands=0;
let chains={};
let amino={};

component.structure.eachResidue(r=>{
residues++;

chains[r.chainname]=(chains[r.chainname]||0)+1;
amino[r.resname]=(amino[r.resname]||0)+1;

if(r.isHet) ligands++;
});

component.structure.eachAtom(a=>{
atoms++;
});

let topAA = Object.entries(amino)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)
.map(x=>`${x[0]} (${x[1]})`)
.join("<br>");

let chainInfo = Object.entries(chains)
.map(x=>`Chain ${x[0]}: ${x[1]}`)
.join("<br>");

analysisPanel.innerHTML=`
<h3>🔬 Protein Analysis Report</h3>
<b>Residues:</b> ${residues}<br>
<b>Atoms:</b> ${atoms}<br>
<b>Ligands:</b> ${ligands}<br>
<br><b>Chains:</b><br>${chainInfo}
<br><br><b>Top Amino Acids:</b><br>${topAA}
`;
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
