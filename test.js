
let validateCredentials = (email, password) => {
    let errors = {};

    if (!email || email.length < 5) Object.assign(errors, {email: 'email too short'});
    if (!password || password.length < 5) Object.assign(errors, {password: 'password too short'});

    if (errors.hasOwnProperty('email') || errors.hasOwnProperty('password')) {
        return errors;
    } else {
        return null;
    }
};

let errors;
if((var errors = validateCredentials('aaasdfa','asdfasf'))){
    console.log('errors');
}