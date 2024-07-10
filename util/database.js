const Sequelize = require('sequelize')

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'nodetutorial',
//     password: 'apple@17'
// });

const sequelize = new Sequelize('expense', 'root', '1718',{
    dialect: 'mysql',
    host: 'localhost'
})

module.exports = sequelize;
