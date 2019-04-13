/*
 * Wrapper to allow for omission of try/catch blocks on async routes.
 * Will catch errors and pass them to error handler middlewares
 */
module.exports = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
