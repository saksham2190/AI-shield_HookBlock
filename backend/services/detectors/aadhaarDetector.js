function isAadhaar(text){

return /\b\d{4}\s?\d{4}\s?\d{4}\b/.test(text);

}

module.exports=isAadhaar;