const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
var authenticate = require('../authenticate');
const favoritesRouter = express.Router();
const cors = require('./cors');

favoritesRouter.use(bodyParser.json());

favoritesRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    console.log('Returning Favorites for User: ' + req.user._id);
    Favorites.findOne({ 'user': req.user._id })
    .populate('user')
    .populate('dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // Favorites.create(req.body)
    console.log('Posting Favorites for User: ' + req.user._id);
    Favorites.findOne({ 'user': req.user._id })
    .then((favorites) => {
        var array = req.body;
        if (!favorites) {
          Favorites.create({ "user": req.user._id, 'dishes': [] })
          .then((createdFavorites) => {
              for (var i in array) {
                console.log("ADDING " + array[i]._id);
                createdFavorites.dishes.push(array[i]._id);
              }
              createdFavorites.save()
              .then((savedFavorites) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(savedFavorites);
              }, (err) => next(err));
          });
        } else {
          for (var i in array) {
            if (favorites.dishes.indexOf(array[i]._id) < 0) {
              console.log("ADDING " + array[i]._id);
              favorites.dishes.push(array[i]._id);
            }
          }
          favorites.save()
          .then((savedFavorites) => {
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json(savedFavorites);
          }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  console.log('Deleting Favorites for User: ' + req.user._id);
    Favorites.remove({ 'user': req.user._id })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoritesRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req,res,next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /favorites/'+ req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, { new: true })
    .then((favorite) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorite);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findByIdAndRemove(req.params.dishId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoritesRouter;
