#!/usr/bin/env python3
"""
Sarthua Bhu-Abhilekh - Portal Dev Server & Live Government API Proxy
Directly connected to AWS Lambda Origin (Zero local image dependencies).
"""

import http.server
import socketserver
import urllib.parse
import urllib.request
import ssl
import json
import os
import io

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
AWS_LAMBDA_ORIGIN = "https://2n7i1ta403.execute-api.ap-south-1.amazonaws.com"
SSL_CTX = ssl._create_unverified_context()

class SarthuaProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)

        # 1. Forward Government WMS requests directly to AWS Lambda
        if parsed.path in ('/api/bihar-wms', '/api/local-wms'):
            target_url = f"{AWS_LAMBDA_ORIGIN}/api/bihar-wms?{parsed.query}"
            try:
                req = urllib.request.Request(target_url, headers={'User-Agent': 'Sarthua-Frontend-Proxy/1.0'})
                with urllib.request.urlopen(req, context=SSL_CTX, timeout=10) as resp:
                    data = resp.read()
                    self.send_response(resp.status)
                    self.send_header('Content-Type', resp.headers.get('Content-Type', 'image/png'))
                    self.send_header('Content-Length', str(len(data)))
                    self.send_header('Cache-Control', 'public, max-age=3600')
                    self.end_headers()
                    self.wfile.write(data)
                    return
            except Exception as e:
                self.send_response(502)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'Lambda proxy error: {str(e)}'}).encode('utf-8'))
                return

        # 2. Forward Plot inspection requests directly to AWS Lambda
        if parsed.path in ('/api/bihar-plot', '/api/local-plot'):
            target_url = f"{AWS_LAMBDA_ORIGIN}/api/bihar-plot?{parsed.query}"
            try:
                req = urllib.request.Request(target_url, headers={'User-Agent': 'Sarthua-Frontend-Proxy/1.0'})
                with urllib.request.urlopen(req, context=SSL_CTX, timeout=5) as resp:
                    data = resp.read()
                    self.send_response(resp.status)
                    self.send_header('Content-Type', 'application/json; charset=utf-8')
                    self.send_header('Content-Length', str(len(data)))
                    self.end_headers()
                    self.wfile.write(data)
                    return
            except Exception as e:
                self.send_response(502)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'Lambda proxy error: {str(e)}'}).encode('utf-8'))
                return

        # 3. Clean URL routing for static pages (.html extension omission)
        clean_path = parsed.path.strip('/')
        if clean_path and not '.' in os.path.basename(clean_path):
            candidate_file = os.path.join(DIRECTORY, f"{clean_path}.html")
            if os.path.isfile(candidate_file):
                self.path = f"/{clean_path}.html"
                if parsed.query:
                    self.path += f"?{parsed.query}"

        super().do_GET()


if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    print(f"============================================================")
    print(f" Sarthua Bhu-Abhilekh - Live Government Web GIS Server")
    print(f" Mode: 100% Direct AWS Lambda Proxy (Zero Local Images)")
    print(f" Lambda Origin: {AWS_LAMBDA_ORIGIN}")
    print(f" URL: http://localhost:{PORT}/map-viewer")
    print(f"============================================================")
    with socketserver.TCPServer(("", PORT), SarthuaProxyHandler) as httpd:
        httpd.serve_forever()
