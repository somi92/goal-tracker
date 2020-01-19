import sirv from 'sirv';
import express from 'express';
import compression from 'compression';
import * as sapper from '@sapper/server';
import passport from 'passport';
import { OAuth2Strategy } from 'passport-google-oauth';
import { json } from 'body-parser';
import session from 'express-session';
import sessionFileStore from 'session-file-store';

const {
  PORT,
  NODE_ENV,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APP_URL_ROOT,
  GOOGLE_SCOPE,
  SESSION_SECRET,
  ALLOWED_USER_EMAIL,
} = process.env;
const dev = NODE_ENV === 'development';

function getUserFromRequest(req) {
  if (req.session.passport) {
    const { user } = req.session.passport;
    const isAllowedUser =
      user.emails.map(e => e.value).indexOf(ALLOWED_USER_EMAIL) > -1;
    return isAllowedUser ? user : null;
  }
  return null;
}

const SessionFileStore = sessionFileStore(session);

passport.use(
  new OAuth2Strategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${APP_URL_ROOT}/auth/login/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      return cb(null, profile);
    },
  ),
);

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

const app = express();
app
  .use(passport.initialize())
  .use(json())
  .use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: new SessionFileStore({
        path: `.sessions`,
      }),
    }),
  )
  .get(
    '/auth/login',
    passport.authenticate('google', {
      scope: GOOGLE_SCOPE,
    }),
  )
  .get(
    '/auth/login/callback',
    passport.authenticate('google', { failureRedirect: '/auth/login' }),
    (req, res) => {
      if (!dev) res.redirect('/#auth_cb');
      else res.redirect('/');
    },
  )
  .get('/hello', (req, res) => {
    const isAuth = req.session.passport ? req.session.passport.user : null;
    if (!isAuth) {
      res.status(401).send('Unauthorized user');
    } else {
      res.json({ data: 'Hello World!' });
    }
  })
  .use(
    compression({ threshold: 0 }),
    sirv('static', { dev }),
    sapper.middleware({
      session: req => {
        const user = getUserFromRequest(req);
        return { user, appUrl: APP_URL_ROOT };
      },
    }),
  )
  .listen(PORT, err => {
    // eslint-disable-next-line no-console
    if (err) console.log('error', err);
  });
