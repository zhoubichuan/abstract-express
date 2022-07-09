const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const tagSchema = new Schema({
    nameEn: String,
    name: String,
    descriptEn: String,
    descript: String,
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    }
})

tagSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = this.updatedAt = Date.now()
    } else {
        this.updatedAt = Date.now()
    }
    next()
})

module.exports = tagSchema