const Moment = require('moment')
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const date = '17/08/2021';
const bookingInfos = [
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '10:00',
    serviceEnd: '11:00',
    customerQty: '4'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '10:30',
    serviceEnd: '13:00',
    customerQty: '5'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '12:00',
    serviceEnd: '13:00',
    customerQty: '4'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '12:30',
    serviceEnd: '14:00',
    customerQty: '6'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '13:30',
    serviceEnd: '15:00',
    customerQty: '5'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '14:30',
    serviceEnd: '16:00',
    customerQty: '10'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '15:00',
    serviceEnd: '17:00',
    customerQty: '10'
  },
  {
    customerName: 'Jane',
    mobileNo: '0123456789',
    serviceDate: '17/08/2021',
    serviceStart: '15:30',
    serviceEnd: '17:00',
    customerQty: '1'
  },
]

calculateTableNumbers = (date, bookingInfos) => {
  let tableQty = 0;
  let bookedIntervals = [];
  bookingInfos.forEach(booking => {
    if (booking.serviceDate === date) {
      const serviceStart = moment(booking.serviceDate + ' ' + booking.serviceStart, "DD/MM/YYYY hh:mm");
      const serviceEnd = moment(booking.serviceDate + ' ' + booking.serviceEnd, "DD/MM/YYYY hh:mm");
      const serviceRange = moment.range(serviceStart, serviceEnd);
      const tableNeeded = Math.ceil(booking.customerQty / 4);
      bookedIntervals.push({
        serviceRange,
        tableNeeded
      })
    }
  })

  let subsets = [];
  bookedIntervals.forEach((interval, index, array) => {
    for (let i = 0; i < array.length; i++) {
      if (i != index) {
        if (interval.serviceRange.overlaps(array[i].serviceRange)) {
          const intersectedRange = interval.serviceRange.intersect(array[i].serviceRange)
          if (!isRangeExistIn(intersectedRange, subsets)) {
            subsets.push(intersectedRange);
          }
        }
      }
    }
  })

  if (subsets.length === 0) {
    return Math.max(...bookedIntervals.map(interval => interval.tableNeeded));
  }

  let diffs = [];
  subsets.forEach(subsetA => {
    subsets.forEach(subsetB => {
      if (subsetA.overlaps(subsetB) && !subsetA.isSame(subsetB)) {
        // console.log('overlaps');
        if (subsetA.valueOf() > subsetB.valueOf()) {
          // console.log('A > B');
          const diffArray = subsetA.subtract(subsetB);
          diffArray.forEach(diff => {
            if (!isRangeExistIn(diff, diffs)) {
              diffs.push(diff)
            }
          })
          subsets = subsets.filter(el => !el.isSame(subsetA));
        }
      }
    })
  })

  diffs.forEach(diffA => {
    diffs.forEach(diffB => {
      if (diffA.overlaps(diffB) && !diffA.isSame(diffB)) {
        if (diffA.valueOf() > diffB.valueOf()) {
          diffs = diffs.filter(el => !el.isSame(diffA));
        }
      }
    })
  })

  subsets.forEach(subset => {
    for (let i = 0; i < diffs.length; i++) {
      if (diffs[i].overlaps(subset)) {
        // console.log('overlapped');
        break;
      }
      // console.log('not overlapped');
      if (!isRangeExistIn(diffs[i], subsets)) {
        subsets.push(diffs[i]);

      }
    }
  })

  subsets.forEach(subset => {
    let tableNeeded = 0;
    bookedIntervals.forEach(interval => {
      if (subset.overlaps(interval.serviceRange)) {
        tableNeeded+=interval.tableNeeded;
      }
    })
    if (tableNeeded > tableQty) {
      tableQty = tableNeeded
    }
  })

  return tableQty;
}

isRangeExistIn = (range, array) => {
  let result = false;
  array.forEach(el => {
    if (el.isSame(range)) {
      result = true;
    }
  })
  return result;
}

const tableQty = calculateTableNumbers(date, bookingInfos);
console.log(tableQty);