const Book = require("../../models/book")

//get
exports.search = async (req, res) => {
  const result = await Book.find({
    $or: [{
        $text: {
          $search: req.query.q,
          $language: "none"
        },
      },
      {
        title: {
          $regex: req.query.q
        }
      },
      {
        author: {
          $regex: req.query.q
        }
      }
    ]
  })

  res.send({
    success: true,
    result
  })
}


//post
exports.enroll = (req, res) => {
  const {
    _id
  } = req.decoded
  const newBook = {
    ...req.body,
    writerId: _id
  }
  Book.create(newBook)
  res.send({
    success: true
  })
}
