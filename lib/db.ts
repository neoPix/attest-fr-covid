import { Profile } from "./interfaces";
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';

const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);

const profiles = new Map<string, Profile>();
const DB_PATH = './_db.json';

type ProfileObject = { [key: string]: Profile };

export default class DBManager {
    public static get(identifier: string): Profile {
        const profile = profiles.get(identifier);
        if(!profile) {
            throw new Error('Profile does not exist');
        }
        return profile;
    }
    public static set(identifier: string, profile: Profile): void {
        profiles.set(identifier, profile);
    }
    public static remove(identifier: string) {
        this.get(identifier);
        profiles.delete(identifier);
    }
    public static list(): ProfileObject {
        return [...profiles.entries()].reduce<ProfileObject>((acc, [identifier, profile]) => {
            acc[identifier] = profile;
            return acc;
        }, {});
    }
    public static async load(): Promise<void> {
        const data: ProfileObject = JSON.parse(await readFileP(DB_PATH, 'utf8'));
        for(const [identifier, profile] of Object.entries(data)) {
            profiles.set(identifier, profile);
        }
    }
    public static async save(): Promise<void> {
        await writeFileP(DB_PATH, JSON.stringify(this.list()), 'utf8');
    }
};