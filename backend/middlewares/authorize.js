const jwt = require('jsonwebtoken');

function authorize(role) {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).send('Yetkisiz erişim');
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (role && decoded.role !== role) return res.status(403).send('Yetkisiz erişim');
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).send('Geçersiz token');
    }
  };
}

module.exports = authorize;
