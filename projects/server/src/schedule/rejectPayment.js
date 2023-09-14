const schedule = require('node-schedule');
const dayjs = require('dayjs');
const isToday = require('dayjs/plugin/isToday');
const db = require("../models");
dayjs.extend(isToday);

const isBusinessDay = (date) => {
    return date.day() > 0 && date.day() < 6;
}

const job = schedule.scheduleJob('*/15 * * * *', async () => {
   
    if (!isBusinessDay(dayjs())) {
        return;
    }

   
});
