import React, { useState, useEffect } from "react";
import {
  MainContainer,
  SectionNavContainer,
  Btn,
  MainContent,
  Goal,
} from "./ProgressReport.styles";
import { enrollmentsRef, query, onSnapshot, goalsRef } from "../../../config";
import { formatPriceAmount, sortProgress } from "../../../helpers";
import ProgressReportItem from "./ProgressReportItem";

const ProgressReport = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [currentGoals, setCurrentGoals] = useState([]);
  const [monthGoal, setMonthGoal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // const handleUpdateGoal = (e) => {
  //   e.preventDefault()

  //   setIsLoading(true)

  //   const docRef = doc(db, "goals", monthGoal.id);
  //   try {
  //     await updateDoc(docRef, updatedEnrollments);
  //   } catch (error) {
  //     console.error("Error updating enrollments: ", error);
  //   }

  // }

  useEffect(() => {
    if (currentGoals.length < 1) return;

    const filteredGoal = currentGoals.filter(
      (item) => item.title === "monthAmount",
    )[0];
    setMonthGoal(filteredGoal.value);
  }, [currentGoals]);

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
    let unsubscribe;

    const fetchData = async () => {
      let conditions = [];

      // Create a compound query
      const goalsQuery = query(goalsRef, ...conditions);

      // Real-time subscription
      unsubscribe = onSnapshot(
        goalsQuery,
        (snapshot) => {
          let tempCurrentGoals = [];
          snapshot.forEach((doc) => {
            tempCurrentGoals.push({ ...doc.data(), id: doc.id });
          });
          setCurrentGoals(tempCurrentGoals);
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

    const sortedData = sortProgress(enrollments);

    setSortedData(sortedData);
  }, [enrollments]);

  useEffect(() => {
    console.log("sorted Progress: ", sortedData);
  }, [sortedData]);

  return (
    <MainContainer>
      <SectionNavContainer>
        {/* <Btn>Update</Btn> */}
        <Goal>{`Goal: $${formatPriceAmount(monthGoal)}`}</Goal>
      </SectionNavContainer>

      <MainContent>
        {sortedData &&
          sortedData.map((agentEnrollments, index) => {
            return (
              <ProgressReportItem
                key={agentEnrollments.id}
                agentEnrollments={agentEnrollments}
                goal={monthGoal}
                index={index}
              />
            );
          })}
      </MainContent>
    </MainContainer>
  );
};

export default ProgressReport;
