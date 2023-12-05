import React, { useState, useEffect, useContext, useRef } from 'react'
import { UserContext } from '../../contexts/user-context'
import {
  usersRef,
  reportsRef,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp
} from '../../config'
import NewItem from './NewItem'
import ReportItem from './ReportItem'
import UpdateModal from '../modals/update/UpdateModal'
import {
  Divider,
  InputRow,
  Label,
  MainContainer,
  ReportTable,
  SectionNavContainer,
  SelectInput,
  TableBody,
  TableHead,
  TableRow,
  ReportMainContent
} from './AdminReports.styles'

const AdminReports = () => {
  const { user } = useContext(UserContext)
  const [reports, setReports] = useState([])
  const [displayNewItem, setDisplayNewItem] = useState(false)
  const [displayUpdateItem, setDisplayUpdate] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState(null)
  const [byTransfer, setByTransfer] = useState('all')
  const [byAgent, setByAgent] = useState('all')
  const [agents, setAgents] = useState([])
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  )
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0])

  const tableContainerRef = useRef(null)

  const handleTransferChange = e => {
    setByTransfer(e.target.value)
  }

  const handleAgentChange = e => {
    setByAgent(e.target.value)
  }

  const handleStartDateChange = e => {
    setStartDate(e.target.value)
    setEndDate(e.target.value)
  }

  const fetchAllUsers = async () => {
    try {
      // Fetch all documents from the collection
      const querySnapshot = await getDocs(usersRef)
      const tempAgents = []
      querySnapshot.forEach(doc => {
        tempAgents.push({ ...doc.data(), id: doc.id })
      })

      setAgents(tempAgents)
    } catch (error) {
      console.error('Error fetching user documents: ', error)
    }
  }

  const getAgentName = agentReportId => {
    const agentObj = agents.filter(agent => agent.id === agentReportId)[0]
    const firstName = agentObj.fname
    const lastName = agentObj.lname

    return `${firstName} ${lastName}`
  }

  useEffect(() => {
    if (!user) return

    fetchAllUsers()
  }, [user])

  useEffect(() => {
    if (!user) return

    // Define the offset for UTC-8 in minutes
    const offset = 1440 // Offset for UTC-8

    // Function to adjust date with the UTC-8 offset
    const adjustDateWithOffset = date => {
      const adjustedDate = new Date(date)
      adjustedDate.setMinutes(adjustedDate.getMinutes() + offset)
      return adjustedDate
    }

    // Use today's date if start or end date is not selected
    let selectedStartDate = startDate ? new Date(startDate) : new Date()
    let selectedEndDate = endDate ? new Date(endDate) : new Date()

    selectedStartDate = adjustDateWithOffset(selectedStartDate)
    selectedEndDate = adjustDateWithOffset(selectedEndDate)

    const startOfDate = new Date(selectedStartDate.setHours(0, 0, 0, 0))
    const endOfDate = new Date(selectedEndDate.setHours(23, 59, 59, 999))

    // Convert to Firestore Timestamps
    const startTimestamp = Timestamp.fromDate(startOfDate)
    const endTimestamp = Timestamp.fromDate(endOfDate)

    let conditions = [
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp)
    ]

    if (byTransfer !== 'all') {
      conditions.push(where('transfer', '==', Number(byTransfer)))
    }

    if (byAgent !== 'all') {
      conditions.push(where('agentId', '==', byAgent))
    }

    // Create a compound query
    const reportsQuery = query(reportsRef, ...conditions)

    // Real-time subscription
    const unsubscribe = onSnapshot(
      reportsQuery,
      snapshot => {
        let tempReports = []
        snapshot.forEach(doc => {
          tempReports.push({ ...doc.data(), id: doc.id })
        })
        setReports(tempReports)
      },
      err => {
        console.error('Error fetching reports: ', err.message)
      }
    )

    // Cleanup subscription on unmount
    return () => unsubscribe()
  }, [user, byTransfer, byAgent, startDate, endDate])

  useEffect(() => {
    // Scroll to the bottom of the table container whenever rows are updated
    if (tableContainerRef.current) {
      const { scrollHeight, clientHeight } = tableContainerRef.current
      tableContainerRef.current.scrollTop = scrollHeight - clientHeight
    }
  }, [reports])

  return (
    <MainContainer>
      {/* <button disabled={displayNewItem} onClick={() => setDisplayNewItem(true)}>
        New
      </button> */}
      <SectionNavContainer>
        <InputRow>
          <Label htmlFor='transfer'>Transfer:</Label>
          <SelectInput
            id='transfer'
            name='transfer'
            onChange={handleTransferChange}
          >
            <option key='all' value='all'>
              All
            </option>
            {[...Array(12)].map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </SelectInput>
        </InputRow>

        <InputRow>
          <Label htmlFor='agentName'>Agent:</Label>
          <SelectInput
            id='agentName'
            name='agentName'
            onChange={handleAgentChange}
          >
            <option key='all' value='all'>
              All
            </option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {`${agent.fname} ${agent.lname}`}
              </option>
            ))}
          </SelectInput>
        </InputRow>

        <InputRow>
          <Label htmlFor='start-date'>Start Date:</Label>
          <input
            type='date'
            id='start-date'
            value={startDate}
            onChange={e => handleStartDateChange(e)}
          />
        </InputRow>

        <InputRow>
          <Label htmlFor='end-date'>End Date:</Label>
          <input
            type='date'
            id='end-date'
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </InputRow>
      </SectionNavContainer>
      <ReportMainContent>
        <ReportTable>
          <thead>
            <TableRow>
              <TableHead>Agent</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>TSFR #</TableHead>
              <TableHead>Phone #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Enrolled Amount</TableHead>
              <TableHead>Not Enough Debt</TableHead>
              <TableHead>State Liability</TableHead>
              <TableHead>Federal Liability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </thead>
          <tbody ref={tableContainerRef}>
            {reports.map(report => (
              <ReportItem
                setItemToUpdate={setItemToUpdate}
                setDisplayUpdate={setDisplayUpdate}
                key={report.id}
                report={report}
                agent={getAgentName(report.agentId)}
              />
            ))}
          </tbody>
        </ReportTable>
      </ReportMainContent>

      {displayUpdateItem && (
        <UpdateModal
          setDisplayUpdate={setDisplayUpdate}
          report={itemToUpdate}
        />
      )}

      <p>Total: {reports.length}</p>
    </MainContainer>
  )
}

export default AdminReports
