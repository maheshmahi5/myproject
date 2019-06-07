'use strict';

const Hapi = require('@hapi/hapi');
const MySQL = require('mysql');

 const connection = MySQL.createConnection({
     host: 'localhost',
     user: 'root',
     password:
     database: 'training'
});


const init = async() => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });
   
    connection.connect();
    var books=[
    {
        id:1,
        title:"Micro Processors",
        author:"sunil"
    },
    {
        id:2,
        title:"Digital communications",
        author:"srinivas"
    },
    {
        id:3,
        title:"Bio Medical Engineering",
        author:"sridhar"
    }
]

    server.route({
        method: 'GET',
        path:'/api/books',
        handler: (request, h) => {
        //return books;
        connection.query('SELECT book_id, title, author_lname FROM books',
       function (error, results, fields) {
       if (error) throw error;
 
       reply(results);
            });
        }
    });

     server.route({
        method: 'POST',
        path:'/api/books',
        handler: (request, h) => {
         books.push(request.payload)
         return books;
        }
    });

      server.route({
        method: 'PUT',
        path:'/api/books/{id}',
        handler: (request, h) => {
        var id=request.params.id;
        var newtitle=request.payload.title
        var booksToBeupdated=books.filter((book)=>{
        return book.id==id
        })
        booksToBeupdated[0].title=newtitle;
        return booksToBeupdated;
        }
    });

      server.route({
        method: 'DELETE',
        path:'/api/books/{id}',
        handler: (request, h) => {
        var id=request.params.id;
        var newtitle=request.payload.title
        var booksToDeleted=books.filter((book)=>{//
        return book.id!=id
        })
        //booksToBeupdated[0].title=newtitle;
        return booksToDeleted;
        }
    });




    await server.start();
    console.log('Server running on %s', server.info.uri);

   
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();