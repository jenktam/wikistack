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
    notEmpty: true
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
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.STRING), //holds an array of strings
    defaultValue: [],
    set: function(tags) {

      tags = tags || [];

      if(typeof tags === 'string') {
        tags = tags.split(',').map(function(str) {
          return str.trim();
        });
      }

      this.setDataValue('tags', tags);
    }
  }
},{
    getterMethods: {
      route: function()  {
        return '/wiki/' + this.urlTitle }
    },
    classMethods: {
      findByTag: function(tag) {
        return this.findAll({
          // $overlap matches a set of possibilities
          where: {
            tags: {
              $overlap: ['someTag', 'someOtherTag']
            }
          }
        })
      }
    },
    // used to navigate to similar pages
    instanceMethods: {
      findSimilar: function() {
        return Page.findAll({
          where: {
            id: {
              $ne: this.id
            },
            tags: {
              $overlap: this.tags
            }
          }
        });
      }
    }
  }
);

Page.hook('beforeValidate', function generateUrlTitle(page) {
  if (page.title) {
    // Removes all non-alphanumeric characters from title
    // And make whitespace underscore
    page.urlTitle = page.title.replace(/\s+/g, '_').replace(/\W/g, '');
  } else {
    // Generates random 5 letter string
    page.urlTitle = Math.random().toString(36).substring(2, 7);
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

Page.belongsTo(User, { as: 'author' });;

module.exports = {
  db: db,
  Page: Page,
  User: User
};
