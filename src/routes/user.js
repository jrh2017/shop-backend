import exception from 'class/exception';

import { request, summary, body, tags, middlewares, path, description } from 'swag';

let func = require('../sql/func');

const tag = tags(['User']);
const userSchema = {
  name: { type: 'string', required: true },
  password: { type: 'string', required: true },
};

const logTime = () => async (ctx, next) => {
  console.log(`start: ${new Date()}`);
  await next();
  console.log(`end: ${new Date()}`);
};


export default class UserRouter {
  @request('POST', '/user/register')
  @summary('register user')
  @description('example of api')
  @tag
  @middlewares([logTime()])
  @body(userSchema)
  static async register(ctx) {
    const { name } = ctx.validatedBody;
    const user = { name };
    ctx.body = { user };
  }

  @request('post', '/user/login')
  @summary('user login, password is 123456')
  @tag
  @body(userSchema)
  static async login(ctx) {
    const { name, password } = ctx.validatedBody;
    let sql = 'select * from user WHERE user_name = ? and password = ?';
    let arr = [name, password];
    await func.connPool(sql, arr).then(result => {
      if(!result.length) {
        ctx.body = {
          code: 0,
          msg: '用户不存在'
        }
        return
      }
      let user = {
        user_id: result[0].id,
        user_name: result[0].user_name,
        role: result[0].role,
      };
      ctx.body = {
        code: 1,
        data: user
      }
    }).catch(err => {
      console.log(err)
    });
  }

  @request('get', '/user')
  @summary('user list')
  @tag
  static async getAll(ctx) {
    const users = [{ name: 'foo' }, { name: 'bar' }];
    ctx.body = { users };
  }

  @request('get', '/user/{id}')
  @summary('get user by id')
  @tag
  @path({ id: { type: 'string', required: true } })
  static async getOne(ctx) {
    const { id } = ctx.validatedParams;
    console.log('id:', id);
    const user = { name: 'foo' };
    ctx.body = { user };
  }

  @request('DELETE', '/user/{id}')
  @summary('delete user by id')
  @tag
  @path({ id: { type: 'string', required: true } })
  static async deleteOne(ctx) {
    const { id } = ctx.validatedParams;
    console.log('id:', id);
    ctx.body = { msg: 'success' };
  }
}

