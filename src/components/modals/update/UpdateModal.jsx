import React, { useRef, useEffect, useState } from 'react'
import { doc, updateDoc, reportsRef, db } from '../../../config'
import { MainContainer, ModalContent } from './UpdateModal.styles'

const UpdateModal = ({ setDisplayUpdate, report }) => {
  const [updatingReport, setUpdatingReport] = useState(false)

  const formRef = useRef(null)

  // Setting default values when the component mounts
  useEffect(() => {
    if (report && formRef.current) {
      formRef.current.elements['phone'].value = report.phone || ''
      formRef.current.elements['name'].value = report.name || ''
      formRef.current.elements['start-time'].value = report.startTime || ''
      formRef.current.elements['duration'].value = report.duration || ''
      formRef.current.elements['notes'].value = report.notes || ''
      formRef.current.elements['enrolled'].value = report.enrolled || 'Yes'
      formRef.current.elements['enrolled-amount'].value =
        report.enrolledAmount || ''
      formRef.current.elements['notEnoughDebt'].checked =
        report.notEnoughDebt || false
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
      startTime: formData.get('start-time'),
      duration: formData.get('duration'),
      notes: formData.get('notes'),
      enrolled: formData.get('enrolled'),
      enrolledAmount: formData.get('enrolled-amount'),
      notEnoughDebt: formData.get('notEnoughDebt') === 'on',
      transfer: parseInt(formData.get('transfer'), 10)
    }

    // Update the document in Firestore
    const docRef = doc(db, 'reports', report.id) // Replace 'yourCollectionName' with your actual collection name
    try {
      await updateDoc(docRef, updatedReport)
      console.log('Report updated successfully')
    } catch (error) {
      console.error('Error updating report: ', error)
    }

    setUpdatingReport(false)
    setDisplayUpdate(false)
  }

  const handleCloseModal = () => {
    setDisplayUpdate(false)
  }

  return (
    <MainContainer>
      <ModalContent>
        <p onClick={handleCloseModal}>X</p>

        <form ref={formRef} onSubmit={handleAddReport}>
          <label>
            Transfer:
            <select name='transfer' required>
              {[...Array(12)].map((_, index) => (
                <option key={index} value={index + 1}>
                  {index + 1}
                </option>
              ))}
            </select>
          </label>

          <label>
            Phone:
            <input type='text' name='phone' placeholder='Phone' required />
          </label>

          <label>
            Name:
            <input type='text' name='name' placeholder='Name' required />
          </label>

          <label>
            Start Time:
            <input
              type='text'
              name='start-time'
              placeholder='Start Time'
              required
            />
          </label>

          <label>
            Duration:
            <input
              type='text'
              name='duration'
              placeholder='Duration'
              required
            />
          </label>

          <label>
            Notes:
            <textarea name='notes' placeholder='Notes' required></textarea>
          </label>

          <label>
            Enrolled: Yes
            <input type='radio' name='enrolled' value='Yes' required />
          </label>

          <label>
            No
            <input type='radio' name='enrolled' value='No' />
          </label>

          <label>
            Not Enough Debt:
            <input type='checkbox' name='notEnoughDebt' />
          </label>

          <label>
            Enrolled Amount:
            <input
              type='text'
              name='enrolled-amount'
              placeholder='Enrolled Amount'
            />
          </label>

          <label>
            Not Enough Debt:
            <input type='checkbox' name='notEnoughDebt' />
          </label>

          <button type='submit'>Update Report</button>
        </form>
      </ModalContent>
    </MainContainer>
  )
}

export default UpdateModal
