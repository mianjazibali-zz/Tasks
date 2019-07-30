const express = require('express')

const app = express()
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

const redis = require('redis');
const client = redis.createClient();

client.on('error', function(error){
    console.log('Error ! ', error)
})

function IsAnyFieldNull(firstName, lastName, dateOfBirth, profileimage, address, zipcode){
    if(firstName == '' || lastName == '' || dateOfBirth == '' || profileimage == '' || address == '' || isNaN(parseInt(zipcode)) || parseInt(zipcode) == 0 ){
        msg = 'Oops ! One or More Fields are Empty'
        return true;
    } 
    return false;
}

function GetUsersCount(callback){
    client.get("usersCount", function(err, reply) {
        if(!err && reply){
            callback(reply);
        }
        else{
            callback('0');
        }
    });
}

function SetUsersCount(usersCount, callback){
    client.set("usersCount", usersCount, function(err){
        if(!err){
            callback('Success')
        }
        else{
            callback()
        }
    });
}

var users = []
var msg = '';
var isSuccessMsg = true;

app.get('', (req, res)=>{
    res.redirect('/read')
});

app.get('/read', (req, res)=>{
    var users = [];
    var temp = [];
    GetUsersCount(function(usersCount){
        for(let i=1;i<=usersCount;i++){
            temp.push(i);
            client.get(i, function(err, reply){
                if(reply){
                    users.push(JSON.parse(reply))
                }
                temp.pop();
                
                if(temp.length == 0){
                    res.render('pages/read', {
                        msg: msg,
                        users: users
                    });
                    msg = '';
                }
            })
        }
        if(temp.length == 0){
            res.render('pages/read', {
                msg: msg,
                users: users
            });
            msg = '';
        }
    })
})

app.get('/create', (req,res)=>{
    res.render('pages/create', {
        msg: msg,
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
        GetUsersCount(function(usersCount){
            var count = parseInt(usersCount) + 1;
            console.log(count);
            var user = {
                Id: count,
                FirstName: req.body.firstname,
                LastName: req.body.lastname,
                DateOfBirth: req.body.dateofbirth,
                ProfileImageUrl: req.body.profileimage,
                Address: req.body.address,
                ZipCode: req.body.zipcode
            }
            client.set(count, JSON.stringify(user), function(err){
                if(!err){
                    SetUsersCount(count, function(result){
                        if(result){
                            msg = 'Record Added Successfully'
                            console.log('Record Added Successfully')
                            res.redirect('/read')
                        }
                        else{
                            msg = 'Error! Record Not Added'
                            console.log('Error! Record Not Added')
                            res.redirect('/create')
                        }
                    })
                }
            })
        });
    }
});

app.get('/update/:id',(req, res)=>{
    users = [];
    client.get(req.params.id, function(err, reply){
        if(!err && reply){
            res.render('pages/update', {
                msg: msg,
                user: JSON.parse(reply)
            })
            msg = '';
        }
        else{
            msg = 'Record Not Found'
            console.log('Record Not Found')
            res.redirect('/read')
        }
    })
})

app.post('/update', (req, res)=>{
    const isNull = IsAnyFieldNull(req.body.firstname, req.body.lastname, req.body.dateofbirth, req.body.profileimage, req.body.address, req.body.zipcode)
    if(isNull){
        var url = '/update/' + req.body.id;
        res.redirect(url);
    }
    else{
        var user = {
            Id: req.body.id,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            DateOfBirth: req.body.dateofbirth,
            ProfileImageUrl: req.body.profileimage,
            Address: req.body.address,
            ZipCode: req.body.zipcode
        }
        console.log('Id : ' + req.body.id);
        client.set(req.body.id, JSON.stringify(user), function(err){
            if(!err){
                client.save();
                msg = 'Record Added Successfully'
                console.log('Record Added Successfully')
                res.redirect('/read')
            }
            else{
                msg = 'Error! Record Not Added'
                console.log('Error! Record Not Added')
                res.redirect('/create')
            }
        })
    }
})

app.get('/delete/:id',(req, res)=>{
    client.del(req.params.id, function(err){
        if(!err){
            msg = 'Record Deleted Successfully'
            console.log('Record Deleted Successfully')
            res.redirect('/read')
        }
        else{
            msg = 'Record Not Deleted'
            console.log('Record Not Deleted')
            res.redirect('/read')
        }
    })
})

app.listen(3000, ()=>{
    console.log('Server is Listening at port 3000')
})