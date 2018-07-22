const { to } = require('await-to-js');
import parseError from 'parse-error';

const _to = async (promise) => {
    let err, res;
    [err, res] = await to(promise);
    if (err)
        return [parseError(err)];
    return [null, res];
};
export { _to as to };

export function responseError(res, err, code){
    if(typeof err =='object' && typeof err.message != 'undefined') err = err.message
    if(typeof code != 'undefined') res.statusCode = code
    return res.json({
        success: false,
        msg: 'Error: '+err
    })
}

module.exports.responseSuccess = function(res, data, code){
    let send_data = {
        success: true
    }
    if(typeof code != 'undefined')
        res.statusCode = code;
    if(typeof data == 'object')
        send_data = Object.assign(send_data, data) // Merge objects
    return res.json(send_data)
}

module.exports.throwError = function(err, log){
    console.log(err)
    throw new Error(err)
}
