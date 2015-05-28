var exec = require("child_process").exec;

// I use --no-colors because I redirect all output from this script to a file
for (var i=0; i<50; i++) {
    var process = exec('casperjs test purchase-scale.js --pid=' + i + ' --no-colors');
    process.stdout.on('data', function(data){
        console.log(data);
    });
}
