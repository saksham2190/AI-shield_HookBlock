function parseAI(text){

try{

return JSON.parse(text);

}
catch{

return{

phishingProbability:0,

confidence:0,

risk:"Unknown",

reason:"Unable to parse AI response"

};

}

}

module.exports=parseAI;