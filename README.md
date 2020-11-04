# attest-fr-covid

The library relies on the official web application https://media.interieur.gouv.fr/deplacement-covid-19/. It uses Puppetter under the hood to automatically fill the fields and generate an attestation. Multiple profiles can be added simplifying the automation after that.

## Installation

```bash
## Local installation for usage as lib
npm i attest-fr-covid
## Global installation for usage in cli
npm i -g attest-fr-covid
```

Valid reasons :

- work
- buy
- health
- family
- handicap
- sport
- legal
- mission
- child

## Code usage

```js
const getAttestationPdf = require('attest-fr-covid');

async function main() {
    const buffer = await getAttestationPdf(
        {
            firstName: 'Robert',
            lastName: 'Praïvhatheu',
            birthday: new Date('1984-12-10'),
            placeOfBirth: 'Brest',
            address: '54 rue de la victoire',
            city: 'Caen',
            postalCode: '14118'
        },
        new Date(),
        ['sport', 'child']
    );
    // do something with this buffer
}
main();
```

## CLI Usage

Generate attestations

```bash
## Add a profile
attest-fr-covid profile add -p eve -f Evelyn -l Droppers -bd 1984-10-31 -bp Paris -a '13 rue de la chance' -pc 35004 -t Rennes
## Delete profile
attest-fr-covid profile delete -p eve
## List profiles
attest-fr-covid profile ls
attest-fr-covid profile ls --json
attest-fr-covid profile ls --json --pretty
attest-fr-covid profile ls -o profiles.json # Can be used as a backup solution
## Generate an attestation
attest-fr-covid generate -p bob -d 2020-11-23T12:30 -r child family -o test.pdf # Multiple reasons can be separated by a space
attest-fr-covid generate -p alice -d 2020-11-23T16:15 -r health > test.pdf
## Version
attest-fr-covid -V
attest-fr-covid --version
## Help
attest-fr-covid help
attest-fr-covid profile help
attest-fr-covid profile help ls
attest-fr-covid profile help delete
attest-fr-covid profile help add
attest-fr-covid generate help
```