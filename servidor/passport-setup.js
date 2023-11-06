const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "259650379862-n012h81tuq3dggb9dld7kmo2prtr4ole.apps.googleusercontent.com",
      //  clientID:"259650379862-gb7aapmqs4nrc3rh1gc11ioqlmtaj2gd.apps.googleusercontent.com", //la de despliegue
      clientSecret: "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",
      // clientSecret:"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", //la de despliegue
      callbackURL: "http://localhost:3000/google/callback",
      // callbackURL:"https://arqbase-gh-yw5dam37vq-ew.a.run.app/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
