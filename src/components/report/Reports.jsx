import React, { useState, useEffect, useContext } from 'react'
import { MainContainer } from './Reports.styles'
import { UserContext } from '../../contexts/user-context'
import { reportsRef, query, where, getDocs, onSnapshot, Timestamp } from '../../config'
import NewItem from './NewItem'
import ReportItem from './ReportItem'
import UpdateModal from '../modals/update/UpdateModal'

const Reports = () => {
  const { user } = useContext(UserContext)
  const [reports, setReports] = useState([])
  const [displayNewItem, setDisplayNewItem] = useState(false)
  const [displayUpdateItem, setDisplayUpdate] = useState(false)
  const [itemToUpdate, setItemToUpdate] = useState(null)


  useEffect(() => {
    if (!user) return

    // // For example, querying documents created on November 11, 2023 in UTC-8
    // const startOfDate = new Date('2023-11-11T00:00:00-08:00') // Start of day in UTC-8
    // const endOfDate = new Date('2023-11-11T23:59:59-08:00') // End of day in UTC-8

    // Get the current date in UTC
    const now = new Date()

    // Convert it to UTC-8
    const offset = -8 * 60 // Offset in minutes for UTC-8
    const nowInUTC8 = new Date(now.getTime() + offset * 60000)

    // Set the start and end of the day in UTC-8
    const startOfDate = new Date(nowInUTC8.setHours(0, 0, 0, 0))
    const endOfDate = new Date(nowInUTC8.setHours(23, 59, 59, 999))

    // Convert to Firestore Timestamp
    const startTimestamp = Timestamp.fromDate(startOfDate)
    const endTimestamp = Timestamp.fromDate(endOfDate)

    // Create a compound query
    const reportsQuery = query(
      reportsRef,
      where('agentId', '==', user.id),
      where('createdAt', '>=', startTimestamp),
      where('createdAt', '<=', endTimestamp)
    )

    // Real-time subscription
    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      let tempReports = [];
      snapshot.forEach(doc => {
        tempReports.push({ ...doc.data(), id: doc.id });
      });
      setReports(tempReports);
    }, (err) => {
      console.error("Error fetching reports: ", err.message);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  return (
    <MainContainer>
      reports
      <button disabled={displayNewItem} onClick={() => setDisplayNewItem(true)}>
        New
      </button>
      {displayNewItem && <NewItem setDisplayNewItem={setDisplayNewItem} />}
      <div>
        {reports.map(report => {
          return <ReportItem setItemToUpdate={setItemToUpdate} setDisplayUpdate={setDisplayUpdate} key={report.id} report={report} />
        })}
      </div>

      {
        displayUpdateItem && <UpdateModal setDisplayUpdate={setDisplayUpdate} report={itemToUpdate} />
      }

      <p>Total: {reports.length}</p>
    </MainContainer>
  )
}

export default Reports
