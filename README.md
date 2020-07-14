# 

Library API

Your task is to build a simple API to manage a library's book inventory. There are two main components of this API: management endpoints (to be used by the Librarians) and user facing endpoints for end-user actions.

Books are referenced by their ISBN. The library can have more than 1 copy of any given book (multiple copies of the same ISBN).

API Endpoints to be built:

Librarian Endpoints:

- An endpoint to add a book (by ISBN) to the library.
- An endpoint to remove a book (by its internal Id) from the library
- An endpoint that generates a list of all overdue books.

User Endpoints:

- An endpoint to check out a book (assume a 2 week checkout period from time of call). A User can check out any book except when:
  - They currently have 3 checked out books.
  - They are overdue on returning any book.
- An endpoint to return a checked out book to the library
- An endpoint that lists all currently checked out books for that user.

For the purposes of this exercise, we can assume there is a Librarian user (userId 1) and three regular users (userids, 2, 3, 4). You can hardcode this table. Also, no need to worry about authentication, etc.

#### Spin Up

To get the app spun up:

- npm install
- npm start
- Using postman, make all requests to localhost:3000/<endpoint>

#### Librarian

Any requests made as a librarian should have an authorization header using the Basic authentication method. The value should be "one"

Authorization: Basic one

##### An endpoint to add a book (by ISBN) to the library.

POST /lib/addBooks

Body property in the options object should have a shape including the properties: isbn(obj containing an isbn10 and isbn 13 property), title(string, name of book) and stock(amount of books in inventory).
{
isbn: {
isbn10: 133821666,
isbn13: 9781338216660,
},
title: "Harry Potter and the Cursed Child",
stock: 13,
}

##### An endpoint to remove a book (by its internal Id) from the library

DELETE /lib/deletebook/:id

##### An endpoint that generates a list of all overdue books.

GET /lib/overduebooks

#### User

Any requests made as a user should have an authorization header using the Basic authentication method. The value should be "two", "three" or "four"

Authorization: Basic two
Authorization: Basic three
Authorization: Basic four

##### An endpoint to check out a book (assume a 2 week checkout period from time of call). A User can check out any book except when:

POST /user/checkout

Body property in the options object should have a shape including the property: userIsbn(non-zero leading 13-digit number referring to a isbn13 isbn in the book log)

{
"userIsbn": 9780545582926
}

###### An endpoint to return a checked out book to the library

DELETE /returnbook/:isbn

Should contain an isbn13 corresponding to a book in the book log

##### An endpoint that lists all currently checked out books for that user.

GET /allbooks

#### Features

##### Librarian

If more time, I would:

- add limits on the amount of data being sent back to the client so they aren't receiving massive amounts of data per request
- adding logic to handle adding duplicate titles

##### User

- Ensure updating information on one table also updates the informtion in other tables, such as checking out a book also updating the amount of that particular book left in stock
- Adding logic to ensure the addition of a book to a user's log does not overwrite the existing id's
- Simplifying the way data is accessedby making the id associated with the isbn for instance so that the book can be deleted without needing to traverse an entire data structure to determine whether the isbn exists in the nested struture.
