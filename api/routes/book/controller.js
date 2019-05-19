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
  Book.create(req.body)
  res.send({
    success: true
  })
}
