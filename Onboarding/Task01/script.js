function Main(){
    var usersCount = parseInt(localStorage.getItem('usersCount'));
    if(isNaN(usersCount)) {
        usersCount = 0;
        localStorage.setItem('usersCount', usersCount);
    }
    else{
        ReadUsers();
    }
    
    var firstName = document.getElementById('firstname');
    var lastName = document.getElementById('lastname');
    var dateOfBirth = document.getElementById('dateofbirth');
    var profileImage = document.getElementById('profileimage');
    var address = document.getElementById('address');
    var zipCode = document.getElementById('zipcode');

    function ClearInputs(){
        firstName.value = "";
        lastName.value = "";
        dateOfBirth.value = "";
        profileImage.value = "";
        address.value = "";
        zipCode.value = "";
    }

    var createUserBtn = document.getElementById('createuserbtn');
    createUserBtn.onclick = function(){
        usersCount = parseInt(localStorage.getItem('usersCount')) + 1;
        if(firstName.value == "" || lastName.value == "" || dateOfBirth.value == "" || profileImage.value == "" || address.value == "" || zipCode.value == ""){
            alert("Error ! One or More Fields are Empty");
            return;
        }
        var user = {
            'firstName' : firstName.value,
            'lastName'  : lastName.value,
            'dateOfBirth' : dateOfBirth.value,
            'profileImage' : profileImage.value,
            'address' : address.value,
            'zipCode' : zipCode.value
        };
        var key = createUserBtn.getAttribute('userid');
        if(key!=""){
            localStorage.setItem(key, JSON.stringify(user));
            alert('Record Updated Successfully');
            createUserBtn.setAttribute('value', 'Add User');
        }
        else{
            localStorage.setItem(usersCount, JSON.stringify(user));
            alert('Record Created Successfully');
        }
        localStorage.setItem('usersCount', usersCount);
        ClearInputs();
        ReadUsers();
    }

    function ReadUsers(){
        var table = document.getElementById('userstable');
        table.innerHTML = "";
        for(var i=1;i<=usersCount;i++){
            var tr = document.createElement('tr');
            var object = JSON.parse(localStorage.getItem(i));
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    const element = object[key];
                    //console.log(element);
                    var td = document.createElement('td');
                    if(key == 'profileImage'){
                        var img = document.createElement('img');
                        img.setAttribute('src', element);
                        img.setAttribute('alt', element);
                        td.append(img);
                    }
                    else{
                        td.innerText = element;
                    }
                    tr.append(td);
                }
            }
            if(object != null){
                var td = document.createElement('td');
                var a = document.createElement('a');
                a.setAttribute('href', '#');
                a.setAttribute('id', 'edituserbtn');
                a.setAttribute('value', i);
                a.innerText = 'Edit';
                a.addEventListener('click', function(){
                    var key = this.getAttribute('value');
                    var object = JSON.parse(localStorage.getItem(key));
                    firstName.value = object.firstName;
                    lastName.value = object.lastName;
                    dateOfBirth.value = object.dateOfBirth;
                    profileImage.value = object.profileImage;
                    address.value = object.address;
                    zipCode.value = object.zipCode;
                    createUserBtn.setAttribute('userid', key);
                    createUserBtn.setAttribute('value', 'Update User');
                });
                td.append(a);
                tr.append(td);
                td = document.createElement('td');
                a = document.createElement('a');
                a.setAttribute('href', '#');
                a.setAttribute('id', 'removeuserbtn');
                a.setAttribute('value', i);
                a.innerText = 'Remove';
                a.addEventListener('click', function(){
                    var key = this.getAttribute('value');
                    localStorage.removeItem(key);
                    ReadUsers();
                    alert('Record Deleted Successfully');
                });
                td.append(a);
                tr.append(td);
                table.append(tr);
            }   
        }
    }
}