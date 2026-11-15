// Baut das "Axolotl-Aquarium" in den Rohinhalt von daveslab.de/basteln ein
// (eigene Projektkarte oben und eigener Abschnitt ganz unten, hinter der Maerchenbox, mit eingebetteter Simulation).
// Gleiches Prinzip wie basteln-wetter.js und basteln-maerchen.js: jede Ersetzung muss genau einmal passen,
// sonst wird nichts gespeichert. Firmware, Flasher und Simulation liegen auf GitHub Pages
// (https://prod-byte.github.io/axolotl-aquarium/) und werden bei jedem Release (tools/release.py) neu
// hochgeladen - auf daveslab.de muss man danach nichts mehr aendern.
//
// SO BENUTZEN (selbst, in Chrome):
//   1. Bei https://daveslab.de/wp-admin/ anmelden
//   2. F12 -> Reiter "Console" -> diese ganze Datei hineinkopieren -> Enter
//      (fragt Chrome nach "allow pasting": einmal  allow pasting  eintippen, Enter, nochmal einfuegen)
//   3. Es kommt eine Rueckfrage "Speichern?" -> OK. Danach https://daveslab.de/basteln/ neu laden.
//   WordPress hebt die alte Fassung als Revision auf (Seite bearbeiten -> Revisionen).
function aquariumEinbauen(raw) {
  const fehler = [];
  let out = raw;
  function ersetze(name, such, neu) {
    const treffer = typeof such === 'string' ? out.split(such).length - 1 : (out.match(new RegExp(such.source, 'g')) || []).length;
    if (treffer !== 1) { fehler.push(name + ': ' + treffer + ' Treffer'); return; }
    out = out.replace(such, typeof neu === 'function' ? neu : () => neu);
  }
  if (out.includes('id="aquarium"')) return {out: raw, fehler: ['Axolotl-Aquarium ist schon eingebaut']};

  // --- Projektkarte oben (hinter der Maerchenbox) ---
  ersetze('karte', /<a class="dl-karte" href="#maerchen"[\s\S]*?<\/a>/, m => m + '\n        ' + AQUARIUM_KARTE);
  ersetze('anzahl de', '</b>4 Projekte', '</b>5 Projekte');
  ersetze('anzahl en', '<b>MAKING</b>4 projects', '<b>MAKING</b>5 projects');

  // --- Abschnitt ganz unten, vor dem Fuss ---
  ersetze('abschnitt', '<footer class="dl-foot">', AQUARIUM_ABSCHNITT + '\n\n  <footer class="dl-foot">');

  // --- Karte -> Abschnitt (die Karten oeffnen immer nur ein Projekt) ---
  ersetze('proj', "maerchen:['maerchen']};", "maerchen:['maerchen'],aquarium:['aquarium']};");

  // --- Englische Uebersetzungen (hinter den Maerchenbox-Texten) ---
  ersetze('en aquarium', "mae_auto_btn:'Open page →',", "mae_auto_btn:'Open page →',\n" + AQUARIUM_EN + ',');

  // --- Build-Nummer anzeigen ---
  ersetze('var build', "buildWetter=null,buildMaerchen=null;", "buildWetter=null,buildMaerchen=null,buildAquarium=null;");
  ersetze('setze ver', "if(vm&&buildMaerchen!==null)vm.textContent=(W.ver||DE.ver).replace('{0}',buildMaerchen);",
    "if(vm&&buildMaerchen!==null)vm.textContent=(W.ver||DE.ver).replace('{0}',buildMaerchen);\n" +
    "  var va=document.getElementById('dl-ver-aquarium');if(va&&buildAquarium!==null)va.textContent=(W.ver||DE.ver).replace('{0}',buildAquarium);");
  ersetze('fetch aquarium', "buildMaerchen=j.build;setze(sprache);}).catch(function(){});",
    "buildMaerchen=j.build;setze(sprache);}).catch(function(){});\n" + AQUARIUM_SKRIPT);

  return {out: fehler.length ? raw : out, fehler};
}

var AQUARIUM_SEITE = 'https://prod-byte.github.io/axolotl-aquarium';
var AQUARIUM_GH = '<a href="https://github.com/ProD-byte/axolotl-aquarium" target="_blank" rel="noopener">GitHub</a>';

