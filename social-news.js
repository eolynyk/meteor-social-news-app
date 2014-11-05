News = new Mongo.Collection("news");

Meteor.methods({
    addNews: function (title,url) {
        News.insert({
            title: title,
            url:url,
            urlTitle:title.replace(/\s/g,'-'),
            dateAdded:new Date()
        });
    }
});


if (Meteor.isClient) {

    Template.allNewsView.helpers({
        news: function () {
            return News.find({},{sort: {dateAdded: -1}});
        }
    });

    Template.addNews.events({
       'submit .addNewsForm':function(e){

           var title= e.target.title.value;

           var url= e.target.url.value;

           if(!title || !url){
               return false;
           }

           Meteor.call('addNews',title,url);

           Router.go('news.all');

           return false;
       }
    });
}

Router.route('/', function () {
    this.render('allNewsView');
},{
    name:'news.all'
});

Router.route('/news/add', function () {
    this.render('addNews');
},{
    name: 'news.add'
});

Router.route('/news/:title', function () {
    this.render('newsView', {
        data: function () {
            return News.findOne({urlTitle: this.params.title});
        }
    });
},{
    name: 'news.single'
});
