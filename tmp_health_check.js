const http = require('http');
const urls = [
  { name: 'ADMIN', url: 'http://localhost:3020/kinalSportsAdmin/v1/health' },
  { name: 'USER', url: 'http://localhost:3008/kinalSportsUser/v1/health' }
];
let pending = urls.length;
urls.forEach(({ name, url }) => {
  http.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => (data += chunk));
    res.on('end', () => {
      console.log(`${name}: ${data}`);
      if (--pending === 0) process.exit(0);
    });
  }).on('error', (err) => {
    console.error(`${name} FAIL: ${err.message}`);
    process.exit(1);
  });
});
