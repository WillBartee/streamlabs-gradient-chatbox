let nameColors, messageColors, opacityConfig;
const STANDARD_COLORS = {
  aqua: '#0ff',
  black: '#000',
  blue: '#00f',
  fuchsia: '#f0f',
  gray: '#808080',
  green: '#008000',
  lime: '#0f0',
  maroon: '#800000',
  navy: '#000080',
  olive: '#808000',
  orange: '#ffa500',
  purple: '#800080',
  red: '#f00',
  silver: '#c0c0c0',
  teal: '#008080',
  white: '#fff',
  yellow: '#ff0'
};
/**
 * Basic functions taken from "https://cdn.rawgit.com/dtao/nearest-color/a017c25b/nearestColor.js"
 */

function mapColors(colors) {
  if (colors instanceof Array) {
    return colors.map(c => createColorSpec(c));
  } else if (typeof colors === 'string') {
    let colorArray = colors.split(',').map(c => c.trim());
    if (colorArray.length === 1) {
      colorArray[1] = colorArray[0];
    }
    return colorArray.map(c => createColorSpec(c));
  }
  return Object.keys(colors).map((name) => createColorSpec(colors[name], name));
};

function parseColor(source) {
  var red, green, blue;

  if (typeof source === 'object') {
    return source;
  }

  if (source in STANDARD_COLORS) {
    return parseColor(STANDARD_COLORS[source]);
  }

  var hexMatch = source.match(/^#((?:[0-9a-f]{3}){1,2})$/i);
  if (hexMatch) {
    hexMatch = hexMatch[1];

    if (hexMatch.length === 3) {
      hexMatch = [
        hexMatch.charAt(0) + hexMatch.charAt(0),
        hexMatch.charAt(1) + hexMatch.charAt(1),
        hexMatch.charAt(2) + hexMatch.charAt(2)
      ];
    } else {
      hexMatch = [
        hexMatch.substring(0, 2),
        hexMatch.substring(2, 4),
        hexMatch.substring(4, 6)
      ];
    }

    red = parseInt(hexMatch[0], 16);
    green = parseInt(hexMatch[1], 16);
    blue = parseInt(hexMatch[2], 16);

    return { r: red, g: green, b: blue };
  }

  var rgbMatch = source.match(/^rgb\(\s*(\d{1,3}%?),\s*(\d{1,3}%?),\s*(\d{1,3}%?)\s*\)$/i);
  if (rgbMatch) {
    red = parseComponentValue(rgbMatch[1]);
    green = parseComponentValue(rgbMatch[2]);
    blue = parseComponentValue(rgbMatch[3]);

    return { r: red, g: green, b: blue };
  }

  throw new Error('Unable to parse color: '+JSON.stringify(source));
}

function createColorSpec(input, name) {
  var color = {};

  if (name) {
    color.name = name;
  }

  if (typeof input === 'string') {
    color.source = input;
    color.rgb = parseColor(input);

  } else if (typeof input === 'object') {
    // This is for if/when we're concatenating lists of colors.
    if (input.source) {
      return createColorSpec(input.source, input.name);
    }

    color.rgb = input;
    color.source = rgbToHex(input);
  }

  return color;
}

function rgbToHex(rgb) {
  const leadZero = v => v.length === 1 ? '0' + v: v;
  return '#' +
    leadZero(rgb.r.toString(16)) +
    leadZero(rgb.g.toString(16)) +
    leadZero(rgb.b.toString(16));
}

function getFromGradient(percent, startColor, endColor) {
  const color = {};
  for (let c of ['r', 'g', 'b']) {
    let diff = endColor.rgb[c] - startColor.rgb[c];
    diff = Math.round((diff * percent/100) + startColor.rgb[c]);
    color[c] = diff
  }
  return createColorSpec(color);
}

function getFromMultiGradient(percent, colors) {
  colors = mapColors(colors);
  percent = percent < 1 ? 0 : percent >= 100  ? 99.9 : percent;
  const colorSections = colors.length - 1;
  const sectionPercent = 100/colorSections;
  const sectionStartIndex = Math.floor(percent/sectionPercent);
  const sectionEndIndex = sectionStartIndex + 1;
  const sectionFadePct = percent % sectionPercent;
  const totalSectionFadePct = Math.round(sectionFadePct / sectionPercent*100);
  const startColor = colors[sectionStartIndex];
  const endColor = colors[sectionEndIndex];

  return getFromGradient(totalSectionFadePct, startColor, endColor);
}

function getPositionPercent(elem) {
  const boundingRect = elem.getBoundingClientRect();
  if (boundingRect.bottom < 0) return null; // skip if we can't see it
  const logPosition = document.querySelector("#log").getBoundingClientRect();
  return boundingRect.bottom/logPosition.bottom;
}

document.addEventListener('onLoad', function setup() {
  let jsConfig = document.getElementById('jsconfig').attributes;
  nameColors = mapColors(jsConfig.nameColorList.value);
  messageColors = mapColors(jsConfig.messageColorList.value);
  opacityConfig = jsConfig.opacitySelect.value === "yes";
});

document.addEventListener('onEventReceived', function receiveMessage(event) {
  if (event.detail.command === 'PRIVMSG') {
    // Changing the username
    $('.name').each((i, elem) => {
      // Set the color of the username element
  		const percent = getPositionPercent(elem) || 1;
  		elem.style.setProperty('--endColor', getFromMultiGradient(percent*100, nameColors).source);
    });
    $('.message').each((i, elem) => {
      // Set the color of the username element
  		const percent = getPositionPercent(elem) || 1;
  		elem.style.setProperty('--endColor', getFromMultiGradient(percent*100, messageColors).source);
    });

    if (opacityConfig) {
    	/** Changing all the wrapped messages */
      $(".wrap").each((i, elem) => { // For every message
        // Set the opacity of the message based on its relative position
        const opacityPercent = getPositionPercent(elem);
        if (opacityPercent) {
          elem.style.setProperty('--opacityEnd', opacityPercent);
        } else {
          elem.style.display = 'none';
        }
      });
    }
  }
});
