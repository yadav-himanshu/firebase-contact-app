import React from 'react'
import Modal from './Modal'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import { toast } from 'react-toastify'
import * as Yup from "yup";

const contactValidationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required")
});


const AddAndUpdateContact = ({isOpen,onClose,isUpdate,contact}) => {

    const addContact=async(contact)=>{
        try {
            const contactRef=collection(db, "contacts");
            await addDoc(contactRef, contact)
            toast.success("Contact added successfully")
            onClose()
            
        } catch (error) {
            console.log(error)
            
        }
    }

    const updateContact=async(contact, id)=>{
        try {
            const contactRef=doc(db, "contacts",id);
            await updateDoc(contactRef, contact)
            toast.success("Contact updated successfully")
            onClose()
            
        } catch (error) {
            console.log(error)
            
        }
    }


  return (
    <div>
        <Modal isOpen={isOpen} onClose={onClose} >
            <Formik
                validationSchema={contactValidationSchema}
                initialValues={isUpdate
                    
                    ?{name:contact.name,
                    email:contact.email,}
                    :{
                    name: '',
                    email: '',
                   }}
                    onSubmit={(values) => {
                         console.log(values);
                         isUpdate?updateContact(values,contact.id):addContact(values)
                        //  addContact(values)
                    }}
            >
                
                <Form className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-1' >
                        <label htmlFor="name">Name</label>
                        <Field name='name' className="border rounded-md px-4 py-2" ></Field>
                        <div className='text-red-500 text-xs'> <ErrorMessage name='name'/>  </div>

                    </div>
                    <div className='flex flex-col gap-1' >
                        <label htmlFor="email">Email</label>
                        <Field type="email" name='email' className="border rounded-md px-4 py-2" ></Field>
                        <div className='text-red-500 text-xs'> <ErrorMessage name='email'/>  </div>
                    </div>
                    <button type='submit' className='bg-orange text-white px-5 py-1.5 rounded-md self-end'>{ isUpdate ? "Update" : "Add" } Contact</button>
                </Form>
            </Formik>
            
        </Modal>
    </div>

  )
}

export default AddAndUpdateContact