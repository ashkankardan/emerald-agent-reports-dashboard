import React from 'react';
import { MainContainer } from './Reports.styles';

const ReportItem = ({report, setItemToUpdate, setDisplayUpdate}) => {

  const handleOpenUpdateModal = () =>{
    setDisplayUpdate(true)
    setItemToUpdate(report)
  }

  console.log(report)
  return (
    <MainContainer>
      <p><strong>TRSFR#: </strong>{report.transfer}</p>
      <p><strong>Phone#: </strong>{report.phone}</p>
      <p><strong>Name: </strong>{report.name}</p>
      <p><strong>Start Time: </strong>{report.startTime}</p>
      <p><strong>Duration: </strong>{report.duration}</p>
      <p><strong>Notes: </strong>{report.notes}</p>
      <p><strong>Enrolled: </strong>{report.enrolled}</p>
      <p><strong>Enrolled Amount: </strong>{report.enrolledAmount}</p>
      <p><strong>Not Enough Debt: </strong>{report.notEnoughDebt ? 'Yes' : 'No'}</p>
      <button onClick={handleOpenUpdateModal}>Update</button>

    </MainContainer>
  );
};

export default ReportItem;
