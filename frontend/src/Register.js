import { useState } from 'react';
import axios from "axios";

const Register = () => {

 const [username,setUsername] = useState('');
 const [password , setPassword] = useState('');
 const [email,setEmail] = useState('');

 const register = async(e) => {
 	e.preventDefault();
 	console.log("Username:",username);
 	console.log("email:",email);
 	console.log("password:",password);
     const {data} = await axios.post('http://localhost:8000/register',{
     userName:username,
     Email:email,
     Password:password
     });
     console.log(data);
 }

      return(
       <>
         <div className='bg-blue-50 h-screen flex items-center'>
            <form className='w-64 mx-auto mb-12' onSubmit={register}>
              <input
               value={username}
               onChange={ev => setUsername(ev.target.value)}
               type='text'
               placeholder="username"
               className='block w-full rounded-sm p-2 mb-2 border'
              />
              <input
               value={email}
               onChange={ev => setEmail(ev.target.value)}
               type='email'
               placeholder="email"
               className='block w-full rounded-sm p-2 mb-2 border'
              />
              <input
               value={password}
               onChange={ev => setPassword(ev.target.value)}
               type='password'
               placeholder="password"
               className='block w-full rounded-sm p-2 mb-2 border'
              />
             <button
              className='bg-blue-500 text-white block w-full rounded-sm p-2'
              >Register
              </button>
            </form>
         </div>
       </>
      )
}

export default Register