var mongodb = require('../../config/mongoDB');


var collectionName = "users";

function read(condition, callback) {
    mongodb.getConnection().collection(collectionName)
        .find(condition)
        .toArray((e, r) => { return callback(e, r); })
}
function insertOne(data, callback) {
    mongodb.getConnection().collection(collectionName)
        .insertOne(data, (e, r) => { return callback(e, r); })
}


module.exports = { read, insertOne }