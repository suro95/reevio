/**
 * Created by aleksa on 1/31/16.
 */



function ValidateUserSession(req, res, next){
  /*  if(req.session.user){
        req.session.cookie.expires = false;
        next();
        return false;
    }*/
if (!('session' in req)){
//console.log('session is not set');

    res.redirect('/auth/login');
//return false;
  //  throw 'Session is not set!';

}else{

    if (req.session.user) {
        next();
    } else {
        // req.session.error = 'Access denied!';
        res.redirect('/auth/login');
    }
}

    }

module.exports=ValidateUserSession;



























