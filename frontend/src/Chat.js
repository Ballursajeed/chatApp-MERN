import React,{useContext} from "react";
import Avatar from './Avatar.js';
import Logo from './Logo.js';
import { UserContext } from "./UserContext.js";

const Chat = () => {

 const [ws,setWs] = React.useState(null);
 const [onlinePeople,setOnlinePeople] = React.useState({});
 const [selectedUserId,setSelectedUserId] = React.useState(null);

 const {username,id} = useContext(UserContext);

 React.useEffect(() => {
    const ws = new WebSocket('ws://localhost:8000');
    setWs(ws);
    ws.addEventListener('message',handleMessage)
 },[]);

 const showOnlinePeople = (peopleArray) => {
       const people = {};
       peopleArray.forEach(({userId,username}) => {
                 people[userId] = username;
       });
       setOnlinePeople(people);
 }

 function handleMessage(e) {
        const messageData = JSON.parse(e.data);
       if ('online' in messageData) {
            showOnlinePeople(messageData.online)
       }
 }

 const selectContact = (userId) => {
     setSelectedUserId(userId)
 }

 const onlinePeopleExclOurUse = {...onlinePeople};
 delete onlinePeopleExclOurUse[id]

 return(
   <>
    <div className='flex h-screen'>
      <div className='bg-white w-1/3 '>
        <Logo />
         {Object.keys(onlinePeopleExclOurUse).map(userId => (
            <div key={userId}
             onClick={() => selectContact(userId)}
             className={'border-b border-gray-100 flex items-center gap-2 cursor-pointer '
              + (userId === selectedUserId ? 'bg-blue-50' : '')}>
              {userId === selectedUserId && (
                 <div className='w-1 bg-blue-500 h-12 rounded-r-md'></div>
              )}

             <div className='flex gap-2 py-2 pl-4 items-center'>
              <Avatar username={onlinePeople[userId]} userId={userId}/>
              <span className='text-gray-800'>{onlinePeople[userId]}</span>
             </div>
            </div>
         ))}
       </div>
      <div className='flex flex-col bg-blue-200 w-2/3 p-2'>
        <div className='flex-grow'>
         Messages
        </div>
        <div className='flex gap-2'>
          <input
           type='text'
           placeholder='type your message'
           className='bg-white flex-grow border rounded-sm p-2'/>
           <button className='bg-blue-500 p-2 rounded-sm text-white'>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
             </svg>
           </button>
        </div>
      </div>
    </div>
   </>
 )
}

export default Chat;