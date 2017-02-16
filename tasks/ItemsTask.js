module.exports = function(app) {
  var schedule = require('node-schedule');

  var ItemsTask = {
    getItems: function(){
      var taskSchedule = new schedule.RecurrenceRule();
      var rule = new schedule.RecurrenceRule();
      //rule.dayOfWeek = [0,3];
      rule.hour = 20;
      rule.minute = 5;
      rule.second = 30;
      console.log('getItems site');
      taskSchedule.hour=20;
      taskSchedule.minute = 10;
      taskSchedule.second = 1;
      schedule.scheduleJob(rule,app.models.ChargerItems.deleteItems);
      schedule.scheduleJob(taskSchedule, app.models.ChargerItems.getItems);
    }
  };

  return ItemsTask;
}