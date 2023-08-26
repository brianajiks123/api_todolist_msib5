const config = require(`${__config_dir}/app.config.json`);
const {debug} = config;
const mysql = new(require(`${__class_dir}/mariadb.class.js`))(config.db);
const Joi =  require('joi');

class _task{
    // Add item
    add(data, dataUser){
        // Validate data
        const schema = Joi.object({
            item: Joi.string()
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
        if (dataUser) {
            // Insert data to database
            const sql = {
                query: `INSERT INTO task (user_id, items) VALUES (?, ?)`,
                params: [dataUser["userId"], data.item]
            }

            return mysql.query(sql.query, sql.params)
                .then(data=>{
                    return {
                        status: true,
                        data
                    }
                })
                .catch(error =>{
                    if (debug){
                        console.error('add task Error: ', error)
                    }

                    return{
                        status: false,
                        error
                    }
                })
        }
    }
    // Get item
    get(params, dataUser){
        // Check parameter
        if (!params.id) {
            // Get all data
            const sql = {
                query: `SELECT * FROM task WHERE user_id = ?`,
                params: [dataUser["userId"]]
            }
    
            return mysql.query(sql.query, sql.params)
                .then(data=>{
                    return {
                        status: true,
                        data
                    }
                })
                .catch(error =>{
                    if (debug){
                        console.error('Get all task Error: ', error)
                    }
    
                    return{
                        status: false,
                        error
                    }
                })
        } else {
            // Check data is available
            const sql_check = {
                query: `SELECT id FROM task WHERE user_id= ?`,
                params: [dataUser["userId"]]
            }

            return mysql.query(sql_check.query, sql_check.params)
                .then(dataid => {
                    const id = dataid.find(id_data => id_data.id == params.id)

                    if (!id) {
                        return {
                            status: false,
                            msg: `Data with id ${params.id} isn't found.`
                        }
                    } else {
                        // Get data with id from database
                        const sql = {
                            query: `SELECT * FROM task WHERE id= ?`,
                            params: [params.id]
                        }

                        return mysql.query(sql.query, sql.params)
                            .then(data=>{
                                return {
                                    status: true,
                                    data
                                }
                            })
                            .catch(error =>{
                                if (debug){
                                    console.error(`Get task with id ${data.id} Error: `, error)
                                }

                                return{
                                    status: false,
                                    error
                                }
                            })
                    }
                })
                .catch(error =>{
                    if (debug){
                        console.error('Error: ', error)
                    }

                    return{
                        status: false,
                        error
                    }
                })
        }
    }
    // Update item
    update(data, dataUser){
        // Validate data
        const schema = Joi.object({
            id: Joi.number(),
            item: Joi.string()
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
        // Check data is available
        const sql_check = {
            query: `SELECT id FROM task WHERE user_id= ?`,
            params: [dataUser["userId"]]
        }

        return mysql.query(sql_check.query, sql_check.params)
            .then(dataid => {
                const id = dataid.find(id_data => id_data.id == data.id)

                if (!id) {
                    return {
                        status: false,
                        msg: `Data with id ${data.id} isn't found.`
                    }
                } else {
                    // Update data to database
                    const sql = {
                        query: `UPDATE task SET items= ? WHERE id= ?`,
                        params: [data.item, data.id]
                    }

                    return mysql.query(sql.query, sql.params)
                        .then(data=>{
                            return {
                                status: true,
                                data
                            }
                        })
                        .catch(error =>{
                            if (debug){
                                console.error(`Update task with id ${data.id} Error: `, error)
                            }

                            return{
                                status: false,
                                error
                            }
                        })
                }
            })
            .catch(error =>{
                if (debug){
                    console.error('Error: ', error)
                }

                return{
                    status: false,
                    error
                }
            })
    }
    // Delete item
    delete(params, dataUser){
        // Check parameter
        if (!params.id) {
            return {
                status: false,
                msg: "Delete function must contain an id parameter."
            }
        } else {
            // Check data is available
            const sql_check = {
                query: `SELECT id FROM task WHERE user_id= ?`,
                params: [dataUser["userId"]]
            }

            return mysql.query(sql_check.query, sql_check.params)
                .then(dataid => {
                    const id = dataid.find(id_data => id_data.id == params.id)

                    if (!id) {
                        return {
                            status: false,
                            msg: `Data with id ${params.id} isn't found.`
                        }
                    } else {
                        // Delete data with id from database
                        const sql = {
                            query: `DELETE FROM task WHERE id=?`,
                            params: [params.id]
                        }
                
                        return mysql.query(sql.query, sql.params)
                            .then(data=>{
                                return {
                                    status: true,
                                    data
                                }
                            })
                            .catch(error =>{
                                if (debug){
                                    console.error(`Delete task with id ${params.id} Error: `, error)
                                }
                
                                return{
                                    status: false,
                                    error
                                }
                            })
                    }
                })
                .catch(error =>{
                    if (debug){
                        console.error('Error: ', error)
                    }

                    return{
                        status: false,
                        error
                    }
                })
        }
    }

}

module.exports = new _task();
