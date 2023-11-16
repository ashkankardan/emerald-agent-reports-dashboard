import React, { useState, useEffect, useContext } from 'react'
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
  TableRow
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

  const handleTransferChange = e => {
    setByTransfer(e.target.value)
  }

  const handleAgentChange = e => {
    setByAgent(e.target.value)
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

  // useEffect(() => {
  //   console.log('All User Documents:', agents)
  // }, [agents])

  useEffect(() => {
    if (!user) return

    // For example, querying documents created on November 11, 2023 in UTC-8
    // const startOfDate = new Date('2023-11-11T00:00:00-08:00') // Start of day in UTC-8
    // const endOfDate = new Date('2023-11-11T23:59:59-08:00') // End of day in UTC-8

    // Get the current date in UTC
    const now = new Date()

    // Convert it to UTC-8
    const offset = 1 // Offset in minutes for UTC-8
    const nowInUTC8 = new Date(now.getTime() + offset * 60000)

    // Set the start and end of the day in UTC-8
    const startOfDate = new Date(nowInUTC8.setHours(0, 0, 0, 0))
    const endOfDate = new Date(nowInUTC8.setHours(23, 59, 59, 999))

    // Convert to Firestore Timestamp
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
  }, [user, byTransfer, byAgent])

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
      </SectionNavContainer>

      <ReportTable>
        <thead>
          <TableRow>
            <TableHead>Agent</TableHead>
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
        <tbody>
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
