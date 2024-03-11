import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Btn,
  Divider,
  MainContainer,
  ReportTable,
  SectionNavContainer,
  TableHead,
  TableRow,
  ReportMainContent,
} from "./Reports.styles";
import { UserContext } from "../../contexts/user-context";
import useCalcEnrolledAmount from "../../hooks/useCalcEnrolledAmount";
import {
  reportsRef,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
} from "../../config";
import NewItem from "./NewItem";
import ReportItem from "./ReportItem";
import UpdateModal from "../modals/update/UpdateModal";
import NewModal from "../modals/new/NewModal";
import { DebtTableHead } from "./DebtTable.style";
import { TaxTableHead } from "./TaxTable.style";
import Stats from "../stats/Stats";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [displayNewItem, setDisplayNewItem] = useState(false);
  const [displayUpdateItem, setDisplayUpdate] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);

  const { user } = useContext(UserContext);
  const { formattedTotal, recalculateTotal } = useCalcEnrolledAmount({
    reports,
  });

  const tableContainerRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // // For example, querying documents created on November 11, 2023 in UTC-8
    // const startOfDate = new Date('2023-11-13T00:00:00-08:00') // Start of day in UTC-8
    // const endOfDate = new Date('2023-11-13T23:59:59-08:00') // End of day in UTC-8

    // Get the current date in UTC
    const now = new Date();

    // Convert it to UTC-8
    // const offset = -8 * 60 // Offset in minutes for UTC-8
    const offset = 1; // Offset in minutes for UTC-8
    const nowInUTC8 = new Date(now.getTime() + offset * 60000);

    // Set the start and end of the day in UTC-8
    const startOfDate = new Date(nowInUTC8.setHours(0, 0, 0, 0));
    const endOfDate = new Date(nowInUTC8.setHours(23, 59, 59, 999));

    // Convert to Firestore Timestamp
    const startTimestamp = Timestamp.fromDate(startOfDate);
    const endTimestamp = Timestamp.fromDate(endOfDate);

    // Create a compound query
    const reportsQuery = query(
      reportsRef,
      where("agentId", "==", user.id),
      where("createdAt", ">=", startTimestamp),
      where("createdAt", "<=", endTimestamp),
    );

    // Real-time subscription
    const unsubscribe = onSnapshot(
      reportsQuery,
      (snapshot) => {
        let tempReports = [];
        snapshot.forEach((doc) => {
          tempReports.push({ ...doc.data(), id: doc.id });
        });
        setReports(tempReports);
      },
      (err) => {
        console.error("Error fetching reports: ", err.message);
      },
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    // Scroll to the bottom of the table container whenever rows are updated
    if (tableContainerRef.current) {
      const { scrollHeight, clientHeight } = tableContainerRef.current;
      tableContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [reports]);

  useEffect(() => {
    recalculateTotal();
  }, [reports]);

  return (
    <MainContainer>
      <SectionNavContainer>
        <Btn disabled={displayNewItem} onClick={() => setDisplayNewItem(true)}>
          New
        </Btn>
      </SectionNavContainer>

      {displayNewItem && <NewModal setDisplayNewItem={setDisplayNewItem} />}
      <ReportMainContent>
        <ReportTable>
          <thead>
            <TableRow>
              {(user.role === "admin" || user.role === "super-admin") && (
                <>
                  <TableHead>TSFR #</TableHead>
                  <TableHead>Access Code</TableHead>
                  <TableHead>Phone #</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Enrolled</TableHead>
                  <TableHead>Enrolled Amount</TableHead>
                  <TableHead>Not Enough Debt</TableHead>
                </>
              )}

              {user.department === "debt" && (
                <>
                  <DebtTableHead>TSFR #</DebtTableHead>
                  <TableHead>Access Code</TableHead>
                  <DebtTableHead>Phone #</DebtTableHead>
                  <DebtTableHead>Name</DebtTableHead>
                  <DebtTableHead>Start Time</DebtTableHead>
                  <DebtTableHead>Duration</DebtTableHead>
                  <DebtTableHead>Notes</DebtTableHead>
                  <DebtTableHead>Enrolled</DebtTableHead>
                  <DebtTableHead>Enrolled Amount</DebtTableHead>
                  <DebtTableHead>Not Enough Debt</DebtTableHead>
                </>
              )}

              {user.department === "tax" && (
                <>
                  <TaxTableHead>TSFR #</TaxTableHead>
                  <TableHead>Access Code</TableHead>
                  <TaxTableHead>Phone #</TaxTableHead>
                  <TaxTableHead>Name</TaxTableHead>
                  <TaxTableHead>Start Time</TaxTableHead>
                  <TaxTableHead>Duration</TaxTableHead>
                  <TaxTableHead>Notes</TaxTableHead>
                  <TaxTableHead>Enrolled</TaxTableHead>
                  <TaxTableHead>State Liability</TaxTableHead>
                  <TaxTableHead>Federal Liability</TaxTableHead>
                </>
              )}

              <TableHead>Actions</TableHead>
            </TableRow>
          </thead>
          <tbody ref={tableContainerRef}>
            {reports.map((report) => (
              <ReportItem
                setItemToUpdate={setItemToUpdate}
                setDisplayUpdate={setDisplayUpdate}
                key={report.id}
                report={report}
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

      <Stats count={reports.length} amount={formattedTotal} />
    </MainContainer>
  );
};

export default Reports;
