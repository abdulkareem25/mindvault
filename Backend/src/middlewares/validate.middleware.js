const validate = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], { abortEarly: false, stripUnknown: true });
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: error.details.map(d => ({ field: d.path.join('.'), message: d.message }))
    });
  }
  req[source] = value;
  next();
};

export default validate;