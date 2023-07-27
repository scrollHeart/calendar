
export const format = function (dateObj, mask) {
  var fecha = {};
var token = /d{1,4}|M{1,4}|yy(?:yy)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
var literal = /\[([^]*?)\]/gm;

function pad(val, len) {
  val = String(val);
  len = len || 2;
  while (val.length < len) {
    val = '0' + val;
  }
  return val;
}

var formatFlags = {
  D: function(dateObj) {
    return dateObj.getDay();
  },
  DD: function(dateObj) {
    return pad(dateObj.getDay());
  },
  Do: function(dateObj, i18n) {
    return i18n.DoFn(dateObj.getDate());
  },
  d: function(dateObj) {
    return dateObj.getDate();
  },
  dd: function(dateObj) {
    return pad(dateObj.getDate());
  },
  ddd: function(dateObj, i18n) {
    return i18n.dayNamesShort[dateObj.getDay()];
  },
  dddd: function(dateObj, i18n) {
    return i18n.dayNames[dateObj.getDay()];
  },
  M: function(dateObj) {
    return dateObj.getMonth() + 1;
  },
  MM: function(dateObj) {
    return pad(dateObj.getMonth() + 1);
  },
  MMM: function(dateObj, i18n) {
    return i18n.monthNamesShort[dateObj.getMonth()];
  },
  MMMM: function(dateObj, i18n) {
    return i18n.monthNames[dateObj.getMonth()];
  },
  yy: function(dateObj) {
    return pad(String(dateObj.getFullYear()), 4).substr(2);
  },
  yyyy: function(dateObj) {
    return pad(dateObj.getFullYear(), 4);
  },
};

fecha.masks = {
  default: 'ddd MMM dd yyyy HH:mm:ss',
  shortDate: 'M/D/yy',
  mediumDate: 'MMM d, yyyy',
  longDate: 'MMMM d, yyyy',
  fullDate: 'dddd, MMMM d, yyyy',
  shortTime: 'HH:mm',
  mediumTime: 'HH:mm:ss',
  longTime: 'HH:mm:ss.SSS'
};
  // var i18n = i18nSettings || fecha.i18n;

  if (typeof dateObj === 'number') {
    dateObj = new Date(dateObj);
  }

  if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
    throw new Error('Invalid Date in fecha.format');
  }

  mask = fecha.masks[mask] || mask || fecha.masks['default'];

  var literals = [];

  mask = mask.replace(literal, function($0, $1) {
    literals.push($1);
    return '@@@';
  });
  mask = mask.replace(token, function ($0) {
    // return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    return $0 in formatFlags ? formatFlags[$0](dateObj) : $0.slice(1, $0.length - 1);
  });
  return mask.replace(/@@@/g, function() {
    return literals.shift();
  });
};
