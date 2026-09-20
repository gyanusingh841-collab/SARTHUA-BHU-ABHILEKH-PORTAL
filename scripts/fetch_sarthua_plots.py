"""
Sarthua Bhu-Naksha Plot Data Harvester & Indexer
Fetches official plot geometry / ULPIN / bounding boxes from Bihar NIC Bhu-Naksha API
and populates the single offline JSON database (sarthua_plots_db.json).
"""

import json
import os
import time
import requests

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'sarthua_plots_db.json')
GIS_CODE = "RS29010402902180701"
API_URL = "https://bhunaksha.bihar.gov.in/ScalarDatahandler"

# Default Spatial Bounds for Mauza Sarthua (Thana 218)
BOUNDS = {
    "min_x": 263266.6945616582,
    "max_x": 265057.76700843644,
    "min_y": 2819926.909755693,
    "max_y": 2821898.30861775,
    "img_width": 8000,
    "img_height": 8805
}

def geo_to_pixel(gx, gy):
    """Converts EPSG:3857 (x, y) to Leaflet image pixel (lat, lng)."""
    norm_x = (gx - BOUNDS["min_x"]) / (BOUNDS["max_x"] - BOUNDS["min_x"])
    norm_y = (gy - BOUNDS["min_y"]) / (BOUNDS["max_y"] - BOUNDS["min_y"])
    
    lng = round(norm_x * BOUNDS["img_width"])
    lat = round(norm_y * BOUNDS["img_height"]) # Leaflet simple CRS
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
        "gis_code": GIS_CODE,
        "spatial_reference": BOUNDS,
        "plots": {}
    }

def save_db(db):
    with open(DB_PATH, 'w', encoding='utf-8') as f:
        json.dump(db, f, ensure_ascii=False, indent=2)
    print(f"[OK] Saved {len(db.get('plots', {}))} plot records to {DB_PATH}")

def fetch_plot_at(x, y, session_cookies=None, user_agent=None):
    """Fetch plot data for a given (X, Y) point from Bihar Bhunaksha."""
    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://bhunaksha.bihar.gov.in/10/indexmain.jsp",
        "User-Agent": user_agent or "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }
    
    params = {
        "OP": "4",
        "state": "10",
        "levels": "29,01,04,0290,RS,07,01,",
        "x": str(x),
        "y": str(y)
    }
    
    try:
        resp = requests.get(API_URL, params=params, headers=headers, cookies=session_cookies, timeout=10)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("has_data") == "Y" and data.get("plotNo"):
                return data
    except Exception as e:
        print(f"[ERR] ({x}, {y}): {e}")
    return None

def add_plot_record(db, raw_data):
    """Processes raw NIC scalar response and adds to database."""
    plot_no = str(raw_data.get("plotNo", "")).strip()
    if not plot_no or plot_no == "-1":
        return False
        
    xmin = float(raw_data.get("xmin", 0))
    ymin = float(raw_data.get("ymin", 0))
    xmax = float(raw_data.get("xmax", 0))
    ymax = float(raw_data.get("ymax", 0))
    
    cx = (xmin + xmax) / 2.0
    cy = (ymin + ymax) / 2.0
    pixel = geo_to_pixel(cx, cy)
    
    db["plots"][plot_no] = {
        "plot_no": plot_no,
        "pniu": raw_data.get("PNIU", ""),
        "gis_code": raw_data.get("gisCode", GIS_CODE),
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
    return True

if __name__ == "__main__":
    db = load_db()
    print(f"Current database contains {len(db.get('plots', {}))} plots.")
