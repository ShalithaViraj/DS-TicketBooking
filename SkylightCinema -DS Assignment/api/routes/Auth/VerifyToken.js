const jwt = require("jsonwebtoken");
const ApiResult = require('../../models/Common/ApiResult');

const arrRouterPermission = [
  // Theater Routes
  {
    strbaseUrl: '/api/theater/getAllTheates',
    arrAuthorizedRoles: ['ADMIN', 'USER']
  },
  {
    strbaseUrl: '/api/theater/addTheater',
    arrAuthorizedRoles: ['ADMIN']
  },
  {
    strbaseUrl: '/api/theater/editTheater',
    arrAuthorizedRoles: ['ADMIN']
  },
  {
    strbaseUrl: '/api/theater/deleteTheater', 
    arrAuthorizedRoles: ['ADMIN']
  },
  // Movie Routes
  {
    strbaseUrl: '/api/movie/getAllMovies',
    arrAuthorizedRoles: []
  },
  {
    strbaseUrl: '/api/movie/addMovie',
    arrAuthorizedRoles: ['ADMIN']
  },
  {
    strbaseUrl: '/api/movie/editMovie',
    arrAuthorizedRoles: ['ADMIN']
  },
  {
    strbaseUrl: '/api/movie/deleteMovie',
    arrAuthorizedRoles: ['ADMIN']
  },
  // Cart Routes
  {
    strbaseUrl: '/api/cart/getCart',
    arrAuthorizedRoles: ['USER']
  },
  {
    strbaseUrl: '/api/cart/addCart',
    arrAuthorizedRoles: ['USER']
  },
  {
    strbaseUrl: '/api/cart/editCart',
    arrAuthorizedRoles: ['USER']
  },
  {
    strbaseUrl: '/api/cart/deleteCart',
    arrAuthorizedRoles: ['USER']
  },
  // Reservation Routes
  {
    strbaseUrl: '/api/reservation/addReservation',
    arrAuthorizedRoles: ['USER']
  },
  {
    strbaseUrl: '/api/reservation/cancelReservation',
    arrAuthorizedRoles: ['USER']
  },
  {
    strbaseUrl: '/api/reservation/getReservation',
    arrAuthorizedRoles: ['USER', 'ADMIN']
  }
]

module.exports = (req, res, next) => {
  // Get token from header
  const token = req.header("auth-token");
  // Check token is there. If not return 401 error
  if (!token) return res.status(401).send(new ApiResult(false, "Access Denied!"));

  try {
    // Verify token using jwt by passing token secret value
    const verifyToken = jwt.verify(token, process.env.APP_SECRET);
    req.objToken = verifyToken;

    // Check user has rights to perform this request
    const arrAuthorizedRoles = arrRouterPermission.filter((objReq) => objReq.strbaseUrl == req.originalUrl)[0]?.arrAuthorizedRoles;
    if(arrAuthorizedRoles && arrAuthorizedRoles.length > 0) {
      if(arrAuthorizedRoles.includes(verifyToken.strUserRole)) { next(); }
      else { return res.status(401).send(new ApiResult(false, "No Rights To Perform Request Task!")); } 
    } else {
      next();
    }

  } catch (err) {
    // Return 400 error if token is invalid
    res.status(400).send(new ApiResult(false, "Invalid Token!")); 
  }
};
