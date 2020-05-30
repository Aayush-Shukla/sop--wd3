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
    db.query("select author_id,content,name,created_at from post join users on post.author_id = users.id where author_id=(?) union select follower_id,content,name,created_at from followers join post on followers.follower_id=post.author_id join users on post.author_id = users.id where user_id=(?) ", [profileid,profileid], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }


        db.query("SELECT name FROM users WHERE id=(?)", [profileid], function (error, namese, fields) {
            if (error) {
                console.log(error, 'dbquery');
            }


            console.log(results)
            res.render('home', {data:{feed:results, name:namese[0].name}});
        })

    })


});






router.get('/register',checkNotAuthenticated(), function(req, res, next) {
  res.render('register', { title: 'Registration' });
});

router.get('/search',authenticationMiddleware(), function(req, res, next) {
  res.render('search', { title: 'Registration' });
});


router.get('/create',authenticationMiddleware(), function(req, res, next) {
  res.render('create');
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
                console.log(results)
            db.query("SELECT * FROM users WHERE id =(?) ", [authorid], function (error, userdetail, fields) {
                if (error) {
                    console.log(error, 'dbquery');
                }
                console.log(userdetail[0])

                res.render('profile', {data: {userblogs: results, info: profinfo[0],userinfo: userdetail[0]}})
            })
        })
    })




});
router.post('/create',authenticationMiddleware (), function(req, res, next) {



    blog=req.body.blog
    authorid=req.session.passport.user.user_id

    const db=require('../db.js')

        db.query("INSERT INTO post(author_id,content)VALUES(?,?)", [authorid, blog], function (error, results, fields) {
            if (error) {
                console.log(error,'dbquery');
            }
            console.log("success")
        })
        res.redirect('/')





});

router.get('/login',checkNotAuthenticated(), function(req, res, next) {
  res.render('login', { title: 'login' });
});




router.get('/user/:name', function(req, res, next) {


    profilevisit=req.params.name
    currentuser=req.session.passport.user.user_id

    const db=require('../db.js')
    db.query("SELECT id FROM users WHERE name =(?) ", [profilevisit], function (error, profileid, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        // console.log(profileid[0].id)
        db.query("SELECT (Select count(*) from post where author_id=(?))as postno, (SELECT count(*) from followings where user_id=(?))as followers,(SELECT count(*) from followers where user_id=(?))as followings,(select name from users where id=(?))as name", [profileid[0].id,profileid[0].id,profileid[0].id,profileid[0].id], function (error, profinfo, fields) {
            if (error) {
                console.log(error, 'dbquery');
            }
            db.query("SELECT content,created_at FROM post WHERE author_id =(?) ", [profileid[0].id], function (error, results, fields) {
                if (error) {
                    console.log(error, 'dbquery');
                }

                db.query("SELECT * from followers where user_id=(?) and follower_id=(?) ", [currentuser,profileid[0].id], function (error, followcheck, fields) {
                    if (error) {
                        console.log(error, 'dbquery');
                    }

                    console.log(followcheck.length==0,'cndn')
                    if(profileid[0].id==currentuser)
                    {
                        res.redirect('/profile')
                    }
                    else{
                    if (followcheck.length==0){
                        res.render('profile', {data: {userblogs: results, info: profinfo[0], id: profileid[0].id, alreaedyfollow:false}})

                    }
                    else {


                        res.render('profile', {data: {userblogs: results, info: profinfo[0], id: profileid[0].id, alreadyfollow:true}})
                    }}
                })
            })
        })
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





router.get('/unfollow/:id',authenticationMiddleware (), function(req, res, next) {

    const db=require('../db.js')
    userid=req.session.passport.user.user_id
    tofollow=req.params.id
    db.query("DELETE FROM followings WHERE following_id=(?) AND user_id=(?)", [userid,tofollow], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        console.log(results)
    })
    db.query("DELETE FROM followers WHERE follower_id=(?) AND user_id=(?)", [tofollow,userid], function (error, results, fields) {
        if (error) {
            console.log(error, 'dbquery');
        }
        console.log(results,'del')
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
    successRedirect:'/',
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








router.post('/search',authenticationMiddleware (), function(req, res, next) {



    search='%'+req.body.search+'%'


    const db=require('../db.js')

    db.query("SELECT name,id FROM users WHERE name LIKE (?)", [search], function (error, results, fields) {
        if (error) {
            console.log(error,'dbquery');
        }
        console.log(results)
        res.render('search',{search_res:results})


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
