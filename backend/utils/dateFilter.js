const isDateInPeriod = (date, period = "overall") => {
  if (!date) return false;

  const value = new Date(date);
  const now = new Date();
  if (isNaN(value.getTime()))
    return false;

  const today = new Date();
  today.setHours(0,0,0,0);

  const todayEnd = new Date(today);
  todayEnd.setHours(23,59,59,999);

  const monthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const threeMonthStart = new Date(
    now.getFullYear(),
    now.getMonth()-2,
    1
  );

  switch(period){

    case "today":
      return value >= today && value <= todayEnd;

    case "thisMonth":
     const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth()+1,
    0,
    23,
    59,
    59,
    999
);

return value >= monthStart &&
       value <= monthEnd;

case "last3Months":
    return value >= threeMonthStart &&
       value <= now;

    case "overall":
    default:
      return true;

  }
};

module.exports = {
    isDateInPeriod
};