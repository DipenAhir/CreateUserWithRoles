const Joi = require("joi");
const { ObjectID } = require("mongodb");
var passwordHash = require('password-hash');


var config = require("../../../config/locales")
var userCollection = require("../../../models/users");
var localization = require("../../../config/locales");
var headerValidator = require("../../../config/header")
var user_rolesCollection = require("../../../models/user_roles");

module.exports = {

    description: 'This API used to create a new user',
    tags: ["api", "user"],
    auth: false,
    response: {
        status: {
            201: { message: Joi.any().default(localization["201"]) },
            400: { message: Joi.any().default(localization["400"]) },
            500: { message: Joi.any().default(localization["500"]) },
        }
    },
    validate: {
        headers: headerValidator.headerAuthNotRequired,
        payload: Joi.object({
            userName: Joi.string().required().min(4).max(10).description("pass unique username").error(new Error("field userName is missing or invalid it must be lesthen 10 char and gretherthen 4 caht")),
            password: Joi.string().required().min(4).max(10).description("enter password").error(new Error("field password is missing  or invalid it must be lesthen 10 char and gretherthen 4 caht"))
        }).unknown(),
        failAction: (req, reply, source, error) => {
            failAction: headerValidator.faildAction(req, reply, source, error)
        }
    },
    handler: function (request, reply) {

        var isUserExist = false; //take isUserExist as false
        request.payload["_id"] = ObjectID(); // create a new userId

        /*
        function to check any user is already exists or not
        */
        function checkUserExists() {
            return new Promise(function (resolve, reject) {
                let condition = {};// put condition as blank
                userCollection.read(condition, (err, result) => {//execute funtion 
                    if (err) {//if mongodb return any error
                        return reject("ASPLPALSW ", err)
                    } else if (result && result.length) {// if find any record from db
                        isUserExist = true;// assign true if we get any result
                        return resolve(true)//return promise
                    } else {//if not find any recored in db
                        return resolve(true)//return promise
                    }
                })
            });
        }
         /*
        function to create a user in mongodb "user" collection
        */
        function createNewUser() {
            return new Promise(function (resolve, reject) {
                request.payload["password"] = passwordHash.generate(request.payload["password"]);//make passwordhash
                userCollection.insertOne(request.payload, (err, result) => {//execute function
                    if (err) {// if mongodb return a error
                        return reject("ASPLPALSW ", err)//return promises
                    } else {//if mongodb not return any error 
                        return resolve(true)//return promises
                    }
                });
            });
        }
         /*
        function to create a user roles
        */
        function createUsersRole() {
            return new Promise(function (resolve, reject) {

                let dataToInsert = { userId: request.payload["_id"] } // declare data to insert
                dataToInsert["role"] = (isUserExist) ? 'NormalUser' : 'Admin'; //assign a role Admin or Normaluser

                user_rolesCollection.insertOne(dataToInsert, (err, result) => {//execute a function
                    if (err) {// if mongodb return a error
                        return reject("ASPLPAOPAPW ", err)//return promises
                    } else {//if mongodb not return any error 
                        return resolve(true)//return promises
                    }
                });

            });
        }


        checkUserExists()//check user
            .then(() => { return createNewUser(); })//create user
            .then(() => { return createUsersRole(); })// create role
            .then(() => { return reply({ message: config['201'] }).code(201); })//return success
            .catch((data) => { return reply({ message: data.message }).code(500); })//return error
    }
};