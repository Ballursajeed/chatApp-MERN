
import Register from "./Register.js";
import Login from "./Login.js";
import axios from 'axios';
import {Routes, Route} from "react-router-dom"
import { useContext } from 'react';
import { UserContext } from './UserContext.js'
import Chat from './Chat.js';
import { Toaster } from 'react-hot-toast';

function App() {
	axios.defaults.withCredentials = true;

	const {username,id} = useContext(UserContext);

  if (username) {
      return(
       <Chat />
      )
  }

  return (
  <>
 <Toaster />
 <Routes >
   <Route path="/" element={<Register/>} />
   <Route path="/login" element={<Login/>} />
 </Routes>
  </>
  );
}

export default App;
