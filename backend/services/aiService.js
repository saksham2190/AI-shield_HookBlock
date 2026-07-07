const model=require("../config/geminiConfig");

const buildPrompt=require("./geminiPrompt");

const parseAI=require("./parser");

async function analyzeWithAI(data){

try{

const prompt=buildPrompt(data);

const result=await model.generateContent(prompt);

const response=result.response.text();

return parseAI(response);

}
catch(err){

return{

phishingProbability:0,

confidence:0,

risk:"Unknown",

reason:"Gemini unavailable"

};

}

}

module.exports=analyzeWithAI;