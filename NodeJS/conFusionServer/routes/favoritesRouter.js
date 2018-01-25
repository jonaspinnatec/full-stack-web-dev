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
    console.log('Posting Favorites for User: ' + req.user._id);
    Favorites.findOne({ 'user': req.user._id })
    .then((favorites) => {
        var array = req.body;
        if (!favorites) {
          Favorites.create({ "user": req.user._id, 'dishes': [] })
          .then((createdFavorites) => {
              for (var i in array) {
                if (createdFavorites.dishes.indexOf(array[i]._id) < 0) {
                  console.log('Adding Favorite: ' + array[i]._id);
                  createdFavorites.dishes.push(array[i]._id);
                }
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
              console.log('Adding Favorite: ' + array[i]._id);
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
.get(cors.cors, authenticate.verifyUser, (req,res,next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if (!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('Adding Favorite: ' + req.params.dishId + ' for User: ' + req.user._id);
    Favorites.findOne({ 'user': req.user._id })
    .then((favorites) => {
        var dishId = req.params.dishId;
        if (!favorites) {
          Favorites.create({ "user": req.user._id, 'dishes': [] })
          .then((createdFavorites) => {
              createdFavorites.dishes.push(dishId);
              createdFavorites.save()
              .then((savedFavorites) => {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.json(savedFavorites);
              }, (err) => next(err));
          });
        } else {
          if (favorites.dishes.indexOf(dishId) < 0) {
            favorites.dishes.push(dishId);
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
    res.end('PUT operation not supported on /favorites/'+ req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  console.log('Deleting Favorite: ' + req.params.dishId + ' for User: ' + req.user._id);
  Favorites.findOne({ 'user': req.user._id })
  .then((favorites) => {
      var dishId = req.params.dishId;
      if (!favorites || (favorites.dishes.indexOf(dishId) < 0)) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
      } else {
        var index = favorites.dishes.indexOf(dishId);
        favorites.dishes.splice(dishId, 1);
        favorites.save()
        .then((favorite) => {
            Favorites.findById(favorite._id)
            .populate('user')
            .populate('dishes')
            .then((favorite) => {
                console.log('Favorite Dish Deleted!', favorite);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            })
        })

        .then((savedFavorites) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(savedFavorites);
        }, (err) => next(err));
      }
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = favoritesRouter;
