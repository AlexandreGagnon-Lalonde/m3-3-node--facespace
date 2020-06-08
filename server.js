'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

let signin = {
  checker: false,
  value: 'Sign In',
  path: '/signin'
}

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', {
    signin: signin,
    users: users
  });
}

const handleUserPage = (req, res) => {
  users.forEach(item => {
    if (item._id === req.params.userID) {
      currentUser = item;
    }
  })
  res.status(200).render('pages/profile', {
    signin: signin,
    user: currentUser,
    users: users
  });
}

const handleSignin = (req, res) => {
  res.status(200).render('pages/signin', {
    signin: signin
  });
}

const handleName = (req, res) => {
  let firstName = req.query.firstName;
  let checker = users.find(user => user.name === firstName);

  if (checker) {
    res.status(200).redirect(`/users/${checker._id}`)//.render('/users/:userId', handleUserPage);
    signin.checker = true;
    signin.value = checker.name;
    signin.path = `/users/${checker._id}`
  } else {
    res.status(404).redirect('/signin')//.render('/signin', handleSignin);
  }
}

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan('dev'))
  .use(express.static('public'))
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints
  .get('/', handleHomepage)
  .get('/users/:userID', handleUserPage)
  .get('/signin', handleSignin)
  .get('/getname', handleName)

  // a catchall endpoint that will send the 404 message.
  .get('*', handleFourOhFour)

  .listen(8000, () => console.log('Listening on port 8000'));
