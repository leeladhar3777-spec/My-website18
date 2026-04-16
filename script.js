// BMI + DIET
function calcBMI(){
let h=parseFloat(height.value);
let w=parseFloat(weight.value);

if(!h||!w) return alert("Enter values");

let bmi=w/(h*h);
bmiResult.innerText="BMI: "+bmi.toFixed(2);

let diet="";
if(bmi<18.5){
diet="🍽️ Weight gain diet: milk, rice, eggs, nuts";
}
else if(bmi<25){
diet="🥗 Balanced diet: veggies, protein, water";
}
else{
diet="🔥 Fat loss: low calorie, exercise";
}

dietPlan.innerText=diet;
}

// AI HEALTH
function runAI(){
let age=parseInt(ageAI.value);
let s=symptomsAI.value.toLowerCase();

let score=0;
let cond=[];

if(age>50)score+=2;
if(s.includes("fever")){score+=2;cond.push("Infection");}
if(s.includes("cough")){score+=1;cond.push("Respiratory");}
if(s.includes("chest")){score+=3;cond.push("Heart Risk");}

let level="Low";
if(score>=3)level="Moderate";
if(score>=6)level="High";

aiReport.innerHTML=`Risk: ${level}<br>Conditions: ${cond.join(", ")}`;
}

// CHAT
let step=0;
function startChat(){
step=0;
aiChat.innerHTML="🤖 Main symptom?";
}
function nextChat(input){
aiChat.innerHTML+="<br>👤 "+input;
if(step==0){
aiChat.innerHTML+="<br>🤖 Fever?";
step++;
}else{
aiChat.innerHTML+="<br>🤖 Stay healthy!";
}
}

// PROTEIN
let stage,component,spinning=false;

async function loadProtein(){
viewer.innerHTML="";
stage=new NGL.Stage("viewer");

let id=pdb.value||pdbSelect.value;
component=await stage.loadFile("rcsb://"+id);

component.addRepresentation(representation.value,{color:colorScheme.value});
component.addRepresentation("cartoon",{colorScheme:"sstruc"});
component.autoView();

fetchInfo(id);
}

function toggleSpin(){
spinning=!spinning;
stage.setSpin(spinning);
}

function highlightLigand(){
component.addRepresentation("ball+stick",{sele:"hetero",color:"red"});
}

function highlightActiveSite(){
component.addRepresentation("spacefill",{sele:"resi 45-55",color:"yellow"});
}

function analyzeStructure(){
let h=0,s=0,t=0;
component.structure.eachResidue(r=>{
t++;
if(r.sstruc==="h")h++;
else if(r.sstruc==="e")s++;
});

let hp=(h/t*100).toFixed(1);
let sp=(s/t*100).toFixed(1);
let cp=(100-hp-sp).toFixed(1);

analysisPanel.innerHTML=`Helix:${hp}%<br>Sheet:${sp}%<br>Coil:${cp}%`;

aiInsight(hp,sp);
}

function aiInsight(h,s){
let text="General protein";
if(h>50)text="Structural protein";
if(s>40)text="Binding protein";

analysisPanel.innerHTML+=`<br>🤖 ${text}`;
}

async function fetchInfo(id){
try{
let r=await fetch(`https://data.rcsb.org/rest/v1/core/entry/${id}`);
let d=await r.json();

infoPanel.innerHTML=`<b>${d.struct.title}</b><br>${d.exptl[0].method}`;
}catch{
infoPanel.innerText="Info error";
}
}

// ALIGNMENT PRO
function alignSeq(){

let s1=seq1.value.toUpperCase().replace(/\s+/g,"");
let s2=seq2.value.toUpperCase().replace(/\s+/g,"");

let match="",score=0,matchCount=0;

for(let i=0;i<Math.max(s1.length,s2.length);i++){
let a=s1[i]||"-";
let b=s2[i]||"-";

if(a===b){
match+="|";score+=2;matchCount++;
}
else if(a==="-"||b==="-" ){
match+=" ";score-=2;
}
else{
match+=".";score-=1;
}
}

let identity=(matchCount/Math.max(s1.length,s2.length)*100).toFixed(2);

alignOutput.innerText=s1+"\n"+match+"\n"+s2;
alignStats.innerHTML=`Score:${score}<br>Identity:${identity}%`;
}
