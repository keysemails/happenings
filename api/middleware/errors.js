const {
  FOREIGN_KEY_VIOLATION, UNIQUE_VIOLATION, NOT_NULL_VIOLATION
} = require('pg-error-constants');
/*
 * Error handler middlewares
 */

const errorLogger = (err, req, res, next) => {
  if ('stack' in err) {
    console.error(err.stack);
  } else {
    console.error(err);
  }
  next(err);
}

const pgErrorHandler = (err, req, res, next) => {
  if (err.code === FOREIGN_KEY_VIOLATION) {
    res.status(400).send({
      error: 'foreign key violation (related entity does not exist'
    })
  } else if (err.code === UNIQUE_VIOLATION) {
    res.status(400).send({
      error: 'unique violation (something with same value already exists)'
    })
  } else if (err.code === NOT_NULL_VIOLATION) {
    res.status(400).send({
      error: 'not null violation (missing some required field)'
    })
  } else {
    next(err)
  }
}


const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({error: 'Something went wrong on our end'})
  } else {
    next(err)
  }
}


const final500ErrorHandler = (err, req, res, next) => {
  res.status(500).send({error: err})
}


module.exports = {
  errorLogger,
  pgErrorHandler,
  clientErrorHandler,
  final500ErrorHandler
}

