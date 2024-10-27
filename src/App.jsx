import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import { Search,CirclePlus,CircleUserRound,UserPen ,Trash2} from 'lucide-react'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { collection, getDocs, onSnapshot } from 'firebase/firestore'
import { db } from './config/firebase'
import ContactsCard from './components/ContactsCard'
import Modal from './components/Modal'
import AddAndUpdateContact from './components/AddAndUpdateContact'
import useDisclose from './hooks/useDisclose'
import ContactNotFound from './components/ContactNotFound'

function App() {

  const[contacts,setContacts]=useState([]);

  const {isOpen, onClose, onOpen}=useDisclose()



  useEffect(()=>{
    const getContact=async()=>{

      try {
        const contactsRef=collection(db,"contacts")
        // const contactsSnapshot=await getDocs(contactsRef)

        onSnapshot(contactsRef,(snapshot)=>{

          const contactLists=snapshot.docs.map((doc)=>{
            return {
              id:doc.id,
              ...doc.data(),
            }
          })
          console.log(contactLists)
          setContacts(contactLists)
          return contactLists
        })


        
        
      } catch (error) {
        console.log(error)
        
      }
    }
    getContact();
  },[]);

  const filterContacts=(e)=>{
    const value=e.target.value;

    const contactsRef=collection(db,"contacts")
    onSnapshot(contactsRef,(snapshot)=>{

      const contactLists=snapshot.docs.map((doc)=>{
        return {
          id:doc.id,
          ...doc.data(),
        }
      })

      const filteredContacts=contactLists.filter((contact)=>
        contact.name.toLowerCase().includes(value.toLowerCase())
      )
 
      console.log(filterContacts)
      setContacts(filteredContacts)

      return filteredContacts
    })
  }

  return (
    <>
      <div className='max-w-[370px] m-auto px-3 py-5'>
        <div className='flex flex-col gap-4'>
          <Navbar/>
          <div className='flex gap-2 items-center'>
            <div className='flex items-center flex-grow'>
              <Search size={21} className='text-white absolute ml-2'/>
              <input
                onChange={filterContacts}
                placeholder='Search by name'
                className='bg-transparent border border-white rounded-md flex-grow p-2 text-white pl-9' type="text" />
            </div>

            <div>
            <CirclePlus onClick={onOpen} size={32} className='text-white cursor-pointer' />
            </div>
          </div>

          <div className='flex flex-col gap-3'>
            {
              contacts.length<=0?<ContactNotFound/> : contacts.map((contact)=>(
                <ContactsCard key={contact.id} contact={contact}/>
              ))
            }
          </div>

        </div>
      </div>
      <AddAndUpdateContact isOpen={isOpen} onClose={onClose}/>
      <ToastContainer position='bottom-center' />
    </>
  )
}

export default App
