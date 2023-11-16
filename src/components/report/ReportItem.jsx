import React, { useContext } from 'react'
import { TableData, TableRow } from './ReportItem.styles'
import { UserContext } from '../../contexts/user-context'

const ReportItem = ({ report, setItemToUpdate, setDisplayUpdate, agent }) => {
  const { user } = useContext(UserContext)

  const handleOpenUpdateModal = () => {
    setDisplayUpdate(true)
    setItemToUpdate(report)
  }

  return (
    <TableRow>
      {(user.role === 'admin' || user.role === 'super-admin') && (
        <TableData>{agent}</TableData>
      )}
      <TableData>{report.transfer}</TableData>
      <TableData>{report.phone}</TableData>
      <TableData>{report.name}</TableData>
      <TableData>{report.startTime}</TableData>
      <TableData>{report.duration}</TableData>
      <TableData>{report.notes}</TableData>
      <TableData>{report.enrolled ? 'Yes' : 'No'}</TableData>
      {user.department !== 'tax' ? (
        <>
          <TableData>{report.enrolledAmount}</TableData>
          <TableData>{report.notEnoughDebt ? 'NED' : '-'}</TableData>
        </>
      ) : (
        <>
          <TableData>{report.stateLiability}</TableData>
          <TableData>{report.federalLiability}</TableData>
        </>
      )}

      {(user.role === 'admin' || user.role === 'super-admin') && (
        <>
          <TableData>{report.stateLiability}</TableData>
          <TableData>{report.federalLiability}</TableData>
        </>
      )}
      <TableData>
        <button onClick={handleOpenUpdateModal}>Update</button>
      </TableData>
    </TableRow>
  )
}

export default ReportItem
