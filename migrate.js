const { readFileSync, writeFileSync, existsSync, unlinkSync } = require('fs');
const { join, resolve } = require('path');

const DB_PATH = resolve(join(module.path, './.profiles_db.json'));
const BASE_PATH = './_db.json';

let migrationRequired = false;
let mergeRequired = false;
if (existsSync(BASE_PATH)) {
    migrationRequired = true;
    if(existsSync(DB_PATH)) {
        mergeRequired = true;
    }
}
if(migrationRequired) {
    const originData = JSON.parse(readFileSync(BASE_PATH, { encoding: 'utf-8' }));
    const destData = mergeRequired ? JSON.parse(readFileSync(DB_PATH, { encoding: 'utf-8' })) : {};
    Object.keys(originData).forEach((name) => {
        if(!destData[name]) {
            destData[name] = originData[name];
        } else {
            destData[`${name}-merge`] = originData[name];
        }
    });
    writeFileSync(DB_PATH, JSON.stringify(destData), { encoding: 'utf-8' });
    unlinkSync(BASE_PATH);
}