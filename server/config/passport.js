// server/config/passport.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import User from "../models/User.js";

export default function configurePassport(passport) {
  // Google Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.OAUTH_GOOGLE_CALLBACK,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error("No email in Google profile"), null);

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email,
              password: null,
              provider: "google",
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // GitHub Strategy  
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.OAUTH_GITHUB_CALLBACK,
        scope: ["user:email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              password: null,
              provider: "github",
            });
          }
          return done(null, user);
        } catch (err) {
          return done(err, null);
        }
      }
    )
  );

  // JWT Strategy
  
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findById(payload.id).select("-password");
          if (user) return done(null, user);
          return done(null, false);
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id).select("-password");
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}
