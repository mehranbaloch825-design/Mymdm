const WebSocket = require('ws');
const http = require('http');

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Custom Turnstile Remote Control</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 20px; background: #eceff1; margin: 0; }
                .card { background: white; padding: 25px; border-radius: 12px; max-width: 400px; margin: 20px auto; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
                h2 { color: #37474f; margin-bottom: 5px; }
                p { color: #607d8b; font-size: 14px; }
                button { padding: 16px; font-size: 16px; font-weight: bold; border: none; border-radius: 8px; margin: 12px 0; width: 100%; cursor: pointer; transition: 0.2s; }
                .btn-reboot { background: #e53935; color: white; }
                .btn-reboot:active { background: #c62828; }
                .btn-open { background: #43a047; color: white; }
                .btn-open:active { background: #2e7d32; }
                .status { font-weight: bold; color: #1e88e5; margin-top: 15px; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Turnstile Control Panel</h2>
                <p>Custom Mobile Remote Administration</p>
                <hr style="border:0; border-top:1px solid #eee; margin:15px 0;"/>
                <button class="btn-reboot" onclick="sendCommand('reboot')">🔄 Restart Tablet Remotely</button>
                <button class="btn-open" onclick="sendCommand('trigger_gate')">🔓 Open Gate (Emergency)</button>
                <div class="status" id="status">Status: Connecting...</div>
            </div>

            <script>
                const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
                const ws = new WebSocket(protocol + '//' + location.host);
                
                ws.onopen = () => {
                    document.getElementById('status').innerText = 'Status: Connected to Server';
                    document.getElementById('status').style.color = '#43a047';
                    ws.send(JSON.stringify({ type: 'register_admin' }));
                };

                ws.onclose = () => {
                    document.getElementById('status').innerText = 'Status: Disconnected';
                    document.getElementById('status').style.color = '#e53935';
                };

                function sendCommand(action) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ws.send(JSON.stringify({ type: 'command', action: action }));
                        alert('Command Sent: ' + action);
                    } else {
                        alert('Server connection not ready!');
                    }
                }
            </script>
        </body>
        </html>
    `);
});

const wss = new WebSocket.Server({ server });
let tabletSocket = null;

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            if (data.type === 'register_tablet') {
                tabletSocket = ws;
                console.log('Tablet Device Connected!');
            }
            if (data.type === 'command' && tabletSocket) {
                tabletSocket.send(JSON.stringify(data));
            }
        } catch(e) {
            console.error('Invalid message format', e);
        }
    });

    ws.on('close', () => {
        if (ws === tabletSocket) {
            tabletSocket = null;
            console.log('Tablet Disconnected');
        }
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