var AQUARIUM_KARTE = `<a class="dl-karte" href="#aquarium" data-p="aquarium" aria-expanded="false"><span class="ic">🦎</span><h3>Axolotl-Aquarium</h3><p data-t="k_aquarium">Axolotl mit eigener KI in einem lebendigen Mini-Aquarium.</p><small>LILYGO T-Display-S3</small><span class="auf-zu" data-t="k_auf">Öffnen</span></a>`;

// Kasten "Zur Webseite des Aquariums" (wie bei der Wetterstation)
var AQUARIUM_WEB = `      <div class="dl-auto rv" style="margin-top:14px">
        <div>
          <h3 data-t="aq_web_h">🌐 Zur Webseite des Aquariums</h3>
          <p data-t="aq_web_p">Ist das Aquarium im WLAN, siehst du unter <code>http://aquarium.local</code> alle Bewohner mit Bedürfnissen und Stammbaum, das Ökosystem und das Tagebuch. Dort fütterst du, wechselst das Wasser und stellst Ton, Uhrzeit, Lüfter und automatische Updates ein – Handy oder PC müssen im selben WLAN sein. Klappt es nicht, die IP-Adresse aus dem Router nehmen.</p>
        </div>
        <a class="dl-btn" href="http://aquarium.local" target="_blank" rel="noopener" data-t="aq_web_btn">Aquarium öffnen →</a>
      </div>`;

var AQUARIUM_ABSCHNITT = `  <section class="dl-sec" id="aquarium">
    <div class="dl-wrap">
      <h2 class="dl-h2 rv" data-t="aq_h2">Axolotl-Aquarium <span class="dl-grad">installieren</span></h2>
      <p class="dl-sub rv"><span data-t="aq_sub">Ein lebendiges Aquarium auf dem <b>LILYGO T-Display-S3</b> (ESP32-S3): Jeder Axolotl hat seine eigene KI, kommt neugierig an die Scheibe, wächst, bekommt Nachwuchs und wird alt – mit Fischen, Garnelen, Pflanzen und einem geschlossenen Stoffkreislauf. Erst in der Simulation ausprobieren – die Tasten funktionieren wie die echten –, dann per USB-C direkt hier aufspielen.</span> <span id="dl-ver-aquarium"></span></p>
      <div class="rv" style="margin:6px 0 26px">
        <iframe id="dl-aquarium-sim" src="${AQUARIUM_SEITE}/simulation.html?einbetten" title="Simulation des Axolotl-Aquariums" loading="lazy" style="display:block;width:100%;height:760px;border:0;background:transparent"></iframe>
      </div>
      <div class="dl-flash">
        <div class="dl-opt rv">
          <h3 data-t="upd_h">🔄 Update</h3>
          <p data-t="aq_upd_p">Neue Firmware aufspielen – <b>WLAN und Aquarium bleiben erhalten.</b> Bei „Erase device?“ den Haken <b>nicht</b> setzen.</p>
          <esp-web-install-button manifest="${AQUARIUM_SEITE}/manifest-update.json">
            <button slot="activate" data-t="upd_btn">⚡ Update installieren</button>
            <span slot="unsupported" data-t="unsup"><b>Dieser Browser kann das leider nicht.</b> Bitte Chrome oder Edge am Computer verwenden.</span>
            <span slot="not-allowed" data-t="notall"><b>Nur über https möglich.</b></span>
          </esp-web-install-button>
        </div>
        <div class="dl-opt rot rv">
          <h3 data-t="neu_h">🧹 Neuinstallation</h3>
          <p data-t="aq_neu_p">Speicher komplett löschen und neu aufspielen – für <b>neue Boards</b> oder wenn gar nichts mehr geht. <b>WLAN und Aquarium sind danach weg.</b></p>
          <esp-web-install-button manifest="${AQUARIUM_SEITE}/manifest-neu.json">
            <button slot="activate" data-t="neu_btn">🗑️ Löschen &amp; neu installieren</button>
            <span slot="unsupported" data-t="unsup"><b>Dieser Browser kann das leider nicht.</b> Bitte Chrome oder Edge am Computer verwenden.</span>
            <span slot="not-allowed" data-t="notall"><b>Nur über https möglich.</b></span>
          </esp-web-install-button>
        </div>
      </div>
      <ol class="dl-schritte" style="margin-top:28px">
        <li class="rv" data-t="aq_s1"><b>Board anschließen.</b> T-Display per <b>USB-C</b> mit dem Computer verbinden (Kabel mit Datenleitungen) und <b>Chrome</b> oder <b>Edge</b> öffnen.</li>
        <li class="rv" data-t="aq_s2"><b>Anschluss auswählen.</b> Meist „USB JTAG/serial debug unit“ – ein Treiber ist nicht nötig.</li>
        <li class="rv" data-t="aq_s3"><b>Keine Verbindung?</b> Taste <b>BOOT</b> gedrückt halten, kurz <b>RST</b> an der Seite drücken, BOOT loslassen – nochmal versuchen.</li>
        <li class="rv" data-t="aq_s4"><b>WLAN einrichten</b> (nur beim ersten Mal): Mit dem Handy ins WLAN <b>„Axolotl-Aquarium“</b>, dein WLAN antippen, Passwort eingeben. Danach läuft die Uhr in Echtzeit und neue Versionen kommen nachts von selbst.</li>
        <li class="rv" data-t="aq_s5"><b>Bedienen.</b> <b>BOOT</b> 1×, 2× oder 3× füttert Pellets, Würmer oder Wasserflöhe, lang drücken wechselt das Wasser. <b>KEY</b> blättert durch Gedanken, Details der Axolotl und Statusseite, lang drücken schaltet zwischen Deutsch und Englisch.</li>
      </ol>
      <div class="dl-auto rv">
        <div>
          <h3 data-t="aq_auto_h">🦎 Simulation in groß</h3>
          <p data-t="aq_auto_p">Tag und Nacht, Füttern, Wasserwechsel und alle Effekte zum Ausprobieren – mit genau demselben Programmcode wie auf dem Gerät. Firmware-Versionen: ${AQUARIUM_GH}.</p>
        </div>
        <a class="dl-btn" href="${AQUARIUM_SEITE}/simulation.html" target="_blank" rel="noopener" data-t="aq_auto_btn">Simulation öffnen →</a>
      </div>
${AQUARIUM_WEB}
    </div>
  </section>`;

