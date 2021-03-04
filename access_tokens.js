const Sequelize = require('sequelize')
const sequelize = require('../database/sequelize')
const accessToken = sequelize.define("access_tokens", {
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    access_token: {
        type: Sequelize.STRING(200),
        allowNull: false
    },
})

accessToken.sync().then(function(){
    return ''
})
module.exports = accessToken