export const formatPriceAmount = (input) => {
  let inputStr = input.toString();
  let result = "";
  let length = inputStr.length;
  let count = 0;

  // Start from the rightmost digit and move towards the left
  for (let i = length - 1; i >= 0; i--) {
    result = inputStr[i] + result;
    count++;
    // Insert a comma after every 3 digits, except at the beginning
    if (count % 3 === 0 && i !== 0) {
      result = "," + result;
    }
  }

  return result;
};

export const getDurationSplit = (duration) => {
  const hour = Number(duration.split(":")[0]);
  const min = Number(duration.split(":")[1]);
  const splitObj = { hour, min };
  return splitObj;
};

export const sortEnrollments = (enrollments) => {
  const sortedData = [...enrollments].sort((a, b) => {
    if (b["dayCount"] !== a["dayCount"]) {
      return b["dayCount"] - a["dayCount"];
    } else if (b["dayAmount"] !== a["dayAmount"]) {
      return b["dayAmount"] - a["dayAmount"];
    } else if (b["weekAmount"] !== a["weekAmount"]) {
      return b["weekAmount"] - a["weekAmount"];
    } else if (b["monthAmount"] !== a["monthAmount"]) {
      return b["monthAmount"] - a["monthAmount"];
    } else if (b["quarterAmount"] !== a["quarterAmount"]) {
      return b["quarterAmount"] - a["quarterAmount"];
    } else {
      return a["fname"].localeCompare(b["fname"]);
    }
  });

  return sortedData;
};

export const sortProgress = (enrollments) => {
  const sortedData = [...enrollments].sort(
    (a, b) => b["monthAmount"] - a["monthAmount"],
  );
  return sortedData;
};

export const calculateProgressBarLength = (current, goal) => {
  const lenPerc = (current * 100) / goal;
  const roundedLenPerc = parseFloat(lenPerc.toFixed(2));
  return roundedLenPerc;
};
