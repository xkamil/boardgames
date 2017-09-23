let express = require('express');
let router = express.Router();
let E = require('../../exceptions');
let Game = require('../models/game');

let admin_access = require('../middleware/admin_middleware');

// Public api ==============================

router.get('/', (req, res, next)=> {
    Game.find({}, (err, games)=> {
        if (err) return next(err);

        res.json(games);
    });
});

// Admin access only api ====================

router.post('/', admin_access, (req, res, next) => {
    let user = req.user;
    let newGame = req.body;

    console.log('Adding new game:', newGame);

    
    Game.findOne({name: newGame.name}, (err, game) => {
        if (err) {
            console.log('Error when reading from db');
            return next(err);
        }
        if (game) {
            console.log('Game with that name already exists');
            return next(new E.ResourceConflict('Game ' + game.name + ' already exists'));
        }

        let gameObj = new Game(newGame);

        gameObj.save((err, game)=> {
            if (err) return next(err);
            res.status(201).json(game)
        });
    });
});

router.delete('/:gameId', admin_access, (req, res, next)=> {
    let user = req.user;
    let gameId = req.params.gameId;

    if (!user || !user.admin)return next(new E.AuthorizationException('Not authorized to remove games.'));

    Game.remove({_id: gameId}, (err) => {
        if (err) return next(err);
        res.json('');
    });
});

module.exports = router;