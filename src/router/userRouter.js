const conn = require('../connection/')
const router = require('express').Router()
const isEmail = require('validator/lib/isEmail')
const bcrypt = require('bcrypt')
const path = require('path')
const multer = require('multer')
const port = require('../config/port')

// __dirname: alamat folder file userRouter.js
const rootdir = path.join(__dirname,'/../..')
const photosdir = path.join(rootdir, '/upload/photos')

const folder = multer.diskStorage(
    {
        destination: function (req, file, cb){
            cb(null, photosdir)
        },
        filename: function (req, file, cb){
            // Waktu upload, nama field, extension file
            cb(null, Date.now() + file.fieldname + path.extname(file.originalname))
        }
    }
)

const upstore = multer(
    {
        storage: folder,
        limits: {
            fileSize: 3000000 // Byte , default 1MB
        },
        fileFilter(req, file, cb) {
            if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){ // will be error if the extension name is not one of these
                return cb(new Error('Please upload image file (jpg, jpeg, or png)')) 
            }
    
            cb(undefined, true)
        }
    }
)


// CREATE ONE USER
// router.post('/user', (req, res) => {
//     var {username, name, email, password} = req.body

//     if(!isEmail(email)){
//         return res.send('Email is not valid')
//     }

//     password = bcrypt.hashSync(password, 8)
    
//     const sql = `INSERT INTO users (username, name, email, password)
//                 VALUES ( '${username}', '${name}', '${email}', '${password}' )`

//     conn.query(sql, (err, result) => {
//         if(err){
//             return res.send(err.sqlMessage)
//         }

//         res.send(result)
//     })
// })

// CREATE ONE USER
router.post('/users', (req, res) => {

    // tanda tanya akan di ganti oleh variabel data
    const sql = `INSERT INTO users SET ?`
    const sql2 = `SELECT id, name, email, verified FROM users WHERE id = ?`
    const data = req.body

    if(!isEmail(data.email)){
        return res.send('Email is not valid')
    }

    data.password = bcrypt.hashSync(data.password, 8)

    conn.query(sql, data, (err, result1) => {
        // Terdapat error ketika insert
        if(err){
            return res.send(err)
        }

        conn.query(sql2, result1.insertId, (err, result2) => {
            if(err){
                return res.send(err)
            }

            res.send(result2)
        })
    })
})

// UPLOAD AVATAR
router.post('/users/avatar', upstore.single('apatar'), (req, res) => {
    const sql = `SELECT * FROM users WHERE username = ?`
    const sql2 = `UPDATE users SET avatar = '${req.file.filename}'
                    WHERE username = '${req.body.uname}'`
    const data = req.body.uname

    conn.query(sql, data, (err, result) => {
        if(err) return res.send(err)

        const user = result[0]

        if(!user) return res.send('User not found')

        conn.query(sql2, (err, result2) => {
            if(err) return res.send(err)

            res.send({
                message: 'Upload berhasil',
                filename: req.file.filename
            })
        })
    })
})

// ACCESS IMAGE
router.get('/users/avatar/:image', (req, res) => {
    // Letak folder photo
    const options = {
        root: photosdir
    }

    // Filename / nama photo
    const fileName = req.params.image

    res.sendFile(fileName, options, function(err){
        if(err) return res.send(err)
        
    })

})


router.get('/allusers', (req, res) => {
    conn.query('SELECT * FROM users', (err, result) => {
        if(err) {
            return res.send(err)
        }
        res.send(result)
    })
})

router.put('/users/:id', (req, res) => {
    const _username = req.body.username
    const _id = req.params.id

    conn.query(`UPDATE users SET username = '${_username}' WHERE id = ${_id}`, (err, result) => {
        if(err) {
            return res.send(err)
        }
        res.send(result)
    })
})

module.exports = router

// console.log(__dirname)