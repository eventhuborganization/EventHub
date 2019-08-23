exports.parseDateObject = (date) => {
    var res = {};
    date = JSON.parse(date)
    switch (date.operator) {
        case '<':
            res.$lt = new Date(date.value)
            break;
        case '>':
            res.$gt = new Date(date.value)
            break;
        case '<=':
            res.$lte = new Date(date.value)
            break;
        case '>=':
            res.$gte = new Date(date.value)
            break;
        case '=':
            res.$gte = new Date(date.value)
            res.$lte = new Date(date.value)
            break;
        default:
            if(!date.value){
                console.log('test');
                res = new Date(date.value)
            }
            break;
    }
    return res;
}