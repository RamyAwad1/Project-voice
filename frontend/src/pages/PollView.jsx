import { useEffect,useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client"

//connect the socket to the backend
const socket=io('http://localhost5000');

const PollView = () =>{

    const{id}=useParams(); // to get the id from the url
    const [poll,setPoll]=useState(null);
    const [options,setOptions]=useState([]);
    const [hasVoted,setHasVoted]=useState(false);



//fetch poll data on load 
useEffect(()=>{
    const fetchpoll =async() =>{
        try{
            const res= await axios.get(`http://localhost:5000/api/polls/${id}`);
            setPoll(res.data.poll);
            // sort options by id so they dont jump around when updating
            setOptions(res.data.options.sort( (a,b)=> a.id - b.id ));
        }catch(err){
            console.error(err);
        }
    };
    fetchpoll();

// listen for the voteudate messages from the server 
socket.on('voteUpdate',(data)=>{

  //we only update if the vote is for this poll
  if(data.pollId === id){
    setOptions((prevOptions)=>{
      
      return prevOptions.map(opt =>
        opt.id === data.updatedOption.id ? data.updatedOption :opt
      );
    });
  }

});

// clean up by turning off the listener whe we leave the page 
return()=> {
  socket.off('voteUpdate');
};

},[id]);





//handle voting
const handleVote = async(optionId)=>{
    try{
        await axios.post(`http://localhost:5000/api/polls/${id}/vote`,{optionId});
        setHasVoted(true);
        alert("Thanks for voting!");

        //optional but we can reload data here in the window to see updated numbers immediately if we dont want to use sockets
        
    }catch(err){
        console.error(err);
        alert("Vote failed try again");
    }
};

if(!poll) return <h2>Loading...</h2>;

// note the inline styling will be removed later on as its now used for testing purpose
return(

    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h1>{poll.title}</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
        {options.map((opt) => (
          <button 
            key={opt.id}
            onClick={() => handleVote(opt.id)}
            disabled={hasVoted} // Disable buttons after voting
            style={{
              padding: '15px',
              fontSize: '18px',
              cursor: hasVoted ? 'not-allowed' : 'pointer',
              backgroundColor: hasVoted ? '#ddd' : '#007bff',
              color: hasVoted ? '#555' : 'white',
              border: 'none',
              borderRadius: '5px'
            }}
          >
            {opt.option_text} 
            {/* Show vote count only after voting (simple version) */}
            {` (${opt.votes} votes)`} 
          </button>
        ))}
      </div>
    </div>

  );
};

export default PollView;