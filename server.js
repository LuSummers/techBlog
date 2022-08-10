const path = require('path');
const express = require('express');
// const routes = require('./controllers/api');
const sequelize = require('./config/connection');
 const homeroutes = require('./controllers/home-routes')
const userRoutes = require('./controllers/api/user-routes')
const postRoutes = require('./controllers/api/post-routes')
const commentRoutes = require('./controllers/api/comment-routes')
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));
const hbs = exphbs.create({});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
const apiroutes ={
  commentRoutes, userRoutes, postRoutes
}
// turn on routes
// app.use(routes);
app.use('/api/comment', apiroutes.commentRoutes);
app.use('/api/users', apiroutes.userRoutes);
app.use('/api/posts', apiroutes.postRoutes);
app.use('/', homeroutes);



// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'));
});