import React, { useState, useEffect } from "react";
import {
  MainContainer,
  ReportMainContent,
  ReportTable,
  TableHead,
  TableRow,
} from "./EnrollmentsReports.styles";
import { enrollmentsRef, query, onSnapshot } from "../../config";
import EnrollmentsReportItem from "./EnrollmentsReportItem";
import EnrollmentsUpdateModal from "../modals/enrollments-update/EnrollmentsUpdateModal";
import EnrollmentsStats from "../stats/EnrollmentsStats";
import { sortEnrollments } from "../../helpers";

const EnrollmentsReports = ({ setReportView }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [displayUpdateItem, setDisplayUpdate] = useState(false);
  const [itemToUpdate, setItemToUpdate] = useState(null);
  const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let unsubscribe;

    const fetchData = async () => {
      let conditions = [];

      // Create a compound query
      const enrollmentsQuery = query(enrollmentsRef, ...conditions);

      // Real-time subscription
      unsubscribe = onSnapshot(
        enrollmentsQuery,
        (snapshot) => {
          let tempEnrollments = [];
          snapshot.forEach((doc) => {
            tempEnrollments.push({ ...doc.data(), id: doc.id });
          });
          setEnrollments(tempEnrollments);
        },
        (err) => {
          console.error("Error fetching reports: ", err.message);
        },
      );

      // Cleanup subscription on unmount
      return unsubscribe;
    };

    // Call the async function
    fetchData();

    // Cleanup function
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!enrollments) return;

    const sortedData = sortEnrollments(enrollments);

    setSortedData(sortedData);
  }, [enrollments]);

  return (
    <MainContainer>
      <ReportMainContent>
        <ReportTable>
          <thead>
            <TableRow>
              <TableHead className="cancellationCount">
                Cancellation $
              </TableHead>
              <TableHead className="cancellationAmount">
                Cancellation #
              </TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Day #</TableHead>
              <TableHead className="dayAmount">Day $</TableHead>
              <TableHead>Pending #</TableHead>
              <TableHead className="pendingAmount">Pending $</TableHead>
              <TableHead>Week #</TableHead>
              <TableHead className="weekAmount">Week $</TableHead>
              <TableHead className="monthAmount">Month $</TableHead>
              <TableHead className="quarterAmount">Quarter $</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </thead>
          <tbody>
            {sortedData &&
              sortedData.map((agentEnrollments) => {
                return (
                  <EnrollmentsReportItem
                    key={agentEnrollments.id}
                    agentEnrollments={agentEnrollments}
                    setItemToUpdate={setItemToUpdate}
                    setDisplayUpdate={setDisplayUpdate}
                  />
                );
              })}
            <EnrollmentsStats enrollments={enrollments} />
          </tbody>
        </ReportTable>
      </ReportMainContent>
      {displayUpdateItem && (
        <EnrollmentsUpdateModal
          setDisplayUpdate={setDisplayUpdate}
          agentEnrollments={itemToUpdate}
        />
      )}
    </MainContainer>
  );
};

export default EnrollmentsReports;
