const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
mongoose.set("strictQuery", false)
mongoose
  .connect(url)
  .then((res) => {
    console.log("Connected to MongoDB!")
  })
  .catch((e) => console.log(e))

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

/* if (process.argv.length === 3) {
  Person.find({}).then((res) => {
    console.log("phonebook:")
    res.forEach((person) => {
      console.log(`${person.name} ${person.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then((result) => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
} */

module.exports = mongoose.model("Person", personSchema)
