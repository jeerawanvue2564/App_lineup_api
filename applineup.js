const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const knex = require('knex')
const multer = require('multer')

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '123456',
    database: process.env.MYSQL_DB || 'applineup',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send({ ok: 1 })
})
// login
app.get('/Login', async (req, res) => {
  console.log(req.query.username)
  console.log(req.query.passwd)
  try {
    const row = await db('user')
      .where({ username: req.query.username, passwd: req.query.passwd })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('username/pass incorrect')
    }
    res.send({
      status: 1,
      data: row,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})

// signup
app.post('/save', async (req, res) => {
  console.log('data=', req.body)
  try {
    const row = await db('user').insert({
      fullname: req.body.fullname,
      username: req.body.username,
      tel: req.body.tel,
      class5: req.body.class5,
      passwd: req.body.passwd,
    })
    res.send({
      status: 1,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})
app.get('/list', async (req, res) => {
  console.log('id=', req.query)
  const row = await db('user').where({ id: req.query.id })
  res.send({
    datas: row[0],
    status: 1,
  })
})

app.get('/lists', async (req, res) => {
  const row = await db('user')
  res.send({
    datas: row,
    status: 1,
  })
})

// lists_class
app.get('/list_class', async (req, res) => {
  console.log('call student')
  let row = await db('student')
  res.send({
    status: 'ok',
    row,
  })
})
// // ของ upload ทั้งหมด
// app.use(bodyParser.urlencoded({extended: true}))
// // SET STORAGE
// let storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads')
//   },
//   filename: (req, file, cb) => {
//     let ext = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length)
//     cb(null, 'e1-' + Date.now() + ext)
//   },
// })
// let upload = multer({ storage: storage })

// app.use((req, res, next) => {
//   let header = { 'Access-Control-Allow-Origin': '*'}
//   for (let i in req.headers) {
//     if (i.toLowerCase().substr(0, 15) === 'access-control-') {
//       header[i.replace(/-request-/g, '-allow-')] = req.headers[i]
//     }
//   }
//   // res.header(header)  // แบบเก่า
//   res.set(header) // แบบใหม่
//   next()
// })

// // uploading multiple images together
// app.post('/multi', upload.any(), (req, res) => {
//   console.log('multi')
//   const files = req.files
//   console.log('file:', files)
//   if (!files) {
//     const error = new Error('Please choose files')
//     error.httpStatusCode = 400
//     return next(error)
//   }

//   res.send({
//     'files=>': files,
//     status: 'ok',
//   })
// })

// app.post('/listup', upload.any(), async (req, res) => {
//   console.log(req.files[0].filename)
//   console.log('คุณสมบัติของfile:', req.files)
//   let row = await db('user').insert({
//     fullname: req.body.username,
//     tel: req.body.mobile,
//     bacount: req.body.bacount,
//     images: req.files[0].filename,
//     email: req.body.email,
//     passwd: req.body.passwd,
//   })

//   res.send({ status: true, filesname: req.files[0].filename })
// })

// app.get('/listg', async (req, res) => {
//   try {
//     let rows = await req.db('group').select('*').orderBy('group.g_code', 'desc')
//       .innerJoin('department', 'group.d_code', 'department.d_code')
//       .where('group.t_status', '!=', 0)
//     res.send({
//       ok: true,
//       datas: rows,
//     })
//   } catch (e) {
//     res.send({ ok: false, error: e.message })
//   }
// })

// app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
//   console.log('คุณสมบัติของfile:', req.file)

//   //  let ext = req.file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
//   console.log('req.file.originalname=', req.file.originalname)
//   console.log('req.file.originalname.lastIndexOf(.)', req.file.originalname.lastIndexOf('.'))
//   console.log('file.originalname.length=', req.file.originalname.length)

//   if (!req.file) {
//     const error = new Error('Please upload a file')
//     error.httpStatusCode = 400
//     return next(error)
//   }
//   res.send(req.file)
// })
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html')
// })

app.listen(7001, () => {
  console.log('ready:applineup')
})
