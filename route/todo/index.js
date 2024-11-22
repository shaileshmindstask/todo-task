const express = require("express")
const router = express.Router()
const path = require("path")
const fs = require("fs")
const { route } = require("../user")
const { userInfo } = require("os")

const filePath = path.join(__dirname, "..", "..", "data", "todo.txt")
const dirPath = path.join(__dirname, "..", "..", "data")


// ADDING MIDDLE WARE FOR CHECK HEADER
router.use((req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({ "message": "Not Authenticated !" })
    }
    const bearerToken = authHeader.split(" ")

    if (isNaN(Number(bearerToken[1]))) {
        return res.json({ "message": "Not Authenticated !" })
    }
    req.userId = Number(bearerToken[1])
    next()
})


router.route("/")
    .get((req, res) => {
        // SHOW ALL TODOS
        if (fs.existsSync(filePath)) {
            fs.readFile(filePath, "utf-8", (err, data) => {
                if (err) throw err
                const fileData = JSON.parse(data)
                if (fileData.data === "false") {
                    return res.status(404).json({ "message": "No Todo Found !" })
                } else {
                    
                    const userTodo = fileData.filter((item) => {
                        return item.userId === req.userId
                    })
                    console.log(userTodo)
                    if (userTodo) {
                        return res.status(200).json(userTodo)
                    } else {
                        return res.status(404).json({ "message": "No Todo Found !" })
                    }
                }
            })
        }
    })
    .post((req, res) => {

        const { todoName, todoDescription } = req.body
        if (!todoName || !todoDescription) {
            return res.status(400).send({ "message": "All fields are required !" })
        }

        //IF VALIDATED SUCCESSFULLY PERFORM DB INSERT OPERATION.. BUT HERE WRITE TO FILE
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath)
        }

        // CHECK ID EXISTS IN USER FILE OR NOT:
        if (!fs.existsSync(filePath)) {
            return res.json({ "message": "Error No file exists !" })
        } else {
            fs.readFile(filePath, "utf-8", (err, data) => {
                if (err) throw err
                const fileData = JSON.parse(data)
                if (fileData.data === "false") {
                    // CREATE NEW TODO
                    const newTodo = [{
                        ...req.body,
                        id: 1,
                        userId: req.userId
                    }]
                    fs.writeFile(filePath, JSON.stringify(newTodo), (err) => {
                        if (err) throw err
                        return res.status(201).json({ "message": "Todo Created Successfully !" })
                    })
                } else {
                    fs.readFile(filePath, "utf-8", (err, data) => {
                        if (err) throw err
                        const parsedDataFie = JSON.parse(data)

                        // NOW APPENDING THE DATA TO FILE:
                        const newTodo = { ...req.body, id: parsedDataFie.length + 1, userId: req.userId }
                        parsedDataFie.push(newTodo)
                        fs.writeFile(filePath, JSON.stringify(parsedDataFie), (err) => {
                            if (err) throw err
                            return res.status(201).json({ "message": "Todo Created Successfully !" })
                        })
                    })
                }
            })
        }

    })

router.route("/:id")
    .patch((req, res) => {
        //CHECK PARAMS ID VALID
        const todoId = Number(req.params.id)

        if (isNaN(todoId)) {
            return res.status(404).json({ "message": "Inavalid User Id !" })
        }

        // FETCH DATA FROM FILE AND UPDATE IT:
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) throw err
            const fileData = JSON.parse(data)
            if (fileData.data === "false") {
                return res.status(404).json({ "message": "No Todo Found !" })
            }
            const searchTodo = fileData.find((item) => {
                return item.id === todoId
            })
            if (!searchTodo) {
                return res.status(404).json({ "message": "No Todo Found !" })
            }

            let upadteTodoData;
            if (req.body.todoName) {
                upadteTodoData = { ...searchTodo, todoName: req.body.todoName }
            }
            if (req.body.todoDescription) {
                upadteTodoData = { ...upadteTodoData, todoDescription: req.body.todoDescription }
            }


            // USE MAP AND WRITE TO THE FILE:
            const updatedData = fileData.map((item) => {
                if (item.id === todoId) {
                    return upadteTodoData
                }
                return item
            })

            // // WRITE TO THE FILE:
            fs.writeFile(filePath, JSON.stringify(updatedData), (err) => {
                if (err) throw err
                return res.status(201).json({ "message": "Todo Updated Successfully !" })
            })
        })
    })
    .delete((req, res) => {
        //CHECK PARAMS ID VALID
        const todoId = Number(req.params.id)

        if (isNaN(todoId)) {
            return res.status(404).json({ "message": "Inavalid User Id !" })
        }

        // FETCH DATA FROM FILE AND UPDATE IT:
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) throw err
            const fileData = JSON.parse(data)
            if (fileData.data === "false") {
                return res.status(404).json({ "message": "No Todo Found !" })
            }
            const searchTodo = fileData.find((item) => {
                return item.id === todoId
            })
            if (!searchTodo) {
                return res.status(404).json({ "message": "No Todo Found !" })
            }

            // USE MAP AND WRITE TO THE FILE:
            const updatedData = fileData.filter((item) => {
                return item.id !== todoId
            })

            // // WRITE TO THE FILE:
            fs.writeFile(filePath, JSON.stringify(updatedData), (err) => {
                if (err) throw err
                return res.status(201).json({ "message": "Todo Deleted Successfully !" })
            })
        })
    })







module.exports = router



