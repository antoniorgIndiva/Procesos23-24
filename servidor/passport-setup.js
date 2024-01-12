const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const GoogleOneTapStrategy = require("passport-google-one-tap").GoogleOneTapStrategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
passport.use(
  new GoogleStrategy(
    {
      //clientID:"259650379862-kc0j05v4s83djch10c8a382n5qa85761.apps.googleusercontent.com",
      clientID:"259650379862-gb7aapmqs4nrc3rh1gc11ioqlmtaj2gd.apps.googleusercontent.com", //la de despliegue
      //clientSecret: "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",
      clientSecret:"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", //la de despliegue
      //callbackURL: "http://localhost:3000/google/callback",
      callbackURL:"https://arqbase-gh-yw5dam37vq-ew.a.run.app/google/callback"
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);
passport.use(
  new GoogleOneTapStrategy(
    {
      clientID: "259650379862-oc05utci7tksinh74a2mqfphnu4pm8u1.apps.googleusercontent.com", //despliegue
      clientSecret: "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", //despliegue
      //clientID: "259650379862-kc0j05v4s83djch10c8a382n5qa85761.apps.googleusercontent.com", //local
      //clientSecret: "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", //local
      verifyCsrfToken: false, // whether to validate the csrf token or not
    },
    function (profile, done) {
      // Here your app code, for example:
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return done(null, profile);
      // });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      //clientID: "8996cd45b6ba2b3cb807",  //local
      //clientSecret: "4e75789ba446219311647b7d42dff4edd10c2491", //local
      //callbackURL: "http://localhost:3000/auth/github/callback", //local

      clientID: "4e56b6f02d8cd852f678",  //despliegue
      clientSecret: "e9fd893747bae1a1d28e281b0e6f9a3493bebfbd", //despliegue
      callbackURL: "https://arqbase-gh-yw5dam37vq-ew.a.run.app/auth/github/callback", //despliegue
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    }
  )
);