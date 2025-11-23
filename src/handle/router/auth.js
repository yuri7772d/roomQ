const express = require('express');
const router = express.Router();
const authUsecase = require('./../../usecase/auth');
const { body } = require('express-validator');
const errValidator = require('../middlewere/err.validator');
const permit = require('../middlewere/permit');

router.post('/',
    [
        body('username')
          .isString()
          .notEmpty(),
        body('password')
          .isString()
          .notEmpty(),
        body('role')
          .isNumeric()
          .notEmpty()
    ],
    errValidator,
    permit([0]),
    async (req, res) => {
        const { username, password, role } = req.body;
        try {
            const result = await authUsecase.create(username, password, role);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

router.post('/login',
    [
        body('username')
          .isString()
          .notEmpty(),
        body('password')
          .isString()
          .notEmpty()

    ],
    errValidator,
    async (req, res) => {
        const { username, password } = req.body;
        try {
            const result = await authUsecase.login(username, password);
             console.log(result.token);
            res.cookie('token',result.token)
            res.status(200).json(result.payload);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
   
);

router.get('/me',
    async (req, res) => {
        try {
            const {token} = req.cookies ; 
            console.log(token)
            const result = await authUsecase.me(token);
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

router.get('/listing',
    permit([0]),
    async (req, res) => {
        try {
            const result = await authUsecase.listing();
            res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

router.delete('/',
        [
        body('auth_id')
          .isNumeric()
          .notEmpty(),
    ],
    errValidator,
    permit([0]),
    async (req, res) => {
        try {
            const {auth_id} = req.body;
            const result = await authUsecase.remove(auth_id);
            res.status(200).json({msg:'ok'});
        } catch (error) {
            res.status(400).json({ msg: error.message });
        }
    }
);

module.exports = router;