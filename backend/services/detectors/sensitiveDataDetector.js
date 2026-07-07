const isValidCard=require("./luhn");
const isAadhaar=require("./aadhaarDetector");
const isPAN=require("./panDetector");
const isEmail=require("./emailDetector");

function detectSensitiveData(text){

return{

creditCard:isValidCard(text),

aadhaar:isAadhaar(text),

pan:isPAN(text),

email:isEmail(text)

};

}

module.exports=detectSensitiveData;