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
    const phone = formData.get('phone')
    const transfer = formData.get('transfer')
    const startTime = formData.get('start-time')
    const duration = formData.get('duration')
    const notes = formData.get('notes')
    const enrolled = formData.get('enrolled') === 'on'
    const notEnoughDebt = formData.get('notEnoughDebt') === 'on'
    const enrolledAmount = formData.get('enrolled-amount')

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
        enrolledAmount
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
                  type='text'
                  name='start-time'
                  placeholder='Start Time'
                  required
                />
              </InputRow>
              <InputRow>
                <Label htmlFor='duration'>Duration:</Label>
                <Input
                  type='text'
                  id='duration'
                  name='duration'
                  placeholder='Duration'
                  required
                />
              </InputRow>
            </TopLeftCol>

            <TopRightCol>
              <InputRow>
                <Label htmlFor='enrolled'>Enrolled:</Label>
                <CheckboxInput type='checkbox' id='enrolled' name='enrolled' />
              </InputRow>

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
