import React, { useEffect, useRef, useState } from 'react';
import Modal from './Modal';
import {
    addDoc,
    collection,
    onSnapshot
} from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

export default function Docs(
    database
){
    const navigate = useNavigate();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [title, setTitle] = useState('');
    const collectionRef = collection(database.database, 'docsClone');
    const isMounted = useRef();
    const [docsData, setDocsData] = useState([]);
    const addData = () => {
        addDoc(collectionRef, {
            title: title
        })
        .then(() => {
            alert('Data Added!')
            handleClose()
        })
        .catch(() => {
            alert('Cannot add data')
        })
    }
    const getData = () => {
        onSnapshot(collectionRef, (data) =>{
            setDocsData(data.docs.map((doc) =>{
            return {...doc.data(), id: doc.id}
        }))
        })
    }
    const getID = (id) =>{
        navigate(`/editDocs/${id}`)
    }
    useEffect(() => {
        if(isMounted.current){
            return
        }

        isMounted.current = true;
        getData()
    }, [])
return (
    <div className="docs-main">
        <h1>Docs Clone</h1>

        <button 
            className="add-docs"
            onClick={handleOpen}
        >
            Add a Document
        </button>
        <div className='grid-main'>
            {docsData.map((doc) => {
                return(
                    <div className='grid-child' onClick={() => getID(doc.id)}>
                        <p>{doc.title}</p>
                        <div dangerouslySetInnerHTML={{ __html: doc.docsDesc}} />
                    </div>

                )
            })}
        </div>

        <Modal
            open={open}
            setOpen={setOpen}
            title={title}
            setTitle={setTitle}
            addData={addData}
        />
    </div>
)
}