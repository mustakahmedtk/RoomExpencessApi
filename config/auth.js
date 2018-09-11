const passport = require('passport');
const jwtStrategy = require('passport-jwt').Strategy;
const localStrategy = require('passport-local').Strategy;
const JWT = require('jsonwebtoken')
const { ExtractJwt } = require('passport-jwt')
const { JWT_SECRET } = require('../config/applicationSecret')
const User = require('../modals/user')
//jwt strategy
passport.use(new jwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET,
},
    async (payload, done) => {
        try {
            const user = await User.findById(payload.sub)
            if (!user) {
                return done(null, false);
            }
            done(null, user)

        } catch (error) {
            done(error, false)
        }
    }
))
//local strategy
passport.use(new localStrategy({
    usernameField: 'email'
},
    async (email, password, done) => {
        try {
            //find the user email
            const user = await User.findOne({ email })
            if (!user) {
                return done(null, false);
            }
            //check if password is match
            const isMatch = await user.isValidPassword(password)
            if (!isMatch) {
                return done(null, false);
            }
            done(null, user);
        } catch (error) {
            done(error, false);
        }

    }
))
module.exports.init = () => { return passport.initialize() };
module.exports.tokenAuthJwt = passport.authenticate('jwt', { session: false });
module.exports.tokenAuthLocal = passport.authenticate('local', { session: false });
module.exports.generateToken = {
    getToken: user => {
        return JWT.sign({
            iss: "roomExpencesApp",
            sub: user.id
        }, JWT_SECRET, { expiresIn: '1h' })
    }
}
