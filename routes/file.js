/* @params: controller object, and router
** @returns the router, with the routes attached
*/
module.exports = ({ controllers: { file }, middlewares: { ensureUser }, router }) => {
  router

    .get('/files/:_id', file.getFile)
    .post('/files', ensureUser, file.postFiles)

  return router;
}
