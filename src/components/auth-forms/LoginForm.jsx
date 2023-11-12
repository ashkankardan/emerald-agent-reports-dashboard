import React, { useState, useRef, useContext } from 'react'
import { MainContainer } from './LoginForm.styles'
import { signInWithEmailAndPassword, auth, doc, db, getDoc } from '../../config'
import { UserContext } from '../../contexts/user-context'

const LoginForm = () => {
  const { setUser } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false)

  const formRef = useRef()

  const fetchUserByUID = async uid => {
    try {
      // Create a reference to the user document
      const userDocRef = doc(db, 'users', uid)

      // Fetch the document
      const docSnap = await getDoc(userDocRef)

      if (docSnap.exists()) {
        console.log('User Document Data:', docSnap.data())
        return docSnap.data() // or handle the data as needed
      } else {
        console.log('No such user document!')
        return null // Handle the case where the user document does not exist
      }
    } catch (error) {
      console.error('Error fetching user document: ', error)
      // Handle any errors that occur during fetch
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(formRef.current);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      formRef.current.reset();
      const userDoc = await fetchUserByUID(cred.user.uid);

      console.log('received user doc: ', userDoc);

      if (userDoc) {
        localStorage.setItem('user', JSON.stringify(userDoc));
        setUser(userDoc);
      } else {
        // Handle the case where the user doc is not found
        console.log('User document not found');
      }
    } catch (err) {
      console.log(err.message);
      // Handle any errors in sign in or fetching user document
    }

    setIsLoading(false);
  };


  return (
    <MainContainer>
      Login form
      <form ref={formRef} onSubmit={handleLogin}>
        <label htmlFor='email'>
          email:
          <input type='text' name='email' id='email' />
        </label>
        <label htmlFor='password'>
          password:
          <input type='text' name='password' id='password' />
        </label>

        <button disabled={isLoading} type='submit'>
          Login
        </button>
      </form>
    </MainContainer>
  )
}

export default LoginForm
