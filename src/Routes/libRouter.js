const express = require('express');
const path = require('path');
const fs = require('fs');
const { json } = require('body-parser');
const libRouter = express();

let booksLogMock, booksTableMock

// const booksLogMock = require('../../Tables/TableCopies/booksLogTableMock.js');
// const booksTableMock =  require('../../Tables/TableCopies/booksTableMock.js')

libRouter.use('/', (req, res, next) => {
  return res.locals.librarian
    ? next()
    : res.send('You are not authorized to access this route.');
    next()
});

libRouter.use('/', (req,res)=>{
  const tableCopies = 'TableCopies'
  const tableMocksDir = path.join(__dirname, '..', 'Tables', tableCopies)
  if(fs.existsSync(tableMocksDir)){
    booksLogMock = require('../../Tables/TableCopies/booksLogTableMock.js');
    booksTableMock =  require('../../Tables/TableCopies/booksTableMock.js')
  }
  next()
})

libRouter.get('/allbooks', (req,res)=> res.send(booksTableMock))

libRouter.get('/overdueBooks', (req, res) => {
  //addlimit?
  const overdueBookList = booksLogMock.map((user) => {
    //bookglogs not updating individual user table
    const { log } = user;
    return log.filter((book) => book.overDue < 0);
  });

  return res.send(overdueBookList);
});


libRouter.delete('/:id', (req, res) => {
  const bookTable_MockPath = path.join(__dirname, '..', '..', 'Tables', 'TableCopies','booksTableMock.js')
  const { id } = req.params;
  let deletedItem;

  const updatedLibrary = booksTableMock.filter((book) => {
    if(book.id === Number(id)) deletedItem = book
    return book.id !== Number(id)
  });

  const updatedLibStr = `module.exports = ${JSON.stringify(updatedLibrary)}`;

  fs.writeFile(bookTable_MockPath, updatedLibStr, (err) => {
    if (err) console.log('//');
    else console.log('success //');
  });
  return res.send(updatedLibrary)
});


//book needs to have all info in post request
libRouter.post('/addBook', (req, res) => {
const booksTable_PathMock =path.join(__dirname, '../../Tables/TableCopies/booksTableMock.js')
  const { body } = req;
  if (
    !body.isbn['isbn10'] ||
    !body.isbn['isbn13'] ||
    !body.title ||
    !body.stock
  ) {
    res.send('nope make your input better');
  }
  //doesnt handle duplicates

  body.id = booksTableMock[booksTableMock.length - 1]['id'] + 1;

  booksTableMock.push(body);

  const updatedLibStr = `module.exports = ${JSON.stringify(booksTableMock)}`;

  fs.writeFile(booksTable_PathMock, updatedLibStr, (err) => {
    if (err) console.log('//');
    else console.log('success //');
  });

  res.send(updatedLibStr);

});


module.exports = libRouter;


