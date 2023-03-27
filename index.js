const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")

morgan.token("body", function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())
app.use(cors())
app.use(express.static("dist"))
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      tokens["body"](req, res),
    ].join(" ")
  })
)

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]

app.get("/", (req, res) => {
  res.send("Hello world!")
})

app.get("/api/persons", (req, res) => {
  res.json(persons)
})

app.get("/info", (req, res) => {
  const total = persons.length > 0 ? persons.length : 0
  const time = new Date()
  res.send(`Phonebook has info for ${total} people<br>${time}`)
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id
  const person = persons.find((p) => p.id == id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
    console.log(res.statusMessage)
  }
})

const generateId = () => {
  return Math.floor(Math.random() * 9999)
}

app.post("/api/persons", (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Name or number missing",
    })
  } else if (persons.find((p) => p.name === body.name)) {
    return res.status(400).json({
      error: "Phonebook already contains a person with this name",
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }

  persons = persons.concat(person)
  console.log(person.id)
  res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  persons = persons.filter((p) => p.id != id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
