const express = require('express')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')
const UserModel = require('../models/users')
const UsersAccessToken = require('../models/access_tokens')
const userAuthentication = require('../middleware/auth')
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const router = express.Router()

router.post('/register_user', async function (req, res){
    
    try{
        if (!req.body.password){
            res.send({
                message: "please provide password"})
           }
           if (req.body.password.length >= 8 && req.body.password.length <= 20) {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(req.body.password, salt )
            req.body.password = hash
        } else {
          throw new Error('Your password should be between 8-20 characters!');
        }
            let createUser = await UserModel.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                mobile_no: req.body.mobile_no,
                email: req.body.email,
                password: req.body.password
            })
               res.send(createUser)
        } catch(e){
            res.status(500).send(e.message)
        }
    })
    router.post('/login', async (req, res) => {
        try{
            const email = req.body.email
            const password = req.body.password
            const user =  await UserModel.findOne({ where: {"email": email}})
             if(!user){
                throw new Error("no such username")
            }
            isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch){
                throw new Error("no match of password")
            }
            const token = jwt.sign({id: user.id}, 'secretKey')
            const data = await UsersAccessToken.create({
                user_id: user.id,
                access_token: token

            })
            res.send(data)
        } catch (e) {
            res.status(400).send()
        }
    })
        
        router.get('/get_all_users', async (req, res) => {
             try{
                 const users = await UserModel.findAll()
                 res.send(users)
             }
             catch (e){
                 res.status(401).send(e)
             }
         })

         router.get('/get_user_byAuth', userAuthentication.auth, async (req, res) => {
            try{
                const users = await UserModel.findAll({where: {"id": req.user.user_id }})
                res.send(users)
            }
            catch (e){
                res.status(401).send(e)
            }
        })


         router.get('/get/page', async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 3
                const page = parseInt(req.query.page_no) || 1
                const skip = limit * (page - 1)
                const users = await UserModel.findAll({ limit: limit, offset: skip });
                res.send(users)
            } catch (e) {
                res.status(401).send(e.message)
            }
        });

        router.patch('/update', userAuthentication.auth, async (req, res) => {
            try {
                const createUpdate = await UserModel.update(
                    { firstName: req.body.firstName, lastName: req.body.lastName, address: req.body.address, mobile_no: req.body.mobile_no}, { where: { "id": req.user.user_id } })
                res.json({ message: 'user updated' })
            } catch (e) {
                res.status(401).send(e.message)
            }
        });
         router.get('/search', async (req, res) => {
            try{
                let {firstName} = req.query;
                const users = await UserModel.findAll({ limit: limit, offset: skip }, { where: {
                    firstName: { [Op.like]: '%' + firstName + '%' }
                     }})
                res.json(users)
            } catch (e){
                res.status(401).send(e.message)
            }
        })
module.exports = router
            