const validationMiddleware = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    const valid = error == null;
    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message);
      console.log("error", message);

      res.status(422).json({
        error: message,
      });
    }
  };
};

export default validationMiddleware;
