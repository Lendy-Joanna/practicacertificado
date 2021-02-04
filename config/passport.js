const Usuario = require('../modelo/usuario');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

module.exports = function(passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
            //Verifica usuario por email
            Usuario.findOne({ email: email })
                .then((user) => {
                    if (!user) {
                        return done(null, false, { message: 'Email no registrado' });
                    }
                    //Compara contraseñas
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: 'Contraseña Incorrecta' });
                        }
                    })
                })
                .catch((err) => { console.log(err) })
        })
    )
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    })
    passport.deserializeUser(function(id, done) {
        Usuario.findById(id, function(err, user) {
            done(err, user);
        })
    })
}