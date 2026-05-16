const fs = require('fs');

const content = fs.readFileSync('/Users/samjurist/focusv-help/lib/articles.ts', 'utf8');
const lines = content.split('\n');
const lineIdx = lines.findIndex(l => l.includes('export const articles: Article[] = ['));
const line = lines[lineIdx];
const arrStart = line.indexOf('export const articles: Article[] = ') + 'export const articles: Article[] = '.length;
const semiIdx = line.lastIndexOf('];');
const articles = JSON.parse(line.slice(arrStart, semiIdx + 1));

// Rewritten articles
const rewrites = {

  'carta-2-user-manual': {
    blocks: [
      {
        type: "paragraph",
        text: "The CARTA 2 is Focus V's second-generation smart e-rig featuring Bluetooth control, a full-color LED ring, and the Intelli-Core atomizer system. It supports both concentrate and dry herb sessions. This manual covers everything from unboxing to routine maintenance."
      },
      {
        type: "heading", level: 2, id: "in-the-box", text: "In the box"
      },
      {
        type: "list",
        items: [
          "CARTA 2 base",
          "Intelli-Core atomizer",
          "Glass top",
          "Carb cap (bubble cap or swivel carb cap depending on kit)",
          "USB-C charging cable",
          "Dab tool / cleaning pick"
        ]
      },
      {
        type: "heading", level: 2, id: "controls", text: "Controls"
      },
      {
        type: "list",
        items: [
          "5x V button clicks — Power on / Power off",
          "1x V button press — Cycle temperature preset (while on, before session)",
          "2x V button clicks — Start a session",
          "Double-click V during session — Extend session by 10 seconds",
          "1x V button press during session — End session early",
          "3x V button clicks — Cycle LED mode",
          "4x V button clicks — Check battery level"
        ]
      },
      {
        type: "heading", level: 2, id: "heat-presets", text: "Heat presets"
      },
      {
        type: "list",
        items: [
          "Blue — 425°F (lowest, best for flavor-focused sessions)",
          "Yellow — 450°F",
          "Green — 475°F",
          "Purple — 500°F",
          "Red — 525°F (highest, densest vapor)",
          "Custom temperatures — set via V Browser app at www.focusv.app"
        ]
      },
      {
        type: "heading", level: 2, id: "first-use", text: "First use"
      },
      {
        type: "steps",
        items: [
          {
            title: "Charge before first use",
            body: "Connect via USB-C to a 5V 2A adapter. Charge for up to 2 hours. Never leave the device unattended while charging."
          },
          {
            title: "Install the atomizer",
            body: "Thread the Intelli-Core atomizer clockwise into the base chamber until snug. A loose atomizer can trigger a reading error."
          },
          {
            title: "Attach the glass top",
            body: "Press the glass top straight down into the silicone-fit opening on the base until it seats firmly. Upward + slight sideways pressure helps release it when removing."
          },
          {
            title: "Power on",
            body: "Click the V button 5 times rapidly. The device vibrates and LEDs illuminate to confirm it's on."
          },
          {
            title: "Select a temperature",
            body: "Press the V button once to cycle through the heat presets. Start with Blue (425°F) for your first session."
          },
          {
            title: "Load your concentrate",
            body: "Place a rice-grain to pea-sized amount of concentrate into the atomizer cup. Place your carb cap on top."
          },
          {
            title: "Start a session",
            body: "Double-click the V button. The device vibrates and heats to your selected preset. It vibrates again when temperature is reached — draw slowly and steadily."
          }
        ]
      },
      {
        type: "paragraph",
        text: "Your CARTA 2 may include a bubble cap or a swivel carb cap depending on which kit you purchased. Both work the same way — place it over the atomizer opening before starting your session."
      },
      {
        type: "heading", level: 2, id: "maintenance", text: "Maintenance schedule"
      },
      {
        type: "list",
        items: [
          "After every session — Wipe the atomizer cup with a dry cotton swab while still warm",
          "Every 25–50 sessions — Full atomizer soak in 70–90% isopropyl alcohol",
          "Every 25–50 sessions — Clean the base port with an isopropyl-dampened swab",
          "As needed — Rinse glass top with isopropyl and water"
        ]
      },
      {
        type: "heading", level: 2, id: "warranty", text: "Warranty"
      },
      {
        type: "paragraph",
        text: "The CARTA 2 base is covered by a 1-year limited warranty from date of purchase. Full warranty terms at portal.focusv.com."
      },
      {
        type: "related",
        items: [
          { title: "How to Use Your CARTA 2", href: "/article/carta-2-how-to-use" },
          { title: "How to Clean Your CARTA 2", href: "/article/carta-2-how-to-clean" },
          { title: "Charging Your CARTA 2 Battery", href: "/article/carta-2-charging-battery" }
        ]
      }
    ]
  },

  'carta-2-how-to-use': {
    blocks: [
      {
        type: "paragraph",
        text: "The CARTA 2 supports both concentrate and dry herb sessions. This guide walks you through a complete session from power-on to power-off, plus temperature settings, LED customization, and battery checks."
      },
      {
        type: "heading", level: 2, id: "session-flow", text: "Session flow"
      },
      {
        type: "steps",
        items: [
          {
            title: "Power on",
            body: "Click the V button 5 times rapidly. The device vibrates and LEDs illuminate to confirm it's on."
          },
          {
            title: "Select your temperature",
            body: "Press the V button once to cycle through the heat presets: Blue (425°F) → Yellow (450°F) → Green (475°F) → Purple (500°F) → Red (525°F). Stop when your desired color is shown. For custom temperatures, connect via the V Browser app at www.focusv.app."
          },
          {
            title: "Load your concentrate",
            body: "Place a rice-grain to pea-sized amount of concentrate into the atomizer cup. Avoid overloading — less is more for flavor and cleanliness."
          },
          {
            title: "Place your carb cap",
            body: "Set your carb cap over the atomizer opening. This traps heat and improves vapor production."
          },
          {
            title: "Start a session",
            body: "Double-click the V button. The device vibrates and begins heating. It vibrates again when your set temperature is reached."
          },
          {
            title: "Inhale",
            body: "Draw slowly and steadily through the mouthpiece. Slow draws produce the best vapor density and flavor, and prevent concentrate from splashing into the airpath."
          },
          {
            title: "Extend or end your session",
            body: "During a session: double-click V to add 10 more seconds, or press V once to end early. The session also ends automatically when the timer expires."
          },
          {
            title: "Power off",
            body: "Click the V button 5 times to power off. The device vibrates and LEDs cycle off."
          }
        ]
      },
      {
        type: "heading", level: 2, id: "temperature-settings", text: "Temperature settings"
      },
      {
        type: "list",
        items: [
          "Blue — 425°F (lowest, best for flavor-focused sessions)",
          "Yellow — 450°F",
          "Green — 475°F",
          "Purple — 500°F",
          "Red — 525°F (highest, densest vapor)",
          "Custom temperatures — set via V Browser app at www.focusv.app"
        ]
      },
      {
        type: "heading", level: 2, id: "led-preferences", text: "LED preferences"
      },
      {
        type: "paragraph",
        text: "Click the V button 3 times to enter LED mode. Press once more to cycle through the available color presets. The last option in the cycle is ghost/stealth mode — all LEDs off for discreet use."
      },
      {
        type: "heading", level: 2, id: "battery-check", text: "Battery level check"
      },
      {
        type: "paragraph",
        text: "Click the V button 4 times to check your battery level. LED color indicates charge: Green = ~75%+, Blue = ~50%, Yellow = ~25%, Red = ~10% (charge soon). Charge via USB-C at 5V 2A for up to 2 hours."
      },
      {
        type: "related",
        items: [
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" },
          { title: "How to Clean Your CARTA 2", href: "/article/carta-2-how-to-clean" },
          { title: "Over/Under Heating", href: "/article/carta-2-overunder-heating" }
        ]
      }
    ]
  },

  'carta-2-how-to-clean': {
    blocks: [
      {
        type: "callout",
        variant: "warning",
        body: "Clean your CARTA 2 every 25–50 sessions to maintain flavor, prevent error codes, and extend device life. You'll need: 70–90% isopropyl alcohol, cotton swabs, paper towels, and a small soaking container."
      },
      {
        type: "heading", level: 2, id: "glass-top", text: "Glass top"
      },
      {
        type: "steps",
        items: [
          {
            title: "Remove the glass top",
            body: "Pull the glass top straight up from the base. Applying upward pressure with a slight sideways rock helps break the silicone seal. Make sure the device is powered off and cool before removing."
          },
          {
            title: "Fill with isopropyl and shake",
            body: "Add 70–90% isopropyl alcohol into the glass top (use a funnel if helpful). Cover the openings with your fingers or the silicone stopper and shake for 30–60 seconds. Repeat if heavily soiled."
          },
          {
            title: "Rinse with water",
            body: "Pour out the isopropyl and rinse thoroughly with clean water until no alcohol smell remains."
          },
          {
            title: "Air dry",
            body: "Set the glass top upright in a clean area and allow to dry fully before reattaching."
          }
        ]
      },
      {
        type: "heading", level: 2, id: "atomizer", text: "Intelli-Core atomizer"
      },
      {
        type: "steps",
        items: [
          {
            title: "Remove the atomizer",
            body: "Grasp the lower cylinder of the atomizer and turn counterclockwise to unthread it from the base. If it feels stuck, run a 15-second session at the lowest temperature to loosen built-up wax, then power off and let it cool completely before removing."
          },
          {
            title: "Soak in isopropyl",
            body: "Place the atomizer (without any silicone parts) into a container of 70–90% isopropyl alcohol. Soak for 10 minutes."
          },
          {
            title: "Clean the cup and contact pins",
            body: "Use a cotton swab dampened with isopropyl to clean the inside of the atomizer cup and the gold contact pins. Remove all residue."
          },
          {
            title: "Air dry completely — no water",
            body: "Remove from the soak and set in a clean, dry area for 1–2 hours. The atomizer must be fully dry before reinstalling. Never rinse with water — moisture can damage the ceramic and shock the connections."
          }
        ]
      },
      {
        type: "heading", level: 2, id: "base-port", text: "Base port"
      },
      {
        type: "steps",
        items: [
          {
            title: "Swab the port with isopropyl",
            body: "Dip a cotton swab in 70–90% isopropyl alcohol and clean the atomizer connection port on the base. Pay special attention to the gold contact pin — remove any wax or residue."
          },
          {
            title: "Let dry for 60 seconds",
            body: "Allow the port to air dry for at least 60 seconds before reinstalling the atomizer."
          },
          {
            title: "Reinstall the atomizer",
            body: "Thread the dry atomizer clockwise until snug. Do not overtighten."
          }
        ]
      },
      {
        type: "related",
        items: [
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" },
          { title: "Tips & Care Guide", href: "/article/carta-2-tips-care-guide" },
          { title: "Over/Under Heating", href: "/article/carta-2-overunder-heating" }
        ]
      }
    ]
  },

  'carta-2-charging-battery': {
    blocks: [
      {
        type: "callout",
        variant: "warning",
        body: "Never charge your CARTA 2 for more than 2 hours. Never leave it unattended while charging. Overcharging can damage the battery and void your warranty."
      },
      {
        type: "heading", level: 2, id: "charging-steps", text: "Charging steps"
      },
      {
        type: "steps",
        items: [
          {
            title: "Use the correct charger",
            body: "Connect via USB-C to a 5V 2A adapter (standard phone charging brick). Do not use fast chargers or adapters rated above 5V 2A."
          },
          {
            title: "Charge when battery reaches ~50%",
            body: "For best battery longevity, plug in when the battery is around 50% rather than letting it fully deplete. Press the V button 4 times to check battery level."
          },
          {
            title: "Monitor the charge",
            body: "Stay nearby while charging. The CARTA 2 takes up to 2 hours for a full charge from empty."
          },
          {
            title: "Disconnect when full",
            body: "Unplug the USB-C cable as soon as charging is complete. Do not leave the device plugged in overnight or unattended."
          }
        ]
      },
      {
        type: "heading", level: 2, id: "dos-and-donts", text: "Do's and don'ts"
      },
      {
        type: "list",
        items: [
          "✅ DO use a 5V 2A USB-C adapter",
          "✅ DO charge at around 50% battery for best longevity",
          "✅ DO stay nearby while charging",
          "❌ DON'T charge for more than 2 hours",
          "❌ DON'T leave the device unattended while charging",
          "❌ DON'T use fast chargers or adapters above 5V 2A",
          "❌ DON'T charge on or near flammable surfaces",
          "❌ DON'T charge while the device is still hot from a session"
        ]
      },
      {
        type: "heading", level: 2, id: "battery-check", text: "Checking battery level"
      },
      {
        type: "paragraph",
        text: "Click the V button 4 times to display battery level via LED color: Green = ~75%+, Blue = ~50%, Yellow = ~25%, Red = ~10% (charge now). Avoid running the battery to 0% — regular moderate charges preserve cell health over time."
      },
      {
        type: "related",
        items: [
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" },
          { title: "How to Use Your CARTA 2", href: "/article/carta-2-how-to-use" }
        ]
      }
    ]
  },

  'carta-2-tips-care-guide': {
    blocks: [
      {
        type: "paragraph",
        text: "Getting the most from your CARTA 2 comes down to a few consistent habits — proper loading, temperature choices, and regular maintenance. This guide covers care tips and how to minimize excess reclaim buildup."
      },
      {
        type: "heading", level: 2, id: "why-reclaim-happens", text: "Why excess reclaim happens"
      },
      {
        type: "list",
        items: [
          "Loading too much concentrate — it overflows the atomizer cup and enters the airpath",
          "Temperature too high — concentrate bubbles aggressively and splashes upward",
          "Inhaling too hard — negative pressure pulls liquid into the mouthpiece and body",
          "Not ending the session promptly — unused vapor condenses into reclaim as it cools",
          "Infrequent cleaning — existing reclaim accelerates new buildup"
        ]
      },
      {
        type: "heading", level: 2, id: "prevention-steps", text: "How to prevent excess reclaim"
      },
      {
        type: "steps",
        items: [
          {
            title: "Load less concentrate",
            body: "A rice-grain to pea-sized amount is ideal. Overloading is the most common cause of reclaim buildup. Less = cleaner vapor path and better flavor."
          },
          {
            title: "Use lower temperatures",
            body: "Start with the Blue preset (425°F) or a custom temp via the V Browser app at www.focusv.app. High temperatures cause concentrate to vaporize aggressively. Work up from lower temps to find your sweet spot."
          },
          {
            title: "Inhale slowly and steadily",
            body: "Take long, gentle draws. Inhaling hard pulls liquid out of the atomizer cup and into the airpath. Slow draws also produce better vapor density and flavor."
          },
          {
            title: "End sessions promptly",
            body: "Press V once to end your session as soon as you've finished. Unused vapor left in the airpath condenses into reclaim as it cools."
          },
          {
            title: "Swab after every session",
            body: "Use a dry cotton swab to wipe the atomizer cup while still warm. This removes residual concentrate before it hardens and builds up."
          }
        ]
      },
      {
        type: "heading", level: 2, id: "care-tips", text: "General care tips"
      },
      {
        type: "list",
        items: [
          "Load size — stick to a rice-grain to pea-sized amount; overloading causes mess and wastes concentrate",
          "Temperature — lower temps extend atomizer life and reduce reclaim; start at Blue (425°F) and work up",
          "Session habits — end sessions as soon as you're done; don't let the device idle at temp",
          "Post-session swab — wipe the atomizer cup with a dry swab after every session while still warm",
          "Clean every 25–50 sessions — a full deep clean keeps flavor clean and error codes away",
          "Atomizer removal — if stuck, run a 15-second session at the lowest temp to loosen built-up wax before removing"
        ]
      },
      {
        type: "heading", level: 2, id: "storage", text: "Storage"
      },
      {
        type: "paragraph",
        text: "Store your CARTA 2 upright in a cool, dry location away from direct sunlight and extreme temperatures. If storing for more than a few days, charge to around 50% — storing at 0% or 100% can degrade battery cell health over time."
      },
      {
        type: "related",
        items: [
          { title: "How to Clean Your CARTA 2", href: "/article/carta-2-how-to-clean" },
          { title: "Charging Your CARTA 2 Battery", href: "/article/carta-2-charging-battery" },
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" }
        ]
      }
    ]
  },

  'carta-2-overunder-heating': {
    blocks: [
      {
        type: "paragraph",
        text: "If your CARTA 2 is consistently running hotter or cooler than expected — or not reaching temperature at all — the steps below will resolve most heating issues."
      },
      {
        type: "heading", level: 2, id: "what-causes-it", text: "What causes over/under heating"
      },
      {
        type: "list",
        items: [
          "Atomizer not calibrated — temperature readings drift when the atomizer is removed and reinstalled without recalibration",
          "Dirty atomizer or contact pins — residue on the connections causes inconsistent temperature sensing",
          "Wrong atomizer type installed — a dry herb atomizer in concentrate mode (or vice versa) affects heat performance",
          "Outdated firmware — software bugs can affect heating accuracy",
          "Ambient temperature — calibration assumes a resting temp below 100°F; hot environments can affect readings"
        ]
      },
      {
        type: "heading", level: 2, id: "troubleshooting", text: "Troubleshooting steps"
      },
      {
        type: "steps",
        items: [
          {
            title: "Update firmware",
            body: "Connect your CARTA 2 to the V Browser app (www.focusv.app) via Bluetooth and check for available firmware updates. Updating can resolve software-related heating issues."
          },
          {
            title: "Clean the atomizer and contact pins",
            body: "Remove the atomizer and clean the gold contact pins on both the atomizer and the base port using a cotton swab dampened with isopropyl alcohol. Residue on the pins causes poor electrical contact and inconsistent heating."
          },
          {
            title: "Recalibrate the atomizer",
            body: "Ensure the device is at or below 100°F (ideally near room temperature, ~77°F). With the device powered on, remove the atomizer, then power the device off. Power it back on, then reinstall the atomizer. This recalibrates the temperature sensor for accurate readings."
          },
          {
            title: "Confirm the correct atomizer type",
            body: "Make sure the atomizer installed matches the mode you're using (concentrate or dry herb). Installing the wrong type will cause heating irregularities. See the Incorrect Atomizer article for more detail."
          }
        ]
      },
      {
        type: "callout",
        variant: "warning",
        body: "Atomizer recalibration should be performed at room temperature (below 100°F). Calibrating while the device is hot will produce inaccurate results."
      },
      {
        type: "related",
        items: [
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" },
          { title: "How to Clean Your CARTA 2", href: "/article/carta-2-how-to-clean" },
          { title: "Incorrect Atomizer / Dry Herb Mode", href: "/article/carta-2-incorrect-atomizer" }
        ]
      }
    ]
  },

  'carta-2-504-505-errors': {
    blocks: [
      {
        type: "paragraph",
        text: "Error codes 504 and 505 on the CARTA 2 indicate a connection problem between the device and the atomizer. The device cannot read or communicate with the atomizer properly. This is usually caused by dirty contacts, a loose atomizer, or a pushed-down connection pin."
      },
      {
        type: "heading", level: 2, id: "troubleshooting", text: "Troubleshooting steps"
      },
      {
        type: "steps",
        items: [
          {
            title: "Power off and reseat the atomizer",
            body: "Click the V button 5 times to power off. Unscrew the atomizer fully, then re-thread it clockwise until snug. Power the device back on and attempt a session."
          },
          {
            title: "Clean the contact pins",
            body: "With the atomizer removed, clean the gold contact pins on both the atomizer base and the device port using a cotton swab dampened with 70–90% isopropyl alcohol. Wax or residue on these pins is the most common cause of 504/505 errors."
          },
          {
            title: "Inspect the base connection pin",
            body: "Look into the base port for the center contact pin. If it appears pushed down or recessed, gently apply isopropyl alcohol around the pin and use a toothpick or similar small tool to carefully lift it back to its normal position."
          },
          {
            title: "Update firmware",
            body: "Connect to the V Browser app (www.focusv.app) via Bluetooth and check for firmware updates. Software issues can occasionally trigger false error codes."
          },
          {
            title: "Power cycle the device",
            body: "Power off the CARTA 2 completely (5x clicks). Wait 10 seconds, then power it back on and reinstall the atomizer. Attempt a session to confirm the error is cleared."
          },
          {
            title: "Submit a support request",
            body: "If the error persists after all steps above, submit a warranty claim at portal.focusv.com. Provide the error code, troubleshooting steps taken, and your purchase date."
          }
        ]
      },
      {
        type: "related",
        items: [
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" },
          { title: "Incorrect Atomizer / Dry Herb Mode", href: "/article/carta-2-incorrect-atomizer" },
          { title: "Over/Under Heating", href: "/article/carta-2-overunder-heating" }
        ]
      }
    ]
  },

  'carta-2-incorrect-atomizer': {
    blocks: [
      {
        type: "paragraph",
        text: "The CARTA 2 automatically detects which atomizer type is installed — concentrate or dry herb — and adjusts its behavior accordingly. When the device shows an 'incorrect atomizer' error, it means the detected type doesn't match what's expected, or the atomizer isn't being read at all."
      },
      {
        type: "heading", level: 2, id: "what-causes-this", text: "What causes this error"
      },
      {
        type: "list",
        items: [
          "Wrong atomizer type installed — a dry herb atomizer is detected when the device expects a concentrate atomizer, or vice versa",
          "Dirty contact pins — residue on the gold pins prevents proper atomizer identification",
          "Loose or improperly seated atomizer — the device can't read an atomizer that isn't fully threaded in",
          "Pushed-down base connection pin — the center pin in the base port may be recessed and not making contact"
        ]
      },
      {
        type: "heading", level: 2, id: "troubleshooting", text: "Troubleshooting steps"
      },
      {
        type: "steps",
        items: [
          {
            title: "Confirm you have the right atomizer type",
            body: "The CARTA 2 supports both concentrate and dry herb atomizers. Make sure the atomizer you're installing matches the session type you intend to use. Check the label or marking on the atomizer if unsure."
          },
          {
            title: "Clean the contact pins",
            body: "Remove the atomizer. Use a cotton swab dampened with 70–90% isopropyl alcohol to clean the gold contact pins on both the atomizer and the base port. Residue buildup is the most common cause of detection errors."
          },
          {
            title: "Reseat the atomizer fully",
            body: "Thread the atomizer clockwise until it's snug — not overtightened, but fully seated. A partially threaded atomizer will not make proper contact and may trigger a detection error."
          },
          {
            title: "Inspect the base pin",
            body: "Look into the base port and check that the center contact pin is at its normal height (not pushed down). If recessed, apply a small amount of isopropyl around the pin and use a toothpick or pin to gently lift it back into position."
          },
          {
            title: "Update firmware",
            body: "Connect to the V Browser app (www.focusv.app) via Bluetooth and install any available firmware updates. Firmware updates can resolve atomizer detection issues caused by software bugs."
          },
          {
            title: "Submit a support request if issue persists",
            body: "If the error continues after all steps above, submit a warranty claim at portal.focusv.com. Include details on the troubleshooting steps taken and your purchase date."
          }
        ]
      },
      {
        type: "related",
        items: [
          { title: "How to Clean Your CARTA 2", href: "/article/carta-2-how-to-clean" },
          { title: "CARTA 2 User Manual", href: "/article/carta-2-user-manual" },
          { title: "Over/Under Heating", href: "/article/carta-2-overunder-heating" }
        ]
      }
    ]
  }

};

// Apply rewrites
let changed = 0;
for (let i = 0; i < articles.length; i++) {
  const slug = articles[i].slug;
  if (rewrites[slug]) {
    articles[i].blocks = rewrites[slug].blocks;
    // Update readTime based on block count
    const blockCount = articles[i].blocks.length;
    articles[i].readTime = Math.max(2, Math.ceil(blockCount / 3));
    articles[i].updated = '2025-05-16';
    changed++;
    console.log(`✅ Rewrote: ${slug}`);
  }
}

console.log(`\nTotal articles modified: ${changed}`);

lines[lineIdx] = line.slice(0, arrStart) + JSON.stringify(articles) + ';';
fs.writeFileSync('/Users/samjurist/focusv-help/lib/articles.ts', lines.join('\n'));
console.log('File written successfully.');
