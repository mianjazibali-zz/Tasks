const express = require('express')

const app = express()
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const Sequelize = require('sequelize')
const connection = new Sequelize('test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
})

function IsAnyFieldNull(firstName, lastName, dateOfBirth, profileimage, address, zipcode){
    if(firstName == '' || lastName == '' || dateOfBirth == '' || profileimage == '' || address == '' || isNaN(parseInt(zipcode)) || parseInt(zipcode) == 0 ){
        msg = 'Oops ! One or More Fields are Empty'
        return true;
    } 
    return false;
}

var Users = connection.define('user', {
    FirstName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    LastName:{
        type: Sequelize.STRING,
        allowNull: false
    },
    DateOfBirth:{
        type: Sequelize.DATEONLY,
        allowNull: false
    },  
    ProfileImageUrl:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    Address:{
        type: Sequelize.STRING,
        allowNull: false
    },
    ZipCode:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

var users = []
var msg = '';

app.get('', (req, res)=>{
    res.redirect('/read')
});

app.get('/read', (req, res)=>{
    users = []
    connection.sync().then(function(){
        Users.findAll().then(function(user){
            for(var i =0;i<user.length;i++){
                users.push(user[i].dataValues);
            }
            res.render('pages/read', {
                msg: msg,
                users: users
            });
            msg = '';
        })
    })
})

app.get('/create', (req,res)=>{
    res.render('pages/create', {
        msg: msg
    });
    msg = '';
});

app.use(express.urlencoded({ extended: true }))

app.post('/create', (req,res)=>{
    const isNull = IsAnyFieldNull(req.body.firstname, req.body.lastname, req.body.dateofbirth, req.body.profileimage, req.body.address, req.body.zipcode)
    if(isNull){
        res.redirect('/create');
    }
    else{
        connection.sync().then(function(){
            Users.create({
                FirstName: req.body.firstname,
                LastName: req.body.lastname,
                DateOfBirth: req.body.dateofbirth,
                ProfileImageUrl: req.body.profileimage,
                Address: req.body.address,
                ZipCode: req.body.zipcode
            }).then(function(){
                msg = 'Record Added Successfully'
                console.log('Record Added Successfully')
                res.redirect('/read')
            })
        })
    }
});

app.get('/update/:id',(req, res)=>{
    users = [];
    connection.sync().then(function(){
        Users.findOne({
            where:{
                id: req.params.id
            }
        }).then(function(user){
            res.render('pages/update', {
                msg: msg,
                user: user.dataValues
            })
            msg = '';
        })
    })
})

app.post('/update', (req, res)=>{
    const isNull = IsAnyFieldNull(req.body.firstname, req.body.lastname, req.body.dateofbirth, req.body.profileimage, req.body.address, req.body.zipcode)
    if(isNull){
        var url = '/update/' + req.body.id;
        res.redirect(url);
    }
    else{
        connection.sync().then(function(){
            Users.update({
                FirstName: req.body.firstname,
                LastName: req.body.lastname,
                DateOfBirth: req.body.dateofbirth,
                ProfileImageUrl: req.body.profileimage,
                Address: req.body.address,
                ZipCode: req.body.zipcode
            },{
                where:{
                    id: req.body.id
                }
            }).then(function(){
                msg = 'Record Updated Successfully'
                console.log('Record Updated Successfully')
                res.redirect('/read')
            })   
        }) 
    }
})

app.get('/delete/:id',(req, res)=>{
    connection.sync().then(function(){
        Users.destroy({
            where:{
                id: req.params.id
            }
        }).then(function(){
            msg = 'Record Deleted Successfully'
            console.log('Record Deleted Successfully')
            res.redirect('/read')
        })
    })
})

app.listen(3000, ()=>{
    console.log('Server is Listening at port 3000')
})