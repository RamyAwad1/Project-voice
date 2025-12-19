const router= require('express').Router();
const pool = require('../db');

//1. create a poll
router.post('/',async(req , res)=>{
    const {title,options}=req.body;
 
    try{
        //insert a poll title 
        const pollResult=await pool.query(
            'INSERT INTO polls (title) VALUES ($1) RETURNING *',[title]
        );
        const newPoll= pollResult.rows[0];

        //insert all options by looping through them
        // promise.all is used to make sure all options are saved before finishing
        const optionPromises = options.map((opt)=>{
            return pool.query(
                'INSERT INTO options (poll_id,option_text) VALUES ($1,$2)',[newPoll.id,opt]
            );
        });
        
        await Promise.all(optionPromises);
        res.json(newPoll);
    }catch (err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//2. get poll by id 
router.get('/:id',async(req,res)=>{

    try{
        const {id}=req.params;

        //get the poll title
        const poll=await pool.query('SELECT * FROM polls WHERE id=$1',[id]);

        //get the poll options for this poll 
        const options= await pool.query('SELECT * FROM options WHERE poll_id=$1',[id]);

        if(poll.rows.length===0){
            return res.status(404).json({msg:"Poll not found !!"});
        }

        res.json({
            poll:poll.rows[0],
            options:options.rows
        });

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//3. Vote to an option from the poll 
router.post('/:id/vote',async(req,res)=>{

    const {optionId}=req.body; //send the option from the frontend 
    const {id}=req.params;
    try{
        // as simple sql to find the option by id and add 1 to the votes
       const update= await pool.query(
            'UPDATE options SET votes = votes + 1 WHERE id=$1 RETURNING *',[optionId]
        );

        if(update.rows.length === 0){
            return res.status(404).json({msg:"Option not found"});
        }

        //get the io instance from the server.js 
        const io=req.app.get('socketio');

        //now we emit the update event to everyone by sending the id and the updated option data
        io.emit('voteUpdate' , {
            pollId:id,
            updatedOption:update.rows[0]
         });


        res.json({message:"Vote counted!",updatedOption:update.rows[0]});
    }catch(err){
        console.error("Vote Error",err.message);
        res.status(500).send('Server Error');
    }

});

module.exports=router;