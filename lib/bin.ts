#!/usr/bin/env node
import getPdf from './';
import DBManager from './db';
import { Reasons } from "./interfaces";
import day from "dayjs";
import { writeFile } from 'fs';
import { promisify } from 'util';
import { Command } from 'commander';
import joi from 'joi';
const { version } = require('../package.json');

const writeFileP = promisify(writeFile);

const program = new Command();

program.version(version);

type GenerateCommand = { profile: string, date: Date, reasons: Reasons[], output?: string };

const generateCommandSchema = joi.object().keys({
    profile: joi.string().required(),
    date: joi.date().required(),
    reasons: joi.array().required().items(joi.string().allow(...Object.keys(Reasons))),
    output: joi.string().optional()
}).unknown(true);

program
    .command('generate')
    .description('Creates an attestation for the given configuration')
    .requiredOption('-p, --profile <profile>', 'The profile to use')
    .requiredOption('-d, --date <when>', 'The date for the attestation')
    .requiredOption('-r, --reasons <reasons...>', 'The reasons for the attestation')
    .option('-o, --output <file>', 'The file to write the output to, if not set, it will write to std')
    .action(async (args) => {
        const { value, error } = generateCommandSchema.validate(args) as { error: Error, value: GenerateCommand };
        if(error) {
            throw error;
        }
        await DBManager.load();
        const buffer = await getPdf(DBManager.get(value.profile), day(value.date).toDate(), value.reasons);
        if(value.output) {
            await writeFileP(value.output, buffer);
            return;
        }
        process.stdout.write(buffer);
    });

const profile = program.command('profile');

profile.command('ls')
    .description('list all the registered profiles')
    .option('-p, --pretty', 'display th JSON in a clean and readable way')
    .option('-o, --output <file>', 'The file to write the output to, if not set, it will write to std')
    .action(async (args) => {
        await DBManager.load();
        const data = Buffer.from(JSON.stringify(DBManager.list(), null, args.pretty ? 2 : 0));
        if(args.output) {
            await writeFileP(args.output, data);
            return;
        }
        process.stdout.write(data);
    });

profile.command('delete')
    .description('removes a profile')
    .requiredOption('-p, --profile <profile>', 'the profile to remove')
    .action(async (args) => {
        await DBManager.load();
        DBManager.remove(args.profile);
        await DBManager.save();
    });

type AddCommand = {
    profile: string;
    firstName: string;
    lastName: string;
    birthDay: Date;
    birthPlace: string;
    address: string;
    town: string;
    postalCode: string;
};

const addCommandSchema = joi.object().keys({
    profile: joi.string().required(),
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    birthDay: joi.date().required(),
    birthPlace: joi.string().required(),
    address: joi.string().required(),
    town: joi.string().required(),
    postalCode: joi.string().required()
}).unknown(true);

profile.command('add')
    .description('adds a profile')
    .requiredOption('-p, --profile <profile>', 'the profile name')
    .requiredOption('-f, --first-name <firstName>', 'The first name used in the attestation')
    .requiredOption('-l, --last-name <lastName>', 'The last name used in the attestation')
    .requiredOption('-bd, --birth-day <birthDay>', 'The birthday used in the attestation')
    .requiredOption('-bp, --birth-place <birthPlace>', 'The place of birth used in the attestation')
    .requiredOption('-a, --address <addr>', 'The street address used in the attestation')
    .requiredOption('-pc, --postal-code <postalCode>', 'The postal code used in the attestation')
    .requiredOption('-t, --town <town>', 'The town used in the attestation')
    .action(async (args) => {
        const { value, error } = addCommandSchema.validate(args) as { error: Error, value: AddCommand };
        if(error) {
            throw error;
        }
        await DBManager.load();
        DBManager.set(value.profile, {
            firstName: value.firstName,
            lastName: value.lastName,
            birthday: value.birthDay,
            placeOfBirth: value.birthPlace,
            address: value.address,
            city: value.town,
            postalCode: value.postalCode
        })
        await DBManager.save();
    });

program.parse(process.argv);