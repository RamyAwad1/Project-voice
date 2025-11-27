const {Pool}= require ('pg');
require('dotenv').config();

//create a pool for db connection 
const pool= new Pool({
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
host: process.env.DB_HOST,
port: process.env.DB_PORT,
database: process.env.DB_NAME,
});

//a quick test for the connection
pool.connect((err,client,release)=>{
    if(err){
        return console.error('Error aquiring the client',err.stack);
    }
    console.log('Connection to the database was established successfully');
});

module.exports=pool;
