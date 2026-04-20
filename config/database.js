const express = require('express');
const mongoose = require('mongoose');

const connectDb = async()=>{
    try{
        await mongoose.connect("mongodb://localhost:27017/LIBEAEY_MANAGEMENT_SYSTEM");
        console.log("connected to database successfully");
    }catch(err){
        console.log("error while connecting to database",err);
    }
}
module.exports = connectDb;