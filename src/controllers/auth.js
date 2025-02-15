const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const google = async (req, res) => {
    console.log('called google')
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  try {
    // Decode the Firebase token
    const decodedToken = jwt.decode(token);

    if (!decodedToken) {
      return res.status(400).json({ message: 'Invalid token.' });
    }

    const { email, email_verified, user_id, name, picture } = decodedToken;


    if (!email_verified) {
      return res.status(400).json({ success: false, error: "Email is not verified" });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        userId: user_id,
        email,
        userName: name,
        photoUrl: picture,
        emailVerified: email_verified
      });
    }

    // Generate JWT token
    const tokenPayload = {
      _id: user._id,
      userId: user.userId,
      email: user.email
    };

    const authToken = generateToken(tokenPayload);

    const respPayload = {
      success: true,
      message: 'Login Successful',
      token: authToken,
      user: {
        _id: user._id,
        userId: user.userId,
        email: user.email,
        userName: user.userName,
        photoUrl: user.photoUrl
      }
    };

    return res.status(200).json(respPayload);

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

module.exports = {
  google
};