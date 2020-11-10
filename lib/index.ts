import puppeteer from 'puppeteer';
import day from 'dayjs';
import ms from 'ms';

import Deferred from './deferred';
import { Profile, Reasons } from './interfaces';

const DATE_FORMAT = 'YYYY-MM-DD';
const TIME_FORMAT = 'HH:mm';

const reasonsAddress = {
    work: '#checkbox-travail',
    buy: '#checkbox-achats',
    health: '#checkbox-sante',
    family: '#checkbox-famille',
    handicap: '#checkbox-handicap',
    sport: '#checkbox-sport_animaux',
    legal: '#checkbox-convocation',
    mission: '#checkbox-missions',
    child: '#checkbox-enfants'
}

export default async (profile: Profile, when: Date, reasons: Reasons[]): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        args: [
            '--lang=fr',
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
        headless: false,
    });
    const page = await browser.newPage();

    try {
        await page.setViewport({ width: 800, height: 600 });
        await page.goto('https://media.interieur.gouv.fr/deplacement-covid-19/', { waitUntil: 'networkidle2' });
        
        //profile
        await page.type('#field-firstname', profile.firstName);
        await page.type('#field-lastname', profile.lastName);
        await page.type('#field-birthday', day(profile.birthday).format('DDMMYYYY'));
        await page.type('#field-placeofbirth', profile.placeOfBirth);
        await page.type('#field-address', profile.address);
        await page.type('#field-city', profile.city);
        await page.type('#field-zipcode', profile.postalCode);
        // date
        await page.evaluate(
            (date, time) => {
                (document.getElementById('field-datesortie') as HTMLInputElement).value = date;
                (document.getElementById('field-heuresortie') as HTMLInputElement).value = time;
            },
            day(when).format(DATE_FORMAT),
            day(when).format(TIME_FORMAT)
        );
    
        for(const reason of reasons) {
            if (reason in reasonsAddress) {
                await page.click(reasonsAddress[reason]);
            } else {
                throw new Error(`${reason} is not a known reason.`)
            }
        }
    
        const data = new Deferred<Buffer>();
    
        const timeout = setTimeout(() => data.reject(new Error('Timed out')), ms('60 seconds'));
    
        page.on('console', (e) => {
            const text = e.text();
            if(text.startsWith('data:application/pdf;base64,')) {
                const buffer = Buffer.from(text.slice('data:application/pdf;base64,'.length), 'base64');
                clearTimeout(timeout);
                data.resolve(buffer);
            }
        })
    
        await page.evaluate(function () {
            // Hacky way to get the Blob content downloaded by the app since puppeteer/chromium does not seem to manage an event for this
            // Don't do this at home
            const previous = URL.createObjectURL;
            URL.createObjectURL = function(data) {
                const reader = new FileReader();
                reader.readAsDataURL(data); 
                reader.onloadend = function() {
                    const base64data = reader.result;                
                    console.log(base64data);
                }
                return previous.apply(URL, [data]);
            }
        });
    
        await page.click('#generate-btn');
    
        const buffer = await data.promise;
        return buffer;
    }
    finally {
        await page.close();
        await browser.close();
    }
};