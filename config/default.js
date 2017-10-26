module.exports = {
  port: 3000,
  session: {
    secret: 'myblog',
    key: 'myblog',
    maxAge: 2592000000
  },
  mysql: {
    host: 'node1.cszjo.com',
    user: 'root',
    password: 'root',
    port: 3306,
    database: 'blog'
	},
  pagecount: 5,
  indexPageBean: 5,
  mongodb: 'mongodb://localhost:27017/myblog'
};