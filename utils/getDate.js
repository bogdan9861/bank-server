const getDate = () => {
  const date = new Date();

  const getCurrentDate = () => {
    const days = {
      0: "Sun.",
      1: "Mnd.",
      2: "Tue.",
      3: "Wed.",
      4: "Thu.",
      5: "Fri.",
      6: "Sat.",
    };

    const months = {
      0: "January",
      1: "Fabruary",
      2: "March",
      3: "April",
      4: "May",
      5: "June",
      6: "July",
      7: "August",
      8: "September",
      9: "October",
      10: "November",
      11: "December",
    };

    const WeekDay = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${WeekDay} ${day} ${month} ${year}`;
  };

  const getTime = () => {
    let hour = date.getHours();
    let minutes = date.getMinutes();

    const setZero = (num) => {
      if (num < 10) {
        return "0" + num;
      } else {
        return num;
      }
    };

    return `${setZero(hour)}:${setZero(minutes)}`;
  };

  return { getCurrentDate, getTime };
};

module.exports = {
  getDate,
};
