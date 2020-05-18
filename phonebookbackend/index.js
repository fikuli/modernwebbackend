const express = require('express')
var morgan = require('morgan')
const app = express()

app.use(express.json())


morgan.token('type', function (req, res) {
    if(req.method==='POST')
        return JSON.stringify(req.body)
    else return ""
})



app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))


const cors = require('cors')

app.use(cors())

app.use(express.static('build'))


let persons = [
        {
        id: 1,
        name: "Sen Ben",
        number: "123-456-789"
      },
      {
        id: 2,
        name: "biz SIZ",
        number: "0000-72727"
      },
      {
        id: 3,
        name: "O BU",
        number: "7733-45464"
      }
    ]

app.get('/', (req, res) => {
  res.send('<h1>Phone Book!</h1>')
})

app.get('/info', (req, res) => {
    const len = persons.length
    const date = new Date()
    res.send(`
            <p>Phonebook has info for ${len} people</p>
            <p>${date}</p>`)
  })
  

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(note => note.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})


app.post('/api/persons', (request, response) => {
  
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  if(persons.filter(person=>person.name === body.name).length>0){
    return response.status(400).json({ 
        error: 'name must be unique' 
      })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
  }

  persons = persons.concat(person)

  response.json(person)


})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
