const graphql = require("graphql");
const EmployeeQueries = require('./queries/employees');
const UserMutations = require('./mutations/users');
const UserQueries = require('./queries/users');

const {
    GraphQLObjectType,
    GraphQLSchema,
} = graphql;

// const EmployeeType = require("./shapes/EmployeeType");

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        ...EmployeeQueries,
        ...UserQueries
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        // createEmployee: {
        //     type: EmployeeType,
        //     args: {
        //         first_name: { type: GraphQLString },
        //         last_name: { type: GraphQLString },
        //     },
        //     resolve(parent, args) {
        //         console.log(args.first_name);
        //         console.log(args.last_name);
        //         return args;
        //     }
        // },
        ...UserMutations,
    },
});

module.exports = new GraphQLSchema({ query: Query, mutation: Mutation });