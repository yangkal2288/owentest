(function(){
  // The website box. Checks the address, then sends the visitor to
  // vallamo.app/signup with their website attached. Without JavaScript the
  // form does the same thing natively (GET to /signup).
  //
  // Optional: if the form's data-lead-endpoint is set, the website is POSTed
  // there first (form-encoded, with first-touch UTM data) and the endpoint may
  // answer { signup_url }. If it is slow or fails, the visitor still goes to
  // signup: losing a lead is bad, losing the visitor is worse.
  var form = document.getElementById("vx-try");
  if (!form || !window.URLSearchParams) return;
  var input = form.querySelector('input[name="website"]');
  var button = form.querySelector(".vx-go");
  var label = button.querySelector("span");
  var msg = document.getElementById("vx-try-msg");
  var SIGNUP = form.getAttribute("action") || "https://vallamo.app/signup";
  var endpoint = (form.getAttribute("data-lead-endpoint") || "").trim();
  var busy = false;

  // A real http(s) business website: "yourbusiness.com", "www.x.co.uk/", "https://x.com/about".
  function clean(raw){
    var v = String(raw || "").trim();
    if (!v || v.length > 500 || /\s/.test(v)) return null;
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) {
      if (/^[a-z][a-z0-9+.-]*:(?!\d)/i.test(v)) return null;
      v = "https://" + v;
    }
    var u; try { u = new URL(v); } catch (e) { return null; }
    if (!/^https?:$/.test(u.protocol) || u.username || u.password) return null;
    var host = u.hostname.toLowerCase().replace(/\.$/, "");
    var parts = host.split(".");
    if (parts.length < 2) return null;
    for (var i = 0; i < parts.length; i++) if (!/^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/.test(parts[i])) return null;
    var tld = parts[parts.length - 1];
    if (!/^[a-z]{2,63}$/.test(tld) && !/^xn--[a-z0-9-]+$/.test(tld)) return null;
    return u.protocol + "//" + host + (u.port ? ":" + u.port : "") + (u.pathname !== "/" ? u.pathname.replace(/\/+$/, "") : "");
  }

  function attribution(){
    var a = {}, q = new URLSearchParams(location.search);
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","fbclid","gclid","gbraid","wbraid"].forEach(function(k){
      var v = q.get(k); if (v) a[k] = v.slice(0, 256);
    });
    a.landing_page = (location.origin + location.pathname).slice(0, 2048);
    if (document.referrer) a.referrer = document.referrer.slice(0, 2048);
    a.captured_at = new Date().toISOString();
    return a;
  }

  function say(text, bad){
    msg.textContent = text || "";
    form.classList.toggle("is-bad", !!bad);
    if (bad) input.setAttribute("aria-invalid", "true"); else input.removeAttribute("aria-invalid");
  }

  function go(site, url){
    var dest = SIGNUP + (SIGNUP.indexOf("?") < 0 ? "?" : "&") + "website=" + encodeURIComponent(site);
    try {
      var u = new URL(url);
      if (u.protocol === "https:" && /\/signup$/.test(u.pathname)) dest = u.href;
    } catch (e) { /* keep the default */ }
    location.assign(dest);
  }

  input.addEventListener("input", function(){ if (form.classList.contains("is-bad")) say(""); });

  form.addEventListener("submit", function(e){
    e.preventDefault();
    if (busy) return;
    var site = clean(input.value);
    if (!site) {
      say(input.value.trim() ? "That doesn’t look like a website. Try something like yourbusiness.com" : "Enter your website to see it in action.", true);
      input.focus();
      return;
    }
    busy = true;
    say("");
    button.disabled = true;
    button.classList.add("is-busy");
    label.textContent = "Opening…";
    try { if (typeof window.gtag === "function") window.gtag("event", "generate_lead", { method: "website_box" }); } catch (err) {}

    if (!endpoint || !window.fetch) { go(site); return; }

    var body = new URLSearchParams();
    body.set("website", input.value.trim());
    body.set("attribution", JSON.stringify(attribution()));
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function(){ if (ctrl) ctrl.abort(); }, 6000);
    // Form-encoded with only an Accept header: a CORS "simple" request, no preflight.
    fetch(endpoint, { method: "POST", headers: { "Accept": "application/json" }, body: body, credentials: "omit", signal: ctrl ? ctrl.signal : undefined })
      .then(function(r){ return r.json().catch(function(){ return {}; }); })
      .then(function(j){ go(site, j && j.signup_url); })
      .catch(function(){ go(site); })
      .then(function(){ clearTimeout(timer); });
  });

  // Back button restores the page from cache: reset the button.
  window.addEventListener("pageshow", function(ev){
    if (!ev.persisted) return;
    busy = false; button.disabled = false; button.classList.remove("is-busy"); label.textContent = "See it now";
  });
})();
