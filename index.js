const express = require("express");
const { existsSync, mkdir } = require("fs");
const path = require("path")
const app = express()
const fs = require("fs")
const PORT = process.env.PORT || 8080


//MIDDLE WARE TO CONVERT STRING TO JSON RESONSE
app.use(express.json());

// DEFAULT ROUTE
app.get("/", (req, res) => {
    const folderPath = path.join(__dirname, "data")
    const userDataFilePath = path.join(__dirname, "data", "user.txt")
    const todoDataFilePath = path.join(__dirname, "data", "todo.txt")
    if(!existsSync(folderPath)){
        fs.mkdirSync(folderPath)
       if(existsSync(folderPath)){
            fs.writeFile(userDataFilePath, JSON.stringify({"data": "false"}), (err) => {
                if(err){
                    throw err
                }else{
                    fs.writeFile(todoDataFilePath, JSON.stringify({"data": "false"}), (err) => {
                        if(err){
                            throw err
                        }
                    })
                }
            })
       }
    }
    res.set({"Content-Type": "text/html"})
    res.status(200).send("<h1>Hello welcome to our todo app !<h1>")
})

// USER ROUTES
app.use("/user", require(path.join(__dirname, "route", "user", "index.js")))
app.use("/todo", require(path.join(__dirname, "route", "todo", "index.js")))



app.get("*", (req, res) => {
    res.set({ "Content-Type": "text/html"})
    res.status(404).send("<h1>404 ! \n Page not found !</h1>")
})

app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`)
}) 