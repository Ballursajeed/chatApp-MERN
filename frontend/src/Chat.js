import React,{useContext, useRef,useEffect} from "react";
import Avatar from './Avatar.js';
import Logo from './Logo.js';
import { UserContext } from "./UserContext.js";
import { uniqBy } from 'lodash';

const Chat = () => {

 const [ws,setWs] = React.useState(null);
 const [onlinePeople,setOnlinePeople] = React.useState({});
 const [selectedUserId,setSelectedUserId] = React.useState(null);
 const [newMessageText, setNewMessageText] = React.useState('');
 const [messages, setMessages] = React.useState([]);

 const divUnderMessages = useRef();

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

 function handleMessage(e) {             //receiving a message
       const messageData = JSON.parse(e.data);

      console.log({e,messageData});

       if ('online' in messageData) {
            showOnlinePeople(messageData.online)
       } else if ('text' in messageData) {
             setMessages(prev => ([...prev,{...messageData}]));
       }
 }

 const selectContact = (userId) => {
     setSelectedUserId(userId)
 }

 const sendMessage = (ev) => { //sending a message
         ev.preventDefault();
         ws.send(JSON.stringify({
                    recipient: selectedUserId,
                    text: newMessageText,
         }));
         setNewMessageText('');
         setMessages(prev => ([...prev,{
         	text:newMessageText,
            sender:id,
            recipient:selectedUserId,
            id: Date.now(),
         	 }]));

 }

 useEffect(() => {
   const div = divUnderMessages.current;

   if (div) {
   div.scrollIntoView({behavior:'smooth',block:'end'});
   }

 },[messages])

 const onlinePeopleExclOurUse = {...onlinePeople};
 delete onlinePeopleExclOurUse[id];

 const messagesWithoutDuplecates = uniqBy(messages, 'id');

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
      <div className='flex flex-col bg-blue-50 w-2/3 p-2'>
        <div className='flex-grow'>
         {!selectedUserId && (
                   <div className='flex flex-grow h-full items-center justify-center '>
                      <div className='text-gray-400 '>&larr; Selecte a Person from the sidebar</div>
                   </div>
         )}

         {!!selectedUserId && (
         <div className='mb-4 h-full'>
            <div className='relative h-full '>
              <div className='overflow-y-scroll absolute top-0 left-0 right-0 bottom-2'>
               {messagesWithoutDuplecates.map(message => (
               <div className={(message.sender === id ? 'text-right': 'text-left')}>
                  <div className={'text-left inline-block p-2 my-2 rounded-md text-sm '
                       +(message.sender === id ? 'bg-blue-500 text-white':'bg-white text-gray-600')}>
                         sender:{message.sender}<br />
                         my id: {id}<br />
                        {message.text}
                   </div>
               </div>
               ))}
             <div ref={divUnderMessages}></div>
            </div>
          </div>
         </div>
         )}

        </div>
        {!!selectedUserId && (
        <form className='flex gap-2' onSubmit={sendMessage}>
          <input
           type='text'
           value={newMessageText}
           onChange={ev => setNewMessageText(ev.target.value)}
           placeholder='type your message'
           className='bg-white flex-grow border rounded-sm p-2'/>
          <button type="submit" className='bg-blue-500 p-2 rounded-sm text-white'>
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
             </svg>
           </button>
        </form>
        )}
      </div>
    </div>
   </>
 )
}

export default Chat;