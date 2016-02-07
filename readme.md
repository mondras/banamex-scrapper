Banamex scrapper
===========

I built this small command line utility that all it does it run a
[CasperJS](http://casperjs.org) script to automate extracting financial
statements for Banamex accounts.

## Installation

Before installing make sure you have the following requirements

  * **CasperJS 1.1**

To install just type:

```
npm install banamex-scapper
```

## Usage

1. Set the environment variables:
 * BANAMEX_NUMBER
 * BANAMEX_PASS

2. Just run

```
banamex-scrapper
```

This will return a JSON with the representation of the first account on your
Banamex account (Will implement iteration over all accounts later).

Sample output:
```
{
    "name": "Chq Perfil Ejc - MXN - 000000",
    "openingBalance": 100.50,
    "transactions": [
        {
            "credit": 672,
            "date": "04 feb 2016",
            "description": "D INT 0000001 Quincena AUT.31664"
        },
        {
            "credit": 360,
            "date": "03 feb 2016",
            "description": "0000000000000000 DEPOSITO EN VENTANILLA AUT.17"
        },
        {
            "date": "02 feb 2016",
            "debit": 19.64,
            "description": "0000000000060440 PAYPAL *SPOTIFY 35359 AUT.76"
        },
        {
            "date": "02 feb 2016",
            "debit": 85,
            "description": "P INT 0001 Pago Renta AUT.7"
        }
    ]
}
```

## TODO:
  * Properly parse dates.
  * Iterate over all accounts.
  * Support pagination (not sure if there's any).
