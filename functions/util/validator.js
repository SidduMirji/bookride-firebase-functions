
// Validate data
const isEmpty = (data) => {
    return (data.trim() === '' ? true : false)
}

exports.validateLoginData = (data) => {
    let errors = {};
    if (isEmpty(data.email)) {
        errors.email = 'Email must not be empty'
    } if (isEmpty(data.password)) {
        errors.password = 'Password must not be empty'
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}

exports.validateSignUpData = (data) => {
    let errors = {};
    if (isEmpty(data.email)) {
        errors.email = 'Email must not be empty'
    }
    if (isEmpty(data.password)) {
        errors.password = 'Password must not be empty'
    }
    if (isEmpty(data.handle)) {
        errors.handle = 'User id must not be empty'
    }

    if (data.password !== data.confirmPassword) {
        errors.confirmPassword = 'Password must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}

exports.validateNewRideData = (data) => {
    let errors = {};
    if (isEmpty(data.source)) {
        errors.source = 'Source must not be empty'
    }
    if (isEmpty(data.dest)) {
        errors.dest = 'Destination must not be empty'
    }
    if (isEmpty(data.scheduledDate)) {
        errors.scheduledDate = 'Scheduled Date id must not be empty'
    }

    if (isEmpty(data.scheduledTime)) {
        errors.scheduledTime = 'Scheduled Time id must not be empty'
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
    }

}
