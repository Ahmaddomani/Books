const asyncErrorHandler = (asyncFunc) => {
  return (req, res, next) => {
    asyncFunc(req, res, next).catch((err) => next(err));
  };
};

export default asyncErrorHandler;
