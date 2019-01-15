import exception from 'class/exception';
import { request, summary, body, tags, middlewares, path, description } from 'swag';
import tools from 'utils/tools'

let func = require('../sql/func');
let md5 = require('md5');

const tag = tags(['用户信息']);
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
    @summary('用户注册')
    @description('shop系统用户注册简单功能')
    @tag
    @middlewares([logTime()])
    @body(userSchema)
    static async register(ctx) {
        const { name, password } = ctx.validatedBody;
        let sql = 'select * from user WHERE user_name = ?';
        let arr = [name];
        let user = null;
        await func.connPool(sql, arr).then(result => {
            if (result.length) {
                user = result
                ctx.body = { code: 0, msg: '用户已存在' }
            }
        }).catch(err => {
            console.log(err)
        });
        if(user && user.length) {
            return
        }
        let insertSql = 'INSERT INTO user(user_name, password, role, create_time, update_time) VALUES(?,?,?,?,?)';
        let insertArr = [name, md5(password), 1, new Date(), new Date()];
        await func.connPool(insertSql, insertArr).then(result => {
            ctx.body = { code: 1, data: '新增用户成功！' };
        }).catch(err => {
            console.log(err)
        });
    }

    @request('post', '/user/login')
    @summary('用户登陆')
    @tag
    @body(userSchema)
    static async login(ctx) {
        const { name, password } = ctx.validatedBody;
        let sql = 'select * from user WHERE user_name = ? and password = ?';
        let arr = [name, md5(password)];
        await func.connPool(sql, arr).then(result => {
            if (!result.length) {
                ctx.body = { code: 0, msg: '用户名或者密码错误' }
                return
            }
            let user = {
                user_id: result[0].id,
                user_name: result[0].user_name,
                role: result[0].role,
            };
            ctx.body = { code: 1, data: user}
        }).catch(err => {
            console.log(err)
        });
    }

    @request('get', '/user')
    @summary('查询所有用户')
    @tag
    static async getAll(ctx) {
        let sql = 'select * from user';
        let arr = []
        await func.connPool(sql, arr).then(result => {
            let users = []
            if (result.length) {
                result.map(function(n){
                    users.push({
                        user_id: n.id,
                        user_name: n.user_name,
                        role: n.role,
                        create_time: tools.dateFtt('yyyy-MM-dd hh:mm:ss', n.create_time),
                        update_time: tools.dateFtt('yyyy-MM-dd hh:mm:ss', n.update_time)
                    })
                })
            }
            ctx.body = { code: 1, data: users}
        }).catch(err => {
            console.log(err)
        });
    }

    @request('get', '/user/{id}')
    @summary('根据id查询指定用户')
    @tag
    @path({ id: { type: 'string', required: true } })
    static async getOne(ctx) {
        const { id } = ctx.validatedParams;
        let sql = 'select * from user WHERE id = ?';
        let arr = [id]
        await func.connPool(sql, arr).then(result => {
            let users = []
            if (result.length) {
                result.map(function(n){
                    users.push({
                        user_id: n.id,
                        user_name: n.user_name,
                        role: n.role,
                        create_time: tools.dateFtt('yyyy-MM-dd hh:mm:ss', n.create_time),
                        update_time: tools.dateFtt('yyyy-MM-dd hh:mm:ss', n.update_time)
                    })
                })
            }
            ctx.body = { code: 1, data: users}
        }).catch(err => {
            console.log(err)
        });
    }

    @request('delete', '/user/{id}')
    @summary('根据id删除指定用户')
    @tag
    @path({ id: { type: 'string', required: true } })
    static async deleteOne(ctx) {
        const { id } = ctx.validatedParams;
        let sql = 'delete from user WHERE id = ?';
        let arr = [id]
        await func.connPool(sql, arr).then(result => {
            if(result.affectedRows == 0) {
                ctx.body = { code: 0, data: '删除用户失败！'}
            }else{
                ctx.body = { code: 1, data: '删除用户成功！'}
            }
        }).catch(err => {
            console.log(err)
        });
    }
}
