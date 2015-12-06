
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
    console.log(req.body.email);
    console.log(req.body.password);
	couch.Users.findOneByView('_design/findOneByView/_view/findOneByView', req.body.email, function(err, user) {
        console.log(user.email);
        console.log(user.password);
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
            console.log("error if");
                //if (bcrypt.crypt().compareHashSync(req.body.password, user.password)) {
                    req.session.user = user;
                    res.redirect('/room');
                } else {
                    console.log("error else");
                    error = 'Invalid email or password!';
                    res.render('auth', { title: "Chat Room - Login", error: error });
                }
            }
        }
    });
});
module.exports = router;