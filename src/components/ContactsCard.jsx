import { deleteDoc,doc } from 'firebase/firestore'
import { Search,CirclePlus,CircleUserRound,UserPen ,Trash2} from 'lucide-react'
import { db } from '../config/firebase'
import AddAndUpdateContact from './AddAndUpdateContact'
import useDisclose from '../hooks/useDisclose'
import { toast } from 'react-toastify'
const ContactsCard = ({contact}) => {

    const {isOpen, onClose, onOpen}=useDisclose()

    const deleteContact=async(id)=>{
        try {
            await deleteDoc(doc(db,'contacts',id))
            toast.success("Contact deleted successfully")
        } catch (error) {
            console.log(error)
            
        }
    }


  return (
    <>
        <div key={contact.id} className='flex gap-2 items-center bg-yellow p-2 rounded-md'>
                    <CircleUserRound size={30} className='text-orange flex-shrink-0'/>

                    <div className='flex-1 min-w-0'>
                        <h2 className='font-bold truncate overflow-hidden text-ellipsis whitespace-nowrap'>{contact.name}</h2>
                        <p className='text-sm font-semibold truncate overflow-hidden text-ellipsis whitespace-nowrap'>{contact.email}</p>
                    </div>

                    <div className='flex gap-1 ml-auto'>
                    <UserPen size={24} onClick={onOpen} className='cursor-pointer flex-shrink-0' />
                    <Trash2 onClick={()=>deleteContact(contact.id)} size={24} className='text-orange cursor-pointer flex-shrink-0' />
                    </div>
                </div>

                <AddAndUpdateContact contact={contact} isUpdate isOpen={isOpen} onClose={onClose} />
    </>
  )
}

export default ContactsCard