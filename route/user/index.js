const express = require("express")
const router = express.Router()
const fs = require("fs")
const path = require("path")


const filePath = path.join(__dirname, "..", "..", "data", "user.txt")
const dirPath = path.join(__dirname, "..", "..", "data")
 
router.get("/get-all-user", (req, res) => {
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err
        const initialData = JSON.parse(data)
        if (initialData.data === "false") {
            return res.status(404).json({ "message": "No user found !" })
        } else {
            res.status(200).json(JSON.parse(data))
        }
    })
})


// POST REQUEST FOR CREATE USER:
router.post("/create-user", (req, res) => {
    const { firstName, lastName, email, password } = req.body
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ "message": "All fields are required !" })
    }

    //IF VALIDATED SUCCESSFULLY PERFORM DB INSERT OPERATION.. BUT HERE WRITE TO FILE
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath)
    }

    //READ DATA FROM THE FILE ,IF NO DATA ADD AND APPEND
    if (fs.existsSync(filePath)) {
        fs.readFile(filePath, "utf-8", (err, data) => {
            if (err) throw err
            const fileData = JSON.parse(data)
            if (fileData.data === "false") {
                // CFREATE NEW USER !
                const newUserAdded = [{
                    ...req.body,
                    id: 1
                }]
                fs.writeFile(filePath, JSON.stringify(newUserAdded), (err) => {
                    if (err) throw err
                    res.set({
                        "Content-Type": "application/json",
                        "Authorization": `Bearer 123`
                    })
                    return res.status(201).json({ "message": "User Created Successfully !" })
                })
            } else {
                fs.readFile(filePath, "utf-8", (err, data) => {
                    if (err) throw err
                    const parsedDataFile = JSON.parse(data)

                    //VALIDATING EMAIL ALREADY EXISTS
                    const emailExists = parsedDataFile.find((item) => {
                        return item.email === req.body.email
                    })
                    if (emailExists) {
                        return res.status(409).json({ "message": "Email Already Exists !" })
                    }

                    // NOW APPENDING THE DATA TO FILE:
                    const newUser = { ...req.body, id: parsedDataFile.length + 1 };
                    parsedDataFile.push(newUser);
                    fs.writeFile(filePath, JSON.stringify(parsedDataFile), (err) => {
                        if(err) throw err
                        res.set({
                            "Content-Type": "application/json",
                            "Authorization": `Bearer 123`
                        })
                        return res.status(201).json({ "message": "User Created Successfully !" })
                    })
                })
            }
        })
    } else {
        // SEND ERROR FILE NOT EXISTS
        return res.status(404).json({ "message": "Error !" })
    }
})


// ADDING MIDDLE WARE FOR CHECK HEADER FOR PATCH AND DELETE
router.use((req, res, next) => {
    const authHeader = req.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({ "message": "Not Authenticated !" })
    }
    const bearerToken = authHeader.split(" ")
    if (Number(bearerToken[1]) !== 123) {
        return res.status(401).json({ "message": "Not Authenticated !" })
    }
    next()
})

// PATCH REQUEST:

router.patch("/update-user/:id", (req, res) => {
    //CHECK PARAMS ID VALID
    const userId = Number(req.params.id)
    if (isNaN(userId)) {
        return res.status(404).json({ "message": "Inavalid User Id !" })
    }

    // FETCH DATA FROM FILE AND UPDATE IT:
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err
        const fileData = JSON.parse(data)

        // WE CANNOT UPDATE OR VALIDATE EMAIL BECAUSE IT ACT AS UNIQUE IDENTIFIER:
        //FINDING USER ON THE BASIS OF USERID:
        const updateUser = fileData.find((item) => {
            return item.id === userId
        })

        if (!updateUser) {
            return res.status(404).json({ "message": "UserID Not Exists !" })
        }

        let upadteExistingData;
        if (req.body.firstName) {
            upadteExistingData = { ...updateUser, firstName: req.body.firstName }
        }
        if (req.body.lastName) {
            upadteExistingData = { ...upadteExistingData, lastName: req.body.lastName }
        }
        if (req.body.password) {
            upadteExistingData = { ...upadteExistingData, password: req.body.password }
        }

        // USE MAP AND WRITE TO THE FILE:
        const updatedData = fileData.map((item) => {
            if (item.id === userId) {
                return upadteExistingData
            }
            return item
        })

        // // WRITE TO THE FILE:
        fs.writeFile(filePath, JSON.stringify(updatedData), (err) => {
            if (err) throw err
            return res.status(201).json({ "message": "User Updated Successfully !" })
        })
    })
})


// GET REQUEST:

router.get("/get-user/:id", (req, res) => {

    //CHECK PARAMS ID VALID
    const userId = Number(req.params.id)
    if (isNaN(userId)) {
        return res.status(404).json({ "message": "Inavalid User Id !" })
    }
    // FETCH DATA OF USER FROM FILE:
    fs.readFile(filePath, "utf-8", (err, data) => {
        if (err) throw err
        const fileData = JSON.parse(data)
        const user = fileData.find((item) => {
            return item.id === userId
        })
        if (user) {
            return res.status(200).json(user)
        } else {
            return res.status(404).json({ "message": "Invalid User Id !", })
        }
    })
})








module.exports = router