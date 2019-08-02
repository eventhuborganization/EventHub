exports.parseDateObject = (date) => {
    var date = {}
    var res;
    switch (date.operator) {
        case '<':
            res.$lt = date.value
            break;
        case '>':
            res.$gt = date.value
            break;
        case '<=':
            res.$lte = date.value
            break;
        case '>=':
            res.$gte = date.value
            break;
        case '=':
            res.$eq = date.value
            break;
        default:
            if(date.value)
                res = date.value
            else
                res = value
            break;
    }
    return res;
}