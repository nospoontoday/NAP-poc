const graphql = require('graphql');
const {
    GraphQLString
} = graphql;
const UserType = require("../../shapes/UserType");
const usersDB = {
    users: require('../../../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises; // temporary since we don't have db yet. will remove
const path = require('path');

module.exports = {
    type: UserType,
    args: {
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        confirm_pwd: { type: GraphQLString },
    },
    async resolve(parent, req, { res }) {
        const user = req.username;
        const pwd = req.password;
        

        if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });
        // check for duplicate usernames in the db
        const duplicate = usersDB.users.find(person => person.username === user);
        if (duplicate) return res.sendStatus(409); //Conflict 
        try {
            //encrypt the password
            const hashedPwd = await bcrypt.hash(pwd, 10);
            //store the new user
            const newUser = { "username": user, "password": hashedPwd };
            usersDB.setUsers([...usersDB.users, newUser]);
            await fsPromises.writeFile(
                path.join(__dirname, '../../../', 'model', 'users.json'),
                JSON.stringify(usersDB.users)
            );
            console.log(usersDB.users);
            return res.status(201).json({ 'success': `New user ${user} created!` });
        } catch (err) {
            return res.status(500).json({ 'message': err.message });
        }
    }
};