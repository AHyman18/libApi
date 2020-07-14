const express = require('express');
const path = require('path');
const fs = require('fs');
const userRouter = express();
let userTable_PathMock, booksTableMock, bookLogsMock, userTable, userTwoTable, userThreeTable, userFourTable;

userRouter.use((req, res)=>{
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


const { validateUser } = require('../Controllers/validateUser.js');


userRouter.post('/checkout', (req, res) => {
  try{
    if (!req.body.userIsbn) return res.send('Please enter a valid ISBN 13 to checkout a book')
    let hasOverdueBook =false;
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

    if (newTable.length >=3) return res.status(200).send('Only three books may be checked out at a time')

    const updatedUserLog = booksTableMock.reduce((newBookLog, book) => {
      if(book.overdue <0) hasOverdueBook =true;
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
    
    if(hasOverdueBook) return res.status(200).send('You must return overdue books before checking out any additional books.')
    
    newTable.push(updatedUserLog);
    const updatedUserTableStr = `module.exports = ${JSON.stringify(newTable)}`;
    
    fs.writeFile(path, newTable, (err) => {
      if (err) return next({message:'Error updating book log', status: 500})
      else return res.status(200).send(updatedUserLog)
    });

  } catch(err){
    const errorObj={
      message:'Error checking out books',
      status: 500
    }
    return next(errorObj)
  }

  
});


userRouter.delete('/returnbook/:isbn', (req, res, next)=>{
  try{
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
      if (err) return next({message: 'Unable to update Book Table file Log', status: 500})
      else return res.status(200).send(returnedBook)
    });
  } catch(err){
    const errorObj={
      message:'Error returning book',
      status: 500
    }
    return next(errorObj)
  }
 
 
})


userRouter.get('/allbooks', (req, res)=>{
  try{
    const {user} =res.locals

  switch (user) {
    case 2:
      res.status(200).send(userTwoTable);
      break;
    case 3:
      res.status(200).send(userThreeTable);
      break;
    case 4:
      res.status(200).send(userFourTable);
      break;
    }
    return;
  } catch (err){
    const errorObj={
      message:'Error retrieving all books',
      status: 500
    }
    return next(errorObj)
  }
  
})



//not  updating books stock log
module.exports = userRouter;
