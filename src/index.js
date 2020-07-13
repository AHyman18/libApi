const express = require('express');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

const {setup, cleanUp} = require('./setup.js')
const libRouter = require('./Routes/libRouter.js');
const userRouter = require('./Routes/userRouter.js');

const { authorizeUser } = require('./Controllers/authorizeUser.js');
const {validateUser} = require('./Controllers/validateUser.js');


const PORT = 3000;

app.use(bodyParser.json());

app.use('/', authorizeUser);
app.use('/user', validateUser)

app.use('/lib', libRouter);
app.use('/user', userRouter);

app.get('/', (req, res) => {
  return res.send('Please enter the app as a Librarian or User.');
});

const server = app.listen(PORT, ()=>{
  const tableCopies = 'TableCopies'
  const tableMocksDir = path.join(__dirname, '..', 'Tables', tableCopies)
  if (!fs.existsSync(tableMocksDir)){
    fs.mkdirSync(tableMocksDir, {recursive:true})
    setup();
    }
  return;
});

process.on( 'SIGINT', ()=>{
  const tableCopies = 'TableCopies'
  const tableMocksDir = path.join(__dirname, '..', 'Tables', tableCopies)
  cleanUp(tableMocksDir)
  server.close()
  return;
})


process.on( 'EXIT', ()=>{
  const tableCopies = 'TableCopies'
  const tableMocksDir = path.join(__dirname, '..', 'Tables', tableCopies)
  cleanUp(tableMocksDir)
  return;
})



