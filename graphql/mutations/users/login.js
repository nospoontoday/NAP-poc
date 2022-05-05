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
    },
    async resolve(parent, args, { req, res }) {
        const user = args.username;
        const pwd = args.password;

        if (!user || !pwd) throw new Error ('Invalid credentials');

        const foundUser = usersDB.users.find(person => person.username === user);

        // if (!foundUser) return res.json({ 'message': 'Invalid email and or password'}); //Unauthorized 
        // if (!foundUser) throw new Error('Invalid username and or password');
        if(!foundUser) throw new Error ('Invalid credentials');

        // evaluate password 
        const match = await bcrypt.compare(pwd, foundUser.password);
        if (match) {
            // create JWTs
            const accessToken = jwt.sign(
                { "username": foundUser.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            const refreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );

            // Saving refreshToken with current user
            const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
            const currentUser = { ...foundUser, refreshToken };
            usersDB.setUsers([ ...otherUsers, currentUser ]);

            await fsPromises.writeFile(
                path.join(__dirname, '../../../', 'model', 'users.json'),
                JSON.stringify(usersDB.users)
            );

            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 });
            foundUser.accessToken = accessToken;
            return foundUser;
        } 
        
        throw new Error ('Invalid credentials');
    }
};