const graphql = require('graphql');
const {
    GraphQLList,
} = graphql;
const EmployeeType = require("../.././shapes/EmployeeType");
const employeeData = require('../../../model/employees.json');

module.exports = {
    type: new GraphQLList(EmployeeType),
    resolve(parent, args) {
        return employeeData;
    },
};