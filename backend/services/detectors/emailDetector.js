function isEmail(text){

return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

}

module.exports=isEmail;