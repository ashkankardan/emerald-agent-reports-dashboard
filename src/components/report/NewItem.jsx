import React, { useState, useContext, useRef } from 'react'
import { MainContainer } from './Reports.styles'
import {
  reportsRef,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc
} from '../../config'
import { UserContext } from '../../contexts/user-context'

const NewItem = ({ setDisplayNewItem }) => {
  const { user } = useContext(UserContext)
  const formRef = useRef(null)

  const handleAddReport = async event => {
    event.preventDefault()

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
    const enrolled = formData.get('enrolled')
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

      console.log('Document written with ID: ', docRef.id)
      formRef.current.reset()
    } catch (e) {
      console.error('Error adding document: ', e)
    }
    setDisplayNewItem(false)
  }

  return (
    <MainContainer>
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
          <input type='text' name='duration' placeholder='Duration' required />
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

        <button type='submit'>Add Report</button>
      </form>
    </MainContainer>
  )
}

export default NewItem
