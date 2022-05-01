const graphql = require("graphql");

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
} = graphql;

const employeeData = require('../model/employees.json');

const EmployeeType = require("./shapes/EmployeeType");

const Query = new GraphQLObjectType({
    name: "Query",
    fields: {
        getAllEmployees: {
            type: new GraphQLList(EmployeeType),
            resolve(parent, args) {
                return employeeData;
            },
        },
    },
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createEmployee: {
            type: EmployeeType,
            args: {
                first_name: { type: GraphQLString },
                last_name: { type: GraphQLString },
            },
            resolve(parent, args) {
                console.log(args.first_name);
                console.log(args.last_name);
                return args;
            }
        }
    }
})

module.exports = new GraphQLSchema({ query: Query, mutation: Mutation });