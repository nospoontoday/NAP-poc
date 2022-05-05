const graphql = require('graphql');
const { GraphQLObjectType, GraphQLInt, GraphQLString } = graphql;

const UserType = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        username: { type: GraphQLString },
        password: { type: GraphQLString },
        accessToken: {type: GraphQLString },
    }),
});

module.exports = UserType;