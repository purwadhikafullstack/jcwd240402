const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../../models");
const crypto = require("crypto");
const Generate = require("../../utils");
const Mailer = require("../../utils/mailer");
const jwt = require("jsonwebtoken");

module.exports = {
  registerUser: async (req, res) => {
    const transaction = await db.sequelize.transaction();
    try {
      const {
        role_id = 3,
        username,
        email,
        password,
        confirm_password,
        is_verify = false,
        first_name,
        last_name,
        phone,
      } = req.body;

      if (password !== confirm_password) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "password and confirm password have to match",
        });
      }
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const isEmailExist = await db.User.findOne({ where: { email } });
      const isUsernameExist = await db.User.findOne({ where: { username } });

      if (isEmailExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "email already used",
        });
      }

      if (isUsernameExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "username already used",
        });
      }

      const verifyToken =
        crypto.randomBytes(16).toString("hex") +
        Math.random() +
        new Date().getTime();

      const newUser = await db.User.create(
        {
          role_id,
          username,
          email,
          password: hashPassword,
          verify_token: verifyToken,
          is_verify,
        },
        { transaction }
      );

      await db.User_detail.create(
        {
          user_id: newUser.id,
          first_name,
          last_name,
          phone,
        },
        { transaction }
      );

      const link = `${process.env.BASEPATH_FE_REACT}/verify/${newUser.verify_token}`;
      const message =
        "Welcome to WareHouse! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out.!";
      const mailing = {
        recipient_email: email,
        link,
        subject: "VERIFY ACCOUNT",
        receiver: username,
        message,
      };
      await transaction.commit();
      Mailer.sendEmail(mailing)
        .then((response) =>
          res.status(201).json({
            ok: true,
            message: `${response.message}, registration ${newUser.username} successful `,
            verify_token: newUser.verify_token,
          })
        )
        .catch((error) =>
          res
            .status(400)
            .json({ ok: false, message: error.message, error: error.message })
        );
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  updateVerify: async (req, res) => {
    const { verify_token } = req.params;
    const transaction = await db.sequelize.transaction();
    console.log(verify_token);

    try {
      const isVerifyTokenExist = await db.User.findOne({
        where: { verify_token: verify_token },
      });

      if (!isVerifyTokenExist) {
        await transaction.rollback();
        return res.json({
          ok: false,
          message: "token invalid",
        });
      }
      if (isVerifyTokenExist.is_verify) {
        await transaction.rollback();
        return res.status(400).send({
          message: "user already verified",
        });
      }

      await db.User.update(
        {
          is_verify: true,
          verify_token: null,
        },
        {
          where: {
            verify_token: verify_token,
          },
          transaction,
        }
      );

      await transaction.commit();
      res.json({
        ok: true,
        message: "verification successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happeneded",
        error: error.message,
      });
    }
  },

  login: async (req, res) => {
    const { user_identification, password } = req.body;
    try {
      const user = await db.User.findOne({
        where: {
          [Op.or]: [
            { email: user_identification },
            { username: user_identification },
          ],
        },
      });
      if (!user) {
        return res.status(401).json({
          ok: false,
          message: "user not found",
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          ok: false,
          message: "wrong password",
        });
      }
      const accessToken = Generate.token(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role_id: user.role_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1h"
      );
      const refreshToken = Generate.token(
        {
          id: user.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        "24h"
      );
      res.json({
        ok: true,
        message: "Log in successful",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  keepLogin: async (req, res) => {
    const userData = req.user;
    try {
      const isRefreshTokenExist = await db.User.findOne({
        where: { id: userData.id },
      });
      console.log(isRefreshTokenExist);
      if (!isRefreshTokenExist) {
        return res.status(401).json({
          ok: false,
          message: "token unauthorized",
        });
      }
      const accessToken = Generate.token(
        {
          id: isRefreshTokenExist.id,
          username: isRefreshTokenExist.username,
          email: isRefreshTokenExist.email,
          role_id: isRefreshTokenExist.role_id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1h"
      );
      res.json({
        ok: true,
        message: "Access Token refreshed",
        accessToken,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  resendVerifyAccount: async (req, res) => {
    const { email } = req.body;
    try {
      const isVerified = await db.User.findOne({
        where: { email },
      });
      console.log(isVerified);
      if (!isVerified) {
        return res.status(404).json({
          ok: false,
          message: "user not found",
        });
      }
      if (isVerified.is_verify) {
        return res.status(400).json({
          ok: false,
          message: "user already verified",
        });
      }
      if (isVerified.verify_token && !isVerified.is_verify) {
        const link = `${process.env.BASEPATH_FE_REACT}/verify/${isVerified.verify_token}`;
        const message =
          "Welcome to WareHouse! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out.!";
        const mailing = {
          recipient_email: email,
          link,
          subject: "VERIFY ACCOUNT",
          receiver: isVerified.username,
          message,
        };
        Mailer.sendEmail(mailing)
          .then((response) =>
            res.status(201).json({
              ok: true,
              message: `${response.message}, registration ${isVerified.username} successful `,
              verify_token: isVerified.verify_token,
            })
          )
          .catch((error) =>
            res
              .status(400)
              .json({ ok: false, message: error.message, error: error.message })
          );
      }
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const isUserExist = await db.User.findOne({
        where: {
          email: email,
        },
      });

      if (!isUserExist) {
        return res.status(400).json({
          ok: false,
          message: "user not found",
        });
      }

      const resetPasswordToken = Math.random(
        crypto.randomBytes(16).toString("hex") * 543241
      )
        .toString()
        .substring(2, 8);

      await db.User.update(
        {
          reset_password_token: resetPasswordToken,
        },
        { where: { email }, transaction }
      );

      const resetToken = Generate.token(
        {
          id: isUserExist.id,
        },
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        "10m"
      );

      const link = `${process.env.BASEPATH_FE_REACT}/reset-password/${resetToken}`;
      const message = `You've requested a password reset for your account. You only have 10 minutes to change new password. Please use the following code to reset your password: ${resetPasswordToken}`;
      const mailing = {
        recipient_email: email,
        link,
        subject: "RESET PASSWORD",
        receiver: isUserExist.username,
        message,
      };
      await transaction.commit();
      Mailer.sendEmail(mailing)
        .then((response) =>
          res.status(201).json({
            ok: true,
            message: `${response.message}, registration ${isUserExist.username} successful `,
            reset_token: resetPasswordToken,
          })
        )
        .catch((error) =>
          res
            .status(400)
            .json({ ok: false, message: error.message, error: error.message })
        );
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  resetPassword: async (req, res) => {
    const { reset_password_token, new_password, confirm_password } = req.body;
    const { resetToken } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const tokenVerification = jwt.verify(
        resetToken,
        process.env.RESET_PASSWORD_TOKEN_SECRET
      );
      console.log("token result", tokenVerification);

      if (!tokenVerification) {
        return res.status(400).json({
          ok: false,
          message: "invalid token",
        });
      }

      const isResetPasswordTokenValid = await db.User.findOne({
        where: { reset_password_token: reset_password_token },
      });

      console.log("is reset token valid", isResetPasswordTokenValid);

      if (!isResetPasswordTokenValid) {
        return res.status(404).json({
          ok: false,
          message: "reset password code not valid",
        });
      }

      if (new_password !== confirm_password)
        return res.status(400).json({
          ok: false,
          message: "password and confirm password have to match",
        });
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(new_password, salt);

      await db.User.update(
        {
          password: hashPassword,
          reset_password_token: null,
        },
        { where: { id: tokenVerification.id }, transaction }
      );
      await transaction.commit();
      res.json({
        ok: true,
        message: "reset password successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  closeAccount: (req, res) => {
    res.json("deleteAccount");
  },
};
