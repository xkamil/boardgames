let express = require('express');
let router = express.Router();
let E = require('../../exceptions');

let Game = require('../models/game');

router.get('/', (req, res, next)=> {
    Game.find({}, (err, games)=> {
        if (err) return next(err);

        res.json(games);
    });
});

router.post('/', (req, res, next) => {
    let user = req.user;
    let game = req.body.game;

    if (!user || !user.admin) return next(new E.AuthorizationException('Not authorized to add new games.'));
    if (!game || game.name.length == 0) return next(new E.BadRequest('Name is required'));

    Game.findOne({name: game.name}, (err, game) => {
        if (err) return next(err);
        if (game) return res.next(new E.ResourceConflict('Game ' + game.name + ' already exists'));

        let newGame = new Game(game);

        newGame.save((err)=> {
            if (err) return next(err);
            res.status(201).json(game)
        });
    });
});

router.delete('/:gameId', (req, res, next)=> {
    let user = req.user;
    let gameId = req.params.gameId;

    if (!user || !user.admin)return next(new E.AuthorizationException('Not authorized to remove games.'));

    Game.remove({_id: gameId}, (err) => {
        if (err) return next(err);
        res.json('');
    });
});

module.exports = router;