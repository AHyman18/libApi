module.exports = [
  {
    userId: 2,
    log: [
      {
        id: 1,
        isbn: {
          isbn10: 054558292,
          isbn13: 9780545582926,
        },
        checkoutDate: 12 - 24 - 2019,
        dueDate: 12 - 25 - 2019,
        overDue: 46,
      },
      {
        id: 2,
        isbn: {
          isbn10: 3,
          isbn13: 3,
        },
        checkoutDate: 12 - 24 - 2019,
        dueDate: 06 - 27 - 2019,
        overDue: -2,
      },
    ],
  },
  {
    userId: 4,
    log: [
      {
        id: 3,
        isbn: {
          isbn10: 054558292,
          isbn13: 9780545582926,
        },
        checkoutDate: 01 - 24 - 2020,
        dueDate: 02 - 14 - 2020,
        overDue: 14,
      },
    ],
  },
  {
    userId: 3,
    log: [
      {
        id: 4,
        isbn: {
          isbn10: 0545010225,
          isbn13: 9780545010221,
        },
        checkoutDate: 03 - 10 - 2020,
        dueDate: 03 - 12 - 2020,
        overDue: -23,
      },
    ],
  },
];
