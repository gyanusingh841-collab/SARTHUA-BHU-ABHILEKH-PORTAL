/**
 * Cloudflare Worker Proxy for Bihar Bhunaksha Live API (Option C)
 * Deploy this to Cloudflare Workers and route `/api/bihar-plot` to it.
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api/bihar-plot") {
      const x = url.searchParams.get("x");
      const y = url.searchParams.get("y");
      const survey = (url.searchParams.get("survey") || "RS").toUpperCase();
      const sheet = parseInt(url.searchParams.get("sheet") || "1", 10);

      if (!x || !y) {
        return new Response(JSON.stringify({ success: false, error: "Missing x or y" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Sarthua: Mauza 0290, Thana 218, Udwantnagar
      const sheetStr = sheet < 10 ? `0${sheet}` : `${sheet}`;
      const surveyCode = survey === "RS" ? "07" : "06";
      const levels = `29,01,04,0290,${survey},${surveyCode},${sheetStr},`;
      const gisCodePrefix = survey === "RS" ? "RS290104029021807" : "CS290104029021806";
      const gisCode = `${gisCodePrefix}${sheetStr}`;

      const bhunakshaUrl = `https://bhunaksha.bihar.gov.in/ScalarDatahandler?OP=4&state=10&levels=${encodeURIComponent(levels)}&x=${x}&y=${y}`;

      try {
        // Step 1: Query directly or maintain session cookie
        const res = await fetch(bhunakshaUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://bhunaksha.bihar.gov.in/10/indexmain.jsp",
            "Accept": "application/json, text/javascript, */*; q=0.01",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.has_data === "Y" && data.plotNo && data.plotNo !== "-1") {
            return new Response(JSON.stringify({
              success: true,
              has_data: "Y",
              plotNo: String(data.plotNo).trim(),
              pniu: data.PNIU || "",
              gis_code: gisCode,
              survey: survey,
              sheet: sheet,
              xmin: parseFloat(data.xmin || 0),
              ymin: parseFloat(data.ymin || 0),
              xmax: parseFloat(data.xmax || 0),
              ymax: parseFloat(data.ymax || 0),
              id: data.ID || "",
            }), {
              headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Cache-Control": "public, max-age=86400",
              },
            });
          }
          return new Response(JSON.stringify({ success: true, has_data: "N" }), {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          });
        }
        return new Response(JSON.stringify({ success: false, status: res.status }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ success: false, error: err.message }), {
          headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
        });
      }
    }

    if (url.pathname === "/api/bihar-wms") {
      const minx = url.searchParams.get("minx");
      const miny = url.searchParams.get("miny");
      const maxx = url.searchParams.get("maxx");
      const maxy = url.searchParams.get("maxy");
      const w = url.searchParams.get("w") || "1024";
      const h = url.searchParams.get("h") || "1024";
      const survey = (url.searchParams.get("survey") || "RS").toUpperCase();
      const sheet = parseInt(url.searchParams.get("sheet") || "1", 10);

      if (!minx || !miny || !maxx || !maxy) {
        return new Response("Missing bbox coordinates", { status: 400 });
      }

      const sheetStr = sheet < 10 ? `0${sheet}` : `${sheet}`;
      const gisCodePrefix = survey === "RS" ? "RS290104029021807" : "CS290104029021806";
      const gisCode = `${gisCodePrefix}${sheetStr}`;

      const wmsUrl = `https://bhunaksha.bihar.gov.in/WMS?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=VILLAGE_MAP&STYLES=VILLAGE_MAP&CRS=EPSG:3857&BBOX=${minx},${miny},${maxx},${maxy}&WIDTH=${w}&HEIGHT=${h}&state=10&gis_code=${gisCode}&overlay_codes=`;

      try {
        const res = await fetch(wmsUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://bhunaksha.bihar.gov.in/10/indexmain.jsp",
          },
          cf: {
            cacheTtl: 604800,
            cacheEverything: true,
          },
        });

        if (res.ok) {
          return new Response(res.body, {
            headers: {
              "Content-Type": "image/png",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=604800",
            },
          });
        }
        return new Response("Upstream error", { status: res.status });
      } catch (err) {
        return new Response(err.message, { status: 502 });
      }
    }

    // Base Official Government Map for full sheet view
    if (url.pathname === "/api/gov-map") {
      const survey = (url.searchParams.get("survey") || "RS").toUpperCase();
      const sheet = parseInt(url.searchParams.get("sheet") || "1", 10);
      const sheetStr = sheet < 10 ? `0${sheet}` : `${sheet}`;
      const gisCodePrefix = survey === "RS" ? "RS290104029021807" : "CS290104029021806";
      const gisCode = `${gisCodePrefix}${sheetStr}`;

      const sheetConfig = {
        "RS_1": { bbox: "263390.6,2820063.6,264930.8,2821762.7", w: 1800, h: 2000 },
        "RS_2": { bbox: "264078.7,2818653.2,264924.1,2820076.3", w: 1200, h: 2000 },
        "RS_3": { bbox: "264865.1,2818179.8,266722.1,2820112.9", w: 1900, h: 2000 },
        "RS_4": { bbox: "264851.9,2820046.3,266722.8,2821561.0", w: 2000, h: 1600 },
        "RS_5": { bbox: "266673.8,2818686.3,267407.1,2820430.7", w: 900,  h: 2000 },
        "RS_6": { bbox: "265639.6,2819677.5,266159.6,2820092.2", w: 2000, h: 1600 },
        "CS_0": { bbox: "263318.5,2818026.3,267319.2,2821676.6", w: 2000, h: 1800 },
        "CS_1": { bbox: "263320.4,2819963.0,264825.2,2821673.7", w: 1800, h: 2000 },
        "CS_2": { bbox: "263964.9,2818528.5,264797.0,2819980.7", w: 1200, h: 2000 },
        "CS_3": { bbox: "264770.3,2818035.4,266604.8,2819958.1", w: 1900, h: 2000 },
        "CS_4": { bbox: "264794.5,2819902.5,266612.0,2821450.8", w: 2000, h: 1700 },
        "CS_5": { bbox: "266584.1,2818505.2,267317.4,2820287.4", w: 900,  h: 2000 }
      };
      const cfg = sheetConfig[`${survey}_${sheet}`] || sheetConfig["RS_1"];
      const wmsUrl = `https://bhunaksha.bihar.gov.in/WMS?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=true&LAYERS=VILLAGE_MAP&STYLES=VILLAGE_MAP&CRS=EPSG:3857&BBOX=${cfg.bbox}&WIDTH=${cfg.w}&HEIGHT=${cfg.h}&state=10&gis_code=${gisCode}&overlay_codes=`;

      try {
        const res = await fetch(wmsUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Referer": "https://bhunaksha.bihar.gov.in/10/indexmain.jsp",
          },
          cf: {
            cacheTtl: 2592000,
            cacheEverything: true,
          },
        });

        if (res.ok) {
          return new Response(res.body, {
            headers: {
              "Content-Type": "image/png",
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=2592000, immutable",
            },
          });
        }
        return new Response("Upstream error", { status: res.status });
      } catch (err) {
        return new Response(err.message, { status: 502 });
      }
    }

    return new Response("Not Found", { status: 404 });
  },
};
