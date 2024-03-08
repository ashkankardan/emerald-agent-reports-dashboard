import React from "react";
import { TableRow, TableData, Btn } from "./EnrollmentsReportItem.styles";
import { formatPriceAmount } from "../../helpers";

const EnrollmentsReportItem = ({
  agentEnrollments,
  setItemToUpdate,
  setDisplayUpdate,
}) => {
  const handleOpenUpdateModal = () => {
    setDisplayUpdate(true);
    setItemToUpdate(agentEnrollments);
  };

  return (
    <TableRow>
      <TableData>
        {agentEnrollments.fname} {agentEnrollments.lname}
      </TableData>
      <TableData>{agentEnrollments.dayCount}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.dayAmount)}</TableData>
      <TableData>{agentEnrollments.pendingCount}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.pendingAmount)}</TableData>
      <TableData>{agentEnrollments.weekCount}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.weekAmount)}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.monthAmount)}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.quarterAmount)}</TableData>
      <TableData>
        <Btn onClick={handleOpenUpdateModal}>Update</Btn>
      </TableData>
    </TableRow>
  );
};

export default EnrollmentsReportItem;
