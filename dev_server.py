#!/usr/bin/env python3
"""
Sarthua Bhu-Abhilekh Portal - Option C Local Proxy & Dev Server
Serves static portal files and proxies plot click coordinates to Bihar Bhunaksha API in real-time.
"""

import http.server
import socketserver
import urllib.parse
import json
import requests
import time
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
WMS_CACHE_DIR = os.path.join(DIRECTORY, 'scratch', 'gov_maps', 'wms_cache')
PLOT_CACHE_FILE = os.path.join(DIRECTORY, 'scratch', 'gov_plots_cache.json')
os.makedirs(WMS_CACHE_DIR, exist_ok=True)

class BiharBhumiProxy:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Referer': 'https://bhunaksha.bihar.gov.in/10/indexmain.jsp'
        }
        self.last_init_time = 0
        self.cache = {}
        if os.path.isfile(PLOT_CACHE_FILE):
            try:
                with open(PLOT_CACHE_FILE, 'r', encoding='utf-8') as f:
                    self.cache = json.load(f)
                print(f"[Proxy] Loaded {len(self.cache)} cached plot records from disk.")
            except Exception as e:
                print(f"[Proxy] Cache load error: {e}")

    def save_cache_to_disk(self):
        try:
            with open(PLOT_CACHE_FILE, 'w', encoding='utf-8') as f:
                json.dump(self.cache, f, ensure_ascii=False)
        except Exception as e:
            pass

    def ensure_session(self):
        # Refresh session cookies every 15 minutes or if never initialized
        if time.time() - self.last_init_time > 900 or not self.session.cookies:
            try:
                print("[Proxy] Initializing Bihar Bhunaksha session...")
                r = self.session.get('https://bhunaksha.bihar.gov.in/10/indexmain.jsp', headers=self.headers, timeout=10)
                if r.status_code == 200:
                    self.last_init_time = time.time()
                    print(f"[Proxy] Session established! Cookies: {list(self.session.cookies.keys())}")
                else:
                    print(f"[Proxy] Warning: Session init returned status {r.status_code}")
            except Exception as e:
                print(f"[Proxy] Session init error: {e}")

    def get_levels_for(self, survey, sheet):
        # Sarthua Mauza: District 29, Sub-division 01, Circle 04, Mauza 0290
        # Survey: RS (code 07) or CS (code 06)
        sheet_int = int(sheet) if str(sheet).isdigit() else 1
        sheet_str = f"{sheet_int:02d}"
        survey_code = "07" if survey == 'RS' else "06"
        return f"29,01,04,0290,{survey},{survey_code},{sheet_str},"

    def get_gis_code_for(self, survey, sheet):
        sheet_int = int(sheet) if str(sheet).isdigit() else 1
        sheet_str = f"{sheet_int:02d}"
        prefix = "RS290104029021807" if survey == 'RS' else "CS290104029021806"
        return f"{prefix}{sheet_str}"

    def query_plot(self, x, y, survey='RS', sheet=1):
        fx = float(x)
        fy = float(y)
        sheet_int = int(sheet) if str(sheet).isdigit() else 1

        # Check 1: Exact coordinate cache key
        cache_key = f"{survey}_{sheet_int}_{round(fx)}_{round(fy)}"
        if cache_key in self.cache:
            return self.cache[cache_key]

        # Check 2: Bounding Box check against all known cached plots (<1ms)
        for cached in self.cache.values():
            if isinstance(cached, dict) and cached.get('has_data') == 'Y':
                if cached.get('survey') == survey and cached.get('sheet') == sheet_int:
                    if cached.get('xmin', 0) <= fx <= cached.get('xmax', 0) and cached.get('ymin', 0) <= fy <= cached.get('ymax', 0):
                        self.cache[cache_key] = cached
                        return cached

        self.ensure_session()
        levels = self.get_levels_for(survey, sheet)
        params = {
            'OP': '4',
            'state': '10',
            'levels': levels,
            'x': str(x),
            'y': str(y)
        }

        try:
            r = self.session.get('https://bhunaksha.bihar.gov.in/ScalarDatahandler', params=params, headers=self.headers, timeout=8)
            
            # If 401 or unauthorized, re-init and retry once
            if r.status_code in [401, 403]:
                print("[Proxy] Got 401/403, refreshing session and retrying...")
                self.last_init_time = 0
                self.ensure_session()
                r = self.session.get('https://bhunaksha.bihar.gov.in/ScalarDatahandler', params=params, headers=self.headers, timeout=8)

            if r.status_code == 200:
                data = r.json()
                if data.get('has_data') == 'Y' and data.get('plotNo') and str(data.get('plotNo')) != '-1':
                    res = {
                        'success': True,
                        'has_data': 'Y',
                        'plotNo': str(data.get('plotNo')).strip(),
                        'pniu': data.get('PNIU', ''),
                        'gis_code': self.get_gis_code_for(survey, sheet),
                        'survey': survey,
                        'sheet': sheet_int,
                        'xmin': float(data.get('xmin', 0)),
                        'ymin': float(data.get('ymin', 0)),
                        'xmax': float(data.get('xmax', 0)),
                        'ymax': float(data.get('ymax', 0)),
                        'id': data.get('ID', '')
                    }
                    self.cache[cache_key] = res
                    self.save_cache_to_disk()
                    return res
                else:
                    return {'success': True, 'has_data': 'N'}
            else:
                return {'success': False, 'status': r.status_code, 'error': 'Upstream server error'}
        except Exception as e:
            return {'success': False, 'error': str(e)}

proxy = BiharBhumiProxy()

class SarthuaHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        
        # Proxy Endpoint for Real-time Bihar Bhunaksha Clicks
        if parsed.path == '/api/bihar-plot':
            query_params = urllib.parse.parse_qs(parsed.query)
            x = query_params.get('x', [''])[0]
            y = query_params.get('y', [''])[0]
            survey = query_params.get('survey', ['RS'])[0].upper()
            sheet = query_params.get('sheet', ['1'])[0]

            if not x or not y:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': 'Missing x or y'}).encode('utf-8'))
                return

            result = proxy.query_plot(x, y, survey, sheet)
            
            body = json.dumps(result, ensure_ascii=False).encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'application/json; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Cache-Control', 'public, max-age=86400')
            self.end_headers()
            self.wfile.write(body)
            return

        # Serve Live Official Bihar Government Map Image
        if parsed.path == '/api/gov-map':
            query_params = urllib.parse.parse_qs(parsed.query)
            survey = query_params.get('survey', ['RS'])[0].upper()
            sheet = query_params.get('sheet', ['1'])[0]
            map_file = os.path.join(DIRECTORY, 'scratch', 'gov_maps', f"{survey}_sheet_{sheet}.png")
            if os.path.isfile(map_file):
                with open(map_file, 'rb') as f:
                    content = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'public, max-age=604800')
                self.end_headers()
                self.wfile.write(content)
                return
            else:
                self.send_response(404)
                self.end_headers()
                return

        # Dynamic Viewport WMS Proxy: Renders razor-sharp zoomed-in view of any extent
        if parsed.path == '/api/bihar-wms':
            query_params = urllib.parse.parse_qs(parsed.query)
            minx = query_params.get('minx', [''])[0]
            miny = query_params.get('miny', [''])[0]
            maxx = query_params.get('maxx', [''])[0]
            maxy = query_params.get('maxy', [''])[0]
            w = query_params.get('w', ['1024'])[0]
            h = query_params.get('h', ['1024'])[0]
            survey = query_params.get('survey', ['RS'])[0].upper()
            sheet = query_params.get('sheet', ['1'])[0]

            if not minx or not miny or not maxx or not maxy:
                self.send_response(400)
                self.end_headers()
                return

            # Quantize coordinates to 4m grid to maximize cache hits on slight drags
            try:
                q_minx = int(round(float(minx) / 4.0) * 4)
                q_miny = int(round(float(miny) / 4.0) * 4)
                q_maxx = int(round(float(maxx) / 4.0) * 4)
                q_maxy = int(round(float(maxy) / 4.0) * 4)
            except Exception:
                q_minx, q_miny, q_maxx, q_maxy = minx, miny, maxx, maxy

            cache_file = os.path.join(WMS_CACHE_DIR, f"wms_{survey}_{sheet}_{q_minx}_{q_miny}_{q_maxx}_{q_maxy}_{w}_{h}.png")
            if os.path.isfile(cache_file):
                with open(cache_file, 'rb') as f:
                    cached_img = f.read()
                self.send_response(200)
                self.send_header('Content-Type', 'image/png')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.send_header('Cache-Control', 'public, max-age=604800')
                self.end_headers()
                self.wfile.write(cached_img)
                return

            gis_code = proxy.get_gis_code_for(survey, sheet)
            proxy.ensure_session()

            p = {
                'SERVICE': 'WMS',
                'VERSION': '1.3.0',
                'REQUEST': 'GetMap',
                'FORMAT': 'image/png',
                'TRANSPARENT': 'true',
                'LAYERS': 'VILLAGE_MAP',
                'STYLES': 'VILLAGE_MAP',
                'CRS': 'EPSG:3857',
                'BBOX': f"{q_minx},{q_miny},{q_maxx},{q_maxy}",
                'WIDTH': str(w),
                'HEIGHT': str(h),
                'state': '10',
                'gis_code': gis_code,
                'overlay_codes': ''
            }

            try:
                r = proxy.session.get('https://bhunaksha.bihar.gov.in/WMS', params=p, headers=proxy.headers, timeout=15)
                if r.status_code == 200 and r.headers.get('Content-Type', '').startswith('image'):
                    try:
                        with open(cache_file, 'wb') as f:
                            f.write(r.content)
                    except Exception as ce:
                        print(f"[Proxy] Cache write error: {ce}")

                    self.send_response(200)
                    self.send_header('Content-Type', 'image/png')
                    self.send_header('Access-Control-Allow-Origin', '*')
                    self.send_header('Cache-Control', 'public, max-age=604800')
                    self.end_headers()
                    self.wfile.write(r.content)
                    return
            except Exception as e:
                print(f"[Proxy] WMS error: {e}")

            self.send_response(502)
            self.end_headers()
            return

        # Clean URL rewrite fallback for local testing (e.g. /bhu-naksha -> /bhu-naksha.html)
        clean_path = parsed.path.lstrip('/')
        if clean_path and not '.' in clean_path:
            candidate = os.path.join(DIRECTORY, clean_path + '.html')
            if os.path.isfile(candidate):
                self.path = '/' + clean_path + '.html'
                if parsed.query:
                    self.path += '?' + parsed.query

        return super().do_GET()

class ThreadedHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    print(f"=====================================================")
    print(f"  SARTHUA BHU-ABHILEKH PORTAL - OPTION C DEV PROXY  ")
    print(f"  URL: http://localhost:{PORT}/bhu-naksha            ")
    print(f"  Live Government API Proxy: Enabled (Multi-threaded)")
    print(f"=====================================================")
    httpd = ThreadedHTTPServer(("", PORT), SarthuaHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()

if __name__ == '__main__':
    run_server()
