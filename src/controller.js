var request = require("superagent")

module.exports = function(bot, controller){
  var help = 'go to channel you want vote and direct mention me `start new vote "title" http://ticket.url` to start vote'

  controller.hears(['help'], ['direct_message','direct_mention'], function(bot, message){
    bot.reply(message, help);
  });

  controller.hears('hello',['direct_message','direct_mention'],function(bot,message) {
    bot.reply(message,'Hello yourself');
  });

  var summaryText = require('./summaryText.js');

  var votes = [];
  var start_channel = 'not set';
  var story = {
                name: "Add option for users to delete their account",
                url: 'https://waffle.io/AgileVentures/WebsiteOne/cards/5834ae24efa1290e00f495a7'
              };
  var instructions = 'Please DM me with: `vote 1` (Simple), `vote 2` (Medium) or `vote 3` (Hard) - Discussion in ticket or here as you prefer. :slightly_smiling_face:'
  var storyId

  function setStoryId(id){
    storyId = id
  }

  controller.hears('start new vote',['direct_message','direct_mention'],function(bot,message) {
    votes = [];
    start_channel = message.channel;
    match = message.text.match(/start new vote\s+"(.*)"\s+<?(http.*)>/)
    story.name = match[1]
    story.url = match[2];
    // request.post('localhost:3000/stories/')
    // .set('Content-Type', 'application/json')
    // .send({name: story.name, url: story.url, size: 0})
    // .end(function(err, res){
    //   storyId = JSON.parse(res.text)._id
    //   setStoryId(storyId)
    // })
    bot.reply(message,'<!channel> NEW ASYNC VOTE on <' + story.url + '|' + story.name + '> ' + instructions);
  });

  controller.hears('vote',['direct_message'],function(bot,message) {
    vote = message.text.match(/\d+/)[0]
    // request.post('localhost:3000/stories/' + storyId + "/votes")
    // .set('Content-Type', 'application/json')
    // .send({size: vote})
    // .end(function(err, res){
    // })
    votes.push({vote:vote, user:message.user});
    bot.reply(message,'I received your vote: ' + vote +  ' <@'+message.user+'>');
    bot.say({channel: start_channel, text: '<!here> ASYNC VOTE UPDATE '+ summaryText(votes)+ ' on <' + story.url + '|' + story.name + '> '});
  });

  controller.hears('result',['direct_message','direct_mention'],function(bot,message) {
    response = 'summary of voting: \n\n'
    votes.forEach(function(vote) {
       response += '<@' + vote.user + '> voted: '+ vote.vote + '\n';
    });
    bot.reply(message,response);
  });

  controller.on('team_joined',function(bot, message) {
      bot.reply(message, 'Welcome aboard!');
  });
};


