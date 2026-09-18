"""
Sarthua Bhu-Abhilekh Portal - Local Development Server with Streaming PDF Proxy
Bypasses Cloudflare Hotlink Protection for local testing by attaching 'Referer: https://gyanu.online/'
"""
import http.server
import socketserver
import urllib.request
import urllib.parse
import sys

PORT = 8089

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == '/pdf-proxy':
            query = urllib.parse.parse_qs(parsed.query)
            target_url = query.get('url', [None])[0]
            if not target_url:
                self.send_error(400, "Missing url query param")
                return

            try:
                # Forward Range header if present
                req = urllib.request.Request(target_url)
                req.add_header('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36')
                req.add_header('Referer', 'https://gyanu.online/')

                range_header = self.headers.get('Range')
                if range_header:
                    req.add_header('Range', range_header)

                with urllib.request.urlopen(req) as resp:
                    status_code = resp.getcode()
                    self.send_response(status_code)
                    
                    # Forward necessary headers
                    for header in ['Content-Type', 'Content-Range', 'Content-Length', 'Accept-Ranges']:
                        val = resp.headers.get(header)
                        if val:
                            self.send_header(header, val)
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Access-Control-Expose-Headers', 'Content-Range, Content-Length, Accept-Ranges')
                    self.end_headers()

                    # Stream data in 64KB chunks
                    while True:
                        chunk = resp.read(65536)
                        if not chunk:
                            break
                        self.wfile.write(chunk)
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                for header in ['Content-Range', 'Content-Length', 'Content-Type']:
                    val = e.headers.get(header)
                    if val:
                        self.send_header(header, val)
                self.end_headers()
                self.wfile.write(e.read())
            except Exception as e:
                self.send_error(500, str(e))
            return

        # Serve static files as usual
        return super().do_GET()

if __name__ == '__main__':
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        print(f"Server started at http://localhost:{PORT} with /pdf-proxy support")
        sys.stdout.flush()
        httpd.serve_forever()
