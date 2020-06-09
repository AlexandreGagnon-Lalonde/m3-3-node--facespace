'use strict';

const express = require('express');
const morgan = require('morgan');

const { users } = require('./data/users');

let currentUser = {};

let signin = {
  verify: false,
  value: 'Sign In',
  path: '/signin',
  signout: ''
}

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render('pages/homepage', {
    signin: signin,
    users: users,
    currentUser: currentUser
  });
}

const handleUserPage = (req, res) => {
  let currentPage;
  users.forEach(item => {
    if (item._id === req.params.userID) {
      currentPage = item;
    }
  })
  if (currentPage._id === currentUser._id) {
    signin.signout = 'Sign Out';
  } else {
    signin.signout = '';
  }
  res.status(200).render('pages/profile', {
    signin: signin,
    user: currentPage,
    users: users
  });
}

const handleSignin = (req, res) => {
  if (!signin.verify) {
    res.status(200).render('pages/signin', {
      signin: signin
    });
  } else {
    res.status(200).redirect('/');
  }
}

const handleName = (req, res) => {
  let firstName = req.query.firstName;
  currentUser = users.find(user => user.name === firstName);
  if (currentUser) {
    res.status(200).redirect(`/users/${currentUser._id}`)//.render('/users/:userId', handleUserPage);
    signin.verify = true;
    signin.value = currentUser.name;
    signin.path = `/users/${currentUser._id}`;
    signin.signout = 'Sign Out';
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
