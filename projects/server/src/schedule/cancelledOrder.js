const schedule = require("node-schedule");
const dayjs = require("dayjs");
const db = require("../models");

const job = schedule.scheduleJob("*/15 * * * *", async () => {
  const t = await db.sequelize.transaction();
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
  } catch (error) {
    if (t && !t.finished) {
      await t.rollback();
    }
  }
});
