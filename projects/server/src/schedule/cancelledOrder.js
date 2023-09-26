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

    for (let order of unpaidOrders) {
      const t = await db.sequelize.transaction();
      try {
        await db.Order.update(
          { order_status_id: 5 },
          { where: { id: order.id } },
          { transaction: t }
        );

        await db.Reserved_stock.destroy({
          where: { order_id: order.id },
          transaction: t,
        });

        await t.commit();
      } catch (error) {
        if (t && !t.finished) {
          await t.rollback();
        }
        console.error("Error processing order:", order.id, error);
      }
    }

    console.log(`Cancelled ${unpaidOrders.length} unpaid orders older than 7 days`);
  } catch (error) {
    console.error("Error in the scheduled job:", error);
  }
});

console.log("Scheduler initialized for cancelling unpaid orders");
