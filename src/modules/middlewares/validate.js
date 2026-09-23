const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false // يرجّع كل الأخطاء مش أول واحدة بس
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(err => err.message)
      });
    }
    next();
  };
};
export default validate;