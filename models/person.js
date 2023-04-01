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
  name: { type: String, required: true, minLength: 3 },
  number: {
    type: String,
    match: [/^\d{2,3}-?\d{6,}$/, "Please enter a valid phone number"],
    required: true,
  },
})

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model("Person", personSchema)
