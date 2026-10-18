const authorize = (...roles) => {
  return (req, res, next) => {

    console.log("ROLE FROM TOKEN:", req.user.role);
    console.log("ALLOWED ROLES:", roles);

    if (!roles.includes(req.user.role)) {
      console.log("ACCESS DENIED");

      return res.status(403).json({
        message: "Access Denied",
      });
    }

    console.log("ACCESS GRANTED");

    next();
  };
};

export default authorize;