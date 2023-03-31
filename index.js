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

app.get("/api/persons/:id", (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((p) => (p ? res.json(p) : res.status(404).end()))
    .catch((e) => next(e))
})

app.post("/api/persons/", (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "Name or number missing" })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then((savedPerson) => res.json(savedPerson))
})

app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((e) => next(e))
})

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end()
    })
    .catch((e) => next(e))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "Unknown endpoint" })
}
app.use(unknownEndpoint)

const errorHandler = (e, req, res, next) => {
  console.error(e.message)
  if (e.name === "CastError") {
    return res.status(400).send({ error: "Malformatted ID" })
  }
  next(e)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
