import React, { useContext } from 'react'
import { TableData, TableRow } from './ReportItem.styles'
import { UserContext } from '../../contexts/user-context'
import { DebtTableData } from './DebtTable.style'
import { TaxTableData } from './TaxTable.style'

const ReportItem = ({ report, setItemToUpdate, setDisplayUpdate, agent }) => {
  const { user } = useContext(UserContext)

  const handleOpenUpdateModal = () => {
    setDisplayUpdate(true)
    setItemToUpdate(report)
  }

  return (
    <TableRow>
      {(user.role === 'admin' || user.role === 'super-admin') && (
        <>
          <TableData>{agent}</TableData>
          <TableData>{report.transfer}</TableData>
          <TableData>{report.phone}</TableData>
          <TableData>{report.name}</TableData>
          <TableData>{report.startTime}</TableData>
          <TableData>{report.duration}</TableData>
          <TableData>{report.notes}</TableData>
          <TableData>{report.enrolled ? 'Yes' : 'No'}</TableData>
          <TableData>{report.enrolledAmount}</TableData>
          <TableData>{report.notEnoughDebt ? 'NED' : '-'}</TableData>
          <TableData>{report.stateLiability}</TableData>
          <TableData>{report.federalLiability}</TableData>
        </>
      )}
      {user.department === 'debt' && (
        <>
          <DebtTableData>{report.transfer}</DebtTableData>
          <DebtTableData>{report.phone}</DebtTableData>
          <DebtTableData>{report.name}</DebtTableData>
          <DebtTableData>{report.startTime}</DebtTableData>
          <DebtTableData>{report.duration}</DebtTableData>
          <DebtTableData>{report.notes}</DebtTableData>
          <DebtTableData>{report.enrolled ? 'Yes' : 'No'}</DebtTableData>
          <DebtTableData>{report.enrolledAmount}</DebtTableData>
          <DebtTableData>{report.notEnoughDebt ? 'NED' : '-'}</DebtTableData>
        </>
      )}

      {user.department === 'tax' && (
        <>
          <TaxTableData>{report.transfer}</TaxTableData>
          <TaxTableData>{report.phone}</TaxTableData>
          <TaxTableData>{report.name}</TaxTableData>
          <TaxTableData>{report.startTime}</TaxTableData>
          <TaxTableData>{report.duration}</TaxTableData>
          <TaxTableData>{report.notes}</TaxTableData>
          <TaxTableData>{report.enrolled ? 'Yes' : 'No'}</TaxTableData>
          <TaxTableData>{report.stateLiability}</TaxTableData>
          <TaxTableData>{report.federalLiability}</TaxTableData>
        </>
      )}

      <TableData>
        <button onClick={handleOpenUpdateModal}>Update</button>
      </TableData>
    </TableRow>
  )
}

export default ReportItem
