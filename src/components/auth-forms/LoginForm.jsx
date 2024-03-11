import React, { useState, useRef, useContext } from "react";
import {
  Btn,
  BtnContainer,
  Input,
  InputRow,
  Label,
  Logo,
  MainContainer,
  MainContent,
} from "./LoginForm.styles";
import {
  signInWithEmailAndPassword,
  auth,
  doc,
  db,
  getDoc,
} from "../../config";
import { UserContext } from "../../contexts/user-context";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/img/EmeraldGain-FinancialGroup-Logo.png";

const LoginForm = () => {
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const formRef = useRef();

  const fetchUserByUID = async (uid) => {
    try {
      // Create a reference to the user document
      const userDocRef = doc(db, "users", uid);

      // Fetch the document
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        return docSnap.data(); // or handle the data as needed
      } else {
        console.log("No user found!");
        return null; // Handle the case where the user document does not exist
      }
    } catch (error) {
      console.error("Error fetching user document: ", error);
      // Handle any errors that occur during fetch
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(formRef.current);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      formRef.current.reset();
      const userDoc = await fetchUserByUID(cred.user.uid);

      if (userDoc) {
        localStorage.setItem("user", JSON.stringify(userDoc));
        setUser(userDoc);

        // Redirect based on user role
        if (userDoc.role === "admin" || userDoc.role === "super-admin") {
          navigate("/admin");
        } else if (userDoc.role === "agent") {
          navigate("/agent");
        }
      } else {
        // Handle the case where the user doc is not found
        console.log("No user found!");
      }
    } catch (err) {
      console.log(err.message);
      // Handle any errors in sign in or fetching user document
    }

    setIsLoading(false);
  };

  return (
    <MainContainer>
      <MainContent>
        <Logo src={logoImg} alt="Emerald Gain Logo" />
        <form ref={formRef} onSubmit={handleLogin}>
          <InputRow>
            <Label htmlFor="email">Email:</Label>
            <Input type="text" name="email" id="email" />
          </InputRow>
          <InputRow>
            <Label htmlFor="password">Password:</Label>
            <Input type="password" name="password" id="password" />
          </InputRow>
          <BtnContainer>
            <Btn disabled={isLoading} type="submit">
              Login
            </Btn>
          </BtnContainer>
        </form>
      </MainContent>
    </MainContainer>
  );
};

export default LoginForm;
