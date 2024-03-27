const { getUser } = require('../service/auth');

// we have this for authentication, we extract the uid and then load the user into req object 
async function restrictToLoggedinUserOnly(req, res, next) {
    const useruid = req.cookies?.uid;
    if(!useruid) {
        return res.redirect('/login');
    }
    const user = getUser(useruid);
    req.user = user;
    next();
}

// here we authorize the user by checking their roles 
// we make a closer that comes with roles and then we check into into another function
function restrictTo(roles) {
    return function (req, res, next) {
        if(!req.user) return res.redirect('/login');
        if(!roles.includes(req.user.role)) return res.end('Not Authorized !!');
        return next();
    }
}



module.exports =  {
    restrictToLoggedinUserOnly,
    restrictTo,
}