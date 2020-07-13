const path = require('path')
const fs = require('fs')


const preSetup = ()=>{
    const booksLogTable_Path = path.join(__dirname, '..', 'Tables', 'bookLogTable.js');
    const booksTable_Path = path.join( __dirname, '..', 'Tables', 'booksTable.js');
    const librarianUserTable_Path = path.join( __dirname,'..',  'Tables', 'librarianUserTable.js');
    const userTable_Path = path.join( __dirname, '..', 'Tables', 'userTables.js');
    const userTwoTable_Path = path.join( __dirname, '..', 'Tables', 'userTwoTable.js');
    const userThreeTable_Path = path.join( __dirname, '..', 'Tables', 'userThreeTable.js');
    const userFourTable_Path = path.join( __dirname, '..', 'Tables', 'userFourTable.js');


    return () => {
        const booksLogTable_PathMock = path.join( __dirname, '..', 'Tables', 'TableCopies', 'booksLogTableMock.js');
        const booksTable_PathMock = path.join(__dirname, '..', 'Tables', 'TableCopies', 'booksTableMock.js');
        const librarianUserTable_PathMock = path.join( __dirname, '..', 'Tables', 'TableCopies', 'librarianUserTableMock.js');
        const userTable_PathMock = path.join(__dirname,'..', 'Tables', 'TableCopies', 'userTableMock.js');
        const userTwo_PathMock = path.join(__dirname,'..', 'Tables', 'TableCopies', 'userTwoMock.js');
        const userThree_PathMock = path.join(__dirname,'..', 'Tables', 'TableCopies', 'userThreeMock.js');
        const userFour_PathMock = path.join(__dirname,'..', 'Tables', 'TableCopies', 'userFourMock.js');
    
    fs.copyFileSync(booksTable_Path, booksTable_PathMock);
    fs.copyFileSync(booksLogTable_Path, booksLogTable_PathMock);
    fs.copyFileSync(librarianUserTable_Path, librarianUserTable_PathMock);
    fs.copyFileSync(userTable_Path, userTable_PathMock);
    fs.copyFileSync(userTwoTable_Path, userTwo_PathMock);
    fs.copyFileSync(userThreeTable_Path, userThree_PathMock);
    fs.copyFileSync(userFourTable_Path, userFour_PathMock);

    return;
 };

}


const cleanUp =(path)=>{
    if(fs.existsSync(path)){
        const allFiles = fs.readdirSync(path)

        if(allFiles.length>0){
            allFiles.forEach(fileName=>{
                fs.unlinkSync(`${path}/${fileName}`)
            })
        }
        fs.rmdirSync(path)
    } else console.log ('File Path Does not exist')

    return;
}


const setup = preSetup()
module.exports = {setup, cleanUp}