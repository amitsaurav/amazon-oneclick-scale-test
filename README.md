# amazon-oneclick-scale-test

I have used this script to test how does "buy with one click" perform when there are say 'x' items available in the inventory and 'y' (>>x) customers hit "buy with one click" at the same instant.

## Pre-requisites

This script needs nodejs, phantomjs and casperjs installed and accessible from command line. Please use the `install-all.sh` script to get setup.

## Usage

Open the file purchase-scale.js and set the amazon username and password to use when running this test. This account should have a valid payment instrument setup and a default shipping address already confidured.

    nodejs parallel.js

There is also a provision to set custom offeringId and merchantId in case the test should not use the offer listings open for public.