// Hoehe der Simulation anpassen und ihr die Sprache der Seite melden. Die Simulation meldet sich jede Sekunde mit
// ihrer Hoehe, darauf antworten wir mit der Sprache. Wechselt jemand die Sprache, geht sie sofort raus,
// und der Link "Simulation oeffnen" bekommt ?lang=.. mit.
var AQUARIUM_SPRACHE = `addEventListener('message',function(e){if(e.origin==='https://prod-byte.github.io'&&e.data&&e.data.aquariumHoehe){var f=document.getElementById('dl-aquarium-sim');if(f){f.style.height=e.data.aquariumHoehe+'px';f.contentWindow.postMessage({aquariumSprache:document.documentElement.lang||'de'},'https://prod-byte.github.io');}}});
(function(){function melde(){var l=document.documentElement.lang||'de',f=document.getElementById('dl-aquarium-sim'),a=document.querySelector('a[data-t="aq_auto_btn"]');if(a)a.href='${AQUARIUM_SEITE}/simulation.html?lang='+l;if(f&&f.contentWindow)f.contentWindow.postMessage({aquariumSprache:l},'https://prod-byte.github.io');}melde();new MutationObserver(melde).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});})();`;

// Kein '&' im Skript: WordPress macht beim Anzeigen &#038; daraus. Der Versionsstempel laedt die Simulation nach jeder Aenderung frisch.
var AQUARIUM_SKRIPT = `fetch('${AQUARIUM_SEITE}/version.json',{cache:'no-store'}).then(function(r){return r.json();}).then(function(j){buildAquarium=j.build;setze(sprache);var f=document.getElementById('dl-aquarium-sim');if(f){var u=new URL(f.src);if(!u.searchParams.has('v')){u.searchParams.set('v',j.stand||j.build);f.src=u.href;}}}).catch(function(){});
${AQUARIUM_SPRACHE}`;

