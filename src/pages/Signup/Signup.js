import React, { useState, useRef, useContext } from 'react';
import { MainContainer } from './Signup.styles';
import BackBTN from '../../components/back-btn/BackBTN';
import { db, getDoc, doc, setDoc, usersRef, auth, serverTimestamp, createUserWithEmailAndPassword, signOut } from '../../config';
import { UserContext } from '../../contexts/user-context';

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser } = useContext(UserContext);
  const formRef = useRef();

  const handleLogout = () => {
    signOut(auth).then(() => {
      setUser(null)
    }).catch(err => {
      console.log(err.message)
    })
  }

  const fetchUserByUID = async (uid) => {
    try {
      // Create a reference to the user document
      const userDocRef = doc(db, "users", uid);

      // Fetch the document
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        console.log("User Document Data:", docSnap.data());
        return docSnap.data(); // or handle the data as needed
      } else {
        console.log("No such user document!");
        return null; // Handle the case where the user document does not exist
      }
    } catch (error) {
      console.error("Error fetching user document: ", error);
      // Handle any errors that occur during fetch
    }
  };


  const handleSignup = (e) => {
    e.preventDefault();

    setIsLoading(true)
    const formData = new FormData(formRef.current);

    const email = formData.get('email')
    const password = formData.get('password')

    createUserWithEmailAndPassword(auth, email, password).then(cred => {

      const userDocRef = doc(usersRef, cred.user.uid);

      setDoc(userDocRef, {
        "id": cred.user.uid,
        "email": email,
        "fname": formData.get('fname'),
        "lname": formData.get('lname'),
        "role": 'agent',
        "createdAt": serverTimestamp()
      }).then(() => {
        formRef.current.reset();

        const userDoc = fetchUserByUID(cred.user.uid)
        console.log('received user doc: ', userDoc)

        setUser(userDoc)

      }).catch(err => {
        console.log('Error setting document: ', err.message);
      });
    })
      .catch(err => {
        console.log('Error creating user: ', err.message);
      });

    setIsLoading(false)
  };

  return (
    <MainContainer>
      SignUp

      {user ? <button onClick={handleLogout}>Logout</button> : <form ref={formRef} onSubmit={handleSignup}>
        <label htmlFor="email">email:
          <input type="text" name='email' id='email' />
        </label>
        <label htmlFor="password">password:
          <input type="text" name='password' id='password' />
        </label>
        <label htmlFor="fname">First Name:
          <input type="text" name='fname' />
        </label>
        <label htmlFor="lname">Last name:
          <input type="text" name='lname' />
        </label>
        <button disabled={isLoading} type="submit">Add User</button>
      </form>
      }
      <BackBTN />

    </MainContainer>
  );
};

export default Signup
