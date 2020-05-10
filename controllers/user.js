const User = require('../models/User');
const tokenHelper = require('../helpers/TokenHelper');

exports.signUp = async (req, res) => {
  const { email } = req.body;
  const { password: hash } = req.body;
  const { name } = req.body;

  try {
    const user = await User.findByEmail(email);

    if (user) {
      return res.status(400).json({
        error: true,
        errors: [{
          param: 'email',
          msg: 'User Already Exists',
        }],
        data: {},
      });
    }

    const userObj = {
      name,
      email,
      hash,
    };

    const newUser = new User(userObj);
    await newUser.save();

    return res.status(200).json({
      error: false,
      errors: [],
      data: 'User created',
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      data: {},
      msg: err.message,
    });
  }
};

exports.signIn = async (req, res) => {
  const { password } = req.body;
  const { email } = req.body;

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(400).json({
      error: true,
      errors: [{
        param: 'User',
        msg: 'Please SignUp',
      }],
      msg: 'User Not Signed Up',
      data: [],
    });
  }

  const isSamePassword = user.comparePassword(password);

  if (isSamePassword) {
    const token = tokenHelper.sign({
      name: user.name,
      email: user.email,
    });

    return res.status(200).json({
      error: false,
      errors: [],
      data: token,
    });
  }
  return res.status(401).json({
    error: true,
    errors: [{
      param: 'password',
      msg: 'Incorrect password',
    }],
    msg: 'Incorrect Password',
  });
};
