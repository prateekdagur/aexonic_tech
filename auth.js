const jwt = require('jsonwebtoken')
const UsersAccessToken = require('../models/access_tokens')

module.exports.auth = async (req,res, next) => {
    try{
        const token = req.headers.token
        if(!token){
            throw new error('token hs not been passed')
        }
        const decoded = jwt.verify(token, 'secretKey')
        const user = await UsersAccessToken.findOne({where: {access_token: token}})
        if (!user){
            throw new Error('token is not vrified')
        }
        req.user = user
        next()
    }  catch (e){
        res.status(401). send(e.message)
    }
}