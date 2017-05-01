var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack', {
    logging: false
});

var Page = db.define('page', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
    notEmpty: true
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false,
    isUrl: true,
    notEmpty: true,
    getterMethods   : {
      route: function()  { return '/wiki/' + this.urlTitle }
    },
  },
  content: {
    type: Sequelize.TEXT,
    allowNull: false,
    notEmpty: true
  },
  status: {
    type: Sequelize.ENUM('open', 'closed'),
    allowNull: true,
    defaultValue: null,
    isIn: [['open', 'closed']],
    notEmpty: true
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlphanumeric: true,
        notEmpty: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true,
        notEmpty: true
    }
});

module.exports = {
  db: db,
  Page: Page,
  User: User
};
