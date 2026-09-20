import os
import json
import time
import requests
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'sarthua_plots_db.json')
GIS_CODE = "RS29010402902180701"
API_URL = "https://bhunaksha.bihar.gov.in/ScalarDatahandler"

# Spatial bounds for Sarthua Mauza (Thana 218)
BOUNDS = {
    "min_x": 263266.6945616582,
    "max_x": 265057.76700843644,
    "min_y": 2819926.909755693,
    "max_y": 2821898.30861775,
    "img_width": 8000,
    "img_height": 8805
}

def geo_to_pixel(gx, gy):
    norm_x = (gx - BOUNDS["min_x"]) / (BOUNDS["max_x"] - BOUNDS["min_x"])
    norm_y = (gy - BOUNDS["min_y"]) / (BOUNDS["max_y"] - BOUNDS["min_y"])
    lng = round(norm_x * BOUNDS["img_width"])
    lat = round(norm_y * BOUNDS["img_height"])
    return [lat, lng]

def load_db():
    if os.path.exists(DB_PATH):
        with open(DB_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {
        "mauza": "सरथुआ",
        "thana_no": "218",
        "anchal": "उदवंतनगर",
        "district": "भोजपुर",
        "state": "बिहार",
        "survey_year": "1970 (रिविजनल सर्वे)",
        "gis_code": GIS_CODE,
        "spatial_reference": {
            "crs": "EPSG:3857 (Web Mercator)",
            **BOUNDS
        },
        "plots": {}
    }

db_lock = threading.Lock()

def save_db(db):
    with db_lock:
        with open(DB_PATH, 'w', encoding='utf-8') as f:
            json.dump(db, f, ensure_ascii=False, indent=2)

def main():
    db = load_db()
    existing_plots = db.get("plots", {})
    print(f"Starting with {len(existing_plots)} plots in db.", flush=True)

    # Get fresh session cookies
    init_session = requests.Session()
    init_session.headers.update({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://bhunaksha.bihar.gov.in/10/indexmain.jsp'
    })
    print("Connecting to Bhunaksha Bihar...", flush=True)
    try:
        init_session.get('https://bhunaksha.bihar.gov.in/10/indexmain.jsp', timeout=12)
    except Exception as e:
        print("Init session error:", e, flush=True)
        return

    cookies = init_session.cookies.get_dict()
    print("Cookies obtained:", list(cookies.keys()), flush=True)

    levels = "29,01,04,0290,RS,07,01,"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://bhunaksha.bihar.gov.in/10/indexmain.jsp'
    }

    # Generate grid coordinates focused on northern half where plots 1-100 reside
    # (Cadastral & Revisional surveys in Bihar number plots sequentially from North-West to South-East)
    step = 25
    points = []
    y_current = int(BOUNDS["max_y"]) - 10
    y_start = int(BOUNDS["min_y"]) + 500  # North to middle
    x_start = int(BOUNDS["min_x"]) + 10
    x_end = int(BOUNDS["max_x"]) - 10

    while y_current >= y_start:
        x_current = x_start
        while x_current <= x_end:
            points.append((x_current, y_current))
            x_current += step
        y_current -= step

    print(f"Total scan points: {len(points)}", flush=True)

    def query_pt(pt):
        x, y = pt
        params = {
            'OP': '4',
            'state': '10',
            'levels': levels,
            'x': f"{x:.2f}",
            'y': f"{y:.2f}"
        }
        try:
            r = requests.get(API_URL, params=params, headers=headers, cookies=cookies, timeout=5)
            if r.status_code == 200:
                data = r.json()
                if data.get("has_data") == "Y" and data.get("plotNo"):
                    return data
        except Exception:
            pass
        return None

    processed = 0
    new_found = 0

    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(query_pt, pt): pt for pt in points}
        for future in as_completed(futures):
            processed += 1
            res = future.result()
            if res:
                plot_no = str(res.get("plotNo", "")).strip()
                if plot_no and plot_no != "-1":
                    with db_lock:
                        if plot_no not in db["plots"]:
                            xmin = float(res.get("xmin", 0))
                            ymin = float(res.get("ymin", 0))
                            xmax = float(res.get("xmax", 0))
                            ymax = float(res.get("ymax", 0))
                            cx = (xmin + xmax) / 2.0
                            cy = (ymin + ymax) / 2.0
                            pixel = geo_to_pixel(cx, cy)

                            db["plots"][plot_no] = {
                                "plot_no": plot_no,
                                "pniu": res.get("PNIU", ""),
                                "gis_code": res.get("gisCode", GIS_CODE),
                                "bbox": {
                                    "xmin": round(xmin, 3),
                                    "ymin": round(ymin, 3),
                                    "xmax": round(xmax, 3),
                                    "ymax": round(ymax, 3)
                                },
                                "center": {
                                    "x": round(cx, 3),
                                    "y": round(cy, 3)
                                },
                                "pixel": pixel,
                                "lpm_url": f"https://bhunaksha.bihar.gov.in/10/plotReportPDF.jsp?state=10&giscode={GIS_CODE}&plotno={plot_no}"
                            }
                            new_found += 1
                            print(f"[+] Discovered Plot: {plot_no} | ULPIN: {res.get('PNIU')} | Total DB: {len(db['plots'])}", flush=True)

            if processed % 50 == 0:
                save_db(db)
                print(f"Progress: {processed}/{len(points)} queried... ({len(db['plots'])} plots stored)", flush=True)

    save_db(db)
    print(f"Finished! Total authentic plots saved in database: {len(db['plots'])}", flush=True)

if __name__ == "__main__":
    main()
