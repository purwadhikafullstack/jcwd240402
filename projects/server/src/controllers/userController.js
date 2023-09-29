const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");
const crypto = require("crypto");
const Generate = require("../utils");
const Mailer = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const { default: axios } = require("axios");
const { getAllWarehouses } = require("../service/warehouse");
const qs = require("qs");
const { autoStockTransfer } = require("../utils");

module.exports = {
  /* AUTH */
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
        img_profile = "/photo-profile/imgprofiledefault.png",
        phone,
        by_form = true,
      } = req.body;

      if (password !== confirm_password) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Password and confirm password have to match",
        });
      }
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const isEmailExist = await db.User.findOne({ where: { email } });
      const isUsernameExist = await db.User.findOne({ where: { username } });
      const isPhoneExist = await db.User_detail.findOne({ where: { phone } });

      if (isEmailExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "Email already used",
        });
      }

      if (isUsernameExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "Username already used",
        });
      }

      if (isPhoneExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "Phone already used",
        });
      }

      const verifyToken =
        crypto.randomBytes(16).toString("hex") +
        Math.random() +
        "-" +
        new Date().getTime();

      const newUser = await db.User.create(
        {
          role_id,
          username,
          email,
          password: hashPassword,
          verify_token: verifyToken,
          is_verify,
          by_form,
        },
        { transaction }
      );

      await db.User_detail.create(
        {
          user_id: newUser.id,
          first_name,
          last_name,
          img_profile,
          phone,
        },
        { transaction }
      );

      const link = `${process.env.BASEPATH_FE_REACT}/verify/${newUser.verify_token}`;
      const message =
        "Welcome to WareHouse! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out.! Remember, you only have 20 minutes to verify your account";
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
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  registerUserByEmail: async (req, res) => {
    const {
      role_id = 3,
      email,
      password = "1234-Purwadhika",
      fullname,
      is_verify,
      phone,
      img_profile = "/photo-profile/imgprofiledefault.png",
      by_form = false,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const isEmailExist = await db.User.findOne({ where: { email } });
      const isPhoneExist = await db.User_detail.findOne({ where: { phone } });

      if (isEmailExist) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Email already taken",
        });
      }

      if (isPhoneExist) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Phone already taken",
        });
      }
      const first_name = fullname.split(" ")[0];
      const last_name = fullname.split(" ")[1];
      const newUsername = fullname.replace(" ", "_");

      const isUsernameExist = await db.User.findOne({
        where: { username: newUsername },
      });

      if (isUsernameExist) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Username already taken",
        });
      }

      const newUser = await db.User.create(
        {
          role_id,
          username: newUsername,
          email,
          password: hashPassword,
          is_verify,
          by_form,
        },
        { transaction }
      );

      await db.User_detail.create(
        {
          user_id: newUser.id,
          first_name,
          last_name,
          img_profile,
          phone,
        },
        { transaction }
      );

      const accessToken = Generate.token(
        {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role_id: newUser.role_id,
          is_verify: newUser.is_verify,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1h"
      );
      const refreshToken = Generate.token(
        {
          id: newUser.id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        "24h"
      );

      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "Register successful",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  updateVerifyByPassword: async (req, res) => {
    const { verify_token } = req.params;
    const { password } = req.body;

    const transaction = await db.sequelize.transaction();

    try {
      const isVerifyTokenExist = await db.User.findOne({
        where: { verify_token: verify_token },
      });

      if (!isVerifyTokenExist) {
        await transaction.rollback();
        return res.json({
          ok: false,
          message:
            "Your verify token already expired! Please, Login to resend verify request on your profile page",
        });
      }
      if (isVerifyTokenExist.is_verify) {
        await transaction.rollback();
        return res.status(400).send({
          ok: false,
          message: "User already verified",
        });
      }

      const match = await bcrypt.compare(password, isVerifyTokenExist.password);

      if (!match) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "Wrong password",
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
        message: "Verification successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happeneded",
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
          message: "User not found",
        });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({
          ok: false,
          message: "Wrong password",
        });
      }
      const accessToken = Generate.token(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role_id: user.role_id,
          is_verify: user.is_verify,
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
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  loginByEmail: async (req, res) => {
    const { email } = req.body;
    try {
      const isUserExist = await db.User.findOne({
        where: { email, by_form: false },
      });
      if (!isUserExist) {
        return res.status(403).json({
          ok: false,
          message: "User not found",
        });
      }
      const accessToken = Generate.token(
        {
          id: isUserExist.id,
          username: isUserExist.username,
          email: isUserExist.email,
          role_id: isUserExist.role_id,
          is_verify: isUserExist.is_verify,
        },
        process.env.ACCESS_TOKEN_SECRET,
        "1h"
      );
      const refreshToken = Generate.token(
        {
          id: isUserExist.id,
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
        message: "Something bad happened",
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

      if (!isRefreshTokenExist) {
        return res.status(401).json({
          ok: false,
          message: "Token unauthorized",
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
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  resendVerifyAccount: async (req, res) => {
    const userData = req.user;
    const { email } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const isVerified = await db.User.findOne({
        where: { email, id: userData.id },
      });
      if (!isVerified) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "Wrong email",
        });
      }
      if (isVerified.is_verify) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "User already verified",
        });
      }

      const verifyToken =
        crypto.randomBytes(16).toString("hex") +
        Math.random() +
        "-" +
        new Date().getTime();

      if (!isVerified.is_verify) {
        await db.User.update(
          {
            verify_token: verifyToken,
          },
          { where: { id: userData.id }, transaction }
        );

        const link = `${process.env.BASEPATH_FE_REACT}/verify/${verifyToken}`;
        const message =
          "Welcome to WareHouse! We're excited to have you with us. Explore our wide range of products and enjoy a seamless shopping experience. If you need any help, don't hesitate to reach out.!";
        const mailing = {
          recipient_email: email,
          link,
          subject: "VERIFY ACCOUNT",
          receiver: isVerified.username,
          message,
        };
        await transaction.commit();
        Mailer.sendEmail(mailing)
          .then((response) =>
            res.status(201).json({
              ok: true,
              message: `${response.message}, registration ${isVerified.username} successful `,
              verify_token: verifyToken,
            })
          )
          .catch((error) =>
            res
              .status(400)
              .json({ ok: false, message: error.message, error: error.message })
          );
      }
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
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
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "User not found",
        });
      }

      if (!isUserExist.by_form) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "This email registered by gmail. please login instead",
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
      const message = `You've requested a password reset for your account. You only have 10 minutes to change new password. Please use the following code to reset your password: <strong>${resetPasswordToken}</strong>`;
      const mailing = {
        recipient_email: email,
        link,
        subject: "RESET PASSWORD",
        receiver: isUserExist.username,
        message,
        buttonText: "Reset Password",
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
        message: "Something bad happened",
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

      if (!tokenVerification) {
        return res.status(400).json({
          ok: false,
          message: "Invalid token",
        });
      }

      const isResetPasswordTokenValid = await db.User.findOne({
        where: { reset_password_token: reset_password_token },
      });

      if (!isResetPasswordTokenValid) {
        return res.status(404).json({
          ok: false,
          message: "Reset password code not valid",
        });
      }

      if (new_password !== confirm_password)
        return res.status(400).json({
          ok: false,
          message: "Password and confirm password have to match",
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
        message: "Reset password successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message:
          "This reset password code is expired. You only have 10 minutes to use it",
        error: error.message,
      });
    }
  },

  userInformation: async (req, res) => {
    const userData = req.user;
    try {
      const user = await db.User.findOne({
        where: { id: userData.id },
        include: [
          {
            model: db.User_detail,
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            include: [
              {
                model: db.Address_user,
                attributes: {
                  exclude: ["createdAt", "updatedAt", "address_user_id"],
                },
              },
            ],
          },
        ],
        attributes: {
          exclude: [
            "verify_token",
            "password",
            "createdAt",
            "updatedAt",
            "reset_password_token",
          ],
        },
      });
      if (!user) {
        return res.status(401).json({
          ok: false,
          message: "User not found",
        });
      }
      res.json({ ok: true, result: user });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },

  /* PROFILING USER */

  updateUserInformation: async (req, res) => {
    const userData = req.user;
    const {
      username,

      first_name,
      last_name,
      phone,
      new_password,
      password,
      new_confirm_password,
    } = req.body;

    const image = req.file?.filename;

    const transaction = await db.sequelize.transaction();
    try {
      const user = await db.User.findOne({ where: { id: userData.id } });
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "User not found",
        });
      }

      if (username) {
        const isUsernameExist = await db.User.findOne({
          where: { username: username },
        });
        if (isUsernameExist) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Username already taken",
          });
        }

        await db.User.update(
          { username: username },
          { where: { id: user.id }, transaction }
        );

        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change username successful",
        });
      }

      if (first_name) {
        await db.User_detail.update(
          { first_name: first_name },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change first name successful",
        });
      }

      if (new_password && new_confirm_password) {
        if (new_password !== new_confirm_password) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Password and confirm password have to match",
          });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Wrong password",
          });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(new_password, salt);

        await db.User.update(
          { password: hashPassword },
          { where: { id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change password successful",
        });
      }

      if (last_name) {
        await db.User_detail.update(
          { last_name: last_name },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change last name successful",
        });
      }

      if (phone) {
        const isPhoneExist = await db.User_detail.findOne({
          where: { phone: phone },
        });

        if (isPhoneExist) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "Phone number already taken",
          });
        }

        await db.User_detail.update(
          { phone: phone },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change phone successful",
        });
      }

      if (image) {
        const userDetail = await db.User_detail.findOne({
          where: { user_id: user.id },
        });

        if (!userDetail) {
          await transaction.rollback();
          res.status(401).json({
            ok: false,
            message: "User data not found",
          });
        }

        const previousImageName = userDetail
          .getDataValue("img_profile")
          ?.split("/")[2];

        if (!previousImageName) {
          await db.User_detail.update(
            {
              img_profile: `/photo-profile/${image}`,
            },
            { where: { user_id: user.id }, transaction }
          );
        }

        if (previousImageName) {
          if (previousImageName === "imgprofiledefault.png") {
            await db.User_detail.update(
              {
                img_profile: `/photo-profile/${image}`,
              },
              { where: { user_id: user.id }, transaction }
            );
          }
          const imagePath = path.join(
            __dirname,
            "..",
            "..",
            "..",
            "server",
            "src",
            "public",
            "imgProfile",
            previousImageName
          );
          if (previousImageName !== "imgprofiledefault.png") {
            fs.unlinkSync(imagePath);
            await db.User_detail.update(
              {
                img_profile: `/photo-profile/${image}`,
              },
              { where: { user_id: user.id }, transaction }
            );
          }
          await db.User_detail.update(
            {
              img_profile: `/photo-profile/${image}`,
            },
            { where: { user_id: user.id }, transaction }
          );
        }
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "Change photo profile successful",
        });
      }
      return res.json({
        ok: false,
        message: "You did not update anything",
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        ok: false,
        message: "Something bad happened",
        error: error.message,
      });
    }
  },
};
