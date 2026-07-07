const express=require("express");
const router=express.Router();

const detect=require("../services/detectors/sensitiveDataDetector");

router.post("/detect",(req,res)=>{

const{text}=req.body;

res.json(detect(text));

});

module.exports=router;