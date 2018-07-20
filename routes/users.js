import express from 'express';
import mongoose from 'mongoose';
import Users from '../models/User';

let router = express.Router();

// router.get('/', (req, res, next)=>{
//   Users.find((err, user)=>{
//     if(err)
//       return next(err);
//     res.json(user)
//   })
// })

// router.get('/:id', (req, res, next)=>{
//   Users.findById(req.params.id, (err, user)=>{
//     if (err) return next(err);
//     res.json(user)
//   })
// })

// router.post('/:id', (req, res, next)=>{
//   Users.create(req.body, (err, user)=>{
//     if (err) return next(err);
//     res.json(user)
//   })
// })

// router.put('/:id', function(req, res, next) {
//   Users.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
//     if (err) return next(err);
//     res.json(user);
//   });
// });

// router.delete('/:id', function(req, res, next) {
//   Users.findByIdAndRemove(req.params.id, req.body, function (err, user) {
//     if (err) return next(err);
//     res.json(user);
//   });
// });


module.exports = router;