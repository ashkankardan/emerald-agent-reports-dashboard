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
        ${formatPriceAmount(agentEnrollments.cancellationAmount)}
      </TableData>
      <TableData className="counts">
        {agentEnrollments.cancellationCount}
      </TableData>
      <TableData>
        {agentEnrollments.fname} {agentEnrollments.lname}
      </TableData>
      <TableData className="counts">{agentEnrollments.dayCount}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.dayAmount)}</TableData>
      <TableData className="counts">{agentEnrollments.pendingCount}</TableData>
      <TableData>
        ${formatPriceAmount(agentEnrollments.pendingAmount)}
      </TableData>
      <TableData className="counts">{agentEnrollments.weekCount}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.weekAmount)}</TableData>
      <TableData>${formatPriceAmount(agentEnrollments.monthAmount)}</TableData>
      <TableData>
        ${formatPriceAmount(agentEnrollments.quarterAmount)}
      </TableData>
      <TableData>
        <Btn onClick={handleOpenUpdateModal}>Update</Btn>
      </TableData>
    </TableRow>
  );
};

export default EnrollmentsReportItem;
