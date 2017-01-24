const express = require('express')
const bodyParser = require('body-parser')
const {graphqlExpress, graphiqlExpress} = require('graphql-server-express')
const {MongoClient} = require('mongodb')
const appSchema = require('./schema/main.js')

const MONGO_URL = process.env.MONGO_URL
const user = process.env.MAIL_USER
const pass = process.env.MAIL_PASS
const app = express()
const PORT = 5000

const facultyMessage = require('./messages/faculty-confirmation.js')
const delegateMessage = require('./messages/delegate-confirmation.js')
var nodemailer = require('nodemailer');

app.use(bodyParser.json())

const mailer = (faculty, options)  => {
   // create reusable transporter object using the default SMTP transport
      var transporter = nodemailer.createTransport(`smtps://${user}%40gmail.com:${pass}@smtp.gmail.com`);

      // setup e-mail data with unicode symbols
      var mailOptions = Object.assign({}, {
              from: '"Scifimun Bot" <scifimun.mexicup@gmail.com>', // sender address
              to: `${faculty.email}`, // list of receivers
              subject: 'Solicitud de Registro', // Subject line
              text: 'Hello world ?', // plaintext body
              html: '<b>Hello world ?</b>' // html body
            }, options);

      // send mail with defined transport object
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
}


MongoClient.connect(MONGO_URL, (err, db) => {
  if (err)
    throw err

  app.post('/api/faculty', (request, response) => {

    const {person, delegation} = request.body

    let faculty = Object.assign({}, person, delegation)

    db.collection('faculties').insertOne(faculty, (err, result) => {
      if (err) {
        response.status(500).send('ERROR')
        throw err
      }

      // mailer(faculty)

      response.json({result: 'ok', faculty})
    })
  })

  app.post('/api/delegate', (request, response) => {

    // insertar delegado

    // con el output, insertar las entradas de registro

    response.json({
      status: 'ok'
    })
  })

  app.use('/graphql', bodyParser.json(), graphqlExpress({
    schema: appSchema,
    context: {
      db
    }
  }))
  app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql'
  }))
  app.listen(PORT)
})
