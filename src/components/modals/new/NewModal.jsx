import React, { useState, useRef, useContext } from 'react'
import {
  addDoc,
  serverTimestamp,
  reportsRef,
  updateDoc,
  doc
} from '../../../config'
import {
  BottomRow,
  Btn,
  BtnContainer,
  CheckboxInput,
  CloseIcon,
  Input,
  InputRow,
  Label,
  MainContainer,
  ModalContent,
  SelectInput,
  TextArea,
  TopLeftCol,
  TopRightCol,
  TopRow
} from './NewModal.styles'
import { UserContext } from '../../../contexts/user-context'

const NewModal = ({ setDisplayNewItem }) => {
  const [addingReport, setAddingReport] = useState(false)
  const [duration, setDuration] = useState('')
  const [startTime, setStartTime] = useState('')

  const { user } = useContext(UserContext)
  const formRef = useRef(null)

  const handleAddReport = async event => {
    event.preventDefault()

    setAddingReport(true)

    if (!user) {
      console.log('No user logged in')
      setDisplayNewItem(false)
      return
    }

    const formData = new FormData(formRef.current)
    const name = formData.get('name')
    const rawPhone = formData.get('phone')
    const phone = rawPhone.trim();
    const transfer = parseInt(formData.get('transfer'), 10)
    const notes = formData.get('notes')
    const enrolled = formData.get('enrolled') === 'on'
    const notEnoughDebt = formData.get('notEnoughDebt') === 'on'
    const enrolledAmount = formData.get('enrolled-amount')
    const stateLiability = formData.get('state-liability')
    const federalLiability = formData.get('federal-liability')

    try {
      const docRef = await addDoc(reportsRef, {
        agentId: user.id,
        createdAt: serverTimestamp(),
        name,
        phone,
        transfer,
        startTime,
        duration,
        notes,
        enrolled,
        notEnoughDebt,
        enrolledAmount,
        stateLiability,
        federalLiability,
        'phoneSuffix': phone.slice(-4)
      })

      // Then, update the document with its generated ID
      await updateDoc(doc(reportsRef, docRef.id), {
        id: docRef.id
      })

      // console.log('Document written with ID: ', docRef.id)
      formRef.current.reset()
    } catch (e) {
      console.error('Error adding document: ', e)
    }

    setAddingReport(false)
    setDisplayNewItem(false)
  }

  const handleCloseModal = () => {
    setDisplayNewItem(false)
  }

  function formatDuration (input) {
    let numbers = input.replace(/[^\d]/g, '') // Remove non-numeric characters
    if (numbers.length > 6) {
      numbers = numbers.substr(0, 6) // Limit string length to 6 digits
    }
    const parts = []
    for (let i = 0; i < numbers.length; i += 2) {
      parts.push(numbers.substr(i, 2))
    }
    return parts.join(':')
  }

  const handleDurationChange = event => {
    const formatted = formatDuration(event.target.value)
    setDuration(formatted)
  }

  function formatStartTime (input) {
    let cleanInput = input.toUpperCase().replace(/[^0-9APM]/g, '')

    // Extract numbers and AM/PM part
    let numbers = cleanInput.replace(/[APM]/g, '')
    let amPm = cleanInput.match(/[APM]+/)?.[0] || ''

    // Limit string length to 4 digits for time
    if (numbers.length > 4) {
      numbers = numbers.substr(0, 4)
    }

    let formattedTime =
      numbers.length > 2
        ? `${numbers.substr(0, 2)}:${numbers.substr(2)}`
        : numbers

    if (amPm.length > 0) {
      formattedTime += ' ' + amPm.substr(0, 2) // Take only the first two characters of AM/PM part
    }

    return formattedTime
  }

  const handleStartTimeChange = event => {
    const formatted = formatStartTime(event.target.value)
    setStartTime(formatted)
  }

  return (
    <MainContainer>
      <ModalContent>
        <CloseIcon onClick={handleCloseModal}>X</CloseIcon>
        <form ref={formRef} onSubmit={handleAddReport}>
          <TopRow>
            <TopLeftCol>
              <InputRow>
                <Label htmlFor='transfer'>Transfer:</Label>
                <SelectInput name='transfer' id='transfer' required>
                  {[...Array(12)].map((_, index) => (
                    <option key={index} value={index + 1}>
                      {index + 1}
                    </option>
                  ))}
                </SelectInput>
              </InputRow>

              <InputRow>
                <Label htmlFor='phone'>Phone:</Label>
                <Input
                  type='text'
                  id='phone'
                  name='phone'
                  placeholder='Phone'
                  required
                />
              </InputRow>
              <InputRow>
                <Label htmlFor='name'>Name:</Label>
                <Input
                  type='text'
                  id='name'
                  name='name'
                  placeholder='Name'
                  required
                />
              </InputRow>
              <InputRow>
                <Label htmlFor='start-time'>Start Time:</Label>
                <Input
                  id='start-time'
                  required
                  type='text'
                  name='start-time'
                  value={startTime}
                  onChange={handleStartTimeChange}
                  placeholder='00:00 AM'
                  maxLength='11'
                  minLength='11'
                />
              </InputRow>
              <InputRow>
                <Label htmlFor='duration'>Duration:</Label>
                <Input
                  type='text'
                  id='duration'
                  name='duration'
                  value={duration}
                  placeholder='00:00:00'
                  onChange={handleDurationChange}
                  maxLength='8'
                  minLength='8'
                  required
                />
              </InputRow>
            </TopLeftCol>

            <TopRightCol>
              <InputRow>
                <Label htmlFor='enrolled'>Enrolled:</Label>
                <CheckboxInput type='checkbox' id='enrolled' name='enrolled' />
              </InputRow>

              {user.department !== 'tax' ? (
                <>
                  <InputRow>
                    <Label htmlFor='enrolled-amount'>Enrolled Amount:</Label>
                    <Input
                      id='enrolled-amount'
                      type='text'
                      name='enrolled-amount'
                      placeholder='Enrolled Amount'
                    />
                  </InputRow>
                  <InputRow>
                    <Label htmlFor='notEnoughDebt'>Not Enough Debt:</Label>
                    <CheckboxInput
                      type='checkbox'
                      id='notEnoughDebt'
                      name='notEnoughDebt'
                    />
                  </InputRow>
                </>
              ) : (
                <>
                  <InputRow>
                    <Label htmlFor='state-liability'>State Liability:</Label>
                    <Input
                      type='text'
                      id='state-liability'
                      name='state-liability'
                      placeholder='State Liability'
                    />
                  </InputRow>
                  <InputRow>
                    <Label htmlFor='federal-liability'>
                      Federal Liability:
                    </Label>
                    <Input
                      type='text'
                      id='federal-liability'
                      name='federal-liability'
                      placeholder='Federal Liability'
                    />
                  </InputRow>
                </>
              )}
            </TopRightCol>
          </TopRow>

          <BottomRow>
            <Label htmlFor='notes'>Notes:</Label>
            <TextArea
              name='notes'
              id='notes'
              placeholder='Notes'
              required
            ></TextArea>
          </BottomRow>

          <BtnContainer>
            <Btn disabled={addingReport} type='submit'>
              Add Report
            </Btn>
          </BtnContainer>
        </form>
      </ModalContent>
    </MainContainer>
  )
}

export default NewModal
