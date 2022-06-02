const { Router } = require('express');
const bcrypt = require('bcryptjs');
const config = require('config');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User  = require('../models/User');
const router = Router();

//  /api/auth/register
router.post(
  '/register',
  [
    check('email', 'No valid email').isEmail(),
    check('password', ' Should be 6 symbols').isLength({min: 6})
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'No correct data',
        })
      }
        
      const {email, password} = req.body;
      
      const candidate = await User.findOne({email});

      if (candidate) {
        return res.status(400).json({ message: 'User already exists'});
      }

      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({email, password: hashedPassword});

      await user.save();

      res.status(201).json({ message: 'User has created'})

    } catch (e) {
      res.status(500).json({ message: 'server error'})
    }
  }
);

//  /api/auth/login
router.post(
  '/login',
  [
    check('email', 'No valid email').normalizeEmail({ gmail_remove_dots: false }).isEmail(),
    check('password', ' No valid password').exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: 'No correct user or password',
        })
      }
      
      const {email, password} = req.body;

      const user = await User.findOne({email});

      if (!user) {
        return res.status(400).json({ message: 'user not found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({ message: 'password isn\'t correct' });
      }

      const token = jwt.sign(
        {userID: user.id},
        config.get('jwtSecret'),
        {expiresIn: '1h'}
      );

      res.json({token, userId: user.id});

    } catch (e) {
      res.status(500).json({ message: 'server error'})
    }
  }
)

module.exports = router;
