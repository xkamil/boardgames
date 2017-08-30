let enviroments = ['prod','test','dev'];
let env = process.argv[2];
let currentEnv;

if(enviroments.indexOf(env) == -1){
    currentEnv = 'test';
}else{
    currentEnv = env;
}

module.exports = require('./' + currentEnv + '.json');

