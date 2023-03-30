require("dotenv").config()
const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require("cors")
const Person = require("./models/person")

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

app.get("/", (req, res) => {
  res.send("Hello world!")
})

app.get("/api/persons", (req, res) => {
  Person.find({}).then((people) => {
    res.json(people)
  })
})

app.get("/info", async (req, res) => {
  const total = await Person.countDocuments({})
  const time = new Date()
  res.send(`Phonebook has info for ${total} people<br>${time}`)
})

app.get("/api/persons/:id", async (req, res) => {
  const id = req.params.id
  const person = await Person.findById(id)
  if (person) {
    res.json(person)
  } else {
    res.render("400 Person with given ID not found!")
  }
})

/* app.post("/api/persons", (req, res) => {
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
}) */

/* app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id
  persons = persons.filter((p) => p.id != id)
  res.status(204).end()
}) */

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
