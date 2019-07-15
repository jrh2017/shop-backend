import exception from 'class/exception';
import { request, summary, body, tags, middlewares, path, description } from 'swag';
import tools from 'utils/tools'

let func = require('../sql/func');
const tag = tags(['患者信息']);

const patientSchema = {
    idcard: { type: 'string', required: true }
};
const searchPatientSchema = {
    page_number: { type: 'number', required: true },
    page_size: { type: 'number', required: true }
};

const logTime = () => async (ctx, next) => {
    console.log(`start: ${new Date()}`);
    await next();
    console.log(`end: ${new Date()}`);
};

export default class PatientRouter {
    @request('POST', '/patient/addPatient')
    @summary('添加患者')
    @description('表单添加患者功能')
    @tag
    @middlewares([logTime()])
    @body(patientSchema)
    static async addPatient(ctx) {
        let params = ctx.validatedBody;
        if (!params.age) params.age = null
        if (!params.height) params.height = null
        if (!params.weight) params.weight = null
        if (!params.body_area) params.body_area = null
        let sql = 'INSERT INTO patient_basic_info (idcard, name, sex, age, height, weight, body_area, phone, bed_no, clinical_diagnosis, chemotherapy_history, allergy_history, physical_power, pleural_effussion, loose_stools, infection, renal_disease, hepatosis, radiation, other, other_desc, ugt1a1_28, ugt1a1_28_1_1, ugt1a1_28_1_28, ugt1a1_28_28_28, ugt1a1_6, ugt1a1_6_1_1, ugt1a1_6_1_6, ugt1a1_6_6_6, glucuronidase_blood, glucuronidase_blood_concentration, glucuronidase_shit, glucuronidase_shit_concentration, glucuronidase_undo, create_time) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
        let arr = [params.idcard, params.name, params.sex, params.age, params.height, params.weight, params.body_area, params.phone, params.bed_no, params.clinical_diagnosis, params.chemotherapy_history, params.allergy_history, params.physical_power, params.pleural_effussion, params.loose_stools, params.infection, params.renal_disease, params.hepatosis, params.radiation, params.other, params.other_desc, params.ugt1a1_28, params.ugt1a1_28_1_1, params.ugt1a1_28_1_28, params.ugt1a1_28_28_28, params.ugt1a1_6, params.ugt1a1_6_1_1, params.ugt1a1_6_1_6, params.ugt1a1_6_6_6, params.glucuronidase_blood, params.glucuronidase_blood_concentration, params.glucuronidase_shit, params.glucuronidase_shit_concentration, params.glucuronidase_undo, new Date()];
        await func.connPool(sql, arr).then(result => {
            ctx.body = { code: 1, data: '新增患者成功！' };
        }).catch(err => {
            ctx.body = { code: 0, data: '数据库连接异常！' };
        });
    }

    @request('POST', '/patient/searchPatients')
    @summary('按条件查找指定患者')
    @description('按条件查找指定患者')
    @tag
    @middlewares([logTime()])
    @body(searchPatientSchema)
    static async searchPatients(ctx) {
        let params = ctx.validatedBody;
        let sql = 'select sql_calc_found_rows * from patient_basic_info where state = 1 order by create_time desc limit ?, ?';
        let sql2 = 'SELECT FOUND_ROWS() as total'
        let arr = [(params.page_number - 1) * params.page_size, params.page_size]
        let users = []
        await func.connPool(sql, arr).then(result => {
            if (result.length) {
                result.map(function(n){
                    n.create_time = tools.dateFtt('yyyy-MM-dd hh:mm:ss', n.create_time)
                    users.push(n)
                })
            }
        }).catch(err => {
            ctx.body = { code: 0, data: '数据库连接异常！' };
        });
        await func.connPool(sql2, []).then(result => {
            ctx.body = { code: 1, data: users, total: result[0].total}
        }).catch(err => {
            ctx.body = { code: 0, data: '数据库连接异常！' };
        });
    }

    @request('POST', '/patient/editPatient')
    @summary('编辑患者')
    @description('表单编辑患者功能')
    @tag
    @middlewares([logTime()])
    @body(patientSchema)
    static async editPatient(ctx) {
        let params = ctx.validatedBody;
        if (!params.age) params.age = null
        if (!params.height) params.height = null
        if (!params.weight) params.weight = null
        if (!params.body_area) params.body_area = null
        let sql = 'update patient_basic_info set idcard = ?, name = ?, sex = ?, age = ?, height = ?, weight = ?, body_area = ?, phone = ?, bed_no = ?, clinical_diagnosis = ?, chemotherapy_history = ?, allergy_history = ?, physical_power = ?, pleural_effussion = ?, loose_stools = ?, infection = ?, renal_disease = ?, hepatosis = ?, radiation = ?, other = ?, other_desc = ?, ugt1a1_28 = ?, ugt1a1_28_1_1 = ?, ugt1a1_28_1_28 = ?, ugt1a1_28_28_28 = ?, ugt1a1_6 = ?, ugt1a1_6_1_1 = ?, ugt1a1_6_1_6 = ?, ugt1a1_6_6_6 = ?, glucuronidase_blood = ?, glucuronidase_blood_concentration = ?, glucuronidase_shit = ?, glucuronidase_shit_concentration = ?, glucuronidase_undo = ? where id =?';
        let arr = [params.idcard, params.name, params.sex, params.age, params.height, params.weight, params.body_area, params.phone, params.bed_no, params.clinical_diagnosis, params.chemotherapy_history, params.allergy_history, params.physical_power, params.pleural_effussion, params.loose_stools, params.infection, params.renal_disease, params.hepatosis, params.radiation, params.other, params.other_desc, params.ugt1a1_28, params.ugt1a1_28_1_1, params.ugt1a1_28_1_28, params.ugt1a1_28_28_28, params.ugt1a1_6, params.ugt1a1_6_1_1, params.ugt1a1_6_1_6, params.ugt1a1_6_6_6, params.glucuronidase_blood, params.glucuronidase_blood_concentration, params.glucuronidase_shit, params.glucuronidase_shit_concentration, params.glucuronidase_undo, params.id];
        await func.connPool(sql, arr).then(result => {
            ctx.body = { code: 1, data: '编辑患者成功！' };
        }).catch(err => {
            console.log('err', err)
            ctx.body = { code: 0, data: '数据库连接异常！' };
        });
    }

    @request('GET', '/patient/removePatient/{id}')
    @summary('删除患者')
    @description('删除患者功能')
    @tag
    @path({ id: { type: 'string', required: true } })
    static async removePatient(ctx) {
        const { id } = ctx.validatedParams;
        let sql = 'update patient_basic_info set state = 0 where id = ?';
        let arr = [id];
        await func.connPool(sql, arr).then(result => {
            ctx.body = { code: 1, data: '删除患者成功！' };
        }).catch(err => {
            console.log('err', err)
            ctx.body = { code: 0, data: '数据库连接异常！' };
        });
    }

    @request('GET', '/patient/patientDetail/{id}')
    @summary('获取患者的详情信息')
    @description('根据ID获取患者的详情信息')
    @tag
    @path({ id: { type: 'string', required: true } })
    static async patientDetail(ctx) {
        const { id } = ctx.validatedParams;
        let sql = 'select * from patient_basic_info where id = ?';
        let arr = [id];
        let patientInfo = null
        await func.connPool(sql, arr).then(result => {
            if (result.length) {
                patientInfo = result[0]
            }
            ctx.body = { code: 1, data: patientInfo };
        }).catch(err => {
            console.log('err', err)
            ctx.body = { code: 0, data: '数据库连接异常！' };
        });
    }
}