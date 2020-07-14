const express = require('express');
const path = require('path');
const fs = require('fs');
const libRouter = express();
let booksLogMock, booksTableMock

libRouter.use((req, res, next) => {
  return res.locals.librarian
    ? next()
    : res.send('You are not authorized to access this route.');
    next()
});

libRouter.use((req,res, next)=>{
  const tableCopies = 'TableCopies'
  const tableMocksDir = path.join(__dirname, '..', '..', 'Tables', tableCopies)
  if(fs.existsSync(tableMocksDir)){
    booksLogMock = require('../../Tables/TableCopies/booksLogTableMock.js');
    booksTableMock = require('../../Tables/TableCopies/booksTableMock.js')
  }
  return next()
})

libRouter.get('/allbooks', (req,res)=> res.status(200).send(booksTableMock))

libRouter.get('/overduebooks', (req, res, next) => {
  try{
    const overdueBookList = booksLogMock.map((user) => {
      const { log } = user;
      return log.filter((book) => book.overDue < 0);
    });
    return res.status(200).send(overdueBookList);
  } catch(err){
    const errorObj={
      message:'Error requesting overdue books',
      status: 500
    }
    return next(errorObj)
  }
});


libRouter.delete('/deletebook/:id', (req, res) => {
  try{
    const bookTable_MockPath = path.join(__dirname, '..', '..', 'Tables', 'TableCopies','booksTableMock.js')
    const { id } = req.params;
    let idExistsInLog = false;
    let deletedItem;
  
    const updatedLibrary = booksTableMock.filter((book) => {
      if(book.id === Number(id)) {
        deletedItem = book;
        idExistsInLog =true;
      }
      return book.id !== Number(id)
    });
    
    if(!idExistsInLog) return next({message:'The tittle you are trying to delete does not exist in the log', status: 204})
    const updatedLibStr = `module.exports = ${JSON.stringify(updatedLibrary)}`;
  
    fs.writeFile(bookTable_MockPath, updatedLibStr, (err) => {
      if (err) return next({message: 'Unable to update Book Table file Log', status: 500})
      else return res.status(200).send(updatedLibrary)
    });
  } catch (err){
    const errorObj={
      message:'Unable to delete file from log.',
      status: 500
    }
    return next(errorObj)
  }
  
  
});


libRouter.post('/addBook', (req, res) => {
  try{
    const booksTable_PathMock =path.join(__dirname, '../../Tables/TableCopies/booksTableMock.js')
    const { body } = req;
    if (
      !body.isbn['isbn10'] ||
      !body.isbn['isbn13'] ||
      !body.title ||
      !body.stock
    ) {
      res.status(200).send('nope make your input better');
    }

    body.id = booksTableMock[booksTableMock.length - 1]['id'] + 1;

    booksTableMock.push(body);

    const updatedLibStr = `module.exports = ${JSON.stringify(booksTableMock)}`;

    fs.writeFile(booksTable_PathMock, updatedLibStr, (err) => {
      if (err) return next({message: 'Unable to update Book Table file Log', status: 500})
      else return res.status(200).send(updatedLibStr);
    });
  } catch(err){
    const errorObj={
      message:'Error adding book to log',
      status: 500
    }
    return next(errorObj)
  }
});


module.exports = libRouter;


