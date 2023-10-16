const passport=require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
passport.serializeUser(function(user, done) {
 done(null, user);
});
passport.deserializeUser(function(user, done) {
 done(null, user);
});
passport.use(new GoogleStrategy({
 clientID: "259650379862-n012h81tuq3dggb9dld7kmo2prtr4ole.apps.googleusercontent.com",
 clientSecret: "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",
 callbackURL: "http://localhost:3000/google/callback"
},
function(accessToken, refreshToken, profile, done) {
return done(null, profile);
}
));