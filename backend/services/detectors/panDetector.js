function isPAN(text){

return /[A-Z]{5}[0-9]{4}[A-Z]{1}/.test(text);

}

module.exports=isPAN;