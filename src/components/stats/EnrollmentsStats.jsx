import React, { useState, useEffect } from "react";
import {
  TableRow,
  TableData,
  Logo,
  LogoContainer,
} from "./EnrollmentsStats.styles";
import { formatPriceAmount } from "../../helpers";
import logoImg from "../../assets/img/EmeraldGain-FinancialGroup-favicon.png";

const EnrollmentsStats = ({ enrollments }) => {
  const [total, setTotal] = useState({
    cancellationCount: 0,
    cancellationAmount: 0,
    dayCount: 0,
    dayAmount: 0,
    pendingCount: 0,
    pendingAmount: 0,
    weekCount: 0,
    weekAmount: 0,
    monthAmount: 0,
    quarterAmount: 0,
  });

  useEffect(() => {
    console.log("enrollments: ", enrollments);

    const tempTotal = {
      cancellationCount: 0,
      cancellationAmount: 0,
      dayCount: 0,
      dayAmount: 0,
      pendingCount: 0,
      pendingAmount: 0,
      weekCount: 0,
      weekAmount: 0,
      monthAmount: 0,
      quarterAmount: 0,
    };

    const totals = enrollments.reduce(
      (acc, obj) => {
        acc.cancellationCount += Number(obj.cancellationCount);
        acc.cancellationAmount += Number(obj.cancellationAmount);
        acc.dayCount += Number(obj.dayCount);
        acc.dayAmount += Number(obj.dayAmount);
        acc.pendingCount += Number(obj.pendingCount);
        acc.pendingAmount += Number(obj.pendingAmount);
        acc.weekCount += Number(obj.weekCount);
        acc.weekAmount += Number(obj.weekAmount);
        acc.monthAmount += Number(obj.monthAmount);
        acc.quarterAmount += Number(obj.quarterAmount);
        return acc;
      },
      { ...tempTotal },
    );

    setTotal(totals);
  }, [enrollments]);

  return (
    <TableRow>
      <TableData>${formatPriceAmount(total.cancellationAmount)}</TableData>
      <TableData className="counts">{total.cancellationCount}</TableData>
      <TableData>Total</TableData>
      <TableData className="counts">{total.dayCount}</TableData>
      <TableData>${formatPriceAmount(total.dayAmount)}</TableData>
      <TableData className="counts">{total.pendingCount}</TableData>
      <TableData>${formatPriceAmount(total.pendingAmount)}</TableData>
      <TableData className="counts">{total.weekCount}</TableData>
      <TableData>${formatPriceAmount(total.weekAmount)}</TableData>
      <TableData>${formatPriceAmount(total.monthAmount)}</TableData>
      <TableData>${formatPriceAmount(total.quarterAmount)}</TableData>
      <TableData>
        <LogoContainer>
          <Logo src={logoImg} alt="Emerald Gain Logo" />
        </LogoContainer>
      </TableData>
    </TableRow>
  );
};

export default EnrollmentsStats;
