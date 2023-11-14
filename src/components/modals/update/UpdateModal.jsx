import React, { useRef, useEffect, useState, useContext } from 'react'
import { doc, updateDoc, reportsRef, db } from '../../../config'
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
} from './UpdateModal.styles'
import { UserContext } from '../../../contexts/user-context'

const UpdateModal = ({ setDisplayUpdate, report }) => {
  const [updatingReport, setUpdatingReport] = useState(false)
  const [duration, setDuration] = useState('')
  const [startTime, setStartTime] = useState('')

  const { user } = useContext(UserContext)
  const formRef = useRef(null)

  // Setting default values when the component mounts
  useEffect(() => {
    if (report && formRef.current) {
      formRef.current.elements['phone'].value = report.phone || ''
      formRef.current.elements['name'].value = report.name || ''
      formRef.current.elements['start-time'].value = report.startTime || ''
      setStartTime(report.startTime || '')
      formRef.current.elements['duration'].value = report.duration || ''
      setDuration(report.duration || '')
      formRef.current.elements['notes'].value = report.notes || ''
      formRef.current.elements['enrolled'].checked = report.enrolled === true
      formRef.current.elements['enrolled-amount'].value =
        report.enrolledAmount || ''
      if (user.department !== 'tax') {
        formRef.current.elements['notEnoughDebt'].checked =
          report.notEnoughDebt || false
      }
      formRef.current.elements['transfer'].value = report.transfer || 1
    }
  }, [report])

  const handleAddReport = async e => {
    e.preventDefault()

    setUpdatingReport(true)

    const formData = new FormData(formRef.current)
    const updatedReport = {
      phone: formData.get('phone'),
      name: formData.get('name'),
      startTime,
      duration,
      notes: formData.get('notes'),
      enrolled: formData.get('enrolled') === 'on',
      enrolledAmount: formData.get('enrolled-amount'),
      notEnoughDebt: formData.get('notEnoughDebt') === 'on',
      transfer: parseInt(formData.get('transfer'), 10)
    }

    // Update the document in Firestore
    const docRef = doc(db, 'reports', report.id)
    try {
      await updateDoc(docRef, updatedReport)
    } catch (error) {
      console.error('Error updating report: ', error)
    }

    setUpdatingReport(false)
    setDisplayUpdate(false)
  }

  const handleCloseModal = () => {
    setDisplayUpdate(false)
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
                />
              </InputRow>
              <InputRow>
                <Label htmlFor='duration'>Duration:</Label>
                <Input
                  type='text'
                  id='duration'
                  name='duration'
                  required
                  value={duration}
                  placeholder='00:00:00'
                  onChange={handleDurationChange}
                  maxLength='8'
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
              {user.department !== 'tax' && (
                <InputRow>
                  <Label htmlFor='notEnoughDebt'>Not Enough Debt:</Label>
                  <CheckboxInput
                    type='checkbox'
                    id='notEnoughDebt'
                    name='notEnoughDebt'
                  />
                </InputRow>
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
            <Btn disabled={updatingReport} type='submit'>
              Update Report
            </Btn>
          </BtnContainer>
        </form>
      </ModalContent>
    </MainContainer>
  )
}

export default UpdateModal
