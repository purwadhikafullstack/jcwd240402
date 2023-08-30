const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../models");
const crypto = require("crypto");
const Generate = require("../utils");
const Mailer = require("../utils/mailer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

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
        img_profile = "photo-profile/imgprofiledefault.png",
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
      const isPhoneExist = await db.User_detail.findOne({ where: { phone } });

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

      if (isPhoneExist) {
        await transaction.rollback();
        return res.status(409).json({
          ok: false,
          message: "phone already used",
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
          img_profile,
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
      const message = `You've requested a password reset for your account. You only have 10 minutes to change new password. Please use the following code to reset your password: <strong>${resetPasswordToken}</strong>`;
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

      if (!tokenVerification) {
        return res.status(400).json({
          ok: false,
          message: "invalid token",
        });
      }

      const isResetPasswordTokenValid = await db.User.findOne({
        where: { reset_password_token: reset_password_token },
      });

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
          message: "user not found",
        });
      }
      res.json({ ok: true, result: user });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  /* PROFILING USER */

  updateUserInformation: async (req, res) => {
    const userData = req.user;
    let data;

    if (req.body.data) {
      data = JSON.parse(req.body.data);
    }

    const image = req.file?.filename;

    const transaction = await db.sequelize.transaction();
    try {
      const user = await db.User.findOne({ where: { id: userData.id } });
      if (!user) {
        return res.status(404).json({
          ok: false,
          message: "user not found",
        });
      }

      if (data?.username) {
        const isUsernameExist = await db.User.findOne({
          where: { username: data.username },
        });
        if (isUsernameExist) {
          return res.status(400).json({
            ok: false,
            message: "username already taken",
          });
        }

        await db.User.update(
          { username: data.username },
          { where: { id: user.id }, transaction }
        );

        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change username successful",
        });
      }

      if (data?.first_name) {
        await db.User_detail.update(
          { first_name: data.first_name },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change first name successful",
        });
      }

      if (data?.email) {
        const isEmailExist = await db.User.findOne({
          where: { email: data.email },
        });

        if (isEmailExist) {
          return res.status(400).json({
            ok: false,
            message: "email already taken",
          });
        }

        const verifyToken =
          crypto.randomBytes(16).toString("hex") +
          Math.random() +
          new Date().getTime();

        await db.User.update(
          { email: data.email, verify_token: verifyToken, is_verify: false },
          { where: { id: user.id }, transaction }
        );
        const link = `${process.env.BASEPATH_FE_REACT}/verify/${verifyToken}`;
        const message =
          "you've updated your email. Please verify the new email to ensure account security";
        const mailing = {
          recipient_email: data.email,
          link,
          subject: "EMAIL CHANGED",
          receiver: user.username,
          message,
        };
        await transaction.commit();
        Mailer.sendEmail(mailing)
          .then((response) =>
            res.status(201).json({
              ok: true,
              message: `${response.message}, change email successful ${user.username} successful `,
              verify_token: verifyToken,
            })
          )
          .catch((error) =>
            res
              .status(400)
              .json({ ok: false, message: error.message, error: error.message })
          );
        return;
      }

      if (data?.new_password && data?.new_confirm_password) {
        if (data.new_password !== data.new_confirm_password) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "password and confirm password have to match",
          });
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
          await transaction.rollback();
          return res.status(400).json({
            ok: false,
            message: "wrong password",
          });
        }

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(data.new_password, salt);

        await db.User.update(
          { password: hashPassword },
          { where: { id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change password successful",
        });
      }

      if (data?.last_name) {
        await db.User_detail.update(
          { last_name: data.last_name },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change last name successful",
        });
      }

      if (data?.phone) {
        const isPhoneExist = await db.User_detail.findOne({
          where: { phone: data?.phone },
        });

        if (isPhoneExist) {
          return res.status(400).json({
            ok: false,
            message: "phone number already taken",
          });
        }

        await db.User_detail.update(
          { phone: data.phone },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change phone successful",
        });
      }

      if (data?.address_user_id) {
        await db.User_detail.update(
          { address_user_id: data.address_user_id },
          { where: { user_id: user.id }, transaction }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change address successful",
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
            message: "user data not found",
          });
        }

        const previousImageName = userDetail
          .getDataValue("img_profile")
          ?.split("/")[1];

        if (!previousImageName) {
          await db.User_detail.update(
            {
              img_profile: `photo-profile/${image}`,
            },
            { where: { user_id: user.id }, transaction }
          );
        }

        if (previousImageName) {
          if (previousImageName === "imgprofiledefault.png") {
            await db.User_detail.update(
              {
                img_profile: `photo-profile/${image}`,
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
                img_profile: `photo-profile/${image}`,
              },
              { where: { user_id: user.id }, transaction }
            );
          }
          await db.User_detail.update(
            {
              img_profile: `photo-profile/${image}`,
            },
            { where: { user_id: user.id }, transaction }
          );
        }
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "change photo profile successful",
        });
      }
      return res.json({
        ok: false,
        message: "you did not update anything",
      });
    } catch (error) {
      await transaction.commit();
      return res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  /* PROFILING USER ADDRESS */
  userAddress: async (req, res) => {
    const userData = req.user;
    try {
      const userAddressData = await db.Address_user.findAll({
        where: { user_id: userData.id },
        include: { model: db.City },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      res.status(200).json({
        ok: true,
        result: userAddressData,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  registerAddress: async (req, res) => {
    const userData = req.user;
    const {
      city_id,
      user_id = userData.id,
      longitude,
      latitude,
      address_details,
      postal_code,
      address_title,
    } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const newAddress = await db.Address_user.create(
        {
          city_id,
          user_id,
          longitude,
          latitude,
          address_details,
          postal_code,
          address_title,
        },
        { transaction }
      );

      if (!newAddress) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "register address failed",
        });
      }
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "register address successful",
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

  changeAddress: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    let data;
    if (req.body.data) {
      data = JSON.parse(req.body.data);
    }
    const transaction = await db.sequelize.transaction();

    try {
      if (data.city_id) {
        await db.Address_user.update(
          {
            city_id: data.city_id,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      if (data.address_details) {
        await db.Address_user.update(
          {
            address_details: data.address_details,
            longitude: data.longitude,
            latitude: data.latitude,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      if (data.postal_code) {
        await db.Address_user.update(
          {
            postal_code: data.postal_code,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      if (data.address_title) {
        await db.Address_user.update(
          {
            address_title: data.address_title,
          },
          { where: { user_id: userData.id, id: address_id }, transaction }
        );
      }

      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "change address successful",
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

  changePrimaryAddress: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const isPrimary = await db.User_detail.findOne({
        where: { address_user_id: address_id },
      });

      if (isPrimary) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: "this address already primary",
        });
      }

      const isAddressExist = await db.Address_user.findOne({
        where: { id: address_id, user_id: userData.id },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });
      if (!isAddressExist) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "address not found",
        });
      }

      await db.User_detail.update(
        { address_user_id: address_id },
        {
          where: { user_id: userData.id },
          transaction,
        }
      );

      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "set primary address successful",
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

  deleteAddress: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    const transaction = await db.sequelize.transaction();

    try {
      const address = await db.Address_user.findOne({
        where: { id: address_id, user_id: userData.id },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      if (!address) {
        await transaction.rollback();
        return res.status(404).json({
          ok: false,
          message: "Address not found",
        });
      }

      const isPrimaryAddress = await db.User_detail.findOne({
        where: { user_id: userData.id, address_user_id: address_id },
      });

      if (isPrimaryAddress) {
        await db.User_detail.update(
          { address_user_id: null },
          {
            where: { user_id: userData.id, address_user_id: address_id },
            transaction,
          }
        );
      }

      await db.Address_user.destroy({
        where: { id: address_id, user_id: userData.id },
        transaction,
      });

      await transaction.commit();

      res.status(200).json({
        ok: true,
        message: "Delete address successful",
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

  getAddressById: async (req, res) => {
    const userData = req.user;
    const { address_id } = req.params;
    console.log(userData);
    try {
      const userAddressData = await db.Address_user.findOne({
        where: { user_id: userData.id, id: address_id },
        include: { model: db.City },
        attributes: {
          exclude: ["address_user_id", "createdAt", "updatedAt", "user_id"],
        },
      });

      if (!userAddressData) {
        return res.status(404).json({
          ok: false,
          message: "address not found",
        });
      }

      res.status(200).json({
        ok: true,
        result: userAddressData,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  regionUserForProvince: async (req, res) => {
    try {
      const result = await db.Province.findAll();

      res.json({
        ok: true,
        result: result,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  regionUserForCity: async (req, res) => {
    const { province_id } = req.query;

    try {
      let result;

      if (province_id) {
        const cityListInProvince = await db.City.findAll({
          where: { province_id },
        });
        result = cityListInProvince;
      } else {
        const allProvince = await db.Province.findAll();
        result = allProvince;
      }

      res.json({
        ok: true,
        result: result,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  /* CART */

  addToCart: async (req, res) => {
    const userData = req.user;
    const { product_name, qty } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const isUserVerify = await db.User.findOne({
        where: { id: userData.id },
      });

      if (!isUserVerify.is_verify) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "you have to verify your account",
        });
      }

      const productIdByName = await db.Product.findOne({
        where: { name: product_name },
      });

      if (!productIdByName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      const getWarehouseStockIdByProductName = await db.Warehouse_stock.findOne(
        {
          where: { product_id: productIdByName.id },
        }
      );

      if (!getWarehouseStockIdByProductName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "the product stock is not available ",
        });
      }

      const isCartExist = await db.Cart.findOne({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
      });

      if (isCartExist) {
        await db.Cart.update(
          {
            quantity: isCartExist.quantity + Number(qty),
          },
          {
            where: {
              user_id: userData.id,
              warehouse_stock_id: getWarehouseStockIdByProductName.id,
            },
            transaction,
          }
        );
        await transaction.commit();
        return res.status(201).json({
          ok: true,
          message: "cart updated",
        });
      }

      const limitMaxFive = await db.Cart.findAll({
        where: { user_id: userData.id },
      });

      if (limitMaxFive.length >= 5) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "you only can add 5 item to your cart",
        });
      }
      await db.Cart.create(
        {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
          quantity: Number(qty),
        },
        { transaction }
      );
      await transaction.commit();
      res.status(201).json({
        ok: true,
        message: "add to cart successful",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getUserCart: async (req, res) => {
    const userData = req.user;
    try {
      const result = await db.Cart.findAll({
        where: { user_id: userData.id },
        attributes: { exclude: ["createdAt", "updatedAt"] },
        include: [
          {
            model: db.Warehouse_stock,
            attributes: { exclude: ["createdAt", "updatedAt"] },
            include: [
              {
                model: db.Product,
                attributes: { exclude: ["createdAt", "updatedAt"] },
                include: [
                  {
                    model: db.Category,
                    as: "category",
                    attributes: {
                      exclude: ["createdAt", "updatedAt", "deletedAt"],
                    },
                  },
                  {
                    model: db.Image_product,
                    attributes: { exclude: ["updatedAt", "createdAt"] },
                  },
                ],
              },
            ],
          },
        ],
      });

      let total = 0;
      for (const item of result) {
        total +=
          Number(item.Warehouse_stock.Product.price) * Number(item.quantity);
      }

      res.json({
        ok: true,
        result,
        total: total,
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  cancelCart: async (req, res) => {
    const userData = req.user;
    const { productName } = req.params;
    const transaction = await db.sequelize.transaction();
    try {
      const productIdByName = await db.Product.findOne({
        where: { name: productName },
      });

      if (!productIdByName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      const getWarehouseStockIdByProductName = await db.Warehouse_stock.findOne(
        {
          where: { product_id: productIdByName.id },
        }
      );

      if (!getWarehouseStockIdByProductName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "the product stock is not available ",
        });
      }
      const isCartExist = await db.Cart.findOne({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
      });

      if (!isCartExist) {
        await transaction.rollback();
        return res.status(404).json({
          ok: true,
          message: "cart is empty",
        });
      }

      await db.Cart.destroy({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
        transaction,
      });
      await transaction.commit();
      res.status(200).json({
        ok: true,
        message: "cart deleted",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  updateCart: async (req, res) => {
    const userData = req.user;
    const { product_name, qty } = req.body;
    const transaction = await db.sequelize.transaction();
    try {
      const isUserVerify = await db.User.findOne({
        where: { id: userData.id },
      });

      if (!isUserVerify.is_verify) {
        await transaction.rollback();
        return res.status(401).json({
          ok: false,
          message: "you have to verify your account",
        });
      }

      const productIdByName = await db.Product.findOne({
        where: { name: product_name },
      });

      if (!productIdByName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "product not found",
        });
      }
      const getWarehouseStockIdByProductName = await db.Warehouse_stock.findOne(
        {
          where: { product_id: productIdByName.id },
        }
      );

      if (!getWarehouseStockIdByProductName) {
        await transaction.rollback();
        res.status(404).json({
          ok: false,
          message: "the product stock is not available ",
        });
      }

      const isCartExist = await db.Cart.findOne({
        where: {
          user_id: userData.id,
          warehouse_stock_id: getWarehouseStockIdByProductName.id,
        },
      });
      if (!isCartExist) {
        await db.Cart.create(
          {
            user_id: userData.id,
            warehouse_stock_id: getWarehouseStockIdByProductName.id,
            quantity: Number(qty),
          },
          { transaction }
        );
        await transaction.commit();
        res.status(201).json({
          ok: true,
          message: "add to cart successful",
        });
      }
      await db.Cart.update(
        {
          quantity: Number(qty),
        },
        {
          where: {
            user_id: userData.id,
            warehouse_stock_id: getWarehouseStockIdByProductName.id,
          },
          transaction,
        }
      );
      await transaction.commit();
      return res.status(201).json({
        ok: true,
        message: "cart updated",
      });
    } catch (error) {
      res.status(500).json({
        ok: false,
        message: "something bad happened",
        error: error.message,
      });
    }
  },

  getOrderList: async (req, res) => {
    const userId = req.user.id;
    try {
      const orderList = await db.Order.findAll({
        where : {user_id : userId}
      });

      res.json({
        ok: true,
        order: orderList,
      });
    } catch (error) {
      res.status(500).send({
        message: "An error occurred while fetching order list",
        error: error.message,
      });
    }
  },

};
