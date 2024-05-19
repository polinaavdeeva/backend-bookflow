const mongoose = require("mongoose");
const validator = require("validator");

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
        // validate: {
        //     validator: (value) => validator.isURL(value),
        //     message: 'Некорректная ссылка',
        // },
    },
    author: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 40,
    },
    rating:{
        type: Number,
        maxlength: 1,
        required: true,
    },
    postingDate:{
        type: String,
        required: true,
    }
    // bookId:{
    //     type: Number,
    //     required: true,
    // }
});

module.exports = mongoose.model("book", bookSchema);