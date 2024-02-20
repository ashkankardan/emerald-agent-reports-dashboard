import { useEffect, useState } from 'react';

const useCalcEnrolledAmount = ({ reports }) => {
  const [formattedTotal, setFormattedTotal] = useState(null);

  const recalculateTotal = () => {
    if (!reports || reports.length < 1) {
      setFormattedTotal(null);
      return;
    }

    const total = reports.reduce((acc, report) => {
      if (report.enrolledAmount) {
        const amount = parseFloat(report.enrolledAmount.replace(/[^\d.]/g, ""));
        return acc + amount;
      }
      return acc;
    }, 0);

    const newFormattedTotal = total.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setFormattedTotal(newFormattedTotal);
  };

  useEffect(() => {
    // Call the recalculation function once on initial render or when reports change
    recalculateTotal();
  }, [reports]);

  return { formattedTotal, recalculateTotal };
};

export default useCalcEnrolledAmount;
