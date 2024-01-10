
import Register from "./Register.js";
import Login from "./Login.js";
import axios from 'axios';
import {Routes, Route} from "react-router-dom"
import { useContext } from 'react';
import { UserContext } from './UserContext.js'

function App() {
	axios.defaults.withCredentials = true;

	const {username,id} = useContext(UserContext);
	console.log('Username:',username);

  if (username) {
        return 'logged In! ' + username;
  }

  return (
  <>
 <Routes >
   <Route path="/" element={<Register/>} />
   <Route path="/login" element={<Login/>} />
 </Routes>
  </>
  );
}

export default App;
