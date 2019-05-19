const mongoose = require('mongoose')
const AutoIncrement = require('mongoose-sequence')(mongoose)
const Schema = mongoose.Schema

const Book = new Schema({
  title: String,
  thumbnail: {
    type: String
  },
  images: {
    type: [String]
  },
  title: {
    type: String
  },
  author: {
    type: String
  },
  publisher: {
    type: String
  },
  pubDate: {
    type: String
  },
  width: {
    type: String
  },
  height: {
    type: String
  },
  page: {
    type: String
  },
  price: {
    type: String
  },
  description: {
    type: String
  },
  // 
  verify: {
    type: Boolean,
    default: false
  },
  // auto
  createdAt: {
    type: Date,
    default: Date.now()
  }
})


// create new Book document
Book.statics.create = function (data) {
  const book = new this(data)

  // return the Promise
  return book.save()
}

// find one book by using title
Book.statics.findOneByBookTitle = function (title) {
  return this.findOne({
    title
  }).exec()
}

Book.plugin(AutoIncrement, {
  inc_field: 'book'
});

module.exports = mongoose.model('book', Book)
