module.exports = function (app) {
  app.get('/', function (req, res) {
    res.redirect('/index');
    // res.render('backmanage');
  });
  app.get('/index', function (req, res) {
    var userInfo;
    if (req.session.user) {
      userInfo = req.session.user;
    }
    console.log('userInfo', userInfo);
    res.render('index', {
      userInfo: userInfo
    });
  });
  
  app.use('/main', require('./main'));
  app.use('/signup', require('./signup'));
  app.use('/signup/check', require('./signup'));
  app.use('/signin', require('./signin'));
  app.use('/signout', require('./signout'));
  app.use('/posts', require('./posts'));
  app.use('/person-blog', require('./person-blog'));
  app.use('/blog-create', require('./blog-create'));
  app.use('/blog-detail', require('./blog-detail'));
  app.use('/backmanage', require('./backmanage'));
  app.use('/usermanage', require('./usermanage'));
  app.use('/ueditor', require('./ueditor'));
  
};