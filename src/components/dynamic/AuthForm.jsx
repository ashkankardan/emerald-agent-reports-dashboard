import React, { useState, useRef } from 'react'
import {
  Btn,
  BtnContainer,
  Form,
  Input,
  InputRow,
  Label,
  MainContainer
} from './AuthForm.styles'
import { functions, httpsCallable } from '../../config'

const AuthForm = ({ setIsAuthenticated, setTempDoc, uniqueUrl }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [accessCode, setAccessCode] = useState()

  const formRef = useRef(null)

  const handleAuth = async e => {
    e.preventDefault()

    if (!uniqueUrl || !accessCode) return
    setIsLoading(true)

    const checkPinAndFetchDocument = httpsCallable(
      functions,
      'checkPinAndFetchDocument'
    )
    try {
      const result = await checkPinAndFetchDocument({
        pin: accessCode,
        id: uniqueUrl
      })
      // Handle the response
      setTempDoc(result.data)
      setIsAuthenticated(true)
    } catch (error) {
      console.error('Error:', error.response ? error.response.data : error)
    }

    setIsLoading(false)
  }

  const handleCodeChange = e => {
    setAccessCode(e.target.value)
  }

  return (
    <MainContainer>
      <Form ref={formRef} onSubmit={handleAuth}>
        <InputRow>
          <Label htmlFor='code'>Access Code:</Label>
          <Input
            type='number'
            id='code'
            name='code'
            required
            onChange={handleCodeChange}
            value={accessCode}
          />
        </InputRow>
        <BtnContainer>
          <Btn disabled={isLoading} type='submit'>
            Next
          </Btn>
        </BtnContainer>
      </Form>
    </MainContainer>
  )
}

export default AuthForm
