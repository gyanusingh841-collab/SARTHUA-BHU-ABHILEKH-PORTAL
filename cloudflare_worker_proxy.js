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

    return new Response("Not Found", { status: 404 });
  },
};
