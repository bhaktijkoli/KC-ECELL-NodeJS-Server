var mdns = require('mdns');
var ad = mdns.createAdvertisement(mdns.tcp('http'), 3000, {name:'kcecell'});
ad.start();
