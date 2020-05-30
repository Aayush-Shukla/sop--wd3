var express = require('express');
var router = express.Router();
var passport=require('passport');

// expressValidator=require('express-validator');
const { check, validationResult } = require('express-validator');
var bcrypt=require('bcrypt');
const saltRounds=10;

/* GET home page. */


router.get('/',authenticationMiddleware (), function(req, res, next) {
    console.log(req.user,req.isAuthenticated())
    profileid=req.session.passport.user.user_id

    const db=require('../db.js')
    db.query("SELECT content,name FROM users INNER JOIN post ON users.id=post.author_id INNER JOIN followers ON (followers.user_id = users.id OR followers.follower_id=users.id) WHERE followers.user_id=(?) OR followers.follower_id=(?) ORDER BY created_at DESC", [profileid,profileid], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }


        db.query("SELECT name FROM users WHERE id=(?)", [profileid], function (error, namese, fields) {
            if (error) {
                console.log(error, 'dbquery');
            }



            res.render('home', {data:{feed:results, name:namese[0].name}});
        })

    })


});






router.get('/register',checkNotAuthenticated(), function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.get('/profile',authenticationMiddleware (), function(req, res, next) {
    authorid=req.session.passport.user.user_id

    const db=require('../db.js')
    db.query("SELECT * FROM post WHERE author_id =(?) ORDER BY created_at DESC", [authorid], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        db.query("SELECT (Select count(*) from post where author_id=(?))as postno, (SELECT count(*) from followings where user_id=(?))as followers,(SELECT count(*) from followers where user_id=(?))as followings,(select name from users where id=(?))as name", [authorid,authorid,authorid,authorid], function (error, profinfo, fields) {
            if (error) {
                console.log(error, 'dbquery');
            }
                console.log(profinfo)

        res.render('profile', {data:{userblogs: results,info:profinfo[0]}})
        })
    })




});
router.post('/profile',authenticationMiddleware (), function(req, res, next) {



    blog=req.body.blog
    authorid=req.session.passport.user.user_id

    const db=require('../db.js')

        db.query("INSERT INTO post(author_id,content)VALUES(?,?)", [authorid, blog], function (error, results, fields) {
            if (error) {
                console.log(error,'dbquery');
            }
            console.log("success")
        })
        db.query("SELECT * FROM post WHERE author_id =(?) ORDER BY created_at DESC", [authorid], function (error, results, fields) {
                    if (error) {
                        console.log(error,'dbquery');
                    }
            res.render('profile', { userblogs: results });


        })





});

router.get('/login',checkNotAuthenticated(), function(req, res, next) {
  res.render('login', { title: 'login' });
});
router.get('/user/:name', function(req, res, next) {

    const db=require('../db.js')
    profilevisit=req.params.name
    db.query("SELECT content FROM users u JOIN post p on u.id = p.author_id WHERE name= (?) ORDER BY created_at DESC", [profilevisit], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        console.log(results)
        res.render('profile', {userblogs: results});
    })


});



router.get('/follow/:id',authenticationMiddleware (), function(req, res, next) {

    const db=require('../db.js')
    userid=req.session.passport.user.user_id
    tofollow=req.params.id
    db.query("INSERT INTO followings(following_id,user_id)VALUES (?,?)", [userid,tofollow], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        console.log(results)
    })
        db.query("INSERT INTO followers(follower_id,user_id)VALUES(?,?)", [tofollow,userid], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        console.log(results)
    })

    db.query("SELECT name FROM users WHERE id=(?)", [tofollow], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        var redirect=results[0].name
        console.log(redirect)
        res.redirect(`/user/${redirect}`);

    })



});

router.post('/login', passport.authenticate(
    'local',{
    successRedirect:'/profile',
    failureRedirect:'/login',
    failureFlash : true
    }));

router.get('/logout', function(req, res, next) {
    req.logout();
    req.session.destroy();
    res.redirect('/login')
});










router.post('/register', check('username').not().isEmpty().withMessage('name cant be empty'),function(req, res, next) {

    exist=[]
    username=req.body.username
    email=req.body.email
    pword=req.body.password
    const db=require('../db.js')
    db.query("SELECT * FROM users WHERE name=(?) OR email =(?)",[username,email],function (error,existresult,fields){



        if (existresult.length!=0) {
            // return res.status(422).json({ errors: errors.array() });
            res.render('register', { title: 'Registration error' ,errors :'Username not available OR Email exists'});
        }
        else{

            bcrypt.hash(pword,saltRounds,function(err,hash) {
                db.query("INSERT INTO users(name,email,pass)VALUES(?,?,?)", [username, email, hash], function (error, results, fields) {
                    if (error) {
                        console.log(error,'dbquery');
                    }

                    db.query('SELECT LAST_INSERT_ID() as user_id',function(error,results,fields){
                        if(error) {
                            console.log(error)
                        }
                        console.log(results[0])
                        const user_id=results[0]
                        req.login(user_id,function(err){
                            res.redirect('/');

                        })
                    })



                })
            })
        }









    })






});
passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {

        done(null, user_id);

});
function authenticationMiddleware () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) return next();
        res.redirect('/login')
    }
}
 function checkNotAuthenticated () {
    return (req, res, next) => {
        console.log(`req.session.passport.user: ${JSON.stringify(req.session.passport)}`);

        if (req.isAuthenticated()) {
            res.redirect('/')
        }

        return next()
    }
}




module.exports = router;
