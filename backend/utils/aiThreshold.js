function shouldCallAI(score,trusted){

if(trusted){

return false;

}

return score<70;

}

module.exports=shouldCallAI;