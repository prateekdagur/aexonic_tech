const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')

const User = sequelize.define("users",{
    firstName:{
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    lastName:{
        type: Sequelize.STRING(20),
        allowNull: false,
    },
    address:{
        type: Sequelize.STRING(200),
        allowNull: false
    },
   mobile_no:{
        type: Sequelize.INTEGER(20),
        allowNull: false,
        validate:  {
            isNumeric: true,
          len:{
                args:[10, 13],
                msg:"Min length of the phone number is 10"
              }
        }
    },
    email: { 
        type: Sequelize.STRING(200),
        allowNull: false,
        validate: {
            isEmail: true
        }
     },
     password: { 
        type: Sequelize.STRING(200),
        allowNull: false,
       },
})
User.sync().then(function(){
    return ''
})

module.exports = User