const { ValidationError } = require('../utils/errors');

function validate(schemas) {
  return (req, res, next) => {
    try {
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }
      next();
    } catch (err) {
      if (err.errors) {
        const issues = err.errors.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message
        }));
        return next(new ValidationError('Invalid request parameters', issues));
      }
      next(err);
    }
  };
}

module.exports = validate;

