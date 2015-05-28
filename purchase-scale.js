var x = require('casper').selectXPath;
casper.test.begin('Purchase Scalability Tester', 2, function(test) {
    casper.userAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)');

    casper.on('remote.message', function(msg) {
    	this.echo('[process ' + casper.cli.get("pid") + '] remote message: ' + msg);
	});

    casper.echo('[process ' + casper.cli.get("pid") + '] Starting request at: ' + new Date().toLocaleString());

    // Starting with the your-accounts page
    casper.start('https://www.amazon.com/gp/css/account/address/view.html');

    // Automatically redirected to sign-in page
    casper.waitForSelector("form[name=signIn] input[name='email']",
        function success() {
            this.sendKeys("input[name='email']", "<AMAZON USERNAME (EMAIL-ID)>");
            this.echo('[process ' + casper.cli.get("pid") + '] Filled up email-id');
        },
        function fail() {
            test.assertExists("form[name=signIn] input[name='email']");
        });

    // Logging into Amazon
    casper.waitForSelector("form[name=signIn] input[name='password']",
        function success() {
            this.sendKeys("input[name='password']", "<AMAZON PASSWORD>");
            this.echo('[process ' + casper.cli.get("pid") + '] Filled up password');
        },
        function fail() {
            test.assertExists("form[name=signIn] input[name='password']");
        });
    casper.waitForSelector("form[name=signIn] input[type=submit]",
        function success() {
        	this.echo('[process ' + casper.cli.get("pid") + '] Logging-in');
            this.click("form[name=signIn] input[type=submit]");
        },
        function fail() {
            test.assertExists("form[name=signIn] input[type=submit]");
        });

    // Turning ON 1-click for this browser
    casper.waitForSelector("form input[type=submit][value='Turn on']",
        function success() {
        	this.echo('[process ' + casper.cli.get("pid") + '] Turning On 1-click');
            this.click("form input[type=submit][value='Turn on']");
        },
        function fail() {
            test.assertExists("form input[type=submit][value='Turn on']");
        });
    casper.waitForSelector("form input[type=submit][value='Turn off']",
        function success() {
        	test.assertExists("form input[type=submit][value='Turn off']");
        	this.echo('[process ' + casper.cli.get("pid") + '] 1-Click is turned ON.');
        },
        function fail() {
            test.assertExists("form input[type=submit][value='Turn off']");
        });

    // Navigating to an ASIN's offerlisting page to test a specific offer, not necessarily the winning offer
    casper.thenOpen("http://www.amazon.com/gp/offer-listing/B0016OTD1G/", function() {
    	this.echo('[process ' + casper.cli.get("pid") + '] Opened OL page');
    });

    // This is only required if a specific offerlisting id needs to be used for testing, which is not
    // listed on the offer listing page.
    casper.waitForSelector("form[action='/gp/legacy-handle-buy-box.html/ref=olp_atc_new_1']",
        function success() {
            casper.evaluate(function(formSelector) {
                var form = document.getElementsByTagName('form')[2];
                for (var ele in form.children) {
                    var element = form.children[ele];
                    if (typeof element.name === "undefined") continue;

                    if (element.name.indexOf('offering') == 0) {
                    	console.log("Setting Custom OfferId");
                        element.name = '<Set the long offeringId>';
                    }

                    if (element.name.indexOf('merchant-id') == 0) {
                    	console.log("Setting Custom MerchantId");
                        element.value = '<Set the merchant id of the customer offeringId>';
                    }
                }
            }, "form[action='/gp/legacy-handle-buy-box.html/ref=olp_atc_new_1']");
        },
        function fail() {
            test.assertExists("form[action='/gp/legacy-handle-buy-box.html/ref=olp_atc_new_1']");
        });

    // All the processes need to wait on a specific minute to hit the buy-box at the same instant
	casper.then(function() {
		casper.echo('[process ' + casper.cli.get("pid") + '] Synchronizing purchase with all processes...');
		casper.waitFor(function check() {
		    return new Date().getMinutes() === <Absolute minute to wait until>;
		}, function then() {
		    casper.echo('[process ' + casper.cli.get("pid") + '] Clicking buy at: ' + new Date().toLocaleString());
		    this.click("form[action='/gp/legacy-handle-buy-box.html/ref=olp_atc_new_1'] input[type='submit']");
		}, function timeout() {
			casper.echo('[process ' + casper.cli.get("pid") + '] Timed-out!');
		}, 300000);
	});

    // If order number is present, the order succeeded
	casper.waitForSelector("h5",
		function success() {
			test.assertExists(x('//h5[contains(text(),"Order Number:")]'));
			casper.echo('[process ' + casper.cli.get("pid") + '] Successfully placed order!')
		},
		function fail() {
			test.assertExists(x('//h5[contains(text(),"Order Number:")]'), '[process ' + casper.cli.get("pid") + '] Failed placing order!');
		});

    // Take the screenshot of the final page before completing
    casper.run(function() {
        casper.capture("result" + casper.cli.get("pid") + ".png");
        test.done();
    });
});
