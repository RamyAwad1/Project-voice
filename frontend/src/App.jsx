import {BrowserRouter as Router,Routes, Route} from 'react-router-dom';
import CreatePoll from './pages/CreatePoll';
import PollView from './pages/PollView';

function App() {

  return (
    <Router>
      <div style={{fontFamily:'Arial,sans-serif'}}>
        <h1 style={{textAlign:'center'}}>Live Polls</h1>
        <Routes>
          <Route path='/' element={<CreatePoll />}/>
          <Route path='/poll/:id' element={<PollView />}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App
