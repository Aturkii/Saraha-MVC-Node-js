import QRCode from 'qrcode';
import User from './../../../db/models/user/user.mode.js';
import Message from '../../../db/models/message/message.model.js';


export const index = async (req, res) => {
  res.render("index.ejs", { loggedIn: false });
};

export const register = async (req, res) => {
  if (!req.session.loggedIn) {
    const { error } = req.query;
    return res.render("register.ejs", { error, loggedIn: false });
  }
  return res.redirect("/messages");
};

export const login = async (req, res) => {
  if (!req.session.loggedIn) {
    return res.render("login.ejs", { error: req.query.error, loggedIn: false });
  }
  res.redirect("/messages");
};

export const user = async (req, res) => {
  const { id } = req.params;
  const link = `${req.protocol}://${req.headers.host}/user/${id}`;

  QRCode.toDataURL(link, (err, url) => {
    if (err) return res.status(500).send("Error generating QR code");

    User.findById(id).then(user => {
      if (!user) return res.status(404).send("User not found");

      res.render("user.ejs", {
        loggedIn: req.session.loggedIn,
        name: user.name,
        link,
        id,
        qrCodeUrl: url
      });
    });
  });
};

export const messages = async (req, res) => {
  if (req.session.loggedIn) {
    const messages = await Message.find({ user: req.session.userId });
    const link = `${req.protocol}://${req.headers.host}/user/${req.session.userId}`;

    QRCode.toDataURL(link, (err, url) => {
      if (err) return res.status(500).send("Error generating QR code");

      res.render("messages.ejs", {
        loggedIn: req.session.loggedIn,
        name: req.session.name,
        link,
        messages,
        qrCodeUrl: url
      });
    });
  } else {
    return res.redirect("/login");
  }
};

export const handleRegister = async (req, res) => {
  const { name, email, password, PasswordConfirmation } = req.body;

  if (await User.findOne({ email })) {
    return res.redirect("/register?error=User already exists");
  }

  if (!name || !email || !password) {
    return res.redirect("/register?error=All fields are required");
  }

  if (PasswordConfirmation !== password) {
    return res.redirect("/register?error=Passwords do not match");
  }

  const user = new User({ name, email, password });
  await user.save();
  return res.redirect("/login");
};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.redirect("/login?error=Email and password are required");
  }

  const user = await User.findOne({ email, password });

  if (!user) {
    return res.redirect("/login?error=Invalid email or password");
  }

  req.session.userId = user._id;
  req.session.name = user.name;
  req.session.loggedIn = true;
  return res.redirect("/messages");
};

export const logOut = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send("Error logging out");
    res.redirect("/");
  });
};
