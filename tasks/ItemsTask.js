module.exports = function(app) {
  var schedule = require('node-schedule');

  var ItemsTask = {
    getItems: function(){
      var taskSchedule = new schedule.RecurrenceRule();
      var rule = new schedule.RecurrenceRule();
      rule.dayOfWeek = [0,3];
      rule.hour = 18;
      rule.minute = 30;
      rule.second = 30;
      console.log('getItems site');
      taskSchedule.hour=18;
      taskSchedule.minute = 50;
      taskSchedule.second = 1;
      schedule.scheduleJob(rule,app.models.ChargerItems.deleteItems);
      schedule.scheduleJob(taskSchedule, app.models.ChargerItems.getItems);
    }
  };

  return ItemsTask;
}
