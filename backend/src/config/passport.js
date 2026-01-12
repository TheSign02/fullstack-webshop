import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

export const isGoogleOAuthConfigured = () => {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
};

const getGoogleCallbackUrl = () => {
  if (process.env.GOOGLE_CALLBACK_URL) return process.env.GOOGLE_CALLBACK_URL;

  const backendOrigin = process.env.BACKEND_ORIGIN || `http://localhost:${process.env.PORT || 5000}`;
  return `${backendOrigin}/api/auth/google/callback`;
};

export const configurePassport = () => {
  if (!isGoogleOAuthConfigured()) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn('[auth] Google OAuth not configured: missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET');
    }
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: getGoogleCallbackUrl(),
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile?.emails?.[0]?.value?.toLowerCase() || null;

          if (!email) {
            return done(new Error('Google account did not provide an email address'));
          }

          const googleId = profile.id;
          const displayName = profile.displayName || profile.name?.givenName || 'Google User';

          let user = await User.findOne({ $or: [{ googleId }, { email }] });

          if (!user) {
            user = await User.create({
              name: displayName,
              email,
              googleId,
              password: null,
            });
          } else {
            let changed = false;
            if (!user.googleId) {
              user.googleId = googleId;
              changed = true;
            }
            if (!user.name && displayName) {
              user.name = displayName;
              changed = true;
            }
            if (changed) {
              await user.save();
            }
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

export default passport;
