const express = require('express'); 
const app = express(); 

const PORT = 3001 ; 

let notes = [ 
    {
        id: 1,
        content: "HTML is easy",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only JavaScript",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        important: true
    }
]

app.use(express.json());

app.get('/', (req,res) => {
    res.send('<h1>Hello World</h1>');
});

// GET ALL 
app.get('/notes', (req,res) => {
    res.json(notes);
});

// GET ONE BY ID 
app.get('/notes/:id', (req,res,next) => {
    const { params = {} } = req; 
    const { id = "" } = params; 
    const note = notes.find( (elem) => elem.id === Number(id) ) ; 
    
    if ( note ) {
        res.json(note) ; 
    } else {
        next({
            statusCode: 404,
            message: `Note with id: ${id}, Not Found`, 
        })
    }
})

// POST ( BODY )
app.post('/notes', (req,res) => {
    const { body } = req;
    notes.push(body) ; 
    res.status(201).json(body) ; 
    console.log(body)
})

// PUT ( BODY ) 
app.put('/notes/:id', (req,res) => {
    const { id } = req.params;
    const { name } = req.body;
    const note = notes.find( (elem) => elem.id === Number(id) );

    if ( !note ) {
        return res.status(404).json({ message: "Note not found" });
    }
    
    note.name = name; 
    res.json(note); 
})

// DELETE 

app.delete('/notes/:id', (req,res) => {
    const { id } = req.params; 
    const index = notes.findIndex( (note) => note.id === Number(id) ); 

    if (index === -1) {
        return res.status(404).json({ message: "Note not foud" });
    }

    notes.splice(index,1);
    res.sendStatus(204);
})

app.use((req, res, next) => {
    next({
        statusCode: 404,
        message: "Route not found" 
    })
})

app.use((err , req, res, next) => {
    const { statusCode = 500 , message = "Error" } = err;
    console.log(message);
    res.status(statusCode);
    res.json({
        message, 
    })
})

app.listen(PORT, (req,res)=> {
    console.log(`Server running on port ${PORT}`);
});
