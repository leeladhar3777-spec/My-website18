let historyData = JSON.parse(localStorage.getItem("bmiHistory")) || [];
let stage, component, isRotating=false;

// BMI
function calcBMI(){
let h=parseFloat(height.value);
let w=parseFloat(weight.value);
if(!h||!w)return alert("Enter valid");

let bmi=w/(h*h);
bmiResult.innerText="BMI: "+bmi.toFixed(2);

historyData.push(bmi);
localStorage.setItem("bmiHistory",JSON.stringify(historyData));

history.innerHTML="";
historyData.forEach(v=>{
let li=document.createElement("li");
li.innerText=v.toFixed(2);
history.appendChild(li);
});

new Chart(chart,{
type:"line",
data:{labels:historyData.map((_,i)=>i+1),
datasets:[{data:historyData}]}
});
}

// AI prediction
function predict(){
let ageVal=age.value;
let sym=symptom.value.toLowerCase();
let res="Low Risk";
if(ageVal>50||sym.includes("fever"))res="Moderate Risk";
if(sym.includes("chest"))res="High Risk";
prediction.innerText=res;
}

// Protein load
async function loadProtein(){
viewer.innerHTML="";
stage=new NGL.Stage("viewer");

let pdbID=pdb.value||pdbSelect.value;
component=await stage.loadFile("rcsb://"+pdbID);

component.addRepresentation(representation.value,{color:colorScheme.value});
component.addRepresentation("cartoon",{colorScheme:"sstruc"});

component.autoView();
fetchInfo(pdbID);
}

// Rotate
function toggleRotate(){
isRotating=!isRotating;
stage.setSpin(isRotating);
}

// Ligand
function highlightLigand(){
component.addRepresentation("ball+stick",{sele:"hetero",color:"red"});
}

// Structure analysis
function analyzeStructure(){
let h=0,s=0,t=0;
component.structure.eachResidue(r=>{
t++;
if(r.sstruc==="h")h++;
else if(r.sstruc==="e")s++;
});
analysisPanel.innerHTML=`
Helix: ${(h/t*100).toFixed(1)}%<br>
Sheet: ${(s/t*100).toFixed(1)}%<br>
Coil: ${(100-(h/t*100+s/t*100)).toFixed(1)}%
`;
}

// Fetch info
async function fetchInfo(pdbID){
try{
let r=await fetch(`https://data.rcsb.org/rest/v1/core/entry/${pdbID}`);
let d=await r.json();
infoPanel.innerHTML=`
<b>${d.struct.title}</b><br>
Method: ${d.exptl[0].method}
`;
}catch{
infoPanel.innerText="Info load failed";
}
}

// Sequence alignment
function alignSeq(){
let s1=seq1.value.toUpperCase();
let s2=seq2.value.toUpperCase();
let match="";
for(let i=0;i<Math.min(s1.length,s2.length);i++){
match+=(s1[i]===s2[i])?"|":" ";
}
alignOutput.innerText=s1+"\\n"+match+"\\n"+s2;
}
