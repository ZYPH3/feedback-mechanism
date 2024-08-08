'use client'
import Image from "next/image";
import { useState, useEffect } from "react"
import { firestore } from "../firebase"
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, getDoc, getDocs, query, setDoc, doc } from "firebase/firestore";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#black',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
  color: '#black'
}

const gradientTitleStyle = {
  background: 'linear-gradient(to right, #000000, #000000)',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  textAlign: 'center',
  margin: '20px 0',
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '20px',
};

const headerTitleStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
};

const gradientButtonStyle = {
  background: 'linear-gradient(to right, #063970, #0e64de)',
  color: '#F2F2F2',
  border: 'none',
  '&:hover': {
    background: 'linear-gradient(to right, #1a2a6c, #0e64de)',
  },
}

export default function Home() {
  const [feedback, setFeedback] = useState([])
  const [open, setOpen] = useState(false)
  const [reviewName, setReviewName] = useState('')

  const updateFeedback = async () => {
    const snapshot = query(collection(firestore, 'feedback'))
    const docs = await getDocs(snapshot)
    const feedbackList = []
    docs.forEach((doc)=>{
      feedbackList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setFeedback(feedbackList)
  }

  const addReview = async (review) =>{
    const docRef = doc(collection(firestore, 'feedback'), review)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
    } else{
      await setDoc(docRef, {quantity: 1})
    }

    await updateFeedback()
  }

  useEffect(()=>{
    updateFeedback()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box 
      width="100vw" 
      height= "100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={2}
      bgcolor="#CACCD1"
    >
      <Typography variant="h3" sx={gradientTitleStyle}>
        Chatbot Feedback
      </Typography>
      <Modal 
      open={open} 
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" color="white">
            Add Review
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Review"
              variant="outlined"
              fullWidth
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              InputProps={{
                style: { color: 'black' },
              }}
              InputLabelProps={{
                style: { color: 'black' },
              }}
            />
            <Button
              variant="outlined" 
              onClick={()=>{
                addReview(reviewName)
                setReviewName('')
                handleClose()
              }}
              sx={gradientButtonStyle}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box width="800px" mb={2}>
        <Box sx={headerStyle}>
          <Box sx={headerTitleStyle}>
            <Typography variant="h3" color="#black">
              Reviews
            </Typography>
          </Box>
          <Button variant="contained" onClick={()=>{handleOpen()}} sx={gradientButtonStyle}>
            Add New Review
          </Button>
        </Box>
        <Stack width="800px" height = "300px" spacing={2} overflow="auto">
        {feedback.map(({name}) => (
            <Box 
              key={name} 
              width = "85%"
              minHeight="150px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor='#black'
              padding={5}
              borderBottom="1px solid #333"
            >
              <Typography variant='h3' color="#black" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}