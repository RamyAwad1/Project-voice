import { useState } from "react";
import axios from 'axios';

const CreatePoll = () =>{
const[title, setTitle]=useState('');
const[options,setOptions]=useState(['','']);


const handleOptionChange = (index , value)=>{

    const newOptions=[...options];
    newOptions[index]=value;
    setOptions(newOptions);

};

const addOption= () =>{

    setOptions([...options,'']);

};

const handleSubmit =async (e) =>{
e.preventDefault();
try{
//filter out the empty options 
const validOptions =options.filter(opt=>opt.trim() !== '');
const res=await axios.post('http://localhost:5000/api/polls',{
   title,
    options: validOptions
});

alert(`Poll Created! ID: ${res.data.id}`);

}catch(err){
console.error(err);
alert('Error creating a poll');
  }
};

return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Create a New Poll</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Question:</label><br/>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="e.g. Best Programming Language?"
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Options:</label>
          {options.map((opt, index) => (
            <div key={index} style={{ marginBottom: '10px' }}>
              <input 
                type="text" 
                value={opt}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
                style={{ width: '80%', padding: '5px', marginRight: '10px' }}
              />
            </div>
          ))}
          <button type="button" onClick={addOption} style={{ padding: '5px 10px' }}>
            + Add Option
          </button>
        </div>

        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
          Create Poll
        </button>
      </form>
    </div>
  );

};

export default CreatePoll;

