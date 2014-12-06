/**
 * GET /go
 * Home page.
 */

exports.goPlay = function(req, res) {
  res.render('game/index', {});
};
