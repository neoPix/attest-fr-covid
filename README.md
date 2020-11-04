# attest-fr-covid

## Installation

```bash
## Local installation for usage as lib
npm i attest-fr-covid
## Global installation for usage in cli
npm i -g attest-fr-covid
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
attest-fr-covid profile ls -o profiles.json
## Generate an attestation
attest-fr-covid generate -p bob -d 2020-11-23T12:30 -r child -o test.pdf
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
