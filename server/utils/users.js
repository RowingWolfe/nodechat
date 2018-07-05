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
        let user = this.getUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }
    getUser(id){
        //return user
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList(room){
        //Return users in room.
        let users = this.users.filter( (user) => {
            //Kinda prefer not using the one liner.
            return user.room === room;
        });
        let namesArr = users.map( (user) => {
            return user.name;
        });
        return namesArr;
    }
}

module.exports = {
    Users
};