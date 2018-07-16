var mdns = require('mdns');

var ad = mdns.createAdvertisement(mdns.tcp('http'), parseInt(process.env.SERVER_PORT), {name:'kcecell'});
ad.start();
