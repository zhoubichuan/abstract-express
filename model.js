let mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)
const Schema = mongoose.Schema;
let config = require('./config');
//连接mongodb数据库
let connection = mongoose.createConnection(config.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//规定数据库中集合的字段和类型
let UserSchema = new Schema({
    username: { type: String },
    password: { type: String },
    email: { type: String },
    avatar: { type: String },
    access: { type: String }// user admin
}, {
    timestamps: true, toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});
let NoticeSchema = new Schema({
    id: { type: String },
    avatar: { type: String },
    title: { type: String },
    datetime: { type: String },
    read: { type: String },
    type: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let ActiveSchema = new Schema({
    user: { type: Object },
    group: { type: Object },
    project: { type: Object },
    template: { type: String },
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let FormSchema = new Schema({
    client: { type: String },
    date: { type: Array },
    goal: { type: String },
    invites: { type: String },
    publicType: { type: String },
    publicUser: { type: String },
    standard: { type: String },
    title: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
let AdvancedFormSchema = new Schema({
    approver: { type: String },
    approver2: { type: String },
    dateRange: { type: String },
    dateRange2: { type: String },
    members: { type: Array },
    name: { type: String },
    name2: { type: String },
    owner: { type: String },
    owner2: { type: String },
    type: { type: String },
    type2: { type: String },
    url: { type: String },
    url2: { type: String }
}, {
    timestamps: true,
    toJSON: {
        transform(doc, ret) {
            return ret
        }
    }
})
//创建User模型 可以操作数据库
const UserModel = connection.model('User', UserSchema);
const NoticeModel = connection.model('Notices', NoticeSchema)
const ActiveModel = connection.model('Active', ActiveSchema)
const FormModel = connection.model('FormModel', FormSchema)
const AdvancedFormModel = connection.model('AdvancedFormModel', AdvancedFormSchema)
module.exports = {
    UserModel,
    NoticeModel,
    FormModel,
    AdvancedFormModel,
    ActiveModel
}