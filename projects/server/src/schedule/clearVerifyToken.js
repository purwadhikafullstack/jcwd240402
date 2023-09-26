const schedule = require("node-schedule");
const dayjs = require("dayjs");
const db = require("../models");
const { Op } = require("sequelize");

const job = schedule.scheduleJob("*/20 * * * * *", async () => {
  const transaction = await db.sequelize.transaction();
  try {
    const tokenValue = await db.User.findAll({
      where: { verify_token: { [Op.ne]: null } },
    });

    const currentTime = new Date();

    for (let i = 0; i < tokenValue.length; i++) {
      const token = tokenValue[i].verify_token;
      const newToken = token.split("-")[1];
      const dateFormatToken = new Date(Number(newToken));

      const timeDiffMinutes = (currentTime - dateFormatToken) / (1000 * 60);

      if (timeDiffMinutes >= 20) {
        await db.User.update(
          { verify_token: null },
          {
            where: { verify_token: token },
            transaction,
          }
        );
      }
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
  }
});
