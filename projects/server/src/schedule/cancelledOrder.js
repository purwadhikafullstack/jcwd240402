const schedule = require("node-schedule");
const dayjs = require("dayjs");
const db = require("../models");

const job = schedule.scheduleJob("*/15 * * * *", async () => {
  try {
    const sevenDaysAgo = dayjs().subtract(7, "day").toDate();

    const unpaidOrders = await db.Order.findAll({
      where: {
        [db.Sequelize.Op.or]: [{ order_status_id: 1 }, { order_status_id: 7 }],
        createdAt: {
          [db.Sequelize.Op.lt]: sevenDaysAgo,
        },
      },
    });

    const t = await db.sequelize.transaction();

    for (let order of unpaidOrders) {
      await db.Order.update(
        { order_status_id: 5 },
        { where: { id: order.id } },
        { transaction: t }
      );

      await db.Reserved_stock.destroy({
        where: { order_id: order.id },
        transaction: t,
      });
    }

    await t.commit();
    console.log(`Cancelled ${unpaidOrders.length} unpaid orders older than 7 days`);
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
    console.error("Error in the scheduled job:", error);
  }
});

console.log("Scheduler initialized for cancelling unpaid orders");
