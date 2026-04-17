// ================= BMI =================


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
alert("Load a protein first");
return;
}

let helix = 0;
let sheet = 0;
let coil = 0;
let total = 0;

let residues = 0;
let atoms = 0;
let ligands = 0;

let chains = {};
let amino = {};

// ================= SECONDARY STRUCTURE =================
component.structure.eachResidue(r => {

total++;
residues++;

// chain stats
let c = r.chainname || "Unknown";
chains[c] = (chains[c] || 0) + 1;

// amino acid stats
let name = r.resname;
amino[name] = (amino[name] || 0) + 1;

// ligand detection
if(r.isHet) ligands++;

// REAL secondary structure from PDB
// NGL uses: helix = "h", sheet = "e"
if(r.sstruc === "h") helix++;
else if(r.sstruc === "e") sheet++;
else coil++;

});

// ================= ATOM COUNT =================
component.structure.eachAtom(a => {
atoms++;
});

// ================= PERCENTAGE CALC =================
let hPercent = ((helix / total) * 100).toFixed(1);
let sPercent = ((sheet / total) * 100).toFixed(1);
let cPercent = ((coil / total) * 100).toFixed(1);

// ================= TOP AMINO ACIDS =================
let topAA = Object.entries(amino)
.sort((a,b)=>b[1]-a[1])
.slice(0,5)
.map(x=>`${x[0]}: ${x[1]}`)
.join("<br>");

// ================= CHAINS =================
let chainInfo = Object.entries(chains)
.map(x=>`Chain ${x[0]} → ${x[1]} residues`)
.join("<br>");

// ================= OUTPUT =================
analysisPanel.innerHTML = `
<h3>🧬 Protein Structural Analysis</h3>

<b>📌 Secondary Structure:</b><br>
🧪 Helix (α-helix): ${hPercent}%<br>
📄 Sheet (β-sheet): ${sPercent}%<br>
🌀 Coil / Loop: ${cPercent}%<br>

<br><b>📊 Basic Stats:</b><br>
Residues: ${residues}<br>
Atoms: ${atoms}<br>
Ligands: ${ligands}<br>

<br><b>🔗 Chains:</b><br>
${chainInfo}

<br><b>🧬 Top Amino Acids:</b><br>
${topAA}
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
