const Sequelize = require('sequelize')
const sequelize = new Sequelize('aexonicData', 'root', '', {
   host: '127.0.0.1',
    dialect: 'mysql',
  
pool: {
    max: 5,
    min: 0,
    idle: 10000
},
});

module.exports = sequelize
global.sequelize = sequelize