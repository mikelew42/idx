const { spawn } = require('child_process')
var child = spawn('node', ['--inspect-brk', 'test.js'], { stdio: 'inherit' })