var AQUARIUM_EN = [
  `k_aquarium:'Axolotls with their own AI in a living mini aquarium.'`,
  `aq_h2:'Install the <span class="dl-grad">axolotl aquarium</span>'`,
  `aq_sub:'A living aquarium on the <b>LILYGO T-Display-S3</b> (ESP32-S3): every axolotl has its own AI, comes up to the glass curiously, grows, has offspring and grows old – with fish, shrimp, plants and a closed nutrient cycle. Try it in the simulation first – the buttons work like the real ones –, then flash it right here via USB-C.'`,
  `aq_upd_p:'Install new firmware – <b>Wi-Fi and aquarium are kept.</b> Do <b>not</b> tick “Erase device?”.'`,
  `aq_neu_p:'Erase everything and install from scratch – for <b>new boards</b> or when nothing works anymore. <b>Wi-Fi and aquarium will be gone.</b>'`,
  `aq_s1:'<b>Connect the board.</b> Plug the T-Display into the computer via <b>USB-C</b> (a cable with data lines) and open <b>Chrome</b> or <b>Edge</b>.'`,
  `aq_s2:'<b>Select the port.</b> Usually “USB JTAG/serial debug unit” – no driver needed.'`,
  `aq_s3:'<b>No connection?</b> Hold the <b>BOOT</b> button, briefly press <b>RST</b> on the side, release BOOT – try again.'`,
  `aq_s4:'<b>Set up Wi-Fi</b> (first time only): connect your phone to the Wi-Fi <b>“Axolotl-Aquarium”</b>, tap your Wi-Fi, enter the password. Then the clock runs in real time and new versions arrive by themselves at night.'`,
  `aq_s5:'<b>Controls.</b> <b>BOOT</b> 1×, 2× or 3× feeds pellets, worms or water fleas, hold it for a water change. <b>KEY</b> cycles through the axolotls’ thoughts, details and the status page, hold it to switch between German and English.'`,
  `aq_auto_h:'🦎 Full-size simulation'`,
  `aq_auto_p:'Day and night, feeding, water changes and all the effects to try out – running exactly the same code as the device. Firmware versions: ${AQUARIUM_GH}.'`,
  `aq_auto_btn:'Open simulation →'`,
  `aq_web_h:'🌐 To the aquarium’s web page'`,
  `aq_web_p:'Once the aquarium is on your Wi-Fi, <code>http://aquarium.local</code> shows every resident with needs and family tree, the ecosystem and the diary. There you feed, change the water and set sound, clock, fan and automatic updates – phone or PC must be on the same Wi-Fi. If that does not work, take the IP address from your router.'`,
  `aq_web_btn:'Open aquarium →'`,
].join(',\n');

// ---------- Ausfuehren: Seite holen, einbauen, nach Rueckfrage speichern ----------
(async function aquariumSpeichern() {
  if (typeof location === 'undefined' || !location.hostname.endsWith('daveslab.de')) { if (typeof alert !== 'undefined') alert('Bitte auf daveslab.de/wp-admin ausfuehren.'); return; }
  const nonce = (typeof wpApiSettings !== 'undefined' && wpApiSettings.nonce) ||
                await (await fetch('/wp-admin/admin-ajax.php?action=rest-nonce', {credentials: 'include'})).text();
  if (!nonce || nonce === '0') { alert('Nicht angemeldet - bitte erst bei WordPress anmelden.'); return; }
  const kopf = {'X-WP-Nonce': nonce, 'Content-Type': 'application/json'};
  const liste = await (await fetch('/wp-json/wp/v2/pages?slug=basteln&context=edit&_fields=id,content', {headers: kopf, credentials: 'include'})).json();
  if (!Array.isArray(liste) || !liste[0]) { alert('Seite "basteln" nicht gefunden: ' + JSON.stringify(liste).slice(0, 200)); return; }
  const seite = liste[0];
  const {out, fehler} = aquariumEinbauen(seite.content.raw);
  if (fehler.length) { alert('Nichts geaendert:\n' + fehler.join('\n')); return; }
  if (!confirm('Axolotl-Aquarium einbauen und Seite "basteln" speichern?\n(' + seite.content.raw.length + ' -> ' + out.length + ' Zeichen)')) return;
  const r = await fetch('/wp-json/wp/v2/pages/' + seite.id, {method: 'POST', headers: kopf, credentials: 'include', body: JSON.stringify({content: out})});
  alert(r.ok ? 'Gespeichert! Jetzt https://daveslab.de/basteln/ neu laden.' : 'Fehler beim Speichern: ' + r.status + ' ' + (await r.text()).slice(0, 200));
})();
