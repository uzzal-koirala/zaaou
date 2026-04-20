<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"
    doctype-system="about:legacy-compat" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Sitemap · Zaaou</title>
        <link rel="icon" href="/favicon.ico" />
        <style>
          :root{
            --bg:#fff7ed;
            --card:#ffffff;
            --border:#fde6c8;
            --text:#1f1410;
            --muted:#7a6a5d;
            --primary:#ff5722;
            --primary-soft:#fff1eb;
            --accent:#facc15;
          }
          @media (prefers-color-scheme: dark){
            :root{
              --bg:#150d08;
              --card:#1f1612;
              --border:#3a2a1f;
              --text:#fff7ed;
              --muted:#b6a99c;
              --primary-soft:#2a1812;
            }
          }
          *{box-sizing:border-box}
          html,body{margin:0;padding:0;background:var(--bg);color:var(--text);
            font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
            -webkit-font-smoothing:antialiased;line-height:1.5;}
          .wrap{max-width:1100px;margin:0 auto;padding:40px 20px 80px;}
          .hero{
            position:relative;overflow:hidden;
            background:linear-gradient(135deg,var(--primary) 0%,#ff8a3d 100%);
            color:#fff;border-radius:24px;padding:36px 32px;margin-bottom:28px;
            box-shadow:0 20px 50px -20px rgba(255,87,34,0.45);
          }
          .hero::after{
            content:"";position:absolute;inset:auto -60px -120px auto;
            width:320px;height:320px;border-radius:50%;
            background:radial-gradient(circle,rgba(250,204,21,0.55),transparent 70%);
            pointer-events:none;
          }
          .badge{
            display:inline-flex;align-items:center;gap:8px;
            background:rgba(255,255,255,0.18);backdrop-filter:blur(6px);
            padding:6px 12px;border-radius:999px;font-size:11px;
            font-weight:700;letter-spacing:0.14em;text-transform:uppercase;
          }
          .badge .dot{width:6px;height:6px;border-radius:50%;background:var(--accent);}
          h1{font-size:34px;margin:14px 0 6px;letter-spacing:-0.02em;font-weight:800;}
          .lede{margin:0;opacity:0.92;font-size:15px;max-width:640px;}
          .stats{
            display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));
            gap:12px;margin-top:22px;position:relative;z-index:1;
          }
          .stat{
            background:rgba(255,255,255,0.14);backdrop-filter:blur(6px);
            padding:14px 16px;border-radius:14px;
          }
          .stat .n{font-size:22px;font-weight:800;line-height:1;}
          .stat .l{font-size:11px;opacity:0.85;text-transform:uppercase;letter-spacing:0.1em;margin-top:4px;}
          .card{
            background:var(--card);border:1px solid var(--border);
            border-radius:18px;overflow:hidden;
          }
          table{width:100%;border-collapse:collapse;font-size:14px;}
          thead th{
            text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;
            letter-spacing:0.12em;color:var(--muted);
            padding:14px 18px;border-bottom:1px solid var(--border);
            background:var(--primary-soft);
          }
          tbody td{padding:14px 18px;border-bottom:1px solid var(--border);vertical-align:middle;}
          tbody tr:last-child td{border-bottom:none;}
          tbody tr:hover{background:var(--primary-soft);}
          a.url{
            color:var(--text);text-decoration:none;font-weight:600;
            display:inline-flex;align-items:center;gap:8px;word-break:break-all;
          }
          a.url:hover{color:var(--primary);}
          a.url svg{flex-shrink:0;color:var(--primary);opacity:0.8;}
          .pill{
            display:inline-block;padding:3px 10px;border-radius:999px;
            font-size:11px;font-weight:700;letter-spacing:0.04em;
            background:var(--primary-soft);color:var(--primary);
          }
          .muted{color:var(--muted);font-variant-numeric:tabular-nums;font-size:13px;}
          .bar{
            display:inline-block;width:60px;height:6px;border-radius:999px;
            background:var(--border);position:relative;overflow:hidden;vertical-align:middle;
            margin-right:8px;
          }
          .bar > span{
            display:block;height:100%;
            background:linear-gradient(90deg,var(--primary),var(--accent));
          }
          footer{
            margin-top:24px;text-align:center;font-size:12px;color:var(--muted);
          }
          footer a{color:var(--primary);text-decoration:none;font-weight:600;}
          @media(max-width:560px){
            h1{font-size:26px;}
            thead th:nth-child(3),tbody td:nth-child(3),
            thead th:nth-child(4),tbody td:nth-child(4){display:none;}
            .wrap{padding:20px 14px 60px;}
            .hero{padding:26px 22px;}
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="hero">
            <span class="badge"><span class="dot"></span> XML Sitemap</span>
            <h1>Zaaou Sitemap</h1>
            <p class="lede">
              A machine-readable index of every public page on Zaaou — used by
              search engines like Google and Bing to discover and rank our content.
            </p>
            <div class="stats">
              <div class="stat">
                <div class="n"><xsl:value-of select="count(s:urlset/s:url)" /></div>
                <div class="l">Total URLs</div>
              </div>
              <div class="stat">
                <div class="n">
                  <xsl:value-of select="count(s:urlset/s:url[contains(s:loc,'/blog/')])" />
                </div>
                <div class="l">Blog pages</div>
              </div>
              <div class="stat">
                <div class="n">
                  <xsl:value-of select="count(s:urlset/s:url[not(contains(s:loc,'/blog/'))])" />
                </div>
                <div class="l">Site pages</div>
              </div>
            </div>
          </div>

          <div class="card">
            <table>
              <thead>
                <tr>
                  <th style="width:55%">URL</th>
                  <th>Priority</th>
                  <th>Change</th>
                  <th>Last modified</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="s:urlset/s:url">
                  <xsl:sort select="s:priority" data-type="number" order="descending" />
                  <tr>
                    <td>
                      <a class="url" href="{s:loc}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" stroke-width="2.4"
                          stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                        </svg>
                        <xsl:value-of select="s:loc" />
                      </a>
                    </td>
                    <td>
                      <span class="bar">
                        <span>
                          <xsl:attribute name="style">
                            width: <xsl:value-of select="number(s:priority) * 100" />%;
                          </xsl:attribute>
                        </span>
                      </span>
                      <span class="muted">
                        <xsl:value-of select="s:priority" />
                      </span>
                    </td>
                    <td>
                      <xsl:if test="s:changefreq">
                        <span class="pill"><xsl:value-of select="s:changefreq" /></span>
                      </xsl:if>
                    </td>
                    <td class="muted">
                      <xsl:value-of select="s:lastmod" />
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            Generated by <a href="/">Zaaou</a> · Search engines see the raw XML;
            this page is a friendly view for humans.
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
