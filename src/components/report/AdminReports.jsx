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
  ReportMainContent,
  Btn
} from './AdminReports.styles'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'

const AdminReports = () => {
  const { user } = useContext(UserContext)
  const [reports, setReports] = useState([])
  const [displayNewItem, setDisplayNewItem] = useState(false)
  const [displayUpdateItem, setDisplayUpdate] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState(null)
  const [byTransfer, setByTransfer] = useState('all')
  const [byDepartment, setByDepartment] = useState('all')
  const [byAgent, setByAgent] = useState('all')
  const [agents, setAgents] = useState([])
  const [startDate, setStartDate] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
  )
  const [endDate, setEndDate] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'America/Los_Angeles' })
  )
  const [isExporting, setIsExporting] = useState(false)

  const tableContainerRef = useRef(null)

  const handleTransferChange = e => {
    setByTransfer(e.target.value)
  }

  const handleDepartmentChange = e => {
    setByDepartment(e.target.value)
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

  const getDepartmentUserIds = async () => {
    try {
      const usersQuery = query(
        usersRef,
        where('department', '==', byDepartment)
      )
      const userSnapshot = await getDocs(usersQuery)
      const userIds = userSnapshot.docs.map(doc => doc.id)

      return userIds
    } catch (error) {
      console.log('Error getting userIds: ', error)
    }
  }

  const exportToExcel = () => {
    setIsExporting(true)

    const fileType =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    const fileExtension = '.xlsx'

    const buildRow = report => {
      const baseData = {
        Date: report.createdAt
          ? report.createdAt.toDate().toLocaleDateString()
          : 'N/A', // Adjust format as needed
        Agent: getAgentName(report.agentId),
        'TSFR #': report.transfer,
        'Phone #': report.phone,
        Name: report.name,
        'Start Time': report.startTime,
        Duration: report.duration,
        Notes: report.notes,
        Enrolled: report.enrolled ? 'Yes' : 'No'
      }

      if (byDepartment === 'all' || byDepartment === 'debt') {
        baseData['Enrolled Amount'] = report.enrolledAmount
        baseData['Not Enough Debt'] = report.notEnoughDebt ? 'NED' : '-'
      }

      if (byDepartment === 'all' || byDepartment === 'tax') {
        baseData['State Liability'] = report.stateLiability
        baseData['Federal Liability'] = report.federalLiability
      }

      return baseData
    }

    const dataForExport = reports.map(buildRow)

    const ws = XLSX.utils.json_to_sheet(dataForExport)
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: fileType })
    FileSaver.saveAs(data, 'Reports' + fileExtension)

    setIsExporting(false)
  }

  useEffect(() => {
    if (!user) return

    fetchAllUsers()
  }, [user])

  useEffect(() => {
    if (!user) return

    let unsubscribe

    const fetchData = async () => {
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

      if (byDepartment !== 'all') {
        try {
          // Await the result of getDepartmentUserIds
          const departmentUserIds = await getDepartmentUserIds()

          if (departmentUserIds && departmentUserIds.length > 0) {
            conditions.push(where('agentId', 'in', departmentUserIds))
          }
        } catch (error) {
          console.error('Error getting department user IDs:', error)
        }
      }

      if (byAgent !== 'all') {
        conditions.push(where('agentId', '==', byAgent))
      }

      // Create a compound query
      const reportsQuery = query(reportsRef, ...conditions)

      // Real-time subscription
      unsubscribe = onSnapshot(
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
      return unsubscribe
    }

    // Call the async function
    fetchData()

    // Cleanup function
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [user, byTransfer, byDepartment, byAgent, startDate, endDate])

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
          <Label htmlFor='department'>Department:</Label>
          <SelectInput
            id='department'
            name='department'
            onChange={handleDepartmentChange}
          >
            <option key='all' value='all'>
              All
            </option>
            <option key='debt' value='debt'>
              Debt
            </option>
            <option key='tax' value='tax'>
              Tax
            </option>
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

        <InputRow className='export'>
          <Btn disabled={isExporting} onClick={exportToExcel}>
            Export
          </Btn>
        </InputRow>
      </SectionNavContainer>
      <ReportMainContent>
        <ReportTable>
          <thead>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>TSFR #</TableHead>
              <TableHead>Phone #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Enrolled</TableHead>

              {(byDepartment === 'all' || byDepartment === 'debt') && (
                <>
                  <TableHead>Enrolled Amount</TableHead>
                  <TableHead>Not Enough Debt</TableHead>
                </>
              )}

              {(byDepartment === 'all' || byDepartment === 'tax') && (
                <>
                  <TableHead>State Liability</TableHead>
                  <TableHead>Federal Liability</TableHead>
                </>
              )}

              <TableHead>Actions</TableHead>
            </TableRow>
          </thead>
          <tbody ref={tableContainerRef}>
            {reports.map(report => (
              <ReportItem
                setItemToUpdate={setItemToUpdate}
                setDisplayUpdate={setDisplayUpdate}
                byDepartment={byDepartment}
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
