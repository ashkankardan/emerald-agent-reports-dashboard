import React, { useState, useEffect, useContext } from "react";
import { Btn, TableData, TableRow } from "./ReportItem.styles";
import { UserContext } from "../../contexts/user-context";
import { DebtTableData } from "./DebtTable.style";
import { TaxTableData } from "./TaxTable.style";
import { format } from "date-fns";

const ReportItem = ({
  report,
  setItemToUpdate,
  setDisplayUpdate,
  agent,
  byDepartment,
}) => {
  const [createdAtFormatted, setCreatedAtFormatted] = useState("N/A");

  const { user } = useContext(UserContext);

  const handleOpenUpdateModal = () => {
    setDisplayUpdate(true);
    setItemToUpdate(report);
  };

  useEffect(() => {
    // Function to format the date
    const formatDate = (timestamp) => {
      if (timestamp && timestamp.toDate) {
        // Convert Firestore Timestamp to JavaScript Date and format it
        // Uncomment the desired format
        return format(timestamp.toDate(), "MM/dd/yy"); // For "MM/DD/YYYY" format
        // return format(timestamp.toDate(), 'MMM dd yyyy'); // For "MMM DD YYYY" format
      }
      return "N/A";
    };

    // Update state with the formatted date
    if (report && report.createdAt) {
      setCreatedAtFormatted(formatDate(report.createdAt));
    }
  }, [report]);

  return (
    <TableRow>
      {(user.role === "admin" || user.role === "super-admin") && (
        <>
          <TableData className={byDepartment}>{createdAtFormatted}</TableData>
          <TableData className={byDepartment}>{agent}</TableData>
          <TableData className={byDepartment}>{report.transfer}</TableData>
          <TableData className={byDepartment}>{report.phone}</TableData>
          <TableData className={byDepartment}>{report.name}</TableData>
          <TableData className={byDepartment}>{report.startTime}</TableData>
          <TableData className={byDepartment}>{report.duration}</TableData>
          <TableData className={byDepartment}>{report.notes}</TableData>
          <TableData className={byDepartment}>
            {report.enrolled ? "Yes" : "No"}
          </TableData>

          {(byDepartment === "all" || byDepartment === "debt") && (
            <>
              <TableData className={byDepartment}>
                {report.enrolledAmount}
              </TableData>
              <TableData className={byDepartment}>
                {report.notEnoughDebt ? "NED" : "-"}
              </TableData>
            </>
          )}
          {(byDepartment === "all" || byDepartment === "tax") && (
            <>
              <TableData className={byDepartment}>
                {report.stateLiability}
              </TableData>
              <TableData className={byDepartment}>
                {report.federalLiability}
              </TableData>
            </>
          )}
        </>
      )}
      {user.department === "debt" && (
        <>
          <DebtTableData>{report.transfer}</DebtTableData>
          <DebtTableData>{report.phone}</DebtTableData>
          <DebtTableData>{report.name}</DebtTableData>
          <DebtTableData>{report.startTime}</DebtTableData>
          <DebtTableData>{report.duration}</DebtTableData>
          <DebtTableData>{report.notes}</DebtTableData>
          <DebtTableData>{report.enrolled ? "Yes" : "No"}</DebtTableData>
          <DebtTableData>{report.enrolledAmount}</DebtTableData>
          <DebtTableData>{report.notEnoughDebt ? "NED" : "-"}</DebtTableData>
        </>
      )}

      {user.department === "tax" && (
        <>
          <TaxTableData>{report.transfer}</TaxTableData>
          <TaxTableData>{report.phone}</TaxTableData>
          <TaxTableData>{report.name}</TaxTableData>
          <TaxTableData>{report.startTime}</TaxTableData>
          <TaxTableData>{report.duration}</TaxTableData>
          <TaxTableData>{report.notes}</TaxTableData>
          <TaxTableData>{report.enrolled ? "Yes" : "No"}</TaxTableData>
          <TaxTableData>{report.stateLiability}</TaxTableData>
          <TaxTableData>{report.federalLiability}</TaxTableData>
        </>
      )}

      <TableData>
        <Btn onClick={handleOpenUpdateModal}>Update</Btn>
      </TableData>
    </TableRow>
  );
};

export default ReportItem;
