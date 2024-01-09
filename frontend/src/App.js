
import Register from "./Register.js";
import axios from 'axios';

function App() {
	axios.defaults.withCredentials = true;
  return (
  <>
   <Register />
  </>
  );
}

export default App;
