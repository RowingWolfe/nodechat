// [{
//     id: '',
//     name: '',
//     room: ''
// }]

//Add User (id, name, room)
//Remove User(id)
//Get User(id)
//getUserList(room)

class Users {
    constructor () {
        this.users = [];
    }
    addUser(id, name, room){
        let user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser(id){
        //return user that is removed

    }
    getUser(id){
        //return user
        
    }
    getUserList(room){
        //Return users in room.

    }
}

module.exports = {
    Users
};