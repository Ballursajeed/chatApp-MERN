
import { createContext,useState, useEffect } from "react";
import axios from 'axios';

export const UserContext = createContext({});

export const UserContextProvider = ({children}) => {

 const [username,setLoggedusername] = useState(null);
 const [id,setId] = useState(null);

 const contextValue = {
    username,
    setLoggedusername,
    id,
    setId,
  };

  useEffect(()=>{
        axios.get('http://localhost:8000/profile').then(response => {
        	   if (response.data.message) {
                 alert(response.data.message);
        	   }
             setId(response?.data?.userId);
            setLoggedusername(response?.data?.userData?.userName);
        })
  })

         return( <UserContext.Provider value={contextValue}>
                   {children}
                 </UserContext.Provider>
               );
}

