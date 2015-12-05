
// dependencies
var express         = require('express'),
    couch           = require('./couch'),
    rules           = require('./rules');

var router = express.Router()

/* GET authenticate page. */
router.get('/', rules.rules().isLogged, function(req, res) {
    res.render('auth', { title: "Chat Room - Login" });
});

/* POST authetication 'login' action*/
router.post('/', function(req, res) {
	couch.Users.findOneByView('_design/findOneByView/_view/findOneByView', req.body.email, function(err, user) {
        var error = "";
        if (err) {
            error = 'Opps, something happened! Try again in few minutes!';
            res.render('auth', { title: "Chat Room - Login", error: error });
        } else {
            error = '';
            if (!user) {
                error = 'Invalid email or password!';
                console.log("dgf");
                res.render('auth', { title: "Chat Room - Login", error: error });
            } else {
		if(req.body.password == user.password){
                //if (bcrypt.crypt().compareHashSync(req.body.password, user.password)) {
                    req.session.user = user;
                    res.redirect('/room');
                } else {
                    console.log("errro else")
                    error = 'Invalid email or password!';
                    res.render('auth', { title: "Chat Room - Login", error: error });
                }
            }
        }
    });
});
module.exports = router;