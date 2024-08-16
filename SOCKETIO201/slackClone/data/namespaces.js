const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

const wiki = new Namespace(0, 'wiki', 'https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/103px-Wikipedia-logo-v2.svg.png', '/wiki');
const moz = new Namespace(1, 'mozilla', 'https://www.mozilla.org/media/img/logos/firefox/logo-quantum.9c5e96634f92.png', '/mozilla');
const linux = new Namespace(2, 'linux', 'https://upload.wikimedia.org/wikipedia/commons/a/af/Tux.png', '/linux');

wiki.addRoom(new Room(0, 'New Articles', 0));
wiki.addRoom(new Room(1, 'Editors', 0));
wiki.addRoom(new Room(2, 'Other', 0));

moz.addRoom(new Room(0, 'Firefox', 1));
moz.addRoom(new Room(1, 'SeaMonkey', 1));
moz.addRoom(new Room(2, 'SpiderMonkey', 1));
moz.addRoom(new Room(3, 'Rust', 1));

linux.addRoom(new Room(0, 'Debian', 2));
linux.addRoom(new Room(1, 'Red Hat', 2));
linux.addRoom(new Room(2, 'Ubuntu', 2));

const namespaces = [wiki, moz, linux];

module.exports = namespaces;