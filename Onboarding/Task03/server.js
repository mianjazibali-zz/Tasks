const express = require('express')

const app = express()
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

const fs = require('fs');
var users = [];

app.get('', (req, res)=>{
    res.redirect('/read');
});

app.get('/read', (req, res)=>{
    try{
        users = JSON.parse(fs.readFileSync('./notes.txt').toString());
    }
    catch(ex){
        users = [];
        console.log(ex.msg);
    }
    var msg = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
    res.render('pages/read', {
        users: users,
        msg: msg
    });
});

app.get('/create', (req,res)=>{
    res.render('pages/create');
});

app.use(express.urlencoded({ extended: true }))

app.post('/create', (req,res)=>{
    try{
        users = JSON.parse(fs.readFileSync('./notes.txt').toString());
    }
    catch(ex){
        users = [];
        console.log(ex.msg);
    }
    var id = users.length;
    var user = {
        'id': id,
        'firstName': req.body.firstname,
        'lastName': req.body.lastname,
        'dateOfBirth': req.body.dateofbirth,
        'profileImage': req.body.profileimage,
        'address': req.body.address,
        'zipCode': req.body.zipcode
    }
    users.push(user);
    fs.writeFileSync('./notes.txt', JSON.stringify(users))
    res.redirect('/read');
});

app.get('/update/:id',(req, res)=>{
    users = JSON.parse(fs.readFileSync('./notes.txt').toString());
    const id = req.params.id;
    var user = users.filter(function( obj ) {
        return obj.id == id;
    });

    res.render('pages/update', {
        user: user[0]
    });
    /*
    fs.writeFileSync('./notes.txt', JSON.stringify(users))
    res.redirect('/read');
    */
})

app.post('/update', (req, res)=>{
    try{
        users = JSON.parse(fs.readFileSync('./notes.txt').toString());
    }
    catch(ex){
        users = [];
        console.log('Total Users : ', ex.msg);
    }
    for (const user of users) {
        if(user['id'] == req.body.id){
            user.firstName = req.body.firstname;
            user.lastName = req.body.lastname;
            user.dateOfBirth = req.body.dateofbirth;
            user.profileImage = req.body.profileimage;
            user.address = req.body.address;
            user.zipCode = req.body.zipcode;
            break;
        }
    }
    fs.writeFileSync('./notes.txt', JSON.stringify(users))
    res.redirect('/read');
})

app.get('/delete/:id',(req, res)=>{
    users = JSON.parse(fs.readFileSync('./notes.txt').toString());
    const id = req.params.id;
    users = users.filter(function( obj ) {
        return obj.id != id;
    });
    fs.writeFileSync('./notes.txt', JSON.stringify(users))
    res.redirect('/read');
})

app.listen(3000, ()=>{
    console.log('Server is Listening at port 3000')
})