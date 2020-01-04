const mysql = require('mysql');
const express = require('express');
const bodyparser = require('body-parser');
var app = express();

//MySQL details
var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1qazZAQ!',
    database: 'learners',
    multipleStatements: true
});

//MySQL connection
mysqlConnection.connect((err)=> {
    if(!err)
        console.log('Connection Established Successfully');
    else
        console.log('Connection Failed!'+ JSON.stringify(err,undefined,2));
});

//Configuring express server
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

//Creating GET Router to fetch all the learner details from the MySQL Database
app.get('/learners' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Router to GET specific learner detail from the MySQL database
app.get('/learners/:id' , (req, res) => {
    mysqlConnection.query('SELECT * FROM learnerdetails WHERE learner_id = ?',[req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
} );

//Router to INSERT/POST a learner's detail
app.post('/learners', (req, res) => {
    var learner = req.body;
    var sql = "SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_id = ?; CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_id);";

    mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err, rows, fields) => {
        if (!err)
            rows.forEach(element => {
                if(element.constructor == Array)
                    res.send('New Learner ID : '+ element[0].learner_id);
            });
        else
            console.log(err);
    })
});

//Router to UPDATE a learner's detail
app.put('/learners', (req, res) => {
    var learner = req.body;
    var sql = "SET @learner_id = ?;SET @learner_name = ?;SET @learner_email = ?;SET @course_id = ?; CALL learnerAddOrEdit(@learner_id,@learner_name,@learner_email,@course_id);";
    
    mysqlConnection.query(sql, [learner.learner_id, learner.learner_name, learner.learner_email, learner.course_id], (err, rows, fields) => {
        if (!err)
            res.send('Learner Details Updated Successfully');
        else
            console.log(err);
    })
});

//Router to DELETE a learner's detail
app.delete('/learners/:id', (req, res) => {
    mysqlConnection.query('DELETE FROM learnerdetails WHERE learner_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Learner Record deleted successfully.');
        else
            console.log(err);
    })
});

//Establish the server connection
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));