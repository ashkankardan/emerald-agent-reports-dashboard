import React, { useState, useEffect, useRef } from 'react'
import {
  Btn,
  BtnContainer,
  Form,
  Input,
  InputRow,
  Label,
  MainContainer
} from './AuthForm.styles'
import {
  functions,
  httpsCallable,
  doc,
  db,
  getDoc,
  updateDoc
} from '../../config'

const UserData = ({ tempDoc }) => {
  const [report, setReport] = useState(null)
  const [dob, setDob] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
  )
  const [ssn, setSsn] = useState('')
  const [name, setName] = useState('')
  const [updatingReport, setUpdatingReport] = useState(false)

  const formRef = useRef(null)

  const handleSsnChange = event => {
    const { value } = event.target
    let formattedInput = value.replace(/\D/g, '') // Remove non-digits

    // Add dashes for SSN format (XXX-XX-XXXX)
    if (formattedInput.length > 3 && formattedInput.length <= 5) {
      formattedInput =
        formattedInput.slice(0, 3) + '-' + formattedInput.slice(3)
    } else if (formattedInput.length > 5) {
      formattedInput =
        formattedInput.slice(0, 3) +
        '-' +
        formattedInput.slice(3, 5) +
        '-' +
        formattedInput.slice(5, 9)
    }

    setSsn(formattedInput)
  }

  useEffect(() => {
    async function fetchReport () {
      if (!tempDoc || !tempDoc.reportId) {
        setReport(null)
        return
      }

      const reportId = tempDoc.reportId
      const reportsRef = doc(db, 'reports', reportId)

      try {
        const reportSnap = await getDoc(reportsRef)
        if (reportSnap.exists()) {
          setReport(reportSnap.data())
        } else {
          setReport(null)
        }
      } catch (error) {
        console.error('Error fetching report:', error)
        setReport(null)
      }
    }

    fetchReport()
  }, [tempDoc])

  useEffect(() => {
    if (report && formRef.current) {
      setName(report.name)
    }
  }, [report])

  const handleSubmitData = async e => {
    e.preventDefault()

    if (!name || !dob || !ssn || !tempDoc || !tempDoc.reportId) return

    setUpdatingReport(true)

    const formData = new FormData(formRef.current)
    const updatedReport = {
      name: formData.get('name'),
      dob: formData.get('dob'),
      ssn: formData.get('ssn')
    }

    const updateAndDeleteDocTempURL = httpsCallable(
      functions,
      'updateAndDeleteDocTempURL'
    )

    try {
      const result = await updateAndDeleteDocTempURL({
        reportId: tempDoc.reportId,
        tempDocId: tempDoc.id,
        updatedReport
      })
      // console.log(result.data)
    } catch (error) {
      console.error('Error calling updateAndDeleteDocTempURL function: ', error)
    }

    setUpdatingReport(false)
  }

  return (
    <MainContainer>
      <Form ref={formRef} onSubmit={handleSubmitData}>
        <InputRow>
          <Label htmlFor='name'>Name:</Label>
          <Input
            type='text'
            id='name'
            name='name'
            placeholder='Name'
            onChange={e => setName(e.target.value)}
            value={name}
            required
          />
        </InputRow>
        <InputRow>
          <Label htmlFor='dob'>Date of Birth:</Label>
          <Input
            type='date'
            id='dob'
            name='dob'
            value={dob}
            onChange={e => setDob(e.target.value)}
            required
          />
        </InputRow>
        <InputRow>
          <Label htmlFor='ssn'>Social Security Number:</Label>
          <Input
            type='text'
            id='ssn'
            name='ssn'
            value={ssn}
            onChange={handleSsnChange}
            maxLength='11' // 9 digits + 2 dashes
            placeholder='XXX-XX-XXXX'
            required
          />
        </InputRow>
        <BtnContainer>
          <Btn disabled={updatingReport} type='submit'>
            Submit
          </Btn>
        </BtnContainer>
      </Form>
    </MainContainer>
  )
}

export default UserData
