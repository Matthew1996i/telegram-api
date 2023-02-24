const { subYears, format, isThisYear, getMonth } = require('date-fns');
const { months } = require('../utils/months');

module.exports = {
  async getYears(daysFrom) {
    let years = [];

    for (let i = 0; i < daysFrom; i++) {
      const yearFormat = format(subYears(new Date(), i), 'yyyy');
      years.push([{ text: yearFormat, callback_data: yearFormat }]);
    }

    return years;
  },

  async getMonths(yearSelected) {
    let formatMonths = [];

    if (isThisYear(new Date(yearSelected, 1, 1))) {
      for (let i = 0; i <= getMonth(new Date()); i++) {
        formatMonths.push([{ text: months[i], callback_data: i }]);
      }

      return formatMonths;
    }

    formatMonths = months.map((month, index) => {
      return [{ text: month, callback_data: index }];
    });

    return formatMonths;
  },
};
