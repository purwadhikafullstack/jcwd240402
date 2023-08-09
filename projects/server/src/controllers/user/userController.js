const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const db = require("../../models");
const crypto = require("crypto");
const Generate = require("../../utils");
const Mailer = require("../../utils/mailer");
const { OAuth2Client } = require("google-auth-library");

const getUserDataGoogleAuth = async (access_token) => {
  const response = await fetch(
    `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`
  );

  const data = await response.json();
  console.log("data", data);
};

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
        is_verify = 0,
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

      const resetPasswordToken = Math.random(
        crypto.randomBytes(16).toString("hex") * 543241
      )
        .toString()
        .substring(2, 8);

      const newUser = await db.User.create(
        {
          role_id,
          username,
          email,
          password: hashPassword,
          verify_token: verifyToken,
          reset_password_token: resetPasswordToken,
          is_verify,
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
            registerToken,
          })
        )
        .catch((error) =>
          res.status(400).json({ ok: false, message: error.message })
        );
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happen",
      });
    }
  },

  registerProfile: async (req, res) => {
    const { verify_token } = req.params;
    const imageURL = req.file.filename;
    const data = JSON.parse(req.body.data);

    const transaction = await db.sequelize.transaction();
    try {
      await db.User.update(
        {
          is_verify: true,
        },
        {
          where: {
            verify_token,
          },
        },
        { transaction }
      );

      await db.User_detail.create(
        {
          user_id: userData.id,
          first_name: data.first_name,
          last_name: data.last_name,
          phone: data.phone,
          img_profile: `/photo-profile/${imageURL}`,
        },
        { transaction }
      );

      await transaction.commit();
      res.json({
        ok: true,
        message: "registration successful",
      });
    } catch (error) {
      await transaction.rollback();
      res.status(500).json({
        ok: false,
        message: "something bad happen",
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
        message: "something bad happen",
      });
    }
  },

  keepLogin: (req, res) => {
    res.json("keepLogin");
  },
  /* oauth google masih error */
  requestGoogleAuth: async (req, res) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Referrer-Policy", "no-referrer-when-downgrade");
    const redirectURL = "http://127.0.0.1:3000/oauth";

    const oAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      redirectURL
    );

    // Generate the url that will be used for the consent dialog.
    const authorizeUrl = oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: "https://www.googleapis.com/auth/userinfo.profile  openid ",
      prompt: "consent",
    });

    res.json({ url: authorizeUrl });
  },

  oAuthGoogleAuth: async (req, res) => {
    const code = req.query.code;

    console.log("codeeeee", code);
    try {
      const redirectURL = "http://127.0.0.1:3000/oauth";
      const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        redirectURL
      );
      const r = await oAuth2Client.getToken(code);
      console.log("rrrrrrrrrrrrrrrrrr", r);
      // Make sure to set the credentials on the OAuth2 client.
      await oAuth2Client.setCredentials(r.tokens);
      console.info("Tokens acquired.");
      const user = oAuth2Client.credentials;
      console.log("credentials", user);
      await getUserDataGoogleAuth(oAuth2Client.credentials.access_token);
      res.json({
        token: r.tokens.id_token,
      });
    } catch (err) {
      console.log("Error logging in with OAuth2 user", err);
    }

    res.redirect(303, "http://localhost:3000/");
  },

  verifyAccount: (req, res) => {
    res.json("verifyAccount");
  },

  resendVerifyAccount: (req, res) => {
    res.json("resendVerifyAccount");
  },

  forgotPassword: (req, res) => {
    res.json("forgotPassword");
  },

  resetPassword: (req, res) => {
    res.json("resetPassword");
  },

  closeAccount: (req, res) => {
    res.json("deleteAccount");
  },
};
