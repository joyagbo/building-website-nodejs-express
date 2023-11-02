const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();
module.exports = (params) => {
  const { feedbackService } = params;

  router.get('/', async (req, res, next) => {
    try {
      const feedback = await feedbackService.getList();
      
      const errors =req.session.feedback? req.session.feedback.errors:false

      return res.render('layout', {
        pageTitle: 'Feedback',
        template: 'feedback',
        feedback,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post(
    '/',
    [
      check('name')
    .trim()
    .isLength({ min: 3 })
    .escape()
    .withMessage('A name is required'),
    check('email')
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage('A valid email address is required'),
      check('title')
        .trim()
        .isLength({ min: 3 })
        .escape()
        .withMessage('A title is required'),
      check('message')
        .trim()
        .isLength({ min: 5 })
        .escape()
        .withMessage('A message is required')
  ],
    (req, res) => {
      const errors = validationResult(req)

      if(!errors.isEmpty()){
        req.session.feedback ={
          errors: errors.array(),
        }
        return res.redirect('/feedback')
      }
      
      res.send('Feedback form posted');
    }
  );

  return router;
};
// const feedback = await feedbackService.getList();
// return res.json(feedback);
