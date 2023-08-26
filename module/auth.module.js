const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi =  require('joi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'TodolistMSIB5Stechoq';

class _auth {
    // Register user
    register(data){
        // Validate data
        const schema = Joi.object({
            username: Joi.string(),
            name: Joi.string(),
            password: Joi.string()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(data)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }

        const saltRounds = 10
        const password = data.password

        return bcrypt.hash(password, saltRounds)
            .then(hash => {
                const sql = {
                    query: 'INSERT INTO task_users (username, name, password) VALUES (?, ?, ?)',
                    params: [data.username, data.name, hash]
                }

                return mysql.query(sql.query, sql.params)
                .then(data => {
                    return {
                        status: true,
                        msg: "Registration success.",
                        data
                    }
                })
                .catch(e => {
                    return {
                        status: false,
                        msg: "User is already registered."
                    }
                })
            })
            .catch(err =>{
                if (debug){
                    console.error('Hashing password error: ', err)
                }

                return{
                    status: false,
                    err
                }
            })
    }
    // Login user
    login(data){
        // Validate data
        const schema = Joi.object({
            username: Joi.string(),
            password: Joi.string()
        }).options({
            abortEarly: false
        })
        const validation = schema.validate(data)
        if(validation.error){
            const errorDetails = validation.error.details.map((detail)=>{
                detail.message
            })

            return {
                status: false,
                code: 422,
                error: errorDetails.join(', ')
            }
        }

        const sql = {
            query: 'SELECT * FROM task_users WHERE username = ?',
            params: [data.username]
        }

        return mysql.query(sql.query, sql.params)
            .then(result => {
                return bcrypt.compare(data.password, result[0]['password'])
                    .then(bresult => {
                        // Password match
                        if (!bresult){
                            return {
                                status: false,
                                msg: "Password incorrect."
                            }
                        }

                        const token = jwt.sign({
                            username: result[0].username,
                            userId: result[0].id,
                        },
                        accessTokenSecret,
                        {
                            expiresIn: '1h'
                        });

                        const sql = {
                            query: 'UPDATE task_users SET last_login = now() WHERE id = ?',
                            params: [result[0].id]
                        }

                        mysql.query(sql.query, sql.params)

                        return {
                            msg: 'Logged in.',
                            token,
                        }
                    })
                    .catch(berr => {
                        if (debug) {
                            console.error('Error: ', berr)
                        }
        
                        return {
                            status: false,
                            msg: berr
                        }
                    })
            })
            .catch(err => {
                if (debug) {
                    console.error('Error: ', err)
                }

                return {
                    status: false,
                    msg: "Username has not been registered."
                }
            })
    }
    // Get user data
    getUser(data){
        return {
            status: true,
            data
        }
    }
}

module.exports = new _auth();
