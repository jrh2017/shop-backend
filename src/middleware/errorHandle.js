export default () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 400;
    ctx.body = { 
        code: 0,
        msg: error.toString() 
    };
  }
};
