let stage, component;
let spinning = false;

// LOAD PROTEIN
async function loadProtein(){
  viewer.innerHTML="";
  stage = new NGL.Stage("viewer");

  let pdbID = pdb.value || pdbSelect.value;

  component = await stage.loadFile("rcsb://" + pdbID);

  component.addRepresentation(representation.value, {
    color: colorScheme.value
  });

  component.addRepresentation("cartoon", {
    colorScheme: "sstruc"
  });

  component.autoView();

  fetchInfo(pdbID);
}

// ROTATE
function toggleSpin(){
  spinning = !spinning;
  stage.setSpin(spinning);
}

// LIGAND
function highlightLigand(){
  component.addRepresentation("ball+stick", {
    sele: "hetero",
    color: "red"
  });
}

// ACTIVE SITE (demo region)
function highlightActiveSite(){
  component.addRepresentation("spacefill", {
    sele: "resi 45-55",
    color: "yellow"
  });
}

// STRUCTURE ANALYSIS
function analyzeStructure(){
  let helix=0, sheet=0, total=0;

  component.structure.eachResidue(r=>{
    total++;
    if(r.sstruc==="h") helix++;
    else if(r.sstruc==="e") sheet++;
  });

  let helixP = (helix/total*100).toFixed(1);
  let sheetP = (sheet/total*100).toFixed(1);
  let coilP = (100 - helixP - sheetP).toFixed(1);

  analysisPanel.innerHTML = `
    <h4>📊 Structure</h4>
    Helix: ${helixP}%<br>
    Sheet: ${sheetP}%<br>
    Coil: ${coilP}%
  `;

  aiInsight(helixP, sheetP);
}

// AI INSIGHT
function aiInsight(h,s){
  let insight = "General protein";

  if(h > 50) insight = "Likely structural protein";
  if(s > 40) insight = "May have binding/enzymatic role";

  analysisPanel.innerHTML += `<p>🤖 Insight: ${insight}</p>`;
}

// FETCH INFO
async function fetchInfo(pdbID){
  try{
    let res = await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbID}`);
    let data = await res.json();

    infoPanel.innerHTML = `
      <h4>${data.struct.title}</h4>
      Method: ${data.exptl[0].method}
    `;
  }catch{
    infoPanel.innerText = "Info load failed";
  }
}
