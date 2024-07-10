const Sequelize = require('sequelize')

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'nodetutorial',
//     password: 'apple@17'
// });

const sequelize = new Sequelize('expense', 'root', '1718',{
    dialect: 'mysql',
    host: 'database-1.c76uskew0vbg.ap-southeast-2.rds.amazonaws.com'
})

module.exports = sequelize;
