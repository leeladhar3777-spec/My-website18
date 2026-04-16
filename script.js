// BMI + DIET
function calcBMI(){
let h=parseFloat(height.value);
let w=parseFloat(weight.value);

let bmi=w/(h*h);
bmiResult.innerText="BMI: "+bmi.toFixed(2);

let diet="";
if(bmi<18.5){
diet="🍽️ Eat high calorie foods";
}else if(bmi<25){
diet="🥗 Maintain balanced diet";
}else{
diet="🔥 Reduce calories & exercise";
}
dietPlan.innerText=diet;
}

// AI HEALTH
function runAI(){
let age=parseInt(ageAI.value);
let s=symptomsAI.value.toLowerCase();

let score=0;
if(age>50)score+=2;
if(s.includes("fever"))score+=2;
if(s.includes("chest"))score+=3;

let level="Low";
if(score>=3)level="Moderate";
if(score>=6)level="High";

aiReport.innerHTML="Risk: "+level;
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
}
else{
aiChat.innerHTML+="<br>🤖 Stay healthy!";
}
}

// PROTEIN
let stage,component;
async function loadProtein(){
viewer.innerHTML="";
stage=new NGL.Stage("viewer");

let id=pdb.value||pdbSelect.value;
component=await stage.loadFile("rcsb://"+id);
component.addRepresentation("cartoon");
component.autoView();
}

function analyzeStructure(){
let h=0,t=0;
component.structure.eachResidue(r=>{
t++;
if(r.sstruc==="h")h++;
});
analysisPanel.innerText="Helix%: "+((h/t)*100).toFixed(1);
}

// ALIGNMENT
function alignSeq(){
let s1=seq1.value.toUpperCase();
let s2=seq2.value.toUpperCase();

let match="";
let score=0;

for(let i=0;i<Math.max(s1.length,s2.length);i++){
let a=s1[i]||"-";
let b=s2[i]||"-";

if(a===b){match+="|";score+=2;}
else{match+=" ";score-=1;}
}

alignOutput.innerText=s1+"\n"+match+"\n"+s2;
alignStats.innerText="Score: "+score;
}
