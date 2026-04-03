import http from 'http';
import { spawn } from 'child_process';

const nextDev = spawn('npm', ['run', 'dev', '--', '-p', '3009'], {
  stdio: ['ignore', 'pipe', 'pipe']
});

nextDev.stdout.on('data', (data) => console.log(`[Next] ${data.toString()}`));
nextDev.stderr.on('data', (data) => console.error(`[Next Error] ${data.toString()}`));

setTimeout(() => {
  console.log("Fetching http://localhost:3009/zh/dice-roller-dnd");
  http.get('http://localhost:3009/zh/dice-roller-dnd', (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      // console.log(data);
      nextDev.kill();
      process.exit(0);
    });
  }).on('error', (err) => {
    console.error(`Error fetching: ${err.message}`);
    nextDev.kill();
    process.exit(1);
  });
}, 5000);
