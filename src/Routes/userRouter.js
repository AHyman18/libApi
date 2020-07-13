const express = require('express');
const path = require('path');
const fs = require('fs');
const userRouter = express();
let userTable_PathMock, booksTableMock, bookLogsMock, userTable, userTwoTable, userThreeTable, userFourTable;

// const booksTable_PathMock = require('../../Tables/TableCopies/booksTableMock.js')
// const userTable_PathMock = require('../../Tables/TableCopies/userTableMock.js')

userRouter.use('/', (req, res)=>{
  if(fs.existsSync(tableMocksDir)){
     userTable_PathMock= path.join(__dirname, '..', '..', 'Tables', 'TableCopies', 'userTableMock.js')
     booksTableMock = require('../../Tables/TableCopies/booksTableMock.js')
     bookLogsMock = require('../../Tables/TableCopies/booksLogTableMock.js')
     userTable = require('../../Tables/TableCopies/userTableMock.js')
     userTwoTable = require('../../Tables/TableCopies/userTwoMock.js')
     userThreeTable = require('../../Tables/TableCopies/userThreeMock.js')
     userFourTable = require('../../Tables/TableCopies/userFourMock.js')

  }
})
// const userTable_PathMock= path.join(__dirname, '..', '..', 'Tables', 'TableCopies', 'userTableMock.js')

// const booksTableMock = require('../../Tables/TableCopies/booksTableMock.js')
// const bookLogsMock = require('../../Tables/TableCopies/booksLogTableMock.js')
// const {userTable} = require('../../Tables/TableCopies/userTableMock.js')
// const {userTwoTable} = require('../../Tables/TableCopies/userTwoMock.js')
// const {userThreeTable} = require('../../Tables/TableCopies/userThreeMock.js')
// const {userFourTable} = require('../../Tables/TableCopies/userFourMock.js')


const { validateUser } = require('../Controllers/validateUser.js');


//push object with this shape
// {
//     id:1,
//     {
//       isbn10: 054558292,
//       isbn13: 9780545582926,
//     },
//     checkoutDate: 12 - 24 - 2019,
//     dueDate: 12 - 25 - 2019,
//     overDue: 46,
//   },

// into array of table

// {
//     isbn13:123912398392
// }

// //post shape: {
//     "userIsbn": 9780545582926
//   }
//user controller should check user log and how many items are in the array
//should check to seeif any books are overdue


userRouter.post('/checkout', (req, res) => {
  if (!req.body.userIsbn) return res.send('Please enter a valid ISBN 13 to checkout a book')
  const { user } = res.locals;
  const { userIsbn } = req.body;
  const userObj = {};

  switch (user) {
    case 2:
      userObj.newTable = [...userTwoTable];
      userObj.path = '../../Tables/TableCopies/userTwoMock.js'
      break
    case 3:
      userObj.newTable = [...userThreeTable];
      userObj.path='../../Tables/TableCopies/userThreeMock.js'
      break
    case 4:
      userObj.newTable = [...userFourTable];
      userObj.path='../../Tables/TableCopies/userFourMock.js'
      break
    }
                
  const {newTable, path} =userObj

  const updatedUserLog = booksTableMock.reduce((newBookLog, book) => {
    const curDate = new Date();
    const checkOutDate = new Date();
    const dueDate = checkOutDate.setDate(checkOutDate.getDate() + 14);

    if ((book.isbn['isbn13'] = userIsbn)) {
      newBookLog.id = newTable.length + 1; //POTENTIAL FOR OVERWRITING HERE
      newBookLog.isbn = book.isbn;
      newBookLog.checkOutDate = curDate;
      newBookLog.dueDate = checkOutDate;
      newBookLog.overdue = dueDate - curDate;
    }
    return newBookLog;
  }, {});

  newTable.push(updatedUserLog);
  const updatedUserTableStr = `module.exports = ${JSON.stringify(newTable)}`;
  
  fs.writeFile(path, newTable, (err) => {
    if (err) console.log('//');
    else console.log('success //');
  });

  return res.send(updatedUserLog);
});

//would have a version of the isbn in the id to make delete requests more efficient

userRouter.delete('/returnbook/:isbn', (req, res, next)=>{
  let returnedBook;
  const {user} =res.locals;
  const {isbn} =req.params

    const userObj ={}
    switch (user) {
    case 2:
      userObj.newTable = [...userTwoTable];
      userObj.path = '../../Tables/TableCopies/userTwoMock.js'
      break
    case 3:
      userObj.newTable = [...userThreeTable];
      userObj.path='../../Tables/TableCopies/userThreeMock.js'
      break
    case 4:
      userObj.newTable = [...userFourTable];
      userObj.path='../../Tables/TableCopies/userFourMock.js'
      break
    }

    const {newTable, path} =userObj
    const updatedUserLog = newTable.reduce((bookLog, entry)=>{
      if(entry.isbn['isbn13'] !== Number(isbn)) bookLog.push(entry)
      else returnedBook = entry;
      return bookLog;
    },[])

  fs.writeFile(path, updatedUserLog, (err) => {
    if (err) console.log('//');
    else console.log('success //');
  });
  return res.send(returnedBook)
})


userRouter.get('/allbooks', (req, res)=>{
  const {user} =res.locals

  switch (user) {
    case 2:
      res.send(userTwoTable);
      break;
    case 3:
      res.send(userThreeTable);
      break;
    case 4:
      res.send(userFourTable);
      break;
    }
})



//not  updating books stock log
module.exports = userRouter;
