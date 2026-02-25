import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-C45OCT45.js";
import {
  AuthService,
  ChangeDetectorRef,
  CommonModule,
  Component,
  EventEmitter,
  HostListener,
  HttpClient,
  Injectable,
  Input,
  NgZone,
  Observable,
  Output,
  Subject,
  ViewChild,
  __commonJS,
  __export,
  __spreadProps,
  __spreadValues,
  __toESM,
  computed,
  inject,
  setClassMetadata,
  signal,
  take,
  takeUntil,
  tap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵstyleProp,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty,
  ɵɵviewQuery
} from "./chunk-AK7BGKVV.js";

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports, module) {
    "use strict";
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse2(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse2(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports, module) {
    "use strict";
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug2(...args) {
          if (!debug2.enabled) {
            return;
          }
          const self2 = debug2;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self2.diff = ms;
          self2.prev = prevTime;
          self2.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self2, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self2, args);
          const logFn = self2.log || createDebug.log;
          logFn.apply(self2, args);
        }
        debug2.namespace = namespace;
        debug2.useColors = createDebug.useColors();
        debug2.color = createDebug.selectColor(namespace);
        debug2.extend = extend;
        debug2.destroy = createDebug.destroy;
        Object.defineProperty(debug2, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug2);
        }
        return debug2;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports, module) {
    "use strict";
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;
    exports.storage = localstorage();
    exports.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports.storage.setItem("debug", namespaces);
        } else {
          exports.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports.storage.getItem("debug") || exports.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module.exports = require_common()(exports);
    var { formatters } = module.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// src/app/core/services/chat.service.ts
var API = "http://172.31.58.150:5001/api";
var ChatService = class _ChatService {
  http;
  chats = signal([], ...ngDevMode ? [{ debugName: "chats" }] : []);
  activeChat = signal(null, ...ngDevMode ? [{ debugName: "activeChat" }] : []);
  messages = signal([], ...ngDevMode ? [{ debugName: "messages" }] : []);
  typingUsers = signal({}, ...ngDevMode ? [{ debugName: "typingUsers" }] : []);
  constructor(http) {
    this.http = http;
  }
  getChats() {
    return this.http.get(`${API}/chats`).pipe(tap((res) => {
      if (res.success)
        this.chats.set(res.data.chats || []);
    }));
  }
  createDirectChat(targetUserId) {
    return this.http.post(`${API}/chats/direct`, { targetUserId }).pipe(tap((res) => {
      if (res.success) {
        const chat = res.data.chat;
        this.chats.update((list) => {
          const exists = list.find((c) => c._id === chat._id);
          return exists ? list.map((c) => c._id === chat._id ? chat : c) : [chat, ...list];
        });
      }
    }));
  }
  // FIXED: was /api/chats/:id/messages -> now /api/messages/:id (matches backend route)
  getMessages(chatId, page = 1) {
    return this.http.get(`${API}/messages/${chatId}?page=${page}&limit=50`).pipe(tap((res) => {
      if (res.success)
        this.messages.set(res.data.messages || []);
    }));
  }
  addMessage(message) {
    this.messages.update((msgs) => [...msgs, message]);
    this.chats.update((list) => list.map((c) => c._id === message.chat ? __spreadProps(__spreadValues({}, c), { lastMessage: message, lastActivity: message.createdAt }) : c));
  }
  // FIXED: was ?query= -> now ?q= (matches backend route)
  searchUsers(q) {
    return this.http.get(`${API}/users/search?q=${encodeURIComponent(q)}`);
  }
  setTyping(chatId, userId, typing) {
    this.typingUsers.update((map) => {
      const users = map[chatId] || [];
      return __spreadProps(__spreadValues({}, map), { [chatId]: typing ? [.../* @__PURE__ */ new Set([...users, userId])] : users.filter((id) => id !== userId) });
    });
  }
  getChatName(chat, myId) {
    if (chat.type === "group")
      return chat.name || "Group";
    return this.getOtherUser(chat, myId)?.name || "Unknown";
  }
  getOtherUser(chat, myId) {
    return chat.members.find((m) => m.user._id !== myId)?.user || null;
  }
  avatarColor(name) {
    const colors = ["#6C63FF", "#FF6B9D", "#00D4AA", "#FFB800", "#FF6B6B", "#3498DB", "#2ECC71", "#E67E22"];
    let h = 0;
    for (const c of name)
      h = c.charCodeAt(0) + ((h << 5) - h);
    return colors[Math.abs(h) % colors.length];
  }
  initials(name) {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  }
  static \u0275fac = function ChatService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChatService)(\u0275\u0275inject(HttpClient));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ChatService, factory: _ChatService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], () => [{ type: HttpClient }], null);
})();

// node_modules/engine.io-parser/build/esm/commons.js
var PACKET_TYPES = /* @__PURE__ */ Object.create(null);
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
var PACKET_TYPES_REVERSE = /* @__PURE__ */ Object.create(null);
Object.keys(PACKET_TYPES).forEach((key) => {
  PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
var ERROR_PACKET = { type: "error", data: "parser error" };

// node_modules/engine.io-parser/build/esm/encodePacket.browser.js
var withNativeBlob = typeof Blob === "function" || typeof Blob !== "undefined" && Object.prototype.toString.call(Blob) === "[object BlobConstructor]";
var withNativeArrayBuffer = typeof ArrayBuffer === "function";
var isView = (obj) => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj && obj.buffer instanceof ArrayBuffer;
};
var encodePacket = ({ type, data }, supportsBinary, callback) => {
  if (withNativeBlob && data instanceof Blob) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(data, callback);
    }
  } else if (withNativeArrayBuffer && (data instanceof ArrayBuffer || isView(data))) {
    if (supportsBinary) {
      return callback(data);
    } else {
      return encodeBlobAsBase64(new Blob([data]), callback);
    }
  }
  return callback(PACKET_TYPES[type] + (data || ""));
};
var encodeBlobAsBase64 = (data, callback) => {
  const fileReader = new FileReader();
  fileReader.onload = function() {
    const content = fileReader.result.split(",")[1];
    callback("b" + (content || ""));
  };
  return fileReader.readAsDataURL(data);
};
function toArray(data) {
  if (data instanceof Uint8Array) {
    return data;
  } else if (data instanceof ArrayBuffer) {
    return new Uint8Array(data);
  } else {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  }
}
var TEXT_ENCODER;
function encodePacketToBinary(packet, callback) {
  if (withNativeBlob && packet.data instanceof Blob) {
    return packet.data.arrayBuffer().then(toArray).then(callback);
  } else if (withNativeArrayBuffer && (packet.data instanceof ArrayBuffer || isView(packet.data))) {
    return callback(toArray(packet.data));
  }
  encodePacket(packet, false, (encoded) => {
    if (!TEXT_ENCODER) {
      TEXT_ENCODER = new TextEncoder();
    }
    callback(TEXT_ENCODER.encode(encoded));
  });
}

// node_modules/engine.io-parser/build/esm/contrib/base64-arraybuffer.js
var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var lookup = typeof Uint8Array === "undefined" ? [] : new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}
var decode = (base64) => {
  let bufferLength = base64.length * 0.75, len = base64.length, i, p = 0, encoded1, encoded2, encoded3, encoded4;
  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }
  const arraybuffer = new ArrayBuffer(bufferLength), bytes = new Uint8Array(arraybuffer);
  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];
    bytes[p++] = encoded1 << 2 | encoded2 >> 4;
    bytes[p++] = (encoded2 & 15) << 4 | encoded3 >> 2;
    bytes[p++] = (encoded3 & 3) << 6 | encoded4 & 63;
  }
  return arraybuffer;
};

// node_modules/engine.io-parser/build/esm/decodePacket.browser.js
var withNativeArrayBuffer2 = typeof ArrayBuffer === "function";
var decodePacket = (encodedPacket, binaryType) => {
  if (typeof encodedPacket !== "string") {
    return {
      type: "message",
      data: mapBinary(encodedPacket, binaryType)
    };
  }
  const type = encodedPacket.charAt(0);
  if (type === "b") {
    return {
      type: "message",
      data: decodeBase64Packet(encodedPacket.substring(1), binaryType)
    };
  }
  const packetType = PACKET_TYPES_REVERSE[type];
  if (!packetType) {
    return ERROR_PACKET;
  }
  return encodedPacket.length > 1 ? {
    type: PACKET_TYPES_REVERSE[type],
    data: encodedPacket.substring(1)
  } : {
    type: PACKET_TYPES_REVERSE[type]
  };
};
var decodeBase64Packet = (data, binaryType) => {
  if (withNativeArrayBuffer2) {
    const decoded = decode(data);
    return mapBinary(decoded, binaryType);
  } else {
    return { base64: true, data };
  }
};
var mapBinary = (data, binaryType) => {
  switch (binaryType) {
    case "blob":
      if (data instanceof Blob) {
        return data;
      } else {
        return new Blob([data]);
      }
    case "arraybuffer":
    default:
      if (data instanceof ArrayBuffer) {
        return data;
      } else {
        return data.buffer;
      }
  }
};

// node_modules/engine.io-parser/build/esm/index.js
var SEPARATOR = String.fromCharCode(30);
var encodePayload = (packets, callback) => {
  const length = packets.length;
  const encodedPackets = new Array(length);
  let count = 0;
  packets.forEach((packet, i) => {
    encodePacket(packet, false, (encodedPacket) => {
      encodedPackets[i] = encodedPacket;
      if (++count === length) {
        callback(encodedPackets.join(SEPARATOR));
      }
    });
  });
};
var decodePayload = (encodedPayload, binaryType) => {
  const encodedPackets = encodedPayload.split(SEPARATOR);
  const packets = [];
  for (let i = 0; i < encodedPackets.length; i++) {
    const decodedPacket = decodePacket(encodedPackets[i], binaryType);
    packets.push(decodedPacket);
    if (decodedPacket.type === "error") {
      break;
    }
  }
  return packets;
};
function createPacketEncoderStream() {
  return new TransformStream({
    transform(packet, controller) {
      encodePacketToBinary(packet, (encodedPacket) => {
        const payloadLength = encodedPacket.length;
        let header;
        if (payloadLength < 126) {
          header = new Uint8Array(1);
          new DataView(header.buffer).setUint8(0, payloadLength);
        } else if (payloadLength < 65536) {
          header = new Uint8Array(3);
          const view = new DataView(header.buffer);
          view.setUint8(0, 126);
          view.setUint16(1, payloadLength);
        } else {
          header = new Uint8Array(9);
          const view = new DataView(header.buffer);
          view.setUint8(0, 127);
          view.setBigUint64(1, BigInt(payloadLength));
        }
        if (packet.data && typeof packet.data !== "string") {
          header[0] |= 128;
        }
        controller.enqueue(header);
        controller.enqueue(encodedPacket);
      });
    }
  });
}
var TEXT_DECODER;
function totalLength(chunks) {
  return chunks.reduce((acc, chunk) => acc + chunk.length, 0);
}
function concatChunks(chunks, size) {
  if (chunks[0].length === size) {
    return chunks.shift();
  }
  const buffer = new Uint8Array(size);
  let j = 0;
  for (let i = 0; i < size; i++) {
    buffer[i] = chunks[0][j++];
    if (j === chunks[0].length) {
      chunks.shift();
      j = 0;
    }
  }
  if (chunks.length && j < chunks[0].length) {
    chunks[0] = chunks[0].slice(j);
  }
  return buffer;
}
function createPacketDecoderStream(maxPayload, binaryType) {
  if (!TEXT_DECODER) {
    TEXT_DECODER = new TextDecoder();
  }
  const chunks = [];
  let state = 0;
  let expectedLength = -1;
  let isBinary2 = false;
  return new TransformStream({
    transform(chunk, controller) {
      chunks.push(chunk);
      while (true) {
        if (state === 0) {
          if (totalLength(chunks) < 1) {
            break;
          }
          const header = concatChunks(chunks, 1);
          isBinary2 = (header[0] & 128) === 128;
          expectedLength = header[0] & 127;
          if (expectedLength < 126) {
            state = 3;
          } else if (expectedLength === 126) {
            state = 1;
          } else {
            state = 2;
          }
        } else if (state === 1) {
          if (totalLength(chunks) < 2) {
            break;
          }
          const headerArray = concatChunks(chunks, 2);
          expectedLength = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length).getUint16(0);
          state = 3;
        } else if (state === 2) {
          if (totalLength(chunks) < 8) {
            break;
          }
          const headerArray = concatChunks(chunks, 8);
          const view = new DataView(headerArray.buffer, headerArray.byteOffset, headerArray.length);
          const n = view.getUint32(0);
          if (n > Math.pow(2, 53 - 32) - 1) {
            controller.enqueue(ERROR_PACKET);
            break;
          }
          expectedLength = n * Math.pow(2, 32) + view.getUint32(4);
          state = 3;
        } else {
          if (totalLength(chunks) < expectedLength) {
            break;
          }
          const data = concatChunks(chunks, expectedLength);
          controller.enqueue(decodePacket(isBinary2 ? data : TEXT_DECODER.decode(data), binaryType));
          state = 0;
        }
        if (expectedLength === 0 || expectedLength > maxPayload) {
          controller.enqueue(ERROR_PACKET);
          break;
        }
      }
    }
  });
}
var protocol = 4;

// node_modules/@socket.io/component-emitter/lib/esm/index.js
function Emitter(obj) {
  if (obj) return mixin(obj);
}
function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}
Emitter.prototype.on = Emitter.prototype.addEventListener = function(event, fn) {
  this._callbacks = this._callbacks || {};
  (this._callbacks["$" + event] = this._callbacks["$" + event] || []).push(fn);
  return this;
};
Emitter.prototype.once = function(event, fn) {
  function on2() {
    this.off(event, on2);
    fn.apply(this, arguments);
  }
  on2.fn = fn;
  this.on(event, on2);
  return this;
};
Emitter.prototype.off = Emitter.prototype.removeListener = Emitter.prototype.removeAllListeners = Emitter.prototype.removeEventListener = function(event, fn) {
  this._callbacks = this._callbacks || {};
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }
  var callbacks = this._callbacks["$" + event];
  if (!callbacks) return this;
  if (1 == arguments.length) {
    delete this._callbacks["$" + event];
    return this;
  }
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  if (callbacks.length === 0) {
    delete this._callbacks["$" + event];
  }
  return this;
};
Emitter.prototype.emit = function(event) {
  this._callbacks = this._callbacks || {};
  var args = new Array(arguments.length - 1), callbacks = this._callbacks["$" + event];
  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }
  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }
  return this;
};
Emitter.prototype.emitReserved = Emitter.prototype.emit;
Emitter.prototype.listeners = function(event) {
  this._callbacks = this._callbacks || {};
  return this._callbacks["$" + event] || [];
};
Emitter.prototype.hasListeners = function(event) {
  return !!this.listeners(event).length;
};

// node_modules/engine.io-client/build/esm/globals.js
var nextTick = (() => {
  const isPromiseAvailable = typeof Promise === "function" && typeof Promise.resolve === "function";
  if (isPromiseAvailable) {
    return (cb) => Promise.resolve().then(cb);
  } else {
    return (cb, setTimeoutFn) => setTimeoutFn(cb, 0);
  }
})();
var globalThisShim = (() => {
  if (typeof self !== "undefined") {
    return self;
  } else if (typeof window !== "undefined") {
    return window;
  } else {
    return Function("return this")();
  }
})();
var defaultBinaryType = "arraybuffer";
function createCookieJar() {
}

// node_modules/engine.io-client/build/esm/util.js
function pick(obj, ...attr) {
  return attr.reduce((acc, k) => {
    if (obj.hasOwnProperty(k)) {
      acc[k] = obj[k];
    }
    return acc;
  }, {});
}
var NATIVE_SET_TIMEOUT = globalThisShim.setTimeout;
var NATIVE_CLEAR_TIMEOUT = globalThisShim.clearTimeout;
function installTimerFunctions(obj, opts) {
  if (opts.useNativeTimers) {
    obj.setTimeoutFn = NATIVE_SET_TIMEOUT.bind(globalThisShim);
    obj.clearTimeoutFn = NATIVE_CLEAR_TIMEOUT.bind(globalThisShim);
  } else {
    obj.setTimeoutFn = globalThisShim.setTimeout.bind(globalThisShim);
    obj.clearTimeoutFn = globalThisShim.clearTimeout.bind(globalThisShim);
  }
}
var BASE64_OVERHEAD = 1.33;
function byteLength(obj) {
  if (typeof obj === "string") {
    return utf8Length(obj);
  }
  return Math.ceil((obj.byteLength || obj.size) * BASE64_OVERHEAD);
}
function utf8Length(str) {
  let c = 0, length = 0;
  for (let i = 0, l = str.length; i < l; i++) {
    c = str.charCodeAt(i);
    if (c < 128) {
      length += 1;
    } else if (c < 2048) {
      length += 2;
    } else if (c < 55296 || c >= 57344) {
      length += 3;
    } else {
      i++;
      length += 4;
    }
  }
  return length;
}
function randomString() {
  return Date.now().toString(36).substring(3) + Math.random().toString(36).substring(2, 5);
}

// node_modules/engine.io-client/build/esm/contrib/parseqs.js
function encode(obj) {
  let str = "";
  for (let i in obj) {
    if (obj.hasOwnProperty(i)) {
      if (str.length)
        str += "&";
      str += encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]);
    }
  }
  return str;
}
function decode2(qs) {
  let qry = {};
  let pairs = qs.split("&");
  for (let i = 0, l = pairs.length; i < l; i++) {
    let pair = pairs[i].split("=");
    qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return qry;
}

// node_modules/engine.io-client/build/esm/transport.js
var TransportError = class extends Error {
  constructor(reason, description, context) {
    super(reason);
    this.description = description;
    this.context = context;
    this.type = "TransportError";
  }
};
var Transport = class extends Emitter {
  /**
   * Transport abstract constructor.
   *
   * @param {Object} opts - options
   * @protected
   */
  constructor(opts) {
    super();
    this.writable = false;
    installTimerFunctions(this, opts);
    this.opts = opts;
    this.query = opts.query;
    this.socket = opts.socket;
    this.supportsBinary = !opts.forceBase64;
  }
  /**
   * Emits an error.
   *
   * @param {String} reason
   * @param description
   * @param context - the error context
   * @return {Transport} for chaining
   * @protected
   */
  onError(reason, description, context) {
    super.emitReserved("error", new TransportError(reason, description, context));
    return this;
  }
  /**
   * Opens the transport.
   */
  open() {
    this.readyState = "opening";
    this.doOpen();
    return this;
  }
  /**
   * Closes the transport.
   */
  close() {
    if (this.readyState === "opening" || this.readyState === "open") {
      this.doClose();
      this.onClose();
    }
    return this;
  }
  /**
   * Sends multiple packets.
   *
   * @param {Array} packets
   */
  send(packets) {
    if (this.readyState === "open") {
      this.write(packets);
    } else {
    }
  }
  /**
   * Called upon open
   *
   * @protected
   */
  onOpen() {
    this.readyState = "open";
    this.writable = true;
    super.emitReserved("open");
  }
  /**
   * Called with data.
   *
   * @param {String} data
   * @protected
   */
  onData(data) {
    const packet = decodePacket(data, this.socket.binaryType);
    this.onPacket(packet);
  }
  /**
   * Called with a decoded packet.
   *
   * @protected
   */
  onPacket(packet) {
    super.emitReserved("packet", packet);
  }
  /**
   * Called upon close.
   *
   * @protected
   */
  onClose(details) {
    this.readyState = "closed";
    super.emitReserved("close", details);
  }
  /**
   * Pauses the transport, in order not to lose packets during an upgrade.
   *
   * @param onPause
   */
  pause(onPause) {
  }
  createUri(schema, query = {}) {
    return schema + "://" + this._hostname() + this._port() + this.opts.path + this._query(query);
  }
  _hostname() {
    const hostname = this.opts.hostname;
    return hostname.indexOf(":") === -1 ? hostname : "[" + hostname + "]";
  }
  _port() {
    if (this.opts.port && (this.opts.secure && Number(this.opts.port) !== 443 || !this.opts.secure && Number(this.opts.port) !== 80)) {
      return ":" + this.opts.port;
    } else {
      return "";
    }
  }
  _query(query) {
    const encodedQuery = encode(query);
    return encodedQuery.length ? "?" + encodedQuery : "";
  }
};

// node_modules/engine.io-client/build/esm/transports/polling.js
var Polling = class extends Transport {
  constructor() {
    super(...arguments);
    this._polling = false;
  }
  get name() {
    return "polling";
  }
  /**
   * Opens the socket (triggers polling). We write a PING message to determine
   * when the transport is open.
   *
   * @protected
   */
  doOpen() {
    this._poll();
  }
  /**
   * Pauses polling.
   *
   * @param {Function} onPause - callback upon buffers are flushed and transport is paused
   * @package
   */
  pause(onPause) {
    this.readyState = "pausing";
    const pause = () => {
      this.readyState = "paused";
      onPause();
    };
    if (this._polling || !this.writable) {
      let total = 0;
      if (this._polling) {
        total++;
        this.once("pollComplete", function() {
          --total || pause();
        });
      }
      if (!this.writable) {
        total++;
        this.once("drain", function() {
          --total || pause();
        });
      }
    } else {
      pause();
    }
  }
  /**
   * Starts polling cycle.
   *
   * @private
   */
  _poll() {
    this._polling = true;
    this.doPoll();
    this.emitReserved("poll");
  }
  /**
   * Overloads onData to detect payloads.
   *
   * @protected
   */
  onData(data) {
    const callback = (packet) => {
      if ("opening" === this.readyState && packet.type === "open") {
        this.onOpen();
      }
      if ("close" === packet.type) {
        this.onClose({ description: "transport closed by the server" });
        return false;
      }
      this.onPacket(packet);
    };
    decodePayload(data, this.socket.binaryType).forEach(callback);
    if ("closed" !== this.readyState) {
      this._polling = false;
      this.emitReserved("pollComplete");
      if ("open" === this.readyState) {
        this._poll();
      } else {
      }
    }
  }
  /**
   * For polling, send a close packet.
   *
   * @protected
   */
  doClose() {
    const close = () => {
      this.write([{ type: "close" }]);
    };
    if ("open" === this.readyState) {
      close();
    } else {
      this.once("open", close);
    }
  }
  /**
   * Writes a packets payload.
   *
   * @param {Array} packets - data packets
   * @protected
   */
  write(packets) {
    this.writable = false;
    encodePayload(packets, (data) => {
      this.doWrite(data, () => {
        this.writable = true;
        this.emitReserved("drain");
      });
    });
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const schema = this.opts.secure ? "https" : "http";
    const query = this.query || {};
    if (false !== this.opts.timestampRequests) {
      query[this.opts.timestampParam] = randomString();
    }
    if (!this.supportsBinary && !query.sid) {
      query.b64 = 1;
    }
    return this.createUri(schema, query);
  }
};

// node_modules/engine.io-client/build/esm/contrib/has-cors.js
var value = false;
try {
  value = typeof XMLHttpRequest !== "undefined" && "withCredentials" in new XMLHttpRequest();
} catch (err) {
}
var hasCORS = value;

// node_modules/engine.io-client/build/esm/transports/polling-xhr.js
function empty() {
}
var BaseXHR = class extends Polling {
  /**
   * XHR Polling constructor.
   *
   * @param {Object} opts
   * @package
   */
  constructor(opts) {
    super(opts);
    if (typeof location !== "undefined") {
      const isSSL = "https:" === location.protocol;
      let port = location.port;
      if (!port) {
        port = isSSL ? "443" : "80";
      }
      this.xd = typeof location !== "undefined" && opts.hostname !== location.hostname || port !== opts.port;
    }
  }
  /**
   * Sends data.
   *
   * @param {String} data to send.
   * @param {Function} called upon flush.
   * @private
   */
  doWrite(data, fn) {
    const req = this.request({
      method: "POST",
      data
    });
    req.on("success", fn);
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr post error", xhrStatus, context);
    });
  }
  /**
   * Starts a poll cycle.
   *
   * @private
   */
  doPoll() {
    const req = this.request();
    req.on("data", this.onData.bind(this));
    req.on("error", (xhrStatus, context) => {
      this.onError("xhr poll error", xhrStatus, context);
    });
    this.pollXhr = req;
  }
};
var Request = class _Request extends Emitter {
  /**
   * Request constructor
   *
   * @param {Object} options
   * @package
   */
  constructor(createRequest, uri, opts) {
    super();
    this.createRequest = createRequest;
    installTimerFunctions(this, opts);
    this._opts = opts;
    this._method = opts.method || "GET";
    this._uri = uri;
    this._data = void 0 !== opts.data ? opts.data : null;
    this._create();
  }
  /**
   * Creates the XHR object and sends the request.
   *
   * @private
   */
  _create() {
    var _a;
    const opts = pick(this._opts, "agent", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "autoUnref");
    opts.xdomain = !!this._opts.xd;
    const xhr = this._xhr = this.createRequest(opts);
    try {
      xhr.open(this._method, this._uri, true);
      try {
        if (this._opts.extraHeaders) {
          xhr.setDisableHeaderCheck && xhr.setDisableHeaderCheck(true);
          for (let i in this._opts.extraHeaders) {
            if (this._opts.extraHeaders.hasOwnProperty(i)) {
              xhr.setRequestHeader(i, this._opts.extraHeaders[i]);
            }
          }
        }
      } catch (e) {
      }
      if ("POST" === this._method) {
        try {
          xhr.setRequestHeader("Content-type", "text/plain;charset=UTF-8");
        } catch (e) {
        }
      }
      try {
        xhr.setRequestHeader("Accept", "*/*");
      } catch (e) {
      }
      (_a = this._opts.cookieJar) === null || _a === void 0 ? void 0 : _a.addCookies(xhr);
      if ("withCredentials" in xhr) {
        xhr.withCredentials = this._opts.withCredentials;
      }
      if (this._opts.requestTimeout) {
        xhr.timeout = this._opts.requestTimeout;
      }
      xhr.onreadystatechange = () => {
        var _a2;
        if (xhr.readyState === 3) {
          (_a2 = this._opts.cookieJar) === null || _a2 === void 0 ? void 0 : _a2.parseCookies(
            // @ts-ignore
            xhr.getResponseHeader("set-cookie")
          );
        }
        if (4 !== xhr.readyState)
          return;
        if (200 === xhr.status || 1223 === xhr.status) {
          this._onLoad();
        } else {
          this.setTimeoutFn(() => {
            this._onError(typeof xhr.status === "number" ? xhr.status : 0);
          }, 0);
        }
      };
      xhr.send(this._data);
    } catch (e) {
      this.setTimeoutFn(() => {
        this._onError(e);
      }, 0);
      return;
    }
    if (typeof document !== "undefined") {
      this._index = _Request.requestsCount++;
      _Request.requests[this._index] = this;
    }
  }
  /**
   * Called upon error.
   *
   * @private
   */
  _onError(err) {
    this.emitReserved("error", err, this._xhr);
    this._cleanup(true);
  }
  /**
   * Cleans up house.
   *
   * @private
   */
  _cleanup(fromError) {
    if ("undefined" === typeof this._xhr || null === this._xhr) {
      return;
    }
    this._xhr.onreadystatechange = empty;
    if (fromError) {
      try {
        this._xhr.abort();
      } catch (e) {
      }
    }
    if (typeof document !== "undefined") {
      delete _Request.requests[this._index];
    }
    this._xhr = null;
  }
  /**
   * Called upon load.
   *
   * @private
   */
  _onLoad() {
    const data = this._xhr.responseText;
    if (data !== null) {
      this.emitReserved("data", data);
      this.emitReserved("success");
      this._cleanup();
    }
  }
  /**
   * Aborts the request.
   *
   * @package
   */
  abort() {
    this._cleanup();
  }
};
Request.requestsCount = 0;
Request.requests = {};
if (typeof document !== "undefined") {
  if (typeof attachEvent === "function") {
    attachEvent("onunload", unloadHandler);
  } else if (typeof addEventListener === "function") {
    const terminationEvent = "onpagehide" in globalThisShim ? "pagehide" : "unload";
    addEventListener(terminationEvent, unloadHandler, false);
  }
}
function unloadHandler() {
  for (let i in Request.requests) {
    if (Request.requests.hasOwnProperty(i)) {
      Request.requests[i].abort();
    }
  }
}
var hasXHR2 = (function() {
  const xhr = newRequest({
    xdomain: false
  });
  return xhr && xhr.responseType !== null;
})();
var XHR = class extends BaseXHR {
  constructor(opts) {
    super(opts);
    const forceBase64 = opts && opts.forceBase64;
    this.supportsBinary = hasXHR2 && !forceBase64;
  }
  request(opts = {}) {
    Object.assign(opts, { xd: this.xd }, this.opts);
    return new Request(newRequest, this.uri(), opts);
  }
};
function newRequest(opts) {
  const xdomain = opts.xdomain;
  try {
    if ("undefined" !== typeof XMLHttpRequest && (!xdomain || hasCORS)) {
      return new XMLHttpRequest();
    }
  } catch (e) {
  }
  if (!xdomain) {
    try {
      return new globalThisShim[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP");
    } catch (e) {
    }
  }
}

// node_modules/engine.io-client/build/esm/transports/websocket.js
var isReactNative = typeof navigator !== "undefined" && typeof navigator.product === "string" && navigator.product.toLowerCase() === "reactnative";
var BaseWS = class extends Transport {
  get name() {
    return "websocket";
  }
  doOpen() {
    const uri = this.uri();
    const protocols = this.opts.protocols;
    const opts = isReactNative ? {} : pick(this.opts, "agent", "perMessageDeflate", "pfx", "key", "passphrase", "cert", "ca", "ciphers", "rejectUnauthorized", "localAddress", "protocolVersion", "origin", "maxPayload", "family", "checkServerIdentity");
    if (this.opts.extraHeaders) {
      opts.headers = this.opts.extraHeaders;
    }
    try {
      this.ws = this.createSocket(uri, protocols, opts);
    } catch (err) {
      return this.emitReserved("error", err);
    }
    this.ws.binaryType = this.socket.binaryType;
    this.addEventListeners();
  }
  /**
   * Adds event listeners to the socket
   *
   * @private
   */
  addEventListeners() {
    this.ws.onopen = () => {
      if (this.opts.autoUnref) {
        this.ws._socket.unref();
      }
      this.onOpen();
    };
    this.ws.onclose = (closeEvent) => this.onClose({
      description: "websocket connection closed",
      context: closeEvent
    });
    this.ws.onmessage = (ev) => this.onData(ev.data);
    this.ws.onerror = (e) => this.onError("websocket error", e);
  }
  write(packets) {
    this.writable = false;
    for (let i = 0; i < packets.length; i++) {
      const packet = packets[i];
      const lastPacket = i === packets.length - 1;
      encodePacket(packet, this.supportsBinary, (data) => {
        try {
          this.doWrite(packet, data);
        } catch (e) {
        }
        if (lastPacket) {
          nextTick(() => {
            this.writable = true;
            this.emitReserved("drain");
          }, this.setTimeoutFn);
        }
      });
    }
  }
  doClose() {
    if (typeof this.ws !== "undefined") {
      this.ws.onerror = () => {
      };
      this.ws.close();
      this.ws = null;
    }
  }
  /**
   * Generates uri for connection.
   *
   * @private
   */
  uri() {
    const schema = this.opts.secure ? "wss" : "ws";
    const query = this.query || {};
    if (this.opts.timestampRequests) {
      query[this.opts.timestampParam] = randomString();
    }
    if (!this.supportsBinary) {
      query.b64 = 1;
    }
    return this.createUri(schema, query);
  }
};
var WebSocketCtor = globalThisShim.WebSocket || globalThisShim.MozWebSocket;
var WS = class extends BaseWS {
  createSocket(uri, protocols, opts) {
    return !isReactNative ? protocols ? new WebSocketCtor(uri, protocols) : new WebSocketCtor(uri) : new WebSocketCtor(uri, protocols, opts);
  }
  doWrite(_packet, data) {
    this.ws.send(data);
  }
};

// node_modules/engine.io-client/build/esm/transports/webtransport.js
var WT = class extends Transport {
  get name() {
    return "webtransport";
  }
  doOpen() {
    try {
      this._transport = new WebTransport(this.createUri("https"), this.opts.transportOptions[this.name]);
    } catch (err) {
      return this.emitReserved("error", err);
    }
    this._transport.closed.then(() => {
      this.onClose();
    }).catch((err) => {
      this.onError("webtransport error", err);
    });
    this._transport.ready.then(() => {
      this._transport.createBidirectionalStream().then((stream) => {
        const decoderStream = createPacketDecoderStream(Number.MAX_SAFE_INTEGER, this.socket.binaryType);
        const reader = stream.readable.pipeThrough(decoderStream).getReader();
        const encoderStream = createPacketEncoderStream();
        encoderStream.readable.pipeTo(stream.writable);
        this._writer = encoderStream.writable.getWriter();
        const read = () => {
          reader.read().then(({ done, value: value2 }) => {
            if (done) {
              return;
            }
            this.onPacket(value2);
            read();
          }).catch((err) => {
          });
        };
        read();
        const packet = { type: "open" };
        if (this.query.sid) {
          packet.data = `{"sid":"${this.query.sid}"}`;
        }
        this._writer.write(packet).then(() => this.onOpen());
      });
    });
  }
  write(packets) {
    this.writable = false;
    for (let i = 0; i < packets.length; i++) {
      const packet = packets[i];
      const lastPacket = i === packets.length - 1;
      this._writer.write(packet).then(() => {
        if (lastPacket) {
          nextTick(() => {
            this.writable = true;
            this.emitReserved("drain");
          }, this.setTimeoutFn);
        }
      });
    }
  }
  doClose() {
    var _a;
    (_a = this._transport) === null || _a === void 0 ? void 0 : _a.close();
  }
};

// node_modules/engine.io-client/build/esm/transports/index.js
var transports = {
  websocket: WS,
  webtransport: WT,
  polling: XHR
};

// node_modules/engine.io-client/build/esm/contrib/parseuri.js
var re = /^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
var parts = [
  "source",
  "protocol",
  "authority",
  "userInfo",
  "user",
  "password",
  "host",
  "port",
  "relative",
  "path",
  "directory",
  "file",
  "query",
  "anchor"
];
function parse(str) {
  if (str.length > 8e3) {
    throw "URI too long";
  }
  const src = str, b = str.indexOf("["), e = str.indexOf("]");
  if (b != -1 && e != -1) {
    str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ";") + str.substring(e, str.length);
  }
  let m = re.exec(str || ""), uri = {}, i = 14;
  while (i--) {
    uri[parts[i]] = m[i] || "";
  }
  if (b != -1 && e != -1) {
    uri.source = src;
    uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ":");
    uri.authority = uri.authority.replace("[", "").replace("]", "").replace(/;/g, ":");
    uri.ipv6uri = true;
  }
  uri.pathNames = pathNames(uri, uri["path"]);
  uri.queryKey = queryKey(uri, uri["query"]);
  return uri;
}
function pathNames(obj, path) {
  const regx = /\/{2,9}/g, names = path.replace(regx, "/").split("/");
  if (path.slice(0, 1) == "/" || path.length === 0) {
    names.splice(0, 1);
  }
  if (path.slice(-1) == "/") {
    names.splice(names.length - 1, 1);
  }
  return names;
}
function queryKey(uri, query) {
  const data = {};
  query.replace(/(?:^|&)([^&=]*)=?([^&]*)/g, function($0, $1, $2) {
    if ($1) {
      data[$1] = $2;
    }
  });
  return data;
}

// node_modules/engine.io-client/build/esm/socket.js
var withEventListeners = typeof addEventListener === "function" && typeof removeEventListener === "function";
var OFFLINE_EVENT_LISTENERS = [];
if (withEventListeners) {
  addEventListener("offline", () => {
    OFFLINE_EVENT_LISTENERS.forEach((listener) => listener());
  }, false);
}
var SocketWithoutUpgrade = class _SocketWithoutUpgrade extends Emitter {
  /**
   * Socket constructor.
   *
   * @param {String|Object} uri - uri or options
   * @param {Object} opts - options
   */
  constructor(uri, opts) {
    super();
    this.binaryType = defaultBinaryType;
    this.writeBuffer = [];
    this._prevBufferLen = 0;
    this._pingInterval = -1;
    this._pingTimeout = -1;
    this._maxPayload = -1;
    this._pingTimeoutTime = Infinity;
    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = null;
    }
    if (uri) {
      const parsedUri = parse(uri);
      opts.hostname = parsedUri.host;
      opts.secure = parsedUri.protocol === "https" || parsedUri.protocol === "wss";
      opts.port = parsedUri.port;
      if (parsedUri.query)
        opts.query = parsedUri.query;
    } else if (opts.host) {
      opts.hostname = parse(opts.host).host;
    }
    installTimerFunctions(this, opts);
    this.secure = null != opts.secure ? opts.secure : typeof location !== "undefined" && "https:" === location.protocol;
    if (opts.hostname && !opts.port) {
      opts.port = this.secure ? "443" : "80";
    }
    this.hostname = opts.hostname || (typeof location !== "undefined" ? location.hostname : "localhost");
    this.port = opts.port || (typeof location !== "undefined" && location.port ? location.port : this.secure ? "443" : "80");
    this.transports = [];
    this._transportsByName = {};
    opts.transports.forEach((t) => {
      const transportName = t.prototype.name;
      this.transports.push(transportName);
      this._transportsByName[transportName] = t;
    });
    this.opts = Object.assign({
      path: "/engine.io",
      agent: false,
      withCredentials: false,
      upgrade: true,
      timestampParam: "t",
      rememberUpgrade: false,
      addTrailingSlash: true,
      rejectUnauthorized: true,
      perMessageDeflate: {
        threshold: 1024
      },
      transportOptions: {},
      closeOnBeforeunload: false
    }, opts);
    this.opts.path = this.opts.path.replace(/\/$/, "") + (this.opts.addTrailingSlash ? "/" : "");
    if (typeof this.opts.query === "string") {
      this.opts.query = decode2(this.opts.query);
    }
    if (withEventListeners) {
      if (this.opts.closeOnBeforeunload) {
        this._beforeunloadEventListener = () => {
          if (this.transport) {
            this.transport.removeAllListeners();
            this.transport.close();
          }
        };
        addEventListener("beforeunload", this._beforeunloadEventListener, false);
      }
      if (this.hostname !== "localhost") {
        this._offlineEventListener = () => {
          this._onClose("transport close", {
            description: "network connection lost"
          });
        };
        OFFLINE_EVENT_LISTENERS.push(this._offlineEventListener);
      }
    }
    if (this.opts.withCredentials) {
      this._cookieJar = createCookieJar();
    }
    this._open();
  }
  /**
   * Creates transport of the given type.
   *
   * @param {String} name - transport name
   * @return {Transport}
   * @private
   */
  createTransport(name) {
    const query = Object.assign({}, this.opts.query);
    query.EIO = protocol;
    query.transport = name;
    if (this.id)
      query.sid = this.id;
    const opts = Object.assign({}, this.opts, {
      query,
      socket: this,
      hostname: this.hostname,
      secure: this.secure,
      port: this.port
    }, this.opts.transportOptions[name]);
    return new this._transportsByName[name](opts);
  }
  /**
   * Initializes transport to use and starts probe.
   *
   * @private
   */
  _open() {
    if (this.transports.length === 0) {
      this.setTimeoutFn(() => {
        this.emitReserved("error", "No transports available");
      }, 0);
      return;
    }
    const transportName = this.opts.rememberUpgrade && _SocketWithoutUpgrade.priorWebsocketSuccess && this.transports.indexOf("websocket") !== -1 ? "websocket" : this.transports[0];
    this.readyState = "opening";
    const transport = this.createTransport(transportName);
    transport.open();
    this.setTransport(transport);
  }
  /**
   * Sets the current transport. Disables the existing one (if any).
   *
   * @private
   */
  setTransport(transport) {
    if (this.transport) {
      this.transport.removeAllListeners();
    }
    this.transport = transport;
    transport.on("drain", this._onDrain.bind(this)).on("packet", this._onPacket.bind(this)).on("error", this._onError.bind(this)).on("close", (reason) => this._onClose("transport close", reason));
  }
  /**
   * Called when connection is deemed open.
   *
   * @private
   */
  onOpen() {
    this.readyState = "open";
    _SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === this.transport.name;
    this.emitReserved("open");
    this.flush();
  }
  /**
   * Handles a packet.
   *
   * @private
   */
  _onPacket(packet) {
    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
      this.emitReserved("packet", packet);
      this.emitReserved("heartbeat");
      switch (packet.type) {
        case "open":
          this.onHandshake(JSON.parse(packet.data));
          break;
        case "ping":
          this._sendPacket("pong");
          this.emitReserved("ping");
          this.emitReserved("pong");
          this._resetPingTimeout();
          break;
        case "error":
          const err = new Error("server error");
          err.code = packet.data;
          this._onError(err);
          break;
        case "message":
          this.emitReserved("data", packet.data);
          this.emitReserved("message", packet.data);
          break;
      }
    } else {
    }
  }
  /**
   * Called upon handshake completion.
   *
   * @param {Object} data - handshake obj
   * @private
   */
  onHandshake(data) {
    this.emitReserved("handshake", data);
    this.id = data.sid;
    this.transport.query.sid = data.sid;
    this._pingInterval = data.pingInterval;
    this._pingTimeout = data.pingTimeout;
    this._maxPayload = data.maxPayload;
    this.onOpen();
    if ("closed" === this.readyState)
      return;
    this._resetPingTimeout();
  }
  /**
   * Sets and resets ping timeout timer based on server pings.
   *
   * @private
   */
  _resetPingTimeout() {
    this.clearTimeoutFn(this._pingTimeoutTimer);
    const delay = this._pingInterval + this._pingTimeout;
    this._pingTimeoutTime = Date.now() + delay;
    this._pingTimeoutTimer = this.setTimeoutFn(() => {
      this._onClose("ping timeout");
    }, delay);
    if (this.opts.autoUnref) {
      this._pingTimeoutTimer.unref();
    }
  }
  /**
   * Called on `drain` event
   *
   * @private
   */
  _onDrain() {
    this.writeBuffer.splice(0, this._prevBufferLen);
    this._prevBufferLen = 0;
    if (0 === this.writeBuffer.length) {
      this.emitReserved("drain");
    } else {
      this.flush();
    }
  }
  /**
   * Flush write buffers.
   *
   * @private
   */
  flush() {
    if ("closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length) {
      const packets = this._getWritablePackets();
      this.transport.send(packets);
      this._prevBufferLen = packets.length;
      this.emitReserved("flush");
    }
  }
  /**
   * Ensure the encoded size of the writeBuffer is below the maxPayload value sent by the server (only for HTTP
   * long-polling)
   *
   * @private
   */
  _getWritablePackets() {
    const shouldCheckPayloadSize = this._maxPayload && this.transport.name === "polling" && this.writeBuffer.length > 1;
    if (!shouldCheckPayloadSize) {
      return this.writeBuffer;
    }
    let payloadSize = 1;
    for (let i = 0; i < this.writeBuffer.length; i++) {
      const data = this.writeBuffer[i].data;
      if (data) {
        payloadSize += byteLength(data);
      }
      if (i > 0 && payloadSize > this._maxPayload) {
        return this.writeBuffer.slice(0, i);
      }
      payloadSize += 2;
    }
    return this.writeBuffer;
  }
  /**
   * Checks whether the heartbeat timer has expired but the socket has not yet been notified.
   *
   * Note: this method is private for now because it does not really fit the WebSocket API, but if we put it in the
   * `write()` method then the message would not be buffered by the Socket.IO client.
   *
   * @return {boolean}
   * @private
   */
  /* private */
  _hasPingExpired() {
    if (!this._pingTimeoutTime)
      return true;
    const hasExpired = Date.now() > this._pingTimeoutTime;
    if (hasExpired) {
      this._pingTimeoutTime = 0;
      nextTick(() => {
        this._onClose("ping timeout");
      }, this.setTimeoutFn);
    }
    return hasExpired;
  }
  /**
   * Sends a message.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  write(msg, options, fn) {
    this._sendPacket("message", msg, options, fn);
    return this;
  }
  /**
   * Sends a message. Alias of {@link Socket#write}.
   *
   * @param {String} msg - message.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @return {Socket} for chaining.
   */
  send(msg, options, fn) {
    this._sendPacket("message", msg, options, fn);
    return this;
  }
  /**
   * Sends a packet.
   *
   * @param {String} type: packet type.
   * @param {String} data.
   * @param {Object} options.
   * @param {Function} fn - callback function.
   * @private
   */
  _sendPacket(type, data, options, fn) {
    if ("function" === typeof data) {
      fn = data;
      data = void 0;
    }
    if ("function" === typeof options) {
      fn = options;
      options = null;
    }
    if ("closing" === this.readyState || "closed" === this.readyState) {
      return;
    }
    options = options || {};
    options.compress = false !== options.compress;
    const packet = {
      type,
      data,
      options
    };
    this.emitReserved("packetCreate", packet);
    this.writeBuffer.push(packet);
    if (fn)
      this.once("flush", fn);
    this.flush();
  }
  /**
   * Closes the connection.
   */
  close() {
    const close = () => {
      this._onClose("forced close");
      this.transport.close();
    };
    const cleanupAndClose = () => {
      this.off("upgrade", cleanupAndClose);
      this.off("upgradeError", cleanupAndClose);
      close();
    };
    const waitForUpgrade = () => {
      this.once("upgrade", cleanupAndClose);
      this.once("upgradeError", cleanupAndClose);
    };
    if ("opening" === this.readyState || "open" === this.readyState) {
      this.readyState = "closing";
      if (this.writeBuffer.length) {
        this.once("drain", () => {
          if (this.upgrading) {
            waitForUpgrade();
          } else {
            close();
          }
        });
      } else if (this.upgrading) {
        waitForUpgrade();
      } else {
        close();
      }
    }
    return this;
  }
  /**
   * Called upon transport error
   *
   * @private
   */
  _onError(err) {
    _SocketWithoutUpgrade.priorWebsocketSuccess = false;
    if (this.opts.tryAllTransports && this.transports.length > 1 && this.readyState === "opening") {
      this.transports.shift();
      return this._open();
    }
    this.emitReserved("error", err);
    this._onClose("transport error", err);
  }
  /**
   * Called upon transport close.
   *
   * @private
   */
  _onClose(reason, description) {
    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) {
      this.clearTimeoutFn(this._pingTimeoutTimer);
      this.transport.removeAllListeners("close");
      this.transport.close();
      this.transport.removeAllListeners();
      if (withEventListeners) {
        if (this._beforeunloadEventListener) {
          removeEventListener("beforeunload", this._beforeunloadEventListener, false);
        }
        if (this._offlineEventListener) {
          const i = OFFLINE_EVENT_LISTENERS.indexOf(this._offlineEventListener);
          if (i !== -1) {
            OFFLINE_EVENT_LISTENERS.splice(i, 1);
          }
        }
      }
      this.readyState = "closed";
      this.id = null;
      this.emitReserved("close", reason, description);
      this.writeBuffer = [];
      this._prevBufferLen = 0;
    }
  }
};
SocketWithoutUpgrade.protocol = protocol;
var SocketWithUpgrade = class extends SocketWithoutUpgrade {
  constructor() {
    super(...arguments);
    this._upgrades = [];
  }
  onOpen() {
    super.onOpen();
    if ("open" === this.readyState && this.opts.upgrade) {
      for (let i = 0; i < this._upgrades.length; i++) {
        this._probe(this._upgrades[i]);
      }
    }
  }
  /**
   * Probes a transport.
   *
   * @param {String} name - transport name
   * @private
   */
  _probe(name) {
    let transport = this.createTransport(name);
    let failed = false;
    SocketWithoutUpgrade.priorWebsocketSuccess = false;
    const onTransportOpen = () => {
      if (failed)
        return;
      transport.send([{ type: "ping", data: "probe" }]);
      transport.once("packet", (msg) => {
        if (failed)
          return;
        if ("pong" === msg.type && "probe" === msg.data) {
          this.upgrading = true;
          this.emitReserved("upgrading", transport);
          if (!transport)
            return;
          SocketWithoutUpgrade.priorWebsocketSuccess = "websocket" === transport.name;
          this.transport.pause(() => {
            if (failed)
              return;
            if ("closed" === this.readyState)
              return;
            cleanup();
            this.setTransport(transport);
            transport.send([{ type: "upgrade" }]);
            this.emitReserved("upgrade", transport);
            transport = null;
            this.upgrading = false;
            this.flush();
          });
        } else {
          const err = new Error("probe error");
          err.transport = transport.name;
          this.emitReserved("upgradeError", err);
        }
      });
    };
    function freezeTransport() {
      if (failed)
        return;
      failed = true;
      cleanup();
      transport.close();
      transport = null;
    }
    const onerror = (err) => {
      const error = new Error("probe error: " + err);
      error.transport = transport.name;
      freezeTransport();
      this.emitReserved("upgradeError", error);
    };
    function onTransportClose() {
      onerror("transport closed");
    }
    function onclose() {
      onerror("socket closed");
    }
    function onupgrade(to) {
      if (transport && to.name !== transport.name) {
        freezeTransport();
      }
    }
    const cleanup = () => {
      transport.removeListener("open", onTransportOpen);
      transport.removeListener("error", onerror);
      transport.removeListener("close", onTransportClose);
      this.off("close", onclose);
      this.off("upgrading", onupgrade);
    };
    transport.once("open", onTransportOpen);
    transport.once("error", onerror);
    transport.once("close", onTransportClose);
    this.once("close", onclose);
    this.once("upgrading", onupgrade);
    if (this._upgrades.indexOf("webtransport") !== -1 && name !== "webtransport") {
      this.setTimeoutFn(() => {
        if (!failed) {
          transport.open();
        }
      }, 200);
    } else {
      transport.open();
    }
  }
  onHandshake(data) {
    this._upgrades = this._filterUpgrades(data.upgrades);
    super.onHandshake(data);
  }
  /**
   * Filters upgrades, returning only those matching client transports.
   *
   * @param {Array} upgrades - server upgrades
   * @private
   */
  _filterUpgrades(upgrades) {
    const filteredUpgrades = [];
    for (let i = 0; i < upgrades.length; i++) {
      if (~this.transports.indexOf(upgrades[i]))
        filteredUpgrades.push(upgrades[i]);
    }
    return filteredUpgrades;
  }
};
var Socket = class extends SocketWithUpgrade {
  constructor(uri, opts = {}) {
    const o = typeof uri === "object" ? uri : opts;
    if (!o.transports || o.transports && typeof o.transports[0] === "string") {
      o.transports = (o.transports || ["polling", "websocket", "webtransport"]).map((transportName) => transports[transportName]).filter((t) => !!t);
    }
    super(uri, o);
  }
};

// node_modules/engine.io-client/build/esm/index.js
var protocol2 = Socket.protocol;

// node_modules/socket.io-client/build/esm/url.js
function url(uri, path = "", loc) {
  let obj = uri;
  loc = loc || typeof location !== "undefined" && location;
  if (null == uri)
    uri = loc.protocol + "//" + loc.host;
  if (typeof uri === "string") {
    if ("/" === uri.charAt(0)) {
      if ("/" === uri.charAt(1)) {
        uri = loc.protocol + uri;
      } else {
        uri = loc.host + uri;
      }
    }
    if (!/^(https?|wss?):\/\//.test(uri)) {
      if ("undefined" !== typeof loc) {
        uri = loc.protocol + "//" + uri;
      } else {
        uri = "https://" + uri;
      }
    }
    obj = parse(uri);
  }
  if (!obj.port) {
    if (/^(http|ws)$/.test(obj.protocol)) {
      obj.port = "80";
    } else if (/^(http|ws)s$/.test(obj.protocol)) {
      obj.port = "443";
    }
  }
  obj.path = obj.path || "/";
  const ipv6 = obj.host.indexOf(":") !== -1;
  const host = ipv6 ? "[" + obj.host + "]" : obj.host;
  obj.id = obj.protocol + "://" + host + ":" + obj.port + path;
  obj.href = obj.protocol + "://" + host + (loc && loc.port === obj.port ? "" : ":" + obj.port);
  return obj;
}

// node_modules/socket.io-parser/build/esm-debug/index.js
var esm_debug_exports = {};
__export(esm_debug_exports, {
  Decoder: () => Decoder,
  Encoder: () => Encoder,
  PacketType: () => PacketType,
  isPacketValid: () => isPacketValid,
  protocol: () => protocol3
});

// node_modules/socket.io-parser/build/esm-debug/is-binary.js
var withNativeArrayBuffer3 = typeof ArrayBuffer === "function";
var isView2 = (obj) => {
  return typeof ArrayBuffer.isView === "function" ? ArrayBuffer.isView(obj) : obj.buffer instanceof ArrayBuffer;
};
var toString = Object.prototype.toString;
var withNativeBlob2 = typeof Blob === "function" || typeof Blob !== "undefined" && toString.call(Blob) === "[object BlobConstructor]";
var withNativeFile = typeof File === "function" || typeof File !== "undefined" && toString.call(File) === "[object FileConstructor]";
function isBinary(obj) {
  return withNativeArrayBuffer3 && (obj instanceof ArrayBuffer || isView2(obj)) || withNativeBlob2 && obj instanceof Blob || withNativeFile && obj instanceof File;
}
function hasBinary(obj, toJSON) {
  if (!obj || typeof obj !== "object") {
    return false;
  }
  if (Array.isArray(obj)) {
    for (let i = 0, l = obj.length; i < l; i++) {
      if (hasBinary(obj[i])) {
        return true;
      }
    }
    return false;
  }
  if (isBinary(obj)) {
    return true;
  }
  if (obj.toJSON && typeof obj.toJSON === "function" && arguments.length === 1) {
    return hasBinary(obj.toJSON(), true);
  }
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
      return true;
    }
  }
  return false;
}

// node_modules/socket.io-parser/build/esm-debug/binary.js
function deconstructPacket(packet) {
  const buffers = [];
  const packetData = packet.data;
  const pack = packet;
  pack.data = _deconstructPacket(packetData, buffers);
  pack.attachments = buffers.length;
  return { packet: pack, buffers };
}
function _deconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (isBinary(data)) {
    const placeholder = { _placeholder: true, num: buffers.length };
    buffers.push(data);
    return placeholder;
  } else if (Array.isArray(data)) {
    const newData = new Array(data.length);
    for (let i = 0; i < data.length; i++) {
      newData[i] = _deconstructPacket(data[i], buffers);
    }
    return newData;
  } else if (typeof data === "object" && !(data instanceof Date)) {
    const newData = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        newData[key] = _deconstructPacket(data[key], buffers);
      }
    }
    return newData;
  }
  return data;
}
function reconstructPacket(packet, buffers) {
  packet.data = _reconstructPacket(packet.data, buffers);
  delete packet.attachments;
  return packet;
}
function _reconstructPacket(data, buffers) {
  if (!data)
    return data;
  if (data && data._placeholder === true) {
    const isIndexValid = typeof data.num === "number" && data.num >= 0 && data.num < buffers.length;
    if (isIndexValid) {
      return buffers[data.num];
    } else {
      throw new Error("illegal attachments");
    }
  } else if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      data[i] = _reconstructPacket(data[i], buffers);
    }
  } else if (typeof data === "object") {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = _reconstructPacket(data[key], buffers);
      }
    }
  }
  return data;
}

// node_modules/socket.io-parser/build/esm-debug/index.js
var import_debug = __toESM(require_browser(), 1);
var debug = (0, import_debug.default)("socket.io-parser");
var RESERVED_EVENTS = [
  "connect",
  // used on the client side
  "connect_error",
  // used on the client side
  "disconnect",
  // used on both sides
  "disconnecting",
  // used on the server side
  "newListener",
  // used by the Node.js EventEmitter
  "removeListener"
  // used by the Node.js EventEmitter
];
var protocol3 = 5;
var PacketType;
(function(PacketType2) {
  PacketType2[PacketType2["CONNECT"] = 0] = "CONNECT";
  PacketType2[PacketType2["DISCONNECT"] = 1] = "DISCONNECT";
  PacketType2[PacketType2["EVENT"] = 2] = "EVENT";
  PacketType2[PacketType2["ACK"] = 3] = "ACK";
  PacketType2[PacketType2["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
  PacketType2[PacketType2["BINARY_EVENT"] = 5] = "BINARY_EVENT";
  PacketType2[PacketType2["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType || (PacketType = {}));
var Encoder = class {
  /**
   * Encoder constructor
   *
   * @param {function} replacer - custom replacer to pass down to JSON.parse
   */
  constructor(replacer) {
    this.replacer = replacer;
  }
  /**
   * Encode a packet as a single string if non-binary, or as a
   * buffer sequence, depending on packet type.
   *
   * @param {Object} obj - packet object
   */
  encode(obj) {
    debug("encoding packet %j", obj);
    if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
      if (hasBinary(obj)) {
        return this.encodeAsBinary({
          type: obj.type === PacketType.EVENT ? PacketType.BINARY_EVENT : PacketType.BINARY_ACK,
          nsp: obj.nsp,
          data: obj.data,
          id: obj.id
        });
      }
    }
    return [this.encodeAsString(obj)];
  }
  /**
   * Encode packet as string.
   */
  encodeAsString(obj) {
    let str = "" + obj.type;
    if (obj.type === PacketType.BINARY_EVENT || obj.type === PacketType.BINARY_ACK) {
      str += obj.attachments + "-";
    }
    if (obj.nsp && "/" !== obj.nsp) {
      str += obj.nsp + ",";
    }
    if (null != obj.id) {
      str += obj.id;
    }
    if (null != obj.data) {
      str += JSON.stringify(obj.data, this.replacer);
    }
    debug("encoded %j as %s", obj, str);
    return str;
  }
  /**
   * Encode packet as 'buffer sequence' by removing blobs, and
   * deconstructing packet into object with placeholders and
   * a list of buffers.
   */
  encodeAsBinary(obj) {
    const deconstruction = deconstructPacket(obj);
    const pack = this.encodeAsString(deconstruction.packet);
    const buffers = deconstruction.buffers;
    buffers.unshift(pack);
    return buffers;
  }
};
var Decoder = class _Decoder extends Emitter {
  /**
   * Decoder constructor
   *
   * @param {function} reviver - custom reviver to pass down to JSON.stringify
   */
  constructor(reviver) {
    super();
    this.reviver = reviver;
  }
  /**
   * Decodes an encoded packet string into packet JSON.
   *
   * @param {String} obj - encoded packet
   */
  add(obj) {
    let packet;
    if (typeof obj === "string") {
      if (this.reconstructor) {
        throw new Error("got plaintext data when reconstructing a packet");
      }
      packet = this.decodeString(obj);
      const isBinaryEvent = packet.type === PacketType.BINARY_EVENT;
      if (isBinaryEvent || packet.type === PacketType.BINARY_ACK) {
        packet.type = isBinaryEvent ? PacketType.EVENT : PacketType.ACK;
        this.reconstructor = new BinaryReconstructor(packet);
        if (packet.attachments === 0) {
          super.emitReserved("decoded", packet);
        }
      } else {
        super.emitReserved("decoded", packet);
      }
    } else if (isBinary(obj) || obj.base64) {
      if (!this.reconstructor) {
        throw new Error("got binary data when not reconstructing a packet");
      } else {
        packet = this.reconstructor.takeBinaryData(obj);
        if (packet) {
          this.reconstructor = null;
          super.emitReserved("decoded", packet);
        }
      }
    } else {
      throw new Error("Unknown type: " + obj);
    }
  }
  /**
   * Decode a packet String (JSON data)
   *
   * @param {String} str
   * @return {Object} packet
   */
  decodeString(str) {
    let i = 0;
    const p = {
      type: Number(str.charAt(0))
    };
    if (PacketType[p.type] === void 0) {
      throw new Error("unknown packet type " + p.type);
    }
    if (p.type === PacketType.BINARY_EVENT || p.type === PacketType.BINARY_ACK) {
      const start = i + 1;
      while (str.charAt(++i) !== "-" && i != str.length) {
      }
      const buf = str.substring(start, i);
      if (buf != Number(buf) || str.charAt(i) !== "-") {
        throw new Error("Illegal attachments");
      }
      p.attachments = Number(buf);
    }
    if ("/" === str.charAt(i + 1)) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if ("," === c)
          break;
        if (i === str.length)
          break;
      }
      p.nsp = str.substring(start, i);
    } else {
      p.nsp = "/";
    }
    const next = str.charAt(i + 1);
    if ("" !== next && Number(next) == next) {
      const start = i + 1;
      while (++i) {
        const c = str.charAt(i);
        if (null == c || Number(c) != c) {
          --i;
          break;
        }
        if (i === str.length)
          break;
      }
      p.id = Number(str.substring(start, i + 1));
    }
    if (str.charAt(++i)) {
      const payload = this.tryParse(str.substr(i));
      if (_Decoder.isPayloadValid(p.type, payload)) {
        p.data = payload;
      } else {
        throw new Error("invalid payload");
      }
    }
    debug("decoded %s as %j", str, p);
    return p;
  }
  tryParse(str) {
    try {
      return JSON.parse(str, this.reviver);
    } catch (e) {
      return false;
    }
  }
  static isPayloadValid(type, payload) {
    switch (type) {
      case PacketType.CONNECT:
        return isObject(payload);
      case PacketType.DISCONNECT:
        return payload === void 0;
      case PacketType.CONNECT_ERROR:
        return typeof payload === "string" || isObject(payload);
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        return Array.isArray(payload);
    }
  }
  /**
   * Deallocates a parser's resources
   */
  destroy() {
    if (this.reconstructor) {
      this.reconstructor.finishedReconstruction();
      this.reconstructor = null;
    }
  }
};
var BinaryReconstructor = class {
  constructor(packet) {
    this.packet = packet;
    this.buffers = [];
    this.reconPack = packet;
  }
  /**
   * Method to be called when binary data received from connection
   * after a BINARY_EVENT packet.
   *
   * @param {Buffer | ArrayBuffer} binData - the raw binary data received
   * @return {null | Object} returns null if more binary data is expected or
   *   a reconstructed packet object if all buffers have been received.
   */
  takeBinaryData(binData) {
    this.buffers.push(binData);
    if (this.buffers.length === this.reconPack.attachments) {
      const packet = reconstructPacket(this.reconPack, this.buffers);
      this.finishedReconstruction();
      return packet;
    }
    return null;
  }
  /**
   * Cleans up binary packet reconstruction variables.
   */
  finishedReconstruction() {
    this.reconPack = null;
    this.buffers = [];
  }
};
function isNamespaceValid(nsp) {
  return typeof nsp === "string";
}
var isInteger = Number.isInteger || function(value2) {
  return typeof value2 === "number" && isFinite(value2) && Math.floor(value2) === value2;
};
function isAckIdValid(id) {
  return id === void 0 || isInteger(id);
}
function isObject(value2) {
  return Object.prototype.toString.call(value2) === "[object Object]";
}
function isDataValid(type, payload) {
  switch (type) {
    case PacketType.CONNECT:
      return payload === void 0 || isObject(payload);
    case PacketType.DISCONNECT:
      return payload === void 0;
    case PacketType.EVENT:
      return Array.isArray(payload) && (typeof payload[0] === "number" || typeof payload[0] === "string" && RESERVED_EVENTS.indexOf(payload[0]) === -1);
    case PacketType.ACK:
      return Array.isArray(payload);
    case PacketType.CONNECT_ERROR:
      return typeof payload === "string" || isObject(payload);
    default:
      return false;
  }
}
function isPacketValid(packet) {
  return isNamespaceValid(packet.nsp) && isAckIdValid(packet.id) && isDataValid(packet.type, packet.data);
}

// node_modules/socket.io-client/build/esm/on.js
function on(obj, ev, fn) {
  obj.on(ev, fn);
  return function subDestroy() {
    obj.off(ev, fn);
  };
}

// node_modules/socket.io-client/build/esm/socket.js
var RESERVED_EVENTS2 = Object.freeze({
  connect: 1,
  connect_error: 1,
  disconnect: 1,
  disconnecting: 1,
  // EventEmitter reserved events: https://nodejs.org/api/events.html#events_event_newlistener
  newListener: 1,
  removeListener: 1
});
var Socket2 = class extends Emitter {
  /**
   * `Socket` constructor.
   */
  constructor(io, nsp, opts) {
    super();
    this.connected = false;
    this.recovered = false;
    this.receiveBuffer = [];
    this.sendBuffer = [];
    this._queue = [];
    this._queueSeq = 0;
    this.ids = 0;
    this.acks = {};
    this.flags = {};
    this.io = io;
    this.nsp = nsp;
    if (opts && opts.auth) {
      this.auth = opts.auth;
    }
    this._opts = Object.assign({}, opts);
    if (this.io._autoConnect)
      this.open();
  }
  /**
   * Whether the socket is currently disconnected
   *
   * @example
   * const socket = io();
   *
   * socket.on("connect", () => {
   *   console.log(socket.disconnected); // false
   * });
   *
   * socket.on("disconnect", () => {
   *   console.log(socket.disconnected); // true
   * });
   */
  get disconnected() {
    return !this.connected;
  }
  /**
   * Subscribe to open, close and packet events
   *
   * @private
   */
  subEvents() {
    if (this.subs)
      return;
    const io = this.io;
    this.subs = [
      on(io, "open", this.onopen.bind(this)),
      on(io, "packet", this.onpacket.bind(this)),
      on(io, "error", this.onerror.bind(this)),
      on(io, "close", this.onclose.bind(this))
    ];
  }
  /**
   * Whether the Socket will try to reconnect when its Manager connects or reconnects.
   *
   * @example
   * const socket = io();
   *
   * console.log(socket.active); // true
   *
   * socket.on("disconnect", (reason) => {
   *   if (reason === "io server disconnect") {
   *     // the disconnection was initiated by the server, you need to manually reconnect
   *     console.log(socket.active); // false
   *   }
   *   // else the socket will automatically try to reconnect
   *   console.log(socket.active); // true
   * });
   */
  get active() {
    return !!this.subs;
  }
  /**
   * "Opens" the socket.
   *
   * @example
   * const socket = io({
   *   autoConnect: false
   * });
   *
   * socket.connect();
   */
  connect() {
    if (this.connected)
      return this;
    this.subEvents();
    if (!this.io["_reconnecting"])
      this.io.open();
    if ("open" === this.io._readyState)
      this.onopen();
    return this;
  }
  /**
   * Alias for {@link connect()}.
   */
  open() {
    return this.connect();
  }
  /**
   * Sends a `message` event.
   *
   * This method mimics the WebSocket.send() method.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
   *
   * @example
   * socket.send("hello");
   *
   * // this is equivalent to
   * socket.emit("message", "hello");
   *
   * @return self
   */
  send(...args) {
    args.unshift("message");
    this.emit.apply(this, args);
    return this;
  }
  /**
   * Override `emit`.
   * If the event is in `events`, it's emitted normally.
   *
   * @example
   * socket.emit("hello", "world");
   *
   * // all serializable datastructures are supported (no need to call JSON.stringify)
   * socket.emit("hello", 1, "2", { 3: ["4"], 5: Uint8Array.from([6]) });
   *
   * // with an acknowledgement from the server
   * socket.emit("hello", "world", (val) => {
   *   // ...
   * });
   *
   * @return self
   */
  emit(ev, ...args) {
    var _a, _b, _c;
    if (RESERVED_EVENTS2.hasOwnProperty(ev)) {
      throw new Error('"' + ev.toString() + '" is a reserved event name');
    }
    args.unshift(ev);
    if (this._opts.retries && !this.flags.fromQueue && !this.flags.volatile) {
      this._addToQueue(args);
      return this;
    }
    const packet = {
      type: PacketType.EVENT,
      data: args
    };
    packet.options = {};
    packet.options.compress = this.flags.compress !== false;
    if ("function" === typeof args[args.length - 1]) {
      const id = this.ids++;
      const ack = args.pop();
      this._registerAckCallback(id, ack);
      packet.id = id;
    }
    const isTransportWritable = (_b = (_a = this.io.engine) === null || _a === void 0 ? void 0 : _a.transport) === null || _b === void 0 ? void 0 : _b.writable;
    const isConnected = this.connected && !((_c = this.io.engine) === null || _c === void 0 ? void 0 : _c._hasPingExpired());
    const discardPacket = this.flags.volatile && !isTransportWritable;
    if (discardPacket) {
    } else if (isConnected) {
      this.notifyOutgoingListeners(packet);
      this.packet(packet);
    } else {
      this.sendBuffer.push(packet);
    }
    this.flags = {};
    return this;
  }
  /**
   * @private
   */
  _registerAckCallback(id, ack) {
    var _a;
    const timeout = (_a = this.flags.timeout) !== null && _a !== void 0 ? _a : this._opts.ackTimeout;
    if (timeout === void 0) {
      this.acks[id] = ack;
      return;
    }
    const timer = this.io.setTimeoutFn(() => {
      delete this.acks[id];
      for (let i = 0; i < this.sendBuffer.length; i++) {
        if (this.sendBuffer[i].id === id) {
          this.sendBuffer.splice(i, 1);
        }
      }
      ack.call(this, new Error("operation has timed out"));
    }, timeout);
    const fn = (...args) => {
      this.io.clearTimeoutFn(timer);
      ack.apply(this, args);
    };
    fn.withError = true;
    this.acks[id] = fn;
  }
  /**
   * Emits an event and waits for an acknowledgement
   *
   * @example
   * // without timeout
   * const response = await socket.emitWithAck("hello", "world");
   *
   * // with a specific timeout
   * try {
   *   const response = await socket.timeout(1000).emitWithAck("hello", "world");
   * } catch (err) {
   *   // the server did not acknowledge the event in the given delay
   * }
   *
   * @return a Promise that will be fulfilled when the server acknowledges the event
   */
  emitWithAck(ev, ...args) {
    return new Promise((resolve, reject) => {
      const fn = (arg1, arg2) => {
        return arg1 ? reject(arg1) : resolve(arg2);
      };
      fn.withError = true;
      args.push(fn);
      this.emit(ev, ...args);
    });
  }
  /**
   * Add the packet to the queue.
   * @param args
   * @private
   */
  _addToQueue(args) {
    let ack;
    if (typeof args[args.length - 1] === "function") {
      ack = args.pop();
    }
    const packet = {
      id: this._queueSeq++,
      tryCount: 0,
      pending: false,
      args,
      flags: Object.assign({ fromQueue: true }, this.flags)
    };
    args.push((err, ...responseArgs) => {
      if (packet !== this._queue[0]) {
      }
      const hasError = err !== null;
      if (hasError) {
        if (packet.tryCount > this._opts.retries) {
          this._queue.shift();
          if (ack) {
            ack(err);
          }
        }
      } else {
        this._queue.shift();
        if (ack) {
          ack(null, ...responseArgs);
        }
      }
      packet.pending = false;
      return this._drainQueue();
    });
    this._queue.push(packet);
    this._drainQueue();
  }
  /**
   * Send the first packet of the queue, and wait for an acknowledgement from the server.
   * @param force - whether to resend a packet that has not been acknowledged yet
   *
   * @private
   */
  _drainQueue(force = false) {
    if (!this.connected || this._queue.length === 0) {
      return;
    }
    const packet = this._queue[0];
    if (packet.pending && !force) {
      return;
    }
    packet.pending = true;
    packet.tryCount++;
    this.flags = packet.flags;
    this.emit.apply(this, packet.args);
  }
  /**
   * Sends a packet.
   *
   * @param packet
   * @private
   */
  packet(packet) {
    packet.nsp = this.nsp;
    this.io._packet(packet);
  }
  /**
   * Called upon engine `open`.
   *
   * @private
   */
  onopen() {
    if (typeof this.auth == "function") {
      this.auth((data) => {
        this._sendConnectPacket(data);
      });
    } else {
      this._sendConnectPacket(this.auth);
    }
  }
  /**
   * Sends a CONNECT packet to initiate the Socket.IO session.
   *
   * @param data
   * @private
   */
  _sendConnectPacket(data) {
    this.packet({
      type: PacketType.CONNECT,
      data: this._pid ? Object.assign({ pid: this._pid, offset: this._lastOffset }, data) : data
    });
  }
  /**
   * Called upon engine or manager `error`.
   *
   * @param err
   * @private
   */
  onerror(err) {
    if (!this.connected) {
      this.emitReserved("connect_error", err);
    }
  }
  /**
   * Called upon engine `close`.
   *
   * @param reason
   * @param description
   * @private
   */
  onclose(reason, description) {
    this.connected = false;
    delete this.id;
    this.emitReserved("disconnect", reason, description);
    this._clearAcks();
  }
  /**
   * Clears the acknowledgement handlers upon disconnection, since the client will never receive an acknowledgement from
   * the server.
   *
   * @private
   */
  _clearAcks() {
    Object.keys(this.acks).forEach((id) => {
      const isBuffered = this.sendBuffer.some((packet) => String(packet.id) === id);
      if (!isBuffered) {
        const ack = this.acks[id];
        delete this.acks[id];
        if (ack.withError) {
          ack.call(this, new Error("socket has been disconnected"));
        }
      }
    });
  }
  /**
   * Called with socket packet.
   *
   * @param packet
   * @private
   */
  onpacket(packet) {
    const sameNamespace = packet.nsp === this.nsp;
    if (!sameNamespace)
      return;
    switch (packet.type) {
      case PacketType.CONNECT:
        if (packet.data && packet.data.sid) {
          this.onconnect(packet.data.sid, packet.data.pid);
        } else {
          this.emitReserved("connect_error", new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));
        }
        break;
      case PacketType.EVENT:
      case PacketType.BINARY_EVENT:
        this.onevent(packet);
        break;
      case PacketType.ACK:
      case PacketType.BINARY_ACK:
        this.onack(packet);
        break;
      case PacketType.DISCONNECT:
        this.ondisconnect();
        break;
      case PacketType.CONNECT_ERROR:
        this.destroy();
        const err = new Error(packet.data.message);
        err.data = packet.data.data;
        this.emitReserved("connect_error", err);
        break;
    }
  }
  /**
   * Called upon a server event.
   *
   * @param packet
   * @private
   */
  onevent(packet) {
    const args = packet.data || [];
    if (null != packet.id) {
      args.push(this.ack(packet.id));
    }
    if (this.connected) {
      this.emitEvent(args);
    } else {
      this.receiveBuffer.push(Object.freeze(args));
    }
  }
  emitEvent(args) {
    if (this._anyListeners && this._anyListeners.length) {
      const listeners = this._anyListeners.slice();
      for (const listener of listeners) {
        listener.apply(this, args);
      }
    }
    super.emit.apply(this, args);
    if (this._pid && args.length && typeof args[args.length - 1] === "string") {
      this._lastOffset = args[args.length - 1];
    }
  }
  /**
   * Produces an ack callback to emit with an event.
   *
   * @private
   */
  ack(id) {
    const self2 = this;
    let sent = false;
    return function(...args) {
      if (sent)
        return;
      sent = true;
      self2.packet({
        type: PacketType.ACK,
        id,
        data: args
      });
    };
  }
  /**
   * Called upon a server acknowledgement.
   *
   * @param packet
   * @private
   */
  onack(packet) {
    const ack = this.acks[packet.id];
    if (typeof ack !== "function") {
      return;
    }
    delete this.acks[packet.id];
    if (ack.withError) {
      packet.data.unshift(null);
    }
    ack.apply(this, packet.data);
  }
  /**
   * Called upon server connect.
   *
   * @private
   */
  onconnect(id, pid) {
    this.id = id;
    this.recovered = pid && this._pid === pid;
    this._pid = pid;
    this.connected = true;
    this.emitBuffered();
    this._drainQueue(true);
    this.emitReserved("connect");
  }
  /**
   * Emit buffered events (received and emitted).
   *
   * @private
   */
  emitBuffered() {
    this.receiveBuffer.forEach((args) => this.emitEvent(args));
    this.receiveBuffer = [];
    this.sendBuffer.forEach((packet) => {
      this.notifyOutgoingListeners(packet);
      this.packet(packet);
    });
    this.sendBuffer = [];
  }
  /**
   * Called upon server disconnect.
   *
   * @private
   */
  ondisconnect() {
    this.destroy();
    this.onclose("io server disconnect");
  }
  /**
   * Called upon forced client/server side disconnections,
   * this method ensures the manager stops tracking us and
   * that reconnections don't get triggered for this.
   *
   * @private
   */
  destroy() {
    if (this.subs) {
      this.subs.forEach((subDestroy) => subDestroy());
      this.subs = void 0;
    }
    this.io["_destroy"](this);
  }
  /**
   * Disconnects the socket manually. In that case, the socket will not try to reconnect.
   *
   * If this is the last active Socket instance of the {@link Manager}, the low-level connection will be closed.
   *
   * @example
   * const socket = io();
   *
   * socket.on("disconnect", (reason) => {
   *   // console.log(reason); prints "io client disconnect"
   * });
   *
   * socket.disconnect();
   *
   * @return self
   */
  disconnect() {
    if (this.connected) {
      this.packet({ type: PacketType.DISCONNECT });
    }
    this.destroy();
    if (this.connected) {
      this.onclose("io client disconnect");
    }
    return this;
  }
  /**
   * Alias for {@link disconnect()}.
   *
   * @return self
   */
  close() {
    return this.disconnect();
  }
  /**
   * Sets the compress flag.
   *
   * @example
   * socket.compress(false).emit("hello");
   *
   * @param compress - if `true`, compresses the sending data
   * @return self
   */
  compress(compress) {
    this.flags.compress = compress;
    return this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the event message will be dropped when this socket is not
   * ready to send messages.
   *
   * @example
   * socket.volatile.emit("hello"); // the server may or may not receive it
   *
   * @returns self
   */
  get volatile() {
    this.flags.volatile = true;
    return this;
  }
  /**
   * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
   * given number of milliseconds have elapsed without an acknowledgement from the server:
   *
   * @example
   * socket.timeout(5000).emit("my-event", (err) => {
   *   if (err) {
   *     // the server did not acknowledge the event in the given delay
   *   }
   * });
   *
   * @returns self
   */
  timeout(timeout) {
    this.flags.timeout = timeout;
    return this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * @example
   * socket.onAny((event, ...args) => {
   *   console.log(`got ${event}`);
   * });
   *
   * @param listener
   */
  onAny(listener) {
    this._anyListeners = this._anyListeners || [];
    this._anyListeners.push(listener);
    return this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * @example
   * socket.prependAny((event, ...args) => {
   *   console.log(`got event ${event}`);
   * });
   *
   * @param listener
   */
  prependAny(listener) {
    this._anyListeners = this._anyListeners || [];
    this._anyListeners.unshift(listener);
    return this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`got event ${event}`);
   * }
   *
   * socket.onAny(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAny(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAny();
   *
   * @param listener
   */
  offAny(listener) {
    if (!this._anyListeners) {
      return this;
    }
    if (listener) {
      const listeners = this._anyListeners;
      for (let i = 0; i < listeners.length; i++) {
        if (listener === listeners[i]) {
          listeners.splice(i, 1);
          return this;
        }
      }
    } else {
      this._anyListeners = [];
    }
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAny() {
    return this._anyListeners || [];
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.onAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  onAnyOutgoing(listener) {
    this._anyOutgoingListeners = this._anyOutgoingListeners || [];
    this._anyOutgoingListeners.push(listener);
    return this;
  }
  /**
   * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
   * callback. The listener is added to the beginning of the listeners array.
   *
   * Note: acknowledgements sent to the server are not included.
   *
   * @example
   * socket.prependAnyOutgoing((event, ...args) => {
   *   console.log(`sent event ${event}`);
   * });
   *
   * @param listener
   */
  prependAnyOutgoing(listener) {
    this._anyOutgoingListeners = this._anyOutgoingListeners || [];
    this._anyOutgoingListeners.unshift(listener);
    return this;
  }
  /**
   * Removes the listener that will be fired when any event is emitted.
   *
   * @example
   * const catchAllListener = (event, ...args) => {
   *   console.log(`sent event ${event}`);
   * }
   *
   * socket.onAnyOutgoing(catchAllListener);
   *
   * // remove a specific listener
   * socket.offAnyOutgoing(catchAllListener);
   *
   * // or remove all listeners
   * socket.offAnyOutgoing();
   *
   * @param [listener] - the catch-all listener (optional)
   */
  offAnyOutgoing(listener) {
    if (!this._anyOutgoingListeners) {
      return this;
    }
    if (listener) {
      const listeners = this._anyOutgoingListeners;
      for (let i = 0; i < listeners.length; i++) {
        if (listener === listeners[i]) {
          listeners.splice(i, 1);
          return this;
        }
      }
    } else {
      this._anyOutgoingListeners = [];
    }
    return this;
  }
  /**
   * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
   * e.g. to remove listeners.
   */
  listenersAnyOutgoing() {
    return this._anyOutgoingListeners || [];
  }
  /**
   * Notify the listeners for each packet sent
   *
   * @param packet
   *
   * @private
   */
  notifyOutgoingListeners(packet) {
    if (this._anyOutgoingListeners && this._anyOutgoingListeners.length) {
      const listeners = this._anyOutgoingListeners.slice();
      for (const listener of listeners) {
        listener.apply(this, packet.data);
      }
    }
  }
};

// node_modules/socket.io-client/build/esm/contrib/backo2.js
function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 1e4;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}
Backoff.prototype.duration = function() {
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand = Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};
Backoff.prototype.reset = function() {
  this.attempts = 0;
};
Backoff.prototype.setMin = function(min) {
  this.ms = min;
};
Backoff.prototype.setMax = function(max) {
  this.max = max;
};
Backoff.prototype.setJitter = function(jitter) {
  this.jitter = jitter;
};

// node_modules/socket.io-client/build/esm/manager.js
var Manager = class extends Emitter {
  constructor(uri, opts) {
    var _a;
    super();
    this.nsps = {};
    this.subs = [];
    if (uri && "object" === typeof uri) {
      opts = uri;
      uri = void 0;
    }
    opts = opts || {};
    opts.path = opts.path || "/socket.io";
    this.opts = opts;
    installTimerFunctions(this, opts);
    this.reconnection(opts.reconnection !== false);
    this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
    this.reconnectionDelay(opts.reconnectionDelay || 1e3);
    this.reconnectionDelayMax(opts.reconnectionDelayMax || 5e3);
    this.randomizationFactor((_a = opts.randomizationFactor) !== null && _a !== void 0 ? _a : 0.5);
    this.backoff = new Backoff({
      min: this.reconnectionDelay(),
      max: this.reconnectionDelayMax(),
      jitter: this.randomizationFactor()
    });
    this.timeout(null == opts.timeout ? 2e4 : opts.timeout);
    this._readyState = "closed";
    this.uri = uri;
    const _parser = opts.parser || esm_debug_exports;
    this.encoder = new _parser.Encoder();
    this.decoder = new _parser.Decoder();
    this._autoConnect = opts.autoConnect !== false;
    if (this._autoConnect)
      this.open();
  }
  reconnection(v) {
    if (!arguments.length)
      return this._reconnection;
    this._reconnection = !!v;
    if (!v) {
      this.skipReconnect = true;
    }
    return this;
  }
  reconnectionAttempts(v) {
    if (v === void 0)
      return this._reconnectionAttempts;
    this._reconnectionAttempts = v;
    return this;
  }
  reconnectionDelay(v) {
    var _a;
    if (v === void 0)
      return this._reconnectionDelay;
    this._reconnectionDelay = v;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMin(v);
    return this;
  }
  randomizationFactor(v) {
    var _a;
    if (v === void 0)
      return this._randomizationFactor;
    this._randomizationFactor = v;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setJitter(v);
    return this;
  }
  reconnectionDelayMax(v) {
    var _a;
    if (v === void 0)
      return this._reconnectionDelayMax;
    this._reconnectionDelayMax = v;
    (_a = this.backoff) === null || _a === void 0 ? void 0 : _a.setMax(v);
    return this;
  }
  timeout(v) {
    if (!arguments.length)
      return this._timeout;
    this._timeout = v;
    return this;
  }
  /**
   * Starts trying to reconnect if reconnection is enabled and we have not
   * started reconnecting yet
   *
   * @private
   */
  maybeReconnectOnOpen() {
    if (!this._reconnecting && this._reconnection && this.backoff.attempts === 0) {
      this.reconnect();
    }
  }
  /**
   * Sets the current transport `socket`.
   *
   * @param {Function} fn - optional, callback
   * @return self
   * @public
   */
  open(fn) {
    if (~this._readyState.indexOf("open"))
      return this;
    this.engine = new Socket(this.uri, this.opts);
    const socket = this.engine;
    const self2 = this;
    this._readyState = "opening";
    this.skipReconnect = false;
    const openSubDestroy = on(socket, "open", function() {
      self2.onopen();
      fn && fn();
    });
    const onError = (err) => {
      this.cleanup();
      this._readyState = "closed";
      this.emitReserved("error", err);
      if (fn) {
        fn(err);
      } else {
        this.maybeReconnectOnOpen();
      }
    };
    const errorSub = on(socket, "error", onError);
    if (false !== this._timeout) {
      const timeout = this._timeout;
      const timer = this.setTimeoutFn(() => {
        openSubDestroy();
        onError(new Error("timeout"));
        socket.close();
      }, timeout);
      if (this.opts.autoUnref) {
        timer.unref();
      }
      this.subs.push(() => {
        this.clearTimeoutFn(timer);
      });
    }
    this.subs.push(openSubDestroy);
    this.subs.push(errorSub);
    return this;
  }
  /**
   * Alias for open()
   *
   * @return self
   * @public
   */
  connect(fn) {
    return this.open(fn);
  }
  /**
   * Called upon transport open.
   *
   * @private
   */
  onopen() {
    this.cleanup();
    this._readyState = "open";
    this.emitReserved("open");
    const socket = this.engine;
    this.subs.push(
      on(socket, "ping", this.onping.bind(this)),
      on(socket, "data", this.ondata.bind(this)),
      on(socket, "error", this.onerror.bind(this)),
      on(socket, "close", this.onclose.bind(this)),
      // @ts-ignore
      on(this.decoder, "decoded", this.ondecoded.bind(this))
    );
  }
  /**
   * Called upon a ping.
   *
   * @private
   */
  onping() {
    this.emitReserved("ping");
  }
  /**
   * Called with data.
   *
   * @private
   */
  ondata(data) {
    try {
      this.decoder.add(data);
    } catch (e) {
      this.onclose("parse error", e);
    }
  }
  /**
   * Called when parser fully decodes a packet.
   *
   * @private
   */
  ondecoded(packet) {
    nextTick(() => {
      this.emitReserved("packet", packet);
    }, this.setTimeoutFn);
  }
  /**
   * Called upon socket error.
   *
   * @private
   */
  onerror(err) {
    this.emitReserved("error", err);
  }
  /**
   * Creates a new socket for the given `nsp`.
   *
   * @return {Socket}
   * @public
   */
  socket(nsp, opts) {
    let socket = this.nsps[nsp];
    if (!socket) {
      socket = new Socket2(this, nsp, opts);
      this.nsps[nsp] = socket;
    } else if (this._autoConnect && !socket.active) {
      socket.connect();
    }
    return socket;
  }
  /**
   * Called upon a socket close.
   *
   * @param socket
   * @private
   */
  _destroy(socket) {
    const nsps = Object.keys(this.nsps);
    for (const nsp of nsps) {
      const socket2 = this.nsps[nsp];
      if (socket2.active) {
        return;
      }
    }
    this._close();
  }
  /**
   * Writes a packet.
   *
   * @param packet
   * @private
   */
  _packet(packet) {
    const encodedPackets = this.encoder.encode(packet);
    for (let i = 0; i < encodedPackets.length; i++) {
      this.engine.write(encodedPackets[i], packet.options);
    }
  }
  /**
   * Clean up transport subscriptions and packet buffer.
   *
   * @private
   */
  cleanup() {
    this.subs.forEach((subDestroy) => subDestroy());
    this.subs.length = 0;
    this.decoder.destroy();
  }
  /**
   * Close the current socket.
   *
   * @private
   */
  _close() {
    this.skipReconnect = true;
    this._reconnecting = false;
    this.onclose("forced close");
  }
  /**
   * Alias for close()
   *
   * @private
   */
  disconnect() {
    return this._close();
  }
  /**
   * Called when:
   *
   * - the low-level engine is closed
   * - the parser encountered a badly formatted packet
   * - all sockets are disconnected
   *
   * @private
   */
  onclose(reason, description) {
    var _a;
    this.cleanup();
    (_a = this.engine) === null || _a === void 0 ? void 0 : _a.close();
    this.backoff.reset();
    this._readyState = "closed";
    this.emitReserved("close", reason, description);
    if (this._reconnection && !this.skipReconnect) {
      this.reconnect();
    }
  }
  /**
   * Attempt a reconnection.
   *
   * @private
   */
  reconnect() {
    if (this._reconnecting || this.skipReconnect)
      return this;
    const self2 = this;
    if (this.backoff.attempts >= this._reconnectionAttempts) {
      this.backoff.reset();
      this.emitReserved("reconnect_failed");
      this._reconnecting = false;
    } else {
      const delay = this.backoff.duration();
      this._reconnecting = true;
      const timer = this.setTimeoutFn(() => {
        if (self2.skipReconnect)
          return;
        this.emitReserved("reconnect_attempt", self2.backoff.attempts);
        if (self2.skipReconnect)
          return;
        self2.open((err) => {
          if (err) {
            self2._reconnecting = false;
            self2.reconnect();
            this.emitReserved("reconnect_error", err);
          } else {
            self2.onreconnect();
          }
        });
      }, delay);
      if (this.opts.autoUnref) {
        timer.unref();
      }
      this.subs.push(() => {
        this.clearTimeoutFn(timer);
      });
    }
  }
  /**
   * Called upon successful reconnect.
   *
   * @private
   */
  onreconnect() {
    const attempt = this.backoff.attempts;
    this._reconnecting = false;
    this.backoff.reset();
    this.emitReserved("reconnect", attempt);
  }
};

// node_modules/socket.io-client/build/esm/index.js
var cache = {};
function lookup2(uri, opts) {
  if (typeof uri === "object") {
    opts = uri;
    uri = void 0;
  }
  opts = opts || {};
  const parsed = url(uri, opts.path || "/socket.io");
  const source = parsed.source;
  const id = parsed.id;
  const path = parsed.path;
  const sameNamespace = cache[id] && path in cache[id]["nsps"];
  const newConnection = opts.forceNew || opts["force new connection"] || false === opts.multiplex || sameNamespace;
  let io;
  if (newConnection) {
    io = new Manager(source, opts);
  } else {
    if (!cache[id]) {
      cache[id] = new Manager(source, opts);
    }
    io = cache[id];
  }
  if (parsed.query && !opts.query) {
    opts.query = parsed.queryKey;
  }
  return io.socket(parsed.path, opts);
}
Object.assign(lookup2, {
  Manager,
  Socket: Socket2,
  io: lookup2,
  connect: lookup2
});

// src/app/core/services/socket.service.ts
var SOCKET_URL = "http://172.31.58.150:5001";
var SocketService = class _SocketService {
  socket;
  connect(userId) {
    if (this.socket?.connected)
      return;
    this.socket = lookup2(SOCKET_URL, {
      auth: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 500,
      reconnectionAttempts: Infinity,
      timeout: 1e4
    });
    this.socket.on("connect", () => console.log("[Socket] Connected"));
    this.socket.on("disconnect", () => console.log("[Socket] Disconnected"));
  }
  disconnect() {
    this.socket?.disconnect();
  }
  on(event) {
    return new Observable((obs) => {
      this.socket?.on(event, (data) => obs.next(data));
    });
  }
  emit(event, data) {
    this.socket?.emit(event, data);
  }
  joinChat(chatId) {
    this.socket?.emit("chat:join", { chatId });
  }
  leaveChat(chatId) {
    this.socket?.emit("chat:leave", { chatId });
  }
  sendMessage(chatId, content) {
    this.socket?.emit("message:send", { chatId, content });
  }
  sendTypingStart(chatId) {
    this.socket?.emit("typing:start", { chatId });
  }
  sendTypingStop(chatId) {
    this.socket?.emit("typing:stop", { chatId });
  }
  initiateCall(chatId, targetUserId, type) {
    this.socket?.emit("call:initiate", { chatId, targetUserId, type });
  }
  sendOffer(callId, sdp, targetUserId) {
    this.socket?.emit("webrtc:offer", { callId, sdp, targetUserId });
  }
  sendAnswer(callId, sdp, targetUserId) {
    this.socket?.emit("webrtc:answer", { callId, sdp, targetUserId });
  }
  sendIce(callId, candidate, targetUserId) {
    this.socket?.emit("webrtc:ice", { callId, candidate, targetUserId });
  }
  syncChats() {
    this.socket?.emit("chats:sync");
  }
  markRead(chatId, messageId) {
    this.socket?.emit("message:read", { chatId, messageId });
  }
  static \u0275fac = function SocketService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SocketService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _SocketService, factory: _SocketService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SocketService, [{
    type: Injectable,
    args: [{ providedIn: "root" }]
  }], null, null);
})();

// src/app/features/call/call.component.ts
var _c0 = ["localVideo"];
var _c1 = ["remoteVideo"];
var _c2 = ["remoteAudio"];
function CallComponent_Conditional_4_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 13)(1, "div", 15);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r0.call.targetColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.call.targetInitials);
  }
}
function CallComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "video", 12, 1);
    \u0275\u0275conditionalCreate(2, CallComponent_Conditional_4_Conditional_2_Template, 3, 3, "div", 13);
    \u0275\u0275domElement(3, "video", 14, 2);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r0.hasRemote() ? 2 : -1);
  }
}
function CallComponent_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 16);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background", ctx_r0.call.targetColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.call.targetInitials);
  }
}
function CallComponent_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 17);
    \u0275\u0275domElement(1, "span")(2, "span")(3, "span");
    \u0275\u0275domElementEnd();
    \u0275\u0275text(4, " Calling");
  }
}
function CallComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate1("Incoming ", ctx_r0.call.type, " call");
  }
}
function CallComponent_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate(ctx_r0.timer());
  }
}
function CallComponent_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0, "Call ended");
  }
}
function CallComponent_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 10)(1, "div", 18)(2, "button", 19);
    \u0275\u0275domListener("click", function CallComponent_Conditional_14_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.decline());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(3, "svg", 20);
    \u0275\u0275domElement(4, "path", 21)(5, "rect", 22)(6, "line", 23);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(7, "span");
    \u0275\u0275text(8, "Decline");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(9, "div", 18)(10, "button", 24);
    \u0275\u0275domListener("click", function CallComponent_Conditional_14_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.answer());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(11, "svg", 25);
    \u0275\u0275domElement(12, "path", 26);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(13, "span");
    \u0275\u0275text(14, "Answer");
    \u0275\u0275domElementEnd()()();
  }
}
function CallComponent_Conditional_15_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 25);
    \u0275\u0275domElement(1, "path", 30)(2, "path", 31);
    \u0275\u0275domElementEnd();
  }
}
function CallComponent_Conditional_15_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 25);
    \u0275\u0275domElement(1, "line", 23)(2, "path", 32)(3, "path", 33);
    \u0275\u0275domElementEnd();
  }
}
function CallComponent_Conditional_15_Conditional_7_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 25);
    \u0275\u0275domElement(1, "polygon", 34)(2, "rect", 22);
    \u0275\u0275domElementEnd();
  }
}
function CallComponent_Conditional_15_Conditional_7_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(0, "svg", 25);
    \u0275\u0275domElement(1, "path", 35)(2, "line", 23);
    \u0275\u0275domElementEnd();
  }
}
function CallComponent_Conditional_15_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 18)(1, "button", 27);
    \u0275\u0275domListener("click", function CallComponent_Conditional_15_Conditional_7_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.toggleVideo());
    });
    \u0275\u0275conditionalCreate(2, CallComponent_Conditional_15_Conditional_7_Conditional_2_Template, 3, 0, ":svg:svg", 25)(3, CallComponent_Conditional_15_Conditional_7_Conditional_3_Template, 3, 0, ":svg:svg", 25);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(4, "span");
    \u0275\u0275text(5);
    \u0275\u0275domElementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275classProp("off", ctx_r0.videoOff());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.videoOff() ? 2 : 3);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.videoOff() ? "Cam On" : "Cam Off");
  }
}
function CallComponent_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 11)(1, "div", 18)(2, "button", 27);
    \u0275\u0275domListener("click", function CallComponent_Conditional_15_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.toggleMute());
    });
    \u0275\u0275conditionalCreate(3, CallComponent_Conditional_15_Conditional_3_Template, 3, 0, ":svg:svg", 25)(4, CallComponent_Conditional_15_Conditional_4_Template, 4, 0, ":svg:svg", 25);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(5, "span");
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd()();
    \u0275\u0275conditionalCreate(7, CallComponent_Conditional_15_Conditional_7_Template, 6, 4, "div", 18);
    \u0275\u0275domElementStart(8, "div", 18)(9, "button", 28);
    \u0275\u0275domListener("click", function CallComponent_Conditional_15_Template_button_click_9_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.end());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275domElementStart(10, "svg", 20);
    \u0275\u0275domElement(11, "path", 29);
    \u0275\u0275domElementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275domElementStart(12, "span");
    \u0275\u0275text(13, "End");
    \u0275\u0275domElementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275classProp("off", ctx_r0.muted());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r0.muted() ? 3 : 4);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.muted() ? "Unmute" : "Mute");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.call.type === "video" ? 7 : -1);
  }
}
function createRingtone(ctx) {
  let stopped = false;
  const playRing = () => {
    if (stopped)
      return;
    const ringOnce = (startTime) => {
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, startTime);
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(480, startTime);
      osc.frequency.linearRampToValueAtTime(460, startTime + 0.05);
      osc.frequency.linearRampToValueAtTime(440, startTime + 0.1);
      osc.frequency.linearRampToValueAtTime(460, startTime + 0.15);
      osc.frequency.linearRampToValueAtTime(440, startTime + 0.2);
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.22, startTime + 0.02);
      gain.gain.setValueAtTime(0.22, startTime + 0.38);
      gain.gain.linearRampToValueAtTime(0, startTime + 0.4);
      osc.start(startTime);
      osc.stop(startTime + 0.42);
      osc2.start(startTime);
      osc2.stop(startTime + 0.42);
    };
    const now = ctx.currentTime;
    ringOnce(now);
    ringOnce(now + 0.5);
    setTimeout(() => {
      if (!stopped)
        playRing();
    }, 3500);
  };
  playRing();
  return () => {
    stopped = true;
  };
}
var CallComponent = class _CallComponent {
  localVideoEl;
  remoteVideoEl;
  remoteAudioEl;
  call;
  callEnded = new EventEmitter();
  socket = inject(SocketService);
  zone = inject(NgZone);
  destroy$ = new Subject();
  pc;
  localStream;
  remoteStream = new MediaStream();
  // ✅ FIX: single persistent remote stream
  timerInterval;
  secs = 0;
  pendingCandidates = [];
  answered = false;
  answering = false;
  audioCtx;
  stopRingtone;
  muted = signal(false, ...ngDevMode ? [{ debugName: "muted" }] : []);
  videoOff = signal(false, ...ngDevMode ? [{ debugName: "videoOff" }] : []);
  hasRemote = signal(false, ...ngDevMode ? [{ debugName: "hasRemote" }] : []);
  timer = signal("00:00", ...ngDevMode ? [{ debugName: "timer" }] : []);
  st = signal("ringing", ...ngDevMode ? [{ debugName: "st" }] : []);
  ngOnInit() {
    this.startRingtone();
    this.listenSocket();
    if (this.call.direction === "outgoing")
      this.setupMedia();
  }
  ngOnDestroy() {
    this.stopRingtoneSound();
    this.destroy$.next();
    this.destroy$.complete();
    this.cleanup();
  }
  startRingtone() {
    try {
      this.audioCtx = new AudioContext();
      this.stopRingtone = createRingtone(this.audioCtx);
    } catch {
    }
  }
  stopRingtoneSound() {
    try {
      this.stopRingtone?.();
    } catch {
    }
    try {
      this.audioCtx?.close();
    } catch {
    }
  }
  // ✅ FIX: dedicated method to attach audio with retries + autoplay unlock
  attachRemoteAudio(n = 0) {
    const el = this.remoteAudioEl?.nativeElement;
    if (el) {
      el.srcObject = this.remoteStream;
      el.volume = 1;
      el.muted = false;
      const p = el.play();
      if (p) {
        p.catch((err) => {
          console.warn("[Audio] play() blocked:", err.name);
          if (n < 5)
            setTimeout(() => this.attachRemoteAudio(n + 1), 300);
        });
      }
    } else if (n < 20) {
      setTimeout(() => this.attachRemoteAudio(n + 1), 150);
    }
  }
  listenSocket() {
    this.socket.on("call:answered").pipe(takeUntil(this.destroy$), take(1)).subscribe(async () => {
      if (this.answered)
        return;
      this.answered = true;
      this.stopRingtoneSound();
      this.zone.run(() => {
        this.st.set("connected");
        this.startTimer();
      });
      let w = 0;
      while (!this.localStream && w < 6e3) {
        await new Promise((r) => setTimeout(r, 100));
        w += 100;
      }
      this.setupPeerConnection();
      await new Promise((r) => setTimeout(r, 200));
      const offer = await this.pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: this.call.type === "video"
      });
      await this.pc.setLocalDescription(offer);
      this.socket.sendOffer(this.call.callId, offer, this.call.targetUserId);
    });
    this.socket.on("webrtc:offer").pipe(takeUntil(this.destroy$)).subscribe(async ({ sdp }) => {
      if (!this.pc) {
        await this.waitForPC();
      }
      if (!this.pc)
        return;
      await this.pc.setRemoteDescription(new RTCSessionDescription(sdp));
      for (const c of this.pendingCandidates) {
        await this.pc.addIceCandidate(new RTCIceCandidate(c)).catch(() => {
        });
      }
      this.pendingCandidates = [];
      const answer = await this.pc.createAnswer();
      await this.pc.setLocalDescription(answer);
      this.socket.sendAnswer(this.call.callId, answer, this.call.targetUserId);
    });
    this.socket.on("webrtc:answer").pipe(takeUntil(this.destroy$)).subscribe(async ({ sdp }) => {
      if (!this.pc)
        return;
      await this.pc.setRemoteDescription(new RTCSessionDescription(sdp)).catch(console.error);
    });
    this.socket.on("webrtc:ice").pipe(takeUntil(this.destroy$)).subscribe(async ({ candidate }) => {
      if (!candidate)
        return;
      if (!this.pc || !this.pc.remoteDescription) {
        this.pendingCandidates.push(candidate);
        return;
      }
      await this.pc.addIceCandidate(new RTCIceCandidate(candidate)).catch(() => {
      });
    });
    this.socket.on("call:declined").pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.zone.run(() => this.endCall());
    });
    this.socket.on("call:ended").pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.zone.run(() => this.endCall());
    });
  }
  waitForPC() {
    return new Promise((r) => {
      let t = 0;
      const i = setInterval(() => {
        t++;
        if (this.pc || t > 20) {
          clearInterval(i);
          r();
        }
      }, 150);
    });
  }
  async answer() {
    if (this.answering)
      return;
    this.answering = true;
    this.stopRingtoneSound();
    try {
      if (this.audioCtx?.state === "suspended")
        await this.audioCtx.resume();
    } catch {
    }
    this.socket.emit("call:answer", { callId: this.call.callId, targetUserId: this.call.targetUserId });
    this.zone.run(() => {
      this.st.set("connected");
      this.startTimer();
    });
    await this.setupMedia();
    this.setupPeerConnection();
    this.attachRemoteAudio();
  }
  decline() {
    this.stopRingtoneSound();
    this.socket.emit("call:decline", { callId: this.call.callId, targetUserId: this.call.targetUserId });
    this.callEnded.emit();
  }
  end() {
    this.stopRingtoneSound();
    this.socket.emit("call:end", { callId: this.call.callId, targetUserId: this.call.targetUserId });
    this.endCall();
  }
  async setupMedia() {
    this.localStream?.getTracks().forEach((t) => t.stop());
    const isVideo = this.call.type === "video";
    const attempts = [
      { audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true }, video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "user" } : false },
      { audio: { echoCancellation: true, noiseSuppression: true }, video: isVideo },
      { audio: true, video: false }
    ];
    for (const c of attempts) {
      try {
        this.localStream = await navigator.mediaDevices.getUserMedia(c);
        console.log("[Media] Got tracks:", this.localStream.getTracks().map((t) => t.kind));
        if (isVideo) {
          this.attachEl(() => this.localVideoEl?.nativeElement, this.localStream);
        }
        return;
      } catch (e) {
        console.warn("[Media] Attempt failed:", e.name, c);
      }
    }
    console.error("[Media] All attempts failed");
  }
  setupPeerConnection() {
    this.pc = new RTCPeerConnection({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19302"] },
        { urls: "turn:openrelay.metered.ca:80", username: "openrelayproject", credential: "openrelayproject" },
        { urls: "turn:openrelay.metered.ca:443", username: "openrelayproject", credential: "openrelayproject" },
        { urls: "turn:openrelay.metered.ca:443?transport=tcp", username: "openrelayproject", credential: "openrelayproject" }
      ]
    });
    this.pc.ontrack = (e) => {
      console.log("[WebRTC] Got remote track:", e.track.kind);
      e.track.onunmute = () => {
        this.remoteStream.addTrack(e.track);
        this.zone.run(() => {
          this.hasRemote.set(true);
          if (e.track.kind === "audio") {
            this.attachRemoteAudio();
          }
          if (e.track.kind === "video" && this.call.type === "video") {
            this.attachEl(() => this.remoteVideoEl?.nativeElement, this.remoteStream);
          }
        });
      };
      this.remoteStream.addTrack(e.track);
      this.zone.run(() => {
        this.hasRemote.set(true);
        if (e.track.kind === "audio") {
          this.attachRemoteAudio();
        }
        if (e.track.kind === "video" && this.call.type === "video") {
          this.attachEl(() => this.remoteVideoEl?.nativeElement, this.remoteStream);
        }
      });
    };
    this.localStream?.getTracks().forEach((t) => {
      this.pc.addTrack(t, this.localStream);
      console.log("[WebRTC] Added local track:", t.kind);
    });
    this.pc.onicecandidate = (e) => {
      if (e.candidate)
        this.socket.sendIce(this.call.callId, e.candidate.toJSON(), this.call.targetUserId);
    };
    this.pc.onconnectionstatechange = () => {
      console.log("[WebRTC] Connection state:", this.pc.connectionState);
      if (this.pc.connectionState === "connected") {
        this.zone.run(() => {
          this.st.set("connected");
          if (!this.timerInterval)
            this.startTimer();
          this.attachRemoteAudio();
        });
      }
    };
    this.pc.oniceconnectionstatechange = () => {
      console.log("[WebRTC] ICE state:", this.pc.iceConnectionState);
    };
  }
  attachEl(getEl, stream, n = 0) {
    const el = getEl();
    if (el) {
      el.srcObject = stream;
      el.play().catch(() => {
      });
    } else if (n < 25)
      setTimeout(() => this.attachEl(getEl, stream, n + 1), 150);
  }
  toggleMute() {
    this.muted.update((m) => !m);
    this.localStream?.getAudioTracks().forEach((t) => t.enabled = !this.muted());
  }
  toggleVideo() {
    this.videoOff.update((v) => !v);
    this.localStream?.getVideoTracks().forEach((t) => t.enabled = !this.videoOff());
  }
  startTimer() {
    this.secs = 0;
    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.secs++;
      const m = Math.floor(this.secs / 60).toString().padStart(2, "0");
      const s = (this.secs % 60).toString().padStart(2, "0");
      this.zone.run(() => this.timer.set(`${m}:${s}`));
    }, 1e3);
  }
  endCall() {
    this.st.set("ended");
    clearInterval(this.timerInterval);
    this.cleanup();
    setTimeout(() => this.callEnded.emit(), 1e3);
  }
  cleanup() {
    clearInterval(this.timerInterval);
    this.localStream?.getTracks().forEach((t) => t.stop());
    try {
      this.pc?.close();
    } catch {
    }
    const a = this.remoteAudioEl?.nativeElement;
    if (a) {
      a.srcObject = null;
      a.pause();
    }
  }
  static \u0275fac = function CallComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CallComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CallComponent, selectors: [["app-call"]], viewQuery: function CallComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c0, 5)(_c1, 5)(_c2, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.localVideoEl = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.remoteVideoEl = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.remoteAudioEl = _t.first);
    }
  }, inputs: { call: "call" }, outputs: { callEnded: "callEnded" }, decls: 16, vars: 8, consts: [["remoteAudio", ""], ["remoteVideo", ""], ["localVideo", ""], [1, "cs"], [1, "bg"], ["autoplay", "", "playsinline", ""], [1, "top"], [1, "aav", 3, "background"], [1, "cname"], [1, "cst"], [1, "acts", "inc"], [1, "acts", "act"], ["autoplay", "", "playsinline", "", 1, "rv"], [1, "rph"], ["autoplay", "", "playsinline", "", "muted", "", 1, "lv"], [1, "rav"], [1, "aav"], [1, "dots"], [1, "aw"], [1, "ab", "dec", 3, "click"], ["viewBox", "0 0 24 24", "fill", "none", "stroke", "white", "stroke-width", "2.5", "stroke-linecap", "round"], ["d", "M23 7l-7 5 7 5V7z"], ["x", "1", "y", "5", "width", "15", "height", "14", "rx", "2"], ["x1", "1", "y1", "1", "x2", "23", "y2", "23"], [1, "ab", "ans", 3, "click"], ["viewBox", "0 0 24 24", "fill", "none", "stroke", "white", "stroke-width", "2", "stroke-linecap", "round"], ["d", "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"], [1, "ab", 3, "click"], [1, "ab", "end", 3, "click"], ["d", "M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.07-3.07M2 2l20 20"], ["d", "M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"], ["d", "M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"], ["d", "M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"], ["d", "M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"], ["points", "23 7 16 12 23 17 23 7"], ["d", "M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10"]], template: function CallComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 3);
      \u0275\u0275domElement(1, "div", 4)(2, "audio", 5, 0);
      \u0275\u0275conditionalCreate(4, CallComponent_Conditional_4_Template, 5, 1);
      \u0275\u0275domElementStart(5, "div", 6);
      \u0275\u0275conditionalCreate(6, CallComponent_Conditional_6_Template, 2, 3, "div", 7);
      \u0275\u0275domElementStart(7, "div", 8);
      \u0275\u0275text(8);
      \u0275\u0275domElementEnd();
      \u0275\u0275domElementStart(9, "div", 9);
      \u0275\u0275conditionalCreate(10, CallComponent_Conditional_10_Template, 5, 0)(11, CallComponent_Conditional_11_Template, 1, 1)(12, CallComponent_Conditional_12_Template, 1, 1)(13, CallComponent_Conditional_13_Template, 1, 0);
      \u0275\u0275domElementEnd()();
      \u0275\u0275conditionalCreate(14, CallComponent_Conditional_14_Template, 15, 0, "div", 10);
      \u0275\u0275conditionalCreate(15, CallComponent_Conditional_15_Template, 14, 5, "div", 11);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275classProp("video", ctx.call.type === "video");
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.call.type === "video" ? 4 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.call.type === "audio" ? 6 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.call.targetName);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.st() === "ringing" && ctx.call.direction === "outgoing" ? 10 : ctx.st() === "ringing" && ctx.call.direction === "incoming" ? 11 : ctx.st() === "connected" ? 12 : 13);
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.st() === "ringing" && ctx.call.direction === "incoming" ? 14 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.st() === "connected" || ctx.st() === "ringing" && ctx.call.direction === "outgoing" ? 15 : -1);
    }
  }, dependencies: [CommonModule], styles: ['\n\n.cs[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  font-family: "Plus Jakarta Sans", sans-serif;\n  touch-action: manipulation;\n}\n.bg[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      160deg,\n      #0d0d1a 0%,\n      #1a0d2e 50%,\n      #0d1a1a 100%);\n  z-index: 0;\n}\n.cs.video[_ngcontent-%COMP%]   .bg[_ngcontent-%COMP%] {\n  background: #000;\n}\n.rv[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 1;\n}\n.rph[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      160deg,\n      #0d0d1a,\n      #1a0d2e);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1;\n}\n.rav[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 34px;\n  font-weight: 800;\n  color: #fff;\n}\n.lv[_ngcontent-%COMP%] {\n  position: absolute;\n  top: env(safe-area-inset-top, 20px);\n  right: 16px;\n  width: 90px;\n  height: 120px;\n  border-radius: 14px;\n  object-fit: cover;\n  z-index: 10;\n  border: 2px solid rgba(255, 255, 255, 0.4);\n  background: #111;\n  margin-top: 80px;\n}\n.top[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: calc(env(safe-area-inset-top, 0px) + 70px);\n  gap: 12px;\n}\n.aav[_ngcontent-%COMP%] {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 34px;\n  font-weight: 800;\n  color: #fff;\n  box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.07), 0 0 0 24px rgba(255, 255, 255, 0.04);\n  animation: _ngcontent-%COMP%_rpulse 2.2s ease-in-out infinite;\n}\n.cname[_ngcontent-%COMP%] {\n  font-size: 28px;\n  font-weight: 800;\n  color: #fff;\n  letter-spacing: -0.5px;\n  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.5);\n}\n.cst[_ngcontent-%COMP%] {\n  font-size: 14px;\n  color: rgba(255, 255, 255, 0.65);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  letter-spacing: 0.2px;\n}\n.dots[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 3px;\n  align-items: center;\n}\n.dots[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.7);\n  animation: _ngcontent-%COMP%_dot 1.4s ease infinite;\n}\n.dots[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.dots[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.4s;\n}\n@keyframes _ngcontent-%COMP%_dot {\n  0%, 80%, 100% {\n    transform: scale(0.6);\n    opacity: 0.4;\n  }\n  40% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.acts[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  gap: 20px;\n  padding: 28px 20px;\n  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));\n}\n.acts.inc[_ngcontent-%COMP%] {\n  gap: 52px;\n}\n.aw[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.aw[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-size: 11px;\n  color: rgba(255, 255, 255, 0.7);\n  font-weight: 600;\n  letter-spacing: 0.3px;\n}\n.ab[_ngcontent-%COMP%] {\n  width: 62px;\n  height: 62px;\n  border-radius: 50%;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.15s, box-shadow 0.15s;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n  min-height: unset;\n  min-width: unset;\n  background: rgba(255, 255, 255, 0.16);\n  -webkit-backdrop-filter: blur(16px);\n  backdrop-filter: blur(16px);\n}\n.ab[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 24px;\n}\n.ab[_ngcontent-%COMP%]:active {\n  transform: scale(0.92);\n}\n.ab.off[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.07);\n  opacity: 0.55;\n}\n.ab.end[_ngcontent-%COMP%] {\n  background: #FF3B30;\n  box-shadow: 0 4px 20px rgba(255, 59, 48, 0.45);\n}\n.ab.end[_ngcontent-%COMP%]:active {\n  box-shadow: 0 2px 10px rgba(255, 59, 48, 0.3);\n}\n.ab.ans[_ngcontent-%COMP%] {\n  background: #34C759;\n  box-shadow: 0 4px 20px rgba(52, 199, 89, 0.45);\n}\n.ab.ans[_ngcontent-%COMP%]:active {\n  box-shadow: 0 2px 10px rgba(52, 199, 89, 0.3);\n}\n.ab.dec[_ngcontent-%COMP%] {\n  background: #FF3B30;\n  box-shadow: 0 4px 20px rgba(255, 59, 48, 0.45);\n}\n@keyframes _ngcontent-%COMP%_rpulse {\n  0%, 100% {\n    box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.07), 0 0 0 24px rgba(255, 255, 255, 0.04);\n  }\n  50% {\n    box-shadow: 0 0 0 18px rgba(255, 255, 255, 0.1), 0 0 0 36px rgba(255, 255, 255, 0.05);\n  }\n}\n/*# sourceMappingURL=call.component.css.map */'] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CallComponent, [{
    type: Component,
    args: [{ selector: "app-call", standalone: true, imports: [CommonModule], template: `
<div class="cs" [class.video]="call.type==='video'">
  <div class="bg"></div>

  <!-- \u2705 FIX: audio element always present, never muted -->
  <audio #remoteAudio autoplay playsinline></audio>

  @if(call.type==='video'){
    <video #remoteVideo class="rv" autoplay playsinline></video>
    @if(!hasRemote()){
      <div class="rph"><div class="rav" [style.background]="call.targetColor">{{call.targetInitials}}</div></div>
    }
    <video #localVideo class="lv" autoplay playsinline muted></video>
  }

  <div class="top">
    @if(call.type==='audio'){
      <div class="aav" [style.background]="call.targetColor">{{call.targetInitials}}</div>
    }
    <div class="cname">{{call.targetName}}</div>
    <div class="cst">
      @if(st()==='ringing' && call.direction==='outgoing'){<span class="dots"><span></span><span></span><span></span></span> Calling}
      @else if(st()==='ringing' && call.direction==='incoming'){Incoming {{call.type}} call}
      @else if(st()==='connected'){{{timer()}}}
      @else{Call ended}
    </div>
  </div>

  @if(st()==='ringing' && call.direction==='incoming'){
    <div class="acts inc">
      <div class="aw"><button class="ab dec" (click)="decline()"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/><line x1="1" y1="1" x2="23" y2="23"/></svg></button><span>Decline</span></div>
      <div class="aw"><button class="ab ans" (click)="answer()"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></button><span>Answer</span></div>
    </div>
  }

  @if(st()==='connected' || (st()==='ringing' && call.direction==='outgoing')){
    <div class="acts act">
      <div class="aw"><button class="ab" [class.off]="muted()" (click)="toggleMute()">
        @if(!muted()){<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>}
        @else{<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><line x1="1" y1="1" x2="23" y2="23"/><path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/><path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23M12 19v4M8 23h8"/></svg>}
      </button><span>{{muted()?'Unmute':'Mute'}}</span></div>

      @if(call.type==='video'){
        <div class="aw"><button class="ab" [class.off]="videoOff()" (click)="toggleVideo()">
          @if(!videoOff()){<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>}
          @else{<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><path d="M16 16v1a2 2 0 01-2 2H3a2 2 0 01-2-2V7a2 2 0 012-2h2m5.66 0H14a2 2 0 012 2v3.34l1 1L23 7v10"/><line x1="1" y1="1" x2="23" y2="23"/></svg>}
        </button><span>{{videoOff()?'Cam On':'Cam Off'}}</span></div>
      }

      <div class="aw"><button class="ab end" (click)="end()"><svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.42 19.42 0 01-3.07-3.07M2 2l20 20"/></svg></button><span>End</span></div>
    </div>
  }
</div>
  `, styles: ['/* angular:styles/component:scss;985cf13d27dad3e811ecc6306e322c916140cdc1d5611f3e06bf22b8815ace6b;C:/js_projects/saylo-v2/frontend/src/app/features/call/call.component.ts */\n.cs {\n  position: fixed;\n  inset: 0;\n  z-index: 9999;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: space-between;\n  font-family: "Plus Jakarta Sans", sans-serif;\n  touch-action: manipulation;\n}\n.bg {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      160deg,\n      #0d0d1a 0%,\n      #1a0d2e 50%,\n      #0d1a1a 100%);\n  z-index: 0;\n}\n.cs.video .bg {\n  background: #000;\n}\n.rv {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  z-index: 1;\n}\n.rph {\n  position: absolute;\n  inset: 0;\n  background:\n    linear-gradient(\n      160deg,\n      #0d0d1a,\n      #1a0d2e);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  z-index: 1;\n}\n.rav {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 34px;\n  font-weight: 800;\n  color: #fff;\n}\n.lv {\n  position: absolute;\n  top: env(safe-area-inset-top, 20px);\n  right: 16px;\n  width: 90px;\n  height: 120px;\n  border-radius: 14px;\n  object-fit: cover;\n  z-index: 10;\n  border: 2px solid rgba(255, 255, 255, 0.4);\n  background: #111;\n  margin-top: 80px;\n}\n.top {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  padding-top: calc(env(safe-area-inset-top, 0px) + 70px);\n  gap: 12px;\n}\n.aav {\n  width: 96px;\n  height: 96px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 34px;\n  font-weight: 800;\n  color: #fff;\n  box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.07), 0 0 0 24px rgba(255, 255, 255, 0.04);\n  animation: rpulse 2.2s ease-in-out infinite;\n}\n.cname {\n  font-size: 28px;\n  font-weight: 800;\n  color: #fff;\n  letter-spacing: -0.5px;\n  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.5);\n}\n.cst {\n  font-size: 14px;\n  color: rgba(255, 255, 255, 0.65);\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  letter-spacing: 0.2px;\n}\n.dots {\n  display: flex;\n  gap: 3px;\n  align-items: center;\n}\n.dots span {\n  width: 5px;\n  height: 5px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.7);\n  animation: dot 1.4s ease infinite;\n}\n.dots span:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.dots span:nth-child(3) {\n  animation-delay: 0.4s;\n}\n@keyframes dot {\n  0%, 80%, 100% {\n    transform: scale(0.6);\n    opacity: 0.4;\n  }\n  40% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n.acts {\n  position: relative;\n  z-index: 5;\n  display: flex;\n  gap: 20px;\n  padding: 28px 20px;\n  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));\n}\n.acts.inc {\n  gap: 52px;\n}\n.aw {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.aw span {\n  font-size: 11px;\n  color: rgba(255, 255, 255, 0.7);\n  font-weight: 600;\n  letter-spacing: 0.3px;\n}\n.ab {\n  width: 62px;\n  height: 62px;\n  border-radius: 50%;\n  border: none;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.15s, box-shadow 0.15s;\n  touch-action: manipulation;\n  -webkit-tap-highlight-color: transparent;\n  min-height: unset;\n  min-width: unset;\n  background: rgba(255, 255, 255, 0.16);\n  -webkit-backdrop-filter: blur(16px);\n  backdrop-filter: blur(16px);\n}\n.ab svg {\n  width: 24px;\n  height: 24px;\n}\n.ab:active {\n  transform: scale(0.92);\n}\n.ab.off {\n  background: rgba(255, 255, 255, 0.07);\n  opacity: 0.55;\n}\n.ab.end {\n  background: #FF3B30;\n  box-shadow: 0 4px 20px rgba(255, 59, 48, 0.45);\n}\n.ab.end:active {\n  box-shadow: 0 2px 10px rgba(255, 59, 48, 0.3);\n}\n.ab.ans {\n  background: #34C759;\n  box-shadow: 0 4px 20px rgba(52, 199, 89, 0.45);\n}\n.ab.ans:active {\n  box-shadow: 0 2px 10px rgba(52, 199, 89, 0.3);\n}\n.ab.dec {\n  background: #FF3B30;\n  box-shadow: 0 4px 20px rgba(255, 59, 48, 0.45);\n}\n@keyframes rpulse {\n  0%, 100% {\n    box-shadow: 0 0 0 12px rgba(255, 255, 255, 0.07), 0 0 0 24px rgba(255, 255, 255, 0.04);\n  }\n  50% {\n    box-shadow: 0 0 0 18px rgba(255, 255, 255, 0.1), 0 0 0 36px rgba(255, 255, 255, 0.05);\n  }\n}\n/*# sourceMappingURL=call.component.css.map */\n'] }]
  }], null, { localVideoEl: [{
    type: ViewChild,
    args: ["localVideo"]
  }], remoteVideoEl: [{
    type: ViewChild,
    args: ["remoteVideo"]
  }], remoteAudioEl: [{
    type: ViewChild,
    args: ["remoteAudio"]
  }], call: [{
    type: Input
  }], callEnded: [{
    type: Output
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CallComponent, { className: "CallComponent", filePath: "src/app/features/call/call.component.ts", lineNumber: 142 });
})();

// src/app/features/chat/chat.component.ts
var _c02 = ["msgsEl"];
var _c12 = ["anchor"];
var _c22 = ["inputEl"];
var _c3 = () => [1, 2, 3, 4];
var _forTrack0 = ($index, $item) => $item._id;
var _forTrack1 = ($index, $item) => $item.l;
function ChatComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "app-call", 33);
    \u0275\u0275listener("callEnded", function ChatComponent_Conditional_1_Template_app_call_callEnded_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onCallEnded());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("call", ctx_r1.activeCall());
  }
}
function ChatComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275listener("click", function ChatComponent_Conditional_2_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.answerIncoming());
    });
    \u0275\u0275elementStart(1, "div", 35);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 36)(4, "div", 37);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 38);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "button", 39);
    \u0275\u0275listener("click", function ChatComponent_Conditional_2_Template_button_click_8_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.declineIncoming());
    });
    \u0275\u0275text(9, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 40);
    \u0275\u0275listener("click", function ChatComponent_Conditional_2_Template_button_click_10_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      $event.stopPropagation();
      return \u0275\u0275resetView(ctx_r1.answerIncoming());
    });
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.incomingCall().targetColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.incomingCall().targetInitials);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.incomingCall().targetName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("", ctx_r1.incomingCall().type === "video" ? "\u{1F4F9}" : "\u{1F4DE}", " Incoming ", ctx_r1.incomingCall().type, " call");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.incomingCall().type === "video" ? "\u{1F4F9}" : "\u{1F4DE}");
  }
}
function ChatComponent_Conditional_29_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 47);
    \u0275\u0275element(1, "div", 51);
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_29_For_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 52);
    \u0275\u0275listener("click", function ChatComponent_Conditional_29_For_14_Template_div_click_0_listener() {
      const u_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.startChat(u_r6._id));
    });
    \u0275\u0275elementStart(1, "div", 53);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "div", 54);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 55);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const u_r6 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.chatSvc.avatarColor(u_r6.name));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.chatSvc.initials(u_r6.name));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(u_r6.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(u_r6.email);
  }
}
function ChatComponent_Conditional_29_Conditional_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275text(1, "No users found");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_29_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 50);
    \u0275\u0275text(1, "Search to start a new conversation");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 27)(1, "div", 41)(2, "button", 42);
    \u0275\u0275listener("click", function ChatComponent_Conditional_29_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.showSearch.set(false);
      ctx_r1.peopleQ = "";
      return \u0275\u0275resetView(ctx_r1.people.set([]));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 12);
    \u0275\u0275element(4, "polyline", 43);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "New Chat");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 44);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(8, "svg", 45);
    \u0275\u0275element(9, "circle", 24)(10, "line", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(11, "input", 46);
    \u0275\u0275twoWayListener("ngModelChange", function ChatComponent_Conditional_29_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.peopleQ, $event) || (ctx_r1.peopleQ = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function ChatComponent_Conditional_29_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.findPeople($event));
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(12, ChatComponent_Conditional_29_Conditional_12_Template, 2, 0, "div", 47);
    \u0275\u0275repeaterCreate(13, ChatComponent_Conditional_29_For_14_Template, 8, 5, "div", 48, _forTrack0);
    \u0275\u0275conditionalCreate(15, ChatComponent_Conditional_29_Conditional_15_Template, 2, 0, "div", 49);
    \u0275\u0275conditionalCreate(16, ChatComponent_Conditional_29_Conditional_16_Template, 2, 0, "div", 50);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(11);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.peopleQ);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.searching() ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.people());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.searching() && ctx_r1.peopleQ && !ctx_r1.people().length ? 15 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.peopleQ ? 16 : -1);
  }
}
function ChatComponent_Conditional_31_For_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 56);
    \u0275\u0275element(1, "div", 57);
    \u0275\u0275elementStart(2, "div", 58);
    \u0275\u0275element(3, "div", 59)(4, "div", 60);
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, ChatComponent_Conditional_31_For_1_Template, 5, 0, "div", 56, \u0275\u0275repeaterTrackByIdentity);
  }
  if (rf & 2) {
    \u0275\u0275repeater(\u0275\u0275pureFunction0(0, _c3));
  }
}
function ChatComponent_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 61);
    \u0275\u0275text(2, "\u{1F4AC}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "No conversations");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "button", 62);
    \u0275\u0275listener("click", function ChatComponent_Conditional_32_Template_button_click_5_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showSearch.set(true));
    });
    \u0275\u0275text(6, "Start chatting");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_For_34_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "em", 72);
    \u0275\u0275text(1, "typing...");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_For_34_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275text(0);
  }
  if (rf & 2) {
    const c_r9 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275textInterpolate(ctx_r1.preview(c_r9));
  }
}
function ChatComponent_For_34_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 73);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r9 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r9.unreadCount > 99 ? "99+" : c_r9.unreadCount);
  }
}
function ChatComponent_For_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 63);
    \u0275\u0275listener("click", function ChatComponent_For_34_Template_div_click_0_listener() {
      const c_r9 = \u0275\u0275restoreView(_r8).$implicit;
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.pickChat(c_r9));
    });
    \u0275\u0275elementStart(1, "div", 64);
    \u0275\u0275text(2);
    \u0275\u0275element(3, "span", 65);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 66)(5, "div", 67)(6, "span", 68);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 69);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 70)(11, "span", 71);
    \u0275\u0275conditionalCreate(12, ChatComponent_For_34_Conditional_12_Template, 2, 0, "em", 72)(13, ChatComponent_For_34_Conditional_13_Template, 1, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(14, ChatComponent_For_34_Conditional_14_Template, 2, 1, "span", 73);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    let tmp_10_0;
    const c_r9 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("act", ((tmp_10_0 = ctx_r1.activeChat()) == null ? null : tmp_10_0._id) === c_r9._id);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.chatSvc.avatarColor(ctx_r1.chatSvc.getChatName(c_r9, ctx_r1.myId())));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.chatSvc.initials(ctx_r1.chatSvc.getChatName(c_r9, ctx_r1.myId())), " ");
    \u0275\u0275advance();
    \u0275\u0275classProp("on", ctx_r1.isOnline(c_r9));
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.chatSvc.getChatName(c_r9, ctx_r1.myId()));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.fmtTime(c_r9.lastMessage == null ? null : c_r9.lastMessage.createdAt));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("unread", c_r9.unreadCount > 0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.typingIn(c_r9._id) ? 12 : 13);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(c_r9.unreadCount > 0 ? 14 : -1);
  }
}
function ChatComponent_Conditional_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 32)(1, "div", 74);
    \u0275\u0275element(2, "div", 75)(3, "div", 76);
    \u0275\u0275elementStart(4, "div", 77);
    \u0275\u0275text(5, "S");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "h2");
    \u0275\u0275text(7, "Saylo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p");
    \u0275\u0275text(9, "Send messages, make calls");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 62);
    \u0275\u0275listener("click", function ChatComponent_Conditional_36_Template_button_click_10_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showSearch.set(true));
    });
    \u0275\u0275text(11, "New Conversation");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_37_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 42);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Conditional_1_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r12);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.chatSvc.activeChat.set(null));
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 104);
    \u0275\u0275element(2, "polyline", 43);
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_37_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 105);
    \u0275\u0275element(1, "span")(2, "span")(3, "span");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, "\xA0");
    \u0275\u0275elementStart(5, "em", 106);
    \u0275\u0275text(6, "typing...");
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_37_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 107);
    \u0275\u0275text(1);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("on", ctx_r1.isOnline(ctx_r1.activeChat()));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.isOnline(ctx_r1.activeChat()) ? "Online" : "Offline");
  }
}
function ChatComponent_Conditional_37_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 92);
    \u0275\u0275element(1, "div", 51);
    \u0275\u0275elementEnd();
  }
}
function ChatComponent_Conditional_37_For_22_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 113);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r13 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("background", ctx_r1.chatSvc.avatarColor(m_r13.sender.name));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.chatSvc.initials(m_r13.sender.name));
  }
}
function ChatComponent_Conditional_37_For_22_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 114);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const m_r13 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("read", ctx_r1.isRead(m_r13));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.isRead(m_r13) ? "\u2713\u2713" : "\u2713");
  }
}
function ChatComponent_Conditional_37_For_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94);
    \u0275\u0275conditionalCreate(1, ChatComponent_Conditional_37_For_22_Conditional_1_Template, 2, 3, "div", 108);
    \u0275\u0275elementStart(2, "div", 109)(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 110)(6, "span", 111);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(8, ChatComponent_Conditional_37_For_22_Conditional_8_Template, 2, 3, "span", 112);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const m_r13 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("out", ctx_r1.isOut(m_r13));
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.isOut(m_r13) ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("out", ctx_r1.isOut(m_r13))("inc", !ctx_r1.isOut(m_r13));
    \u0275\u0275advance();
    \u0275\u0275classProp("del", m_r13.isDeleted);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(m_r13.isDeleted ? "\u{1F6AB} This message was deleted" : m_r13.content);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.fmtMsgTime(m_r13.createdAt));
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isOut(m_r13) ? 8 : -1);
  }
}
function ChatComponent_Conditional_37_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 94)(1, "div", 115);
    \u0275\u0275element(2, "span")(3, "span")(4, "span");
    \u0275\u0275elementEnd()();
  }
}
function ChatComponent_Conditional_37_Conditional_26_Conditional_3_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 123);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Conditional_26_Conditional_3_For_2_Template_button_click_0_listener() {
      const c_r16 = \u0275\u0275restoreView(_r15).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(4);
      return \u0275\u0275resetView(ctx_r1.setCat(c_r16));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const c_r16 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(4);
    \u0275\u0275classProp("act", ctx_r1.activeCat() === c_r16.l);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(c_r16.i);
  }
}
function ChatComponent_Conditional_37_Conditional_26_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 119);
    \u0275\u0275repeaterCreate(1, ChatComponent_Conditional_37_Conditional_26_Conditional_3_For_2_Template, 2, 3, "button", 122, _forTrack1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.CATS);
  }
}
function ChatComponent_Conditional_37_Conditional_26_For_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 124);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Conditional_26_For_6_Template_button_click_0_listener() {
      const e_r18 = \u0275\u0275restoreView(_r17).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r1.insertEmoji(e_r18));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const e_r18 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(e_r18);
  }
}
function ChatComponent_Conditional_37_Conditional_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 116);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Conditional_26_Template_div_click_0_listener($event) {
      \u0275\u0275restoreView(_r14);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(1, "div", 117)(2, "input", 118);
    \u0275\u0275twoWayListener("ngModelChange", function ChatComponent_Conditional_37_Conditional_26_Template_input_ngModelChange_2_listener($event) {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r1.emojiQ, $event) || (ctx_r1.emojiQ = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function ChatComponent_Conditional_37_Conditional_26_Template_input_ngModelChange_2_listener() {
      \u0275\u0275restoreView(_r14);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.filterEmoji());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(3, ChatComponent_Conditional_37_Conditional_26_Conditional_3_Template, 3, 0, "div", 119);
    \u0275\u0275elementStart(4, "div", 120);
    \u0275\u0275repeaterCreate(5, ChatComponent_Conditional_37_Conditional_26_For_6_Template, 2, 1, "button", 121, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.emojiQ);
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1.emojiQ ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(ctx_r1.emojiList());
  }
}
function ChatComponent_Conditional_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 78);
    \u0275\u0275conditionalCreate(1, ChatComponent_Conditional_37_Conditional_1_Template, 3, 0, "button", 79);
    \u0275\u0275elementStart(2, "div", 80);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 81)(5, "div", 82);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 83);
    \u0275\u0275conditionalCreate(8, ChatComponent_Conditional_37_Conditional_8_Template, 7, 0)(9, ChatComponent_Conditional_37_Conditional_9_Template, 2, 3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "div", 84)(11, "button", 85);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.audioCall());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(12, "svg", 86);
    \u0275\u0275element(13, "path", 87);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(14, "button", 88);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Template_button_click_14_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.videoCall());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(15, "svg", 86);
    \u0275\u0275element(16, "polygon", 89)(17, "rect", 90);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(18, "div", 91, 0);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Template_div_click_18_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.showEmoji.set(false));
    });
    \u0275\u0275conditionalCreate(20, ChatComponent_Conditional_37_Conditional_20_Template, 2, 0, "div", 92);
    \u0275\u0275repeaterCreate(21, ChatComponent_Conditional_37_For_22_Template, 9, 12, "div", 93, _forTrack0);
    \u0275\u0275conditionalCreate(23, ChatComponent_Conditional_37_Conditional_23_Template, 5, 0, "div", 94);
    \u0275\u0275element(24, "div", null, 1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(26, ChatComponent_Conditional_37_Conditional_26_Template, 7, 2, "div", 95);
    \u0275\u0275elementStart(27, "div", 96)(28, "button", 97);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Template_button_click_28_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleEmoji($event));
    });
    \u0275\u0275text(29, "\u{1F60A}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 98)(31, "input", 99, 2);
    \u0275\u0275twoWayListener("ngModelChange", function ChatComponent_Conditional_37_Template_input_ngModelChange_31_listener($event) {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r1.txt, $event) || (ctx_r1.txt = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275listener("ngModelChange", function ChatComponent_Conditional_37_Template_input_ngModelChange_31_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onType());
    })("keydown.enter", function ChatComponent_Conditional_37_Template_input_keydown_enter_31_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.send());
    })("focus", function ChatComponent_Conditional_37_Template_input_focus_31_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.focused.set(true));
    })("blur", function ChatComponent_Conditional_37_Template_input_blur_31_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      ctx_r1.focused.set(false);
      return \u0275\u0275resetView(ctx_r1.stopTyping());
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "button", 100);
    \u0275\u0275listener("click", function ChatComponent_Conditional_37_Template_button_click_33_listener() {
      \u0275\u0275restoreView(_r11);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.send());
    });
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(34, "svg", 101);
    \u0275\u0275element(35, "line", 102)(36, "polygon", 103);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isMobile() ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx_r1.chatSvc.avatarColor(ctx_r1.chatSvc.getChatName(ctx_r1.activeChat(), ctx_r1.myId())));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.chatSvc.initials(ctx_r1.chatSvc.getChatName(ctx_r1.activeChat(), ctx_r1.myId())));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.chatSvc.getChatName(ctx_r1.activeChat(), ctx_r1.myId()));
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.typingIn(ctx_r1.activeChat()._id) ? 8 : 9);
    \u0275\u0275advance(12);
    \u0275\u0275conditional(ctx_r1.loadingMsgs() ? 20 : -1);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r1.messages());
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r1.typingIn(ctx_r1.activeChat()._id) ? 23 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r1.showEmoji() ? 26 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("act", ctx_r1.showEmoji());
    \u0275\u0275advance(2);
    \u0275\u0275classProp("focus", ctx_r1.focused());
    \u0275\u0275advance();
    \u0275\u0275twoWayProperty("ngModel", ctx_r1.txt);
    \u0275\u0275property("placeholder", "Message");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("ready", ctx_r1.txt.trim());
  }
}
var EMOJIS = [
  "\u{1F600}",
  "\u{1F603}",
  "\u{1F604}",
  "\u{1F601}",
  "\u{1F606}",
  "\u{1F605}",
  "\u{1F602}",
  "\u{1F923}",
  "\u{1F60A}",
  "\u{1F607}",
  "\u{1F642}",
  "\u{1F643}",
  "\u{1F609}",
  "\u{1F60C}",
  "\u{1F60D}",
  "\u{1F970}",
  "\u{1F618}",
  "\u{1F617}",
  "\u{1F619}",
  "\u{1F61A}",
  "\u{1F60B}",
  "\u{1F61B}",
  "\u{1F61D}",
  "\u{1F61C}",
  "\u{1F92A}",
  "\u{1F928}",
  "\u{1F9D0}",
  "\u{1F913}",
  "\u{1F60E}",
  "\u{1F978}",
  "\u{1F929}",
  "\u{1F973}",
  "\u{1F60F}",
  "\u{1F612}",
  "\u{1F61E}",
  "\u{1F614}",
  "\u{1F61F}",
  "\u{1F615}",
  "\u{1F641}",
  "\u2639\uFE0F",
  "\u{1F623}",
  "\u{1F616}",
  "\u{1F62B}",
  "\u{1F629}",
  "\u{1F97A}",
  "\u{1F622}",
  "\u{1F62D}",
  "\u{1F624}",
  "\u{1F620}",
  "\u{1F621}",
  "\u{1F92C}",
  "\u{1F92F}",
  "\u{1F633}",
  "\u{1F975}",
  "\u{1F976}",
  "\u{1F631}",
  "\u{1F628}",
  "\u{1F630}",
  "\u{1F625}",
  "\u{1F613}",
  "\u{1F917}",
  "\u{1F914}",
  "\u{1F92D}",
  "\u{1F92B}",
  "\u{1F925}",
  "\u{1F636}",
  "\u{1F610}",
  "\u{1F611}",
  "\u{1F62C}",
  "\u{1F644}",
  "\u{1F62F}",
  "\u{1F626}",
  "\u{1F627}",
  "\u{1F62E}",
  "\u{1F632}",
  "\u{1F971}",
  "\u{1F634}",
  "\u{1F924}",
  "\u{1F62A}",
  "\u{1F635}",
  "\u{1F44D}",
  "\u{1F44E}",
  "\u{1F44F}",
  "\u{1F64C}",
  "\u{1F91D}",
  "\u{1F44A}",
  "\u270A",
  "\u{1F91B}",
  "\u{1F91C}",
  "\u{1F91E}",
  "\u270C\uFE0F",
  "\u{1F91F}",
  "\u{1F918}",
  "\u{1F44C}",
  "\u{1F90C}",
  "\u{1F90F}",
  "\u{1F448}",
  "\u{1F449}",
  "\u{1F446}",
  "\u{1F447}",
  "\u2764\uFE0F",
  "\u{1F9E1}",
  "\u{1F49B}",
  "\u{1F49A}",
  "\u{1F499}",
  "\u{1F49C}",
  "\u{1F5A4}",
  "\u{1F90D}",
  "\u{1F90E}",
  "\u{1F494}",
  "\u2763\uFE0F",
  "\u{1F495}",
  "\u{1F49E}",
  "\u{1F493}",
  "\u{1F497}",
  "\u{1F496}",
  "\u{1F498}",
  "\u{1F49D}",
  "\u{1F49F}",
  "\u262E\uFE0F",
  "\u{1F389}",
  "\u{1F38A}",
  "\u{1F388}",
  "\u{1F381}",
  "\u{1F382}",
  "\u{1F355}",
  "\u{1F354}",
  "\u{1F35F}",
  "\u{1F32E}",
  "\u{1F32F}",
  "\u{1F35C}",
  "\u{1F35D}",
  "\u{1F35B}",
  "\u{1F363}",
  "\u{1F371}",
  "\u{1F369}",
  "\u{1F36A}",
  "\u{1F36B}",
  "\u{1F36C}",
  "\u{1F36D}",
  "\u{1F30D}",
  "\u{1F30E}",
  "\u{1F30F}",
  "\u{1F319}",
  "\u2B50",
  "\u{1F31F}",
  "\u{1F4AB}",
  "\u2728",
  "\u{1F308}",
  "\u26C5",
  "\u{1F324}\uFE0F",
  "\u{1F525}",
  "\u{1F4A7}",
  "\u{1F30A}",
  "\u{1F338}",
  "\u{1F33A}",
  "\u{1F33B}",
  "\u{1F339}",
  "\u{1F340}",
  "\u{1F33F}",
  "\u{1F436}",
  "\u{1F431}",
  "\u{1F42D}",
  "\u{1F439}",
  "\u{1F430}",
  "\u{1F98A}",
  "\u{1F43B}",
  "\u{1F43C}",
  "\u{1F428}",
  "\u{1F42F}",
  "\u{1F981}",
  "\u{1F42E}",
  "\u{1F437}",
  "\u{1F438}",
  "\u{1F435}",
  "\u{1F648}",
  "\u{1F649}",
  "\u{1F64A}",
  "\u{1F414}",
  "\u{1F427}",
  "\u{1F680}",
  "\u2708\uFE0F",
  "\u{1F697}",
  "\u{1F695}",
  "\u{1F699}",
  "\u{1F3CE}\uFE0F",
  "\u{1F693}",
  "\u{1F691}",
  "\u{1F692}",
  "\u{1F6FB}",
  "\u{1F69A}",
  "\u{1F3CD}\uFE0F",
  "\u{1F6F5}",
  "\u{1F6B2}",
  "\u26BD",
  "\u{1F3C0}",
  "\u{1F3AE}",
  "\u{1F3B5}",
  "\u{1F3B8}",
  "\u{1F3AF}"
];
var CATS = [
  { i: "\u{1F600}", l: "Smileys", s: 0, e: 40 },
  { i: "\u{1F44D}", l: "Gestures", s: 40, e: 60 },
  { i: "\u2764\uFE0F", l: "Hearts", s: 60, e: 80 },
  { i: "\u{1F389}", l: "Objects", s: 80, e: 100 },
  { i: "\u{1F30D}", l: "Nature", s: 100, e: 120 },
  { i: "\u{1F436}", l: "Animals", s: 120, e: 140 },
  { i: "\u{1F680}", l: "More", s: 140, e: 160 }
];
var ChatComponent = class _ChatComponent {
  msgsEl;
  anchor;
  inputEl;
  auth = inject(AuthService);
  chatSvc = inject(ChatService);
  socket = inject(SocketService);
  zone = inject(NgZone);
  cdr = inject(ChangeDetectorRef);
  me = this.auth.currentUser;
  activeChat = this.chatSvc.activeChat;
  messages = this.chatSvc.messages;
  typing = this.chatSvc.typingUsers;
  loading = signal(false, ...ngDevMode ? [{ debugName: "loading" }] : []);
  loadingMsgs = signal(false, ...ngDevMode ? [{ debugName: "loadingMsgs" }] : []);
  showSearch = signal(false, ...ngDevMode ? [{ debugName: "showSearch" }] : []);
  focused = signal(false, ...ngDevMode ? [{ debugName: "focused" }] : []);
  searching = signal(false, ...ngDevMode ? [{ debugName: "searching" }] : []);
  showEmoji = signal(false, ...ngDevMode ? [{ debugName: "showEmoji" }] : []);
  people = signal([], ...ngDevMode ? [{ debugName: "people" }] : []);
  activeCall = signal(null, ...ngDevMode ? [{ debugName: "activeCall" }] : []);
  incomingCall = signal(null, ...ngDevMode ? [{ debugName: "incomingCall" }] : []);
  activeCat = signal("Smileys", ...ngDevMode ? [{ debugName: "activeCat" }] : []);
  emojiList = signal(EMOJIS.slice(0, 40), ...ngDevMode ? [{ debugName: "emojiList" }] : []);
  CATS = CATS;
  txt = "";
  filterQ = "";
  peopleQ = "";
  emojiQ = "";
  destroy$ = new Subject();
  typingTimer;
  receivedIds = /* @__PURE__ */ new Set();
  shouldScroll = true;
  myId = computed(() => this.me()?._id || "", ...ngDevMode ? [{ debugName: "myId" }] : []);
  filtered = computed(() => {
    const q = this.filterQ.toLowerCase();
    return this.chatSvc.chats().filter((c) => !q || this.chatSvc.getChatName(c, this.myId()).toLowerCase().includes(q));
  }, ...ngDevMode ? [{ debugName: "filtered" }] : []);
  ngOnInit() {
    const uid = this.me()?._id;
    if (!uid)
      return;
    this.socket.connect(uid);
    this.loading.set(true);
    this.chatSvc.getChats().pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loading.set(false);
        setTimeout(() => this.socket.syncChats(), 500);
      },
      error: () => this.loading.set(false)
    });
    this.listenSocket();
  }
  ngAfterViewChecked() {
    if (this.shouldScroll)
      this.scrollBottom();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.socket.disconnect();
  }
  onEsc() {
    this.showEmoji.set(false);
  }
  isMobile() {
    return window.innerWidth <= 768;
  }
  pickChat(c) {
    if (this.activeChat()?._id === c._id)
      return;
    if (this.activeChat())
      this.socket.leaveChat(this.activeChat()._id);
    this.chatSvc.activeChat.set(c);
    this.chatSvc.messages.set([]);
    this.shouldScroll = true;
    this.loadingMsgs.set(true);
    this.chatSvc.getMessages(c._id).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.loadingMsgs.set(false);
        this.socket.joinChat(c._id);
        const msgs = this.chatSvc.messages();
        msgs.filter((m) => !this.isOut(m)).forEach((m) => {
          this.socket.markRead(c._id, m._id);
        });
        this.chatSvc.chats.update((list) => list.map((ch) => ch._id === c._id ? __spreadProps(__spreadValues({}, ch), { unreadCount: 0 }) : ch));
      },
      error: () => this.loadingMsgs.set(false)
    });
  }
  listenSocket() {
    this.socket.on("message:new").pipe(takeUntil(this.destroy$)).subscribe(({ message }) => {
      this.zone.run(() => {
        if (this.receivedIds.has(message._id))
          return;
        this.receivedIds.add(message._id);
        if (this.receivedIds.size > 300) {
          const first = this.receivedIds.values().next().value;
          this.receivedIds.delete(first);
        }
        if (message.chat === this.activeChat()?._id) {
          this.shouldScroll = true;
          this.chatSvc.addMessage(message);
          this.chatSvc.chats.update((list) => list.map((c) => c._id === message.chat ? __spreadProps(__spreadValues({}, c), { lastMessage: message, unreadCount: 0 }) : c));
          if (!this.isOut(message)) {
            this.socket.markRead(message.chat, message._id);
          }
        } else {
          this.chatSvc.chats.update((list) => list.map((c) => c._id === message.chat ? __spreadProps(__spreadValues({}, c), { lastMessage: message, unreadCount: (c.unreadCount || 0) + 1 }) : c));
        }
      });
    });
    this.socket.on("typing:start").pipe(takeUntil(this.destroy$)).subscribe(({ chatId, userId }) => {
      if (userId !== this.myId())
        this.chatSvc.setTyping(chatId, userId, true);
    });
    this.socket.on("typing:stop").pipe(takeUntil(this.destroy$)).subscribe(({ chatId, userId }) => {
      this.chatSvc.setTyping(chatId, userId, false);
    });
    this.socket.on("message:read").pipe(takeUntil(this.destroy$)).subscribe(({ chatId, messageId, readBy }) => {
      this.zone.run(() => {
        if (readBy !== this.myId()) {
          this.chatSvc.messages.update((ms) => ms.map((m) => m._id === messageId ? __spreadProps(__spreadValues({}, m), { readBy: [...m.readBy, { user: readBy }] }) : m));
        }
      });
    });
    this.socket.on("user:online").pipe(takeUntil(this.destroy$)).subscribe(({ userId }) => {
      this.zone.run(() => this.updateStatus(userId, "online"));
    });
    this.socket.on("user:offline").pipe(takeUntil(this.destroy$)).subscribe(({ userId }) => {
      this.zone.run(() => this.updateStatus(userId, "offline"));
    });
    this.socket.on("users:online").pipe(takeUntil(this.destroy$)).subscribe(({ userIds }) => {
      this.zone.run(() => {
        this.chatSvc.chats.update((list) => list.map((c) => __spreadProps(__spreadValues({}, c), {
          members: c.members.map((m) => __spreadProps(__spreadValues({}, m), {
            user: __spreadProps(__spreadValues({}, m.user), { status: userIds.includes(m.user._id) ? "online" : "offline" })
          }))
        })));
      });
    });
    this.socket.on("chats:synced").pipe(takeUntil(this.destroy$)).subscribe(({ chats }) => {
      this.zone.run(() => {
        if (chats && chats.length > 0) {
          this.chatSvc.chats.update((existing) => {
            const merged = [...existing];
            chats.forEach((c) => {
              if (!merged.find((e) => e._id === c._id))
                merged.push(c);
            });
            return merged.sort((a, b) => new Date(b.lastActivity || 0).getTime() - new Date(a.lastActivity || 0).getTime());
          });
        }
      });
    });
    this.socket.on("call:incoming").pipe(takeUntil(this.destroy$)).subscribe(({ callId, caller, type }) => {
      this.zone.run(() => {
        const u = this.findUser(caller.userId);
        this.incomingCall.set({
          callId,
          type,
          direction: "incoming",
          status: "ringing",
          targetUserId: caller.userId,
          targetName: u?.name || "Unknown",
          targetColor: this.chatSvc.avatarColor(u?.name || "U"),
          targetInitials: this.chatSvc.initials(u?.name || "U")
        });
      });
    });
  }
  findUser(uid) {
    for (const c of this.chatSvc.chats()) {
      const m = c.members.find((m2) => m2.user._id === uid);
      if (m)
        return m.user;
    }
    return null;
  }
  updateStatus(uid, status) {
    this.chatSvc.chats.update((list) => list.map((c) => __spreadProps(__spreadValues({}, c), {
      members: c.members.map((m) => m.user._id === uid ? __spreadProps(__spreadValues({}, m), { user: __spreadProps(__spreadValues({}, m.user), { status }) }) : m)
    })));
  }
  answerIncoming() {
    const call = this.incomingCall();
    if (!call)
      return;
    this.activeCall.set(__spreadProps(__spreadValues({}, call), { status: "connected" }));
    this.incomingCall.set(null);
  }
  declineIncoming() {
    const call = this.incomingCall();
    if (call)
      this.socket.emit("call:decline", { callId: call.callId, targetUserId: call.targetUserId });
    this.incomingCall.set(null);
  }
  onCallEnded() {
    this.activeCall.set(null);
    this.cdr.detectChanges();
  }
  audioCall() {
    const other = this.chatSvc.getOtherUser(this.activeChat(), this.myId());
    if (!other)
      return;
    this.socket.initiateCall(this.activeChat()._id, other._id, "audio");
    this.activeCall.set({ callId: "call_" + Date.now(), type: "audio", direction: "outgoing", status: "ringing", targetUserId: other._id, targetName: other.name, targetColor: this.chatSvc.avatarColor(other.name), targetInitials: this.chatSvc.initials(other.name) });
  }
  videoCall() {
    const other = this.chatSvc.getOtherUser(this.activeChat(), this.myId());
    if (!other)
      return;
    this.socket.initiateCall(this.activeChat()._id, other._id, "video");
    this.activeCall.set({ callId: "call_" + Date.now(), type: "video", direction: "outgoing", status: "ringing", targetUserId: other._id, targetName: other.name, targetColor: this.chatSvc.avatarColor(other.name), targetInitials: this.chatSvc.initials(other.name) });
  }
  send() {
    const text = this.txt.trim();
    if (!text || !this.activeChat())
      return;
    this.socket.sendMessage(this.activeChat()._id, text);
    this.txt = "";
    this.shouldScroll = true;
    this.stopTyping();
  }
  onType() {
    if (!this.activeChat())
      return;
    this.socket.sendTypingStart(this.activeChat()._id);
    clearTimeout(this.typingTimer);
    this.typingTimer = setTimeout(() => this.stopTyping(), 2e3);
  }
  stopTyping() {
    clearTimeout(this.typingTimer);
    if (this.activeChat())
      this.socket.sendTypingStop(this.activeChat()._id);
  }
  toggleEmoji(e) {
    e.stopPropagation();
    this.showEmoji.update((v) => !v);
    if (this.showEmoji())
      this.filterEmoji();
  }
  insertEmoji(emoji) {
    this.txt += emoji;
    this.inputEl?.nativeElement?.focus();
  }
  setCat(c) {
    this.activeCat.set(c.l);
    this.filterEmoji();
  }
  filterEmoji() {
    if (this.emojiQ) {
      this.emojiList.set(EMOJIS.filter((e) => e.includes(this.emojiQ)).slice(0, 64));
      return;
    }
    const cat = CATS.find((c) => c.l === this.activeCat());
    this.emojiList.set(cat ? EMOJIS.slice(cat.s, cat.e) : EMOJIS.slice(0, 40));
  }
  findPeople(q) {
    if (!q.trim()) {
      this.people.set([]);
      return;
    }
    this.searching.set(true);
    this.chatSvc.searchUsers(q).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.people.set(r.data?.users || []);
        this.searching.set(false);
      },
      error: () => this.searching.set(false)
    });
  }
  startChat(uid) {
    this.chatSvc.createDirectChat(uid).pipe(takeUntil(this.destroy$)).subscribe({
      next: (r) => {
        this.showSearch.set(false);
        this.people.set([]);
        this.peopleQ = "";
        const chat = r.data?.chat;
        if (chat) {
          const found = this.chatSvc.chats().find((c) => c._id === chat._id);
          this.pickChat(found || chat);
        }
      }
    });
  }
  logout() {
    this.auth.logout();
  }
  scrollBottom() {
    try {
      this.anchor?.nativeElement?.scrollIntoView({ behavior: "auto" });
    } catch {
    }
  }
  isOut(m) {
    return m.sender._id === this.myId();
  }
  isRead(m) {
    if (!m.readBy || m.readBy.length === 0)
      return false;
    return m.readBy.some((r) => {
      const uid = r.user?._id || r.user || r;
      return uid && uid.toString() !== this.myId();
    });
  }
  typingIn(chatId) {
    return (this.typing()[chatId] || []).length > 0;
  }
  isOnline(c) {
    return this.chatSvc.getOtherUser(c, this.myId())?.status === "online";
  }
  preview(c) {
    if (!c.lastMessage)
      return "No messages yet";
    if (c.lastMessage.isDeleted)
      return "This message was deleted";
    const mine = c.lastMessage.sender._id === this.myId();
    return (mine ? "You: " : "") + (c.lastMessage.content?.slice(0, 45) || "");
  }
  fmtTime(d) {
    if (!d)
      return "";
    const dt = new Date(d), now = /* @__PURE__ */ new Date();
    if (dt.toDateString() === now.toDateString())
      return dt.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
    const diff = Math.floor((now.getTime() - dt.getTime()) / 864e5);
    if (diff === 1)
      return "Yesterday";
    if (diff < 7)
      return dt.toLocaleDateString("en-IN", { weekday: "short" });
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  }
  fmtMsgTime(d) {
    return new Date(d).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
  }
  static \u0275fac = function ChatComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ChatComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ChatComponent, selectors: [["app-chat"]], viewQuery: function ChatComponent_Query(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275viewQuery(_c02, 5)(_c12, 5)(_c22, 5);
    }
    if (rf & 2) {
      let _t;
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.msgsEl = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.anchor = _t.first);
      \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.inputEl = _t.first);
    }
  }, hostBindings: function ChatComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275listener("keydown.escape", function ChatComponent_keydown_escape_HostBindingHandler() {
        return ctx.onEsc();
      }, \u0275\u0275resolveDocument);
    }
  }, decls: 38, vars: 17, consts: [["msgsEl", ""], ["anchor", ""], ["inputEl", ""], [1, "app"], [3, "call"], [1, "ring-toast"], [1, "sb"], [1, "sb-hdr"], [1, "logo"], [1, "logo-dot"], [1, "sb-hdr-acts"], [1, "hbtn", 3, "click"], ["width", "20", "height", "20", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round"], ["x1", "12", "y1", "5", "x2", "12", "y2", "19"], ["x1", "5", "y1", "12", "x2", "19", "y2", "12"], [1, "my-av", 3, "click"], [1, "sb-me"], [1, "me-av"], [1, "me-info"], [1, "me-name"], [1, "me-st"], [1, "online-dot"], [1, "sb-search"], ["width", "15", "height", "15", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round"], ["cx", "11", "cy", "11", "r", "8"], ["x1", "21", "y1", "21", "x2", "16.65", "y2", "16.65"], ["placeholder", "Search conversations", 3, "ngModelChange", "ngModel"], [1, "new-chat-panel"], [1, "chat-list"], [1, "no-chats"], [1, "ci", 3, "act"], [1, "main"], [1, "welcome"], [3, "callEnded", "call"], [1, "ring-toast", 3, "click"], [1, "rt-av"], [1, "rt-info"], [1, "rt-name"], [1, "rt-sub"], [1, "rt-dec", 3, "click"], [1, "rt-ans", 3, "click"], [1, "ncp-hdr"], [1, "back-btn", 3, "click"], ["points", "15 18 9 12 15 6"], [1, "ncp-search"], ["width", "15", "height", "15", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], ["placeholder", "Search by name or email...", "autofocus", "", 3, "ngModelChange", "ngModel"], [1, "ncp-load"], [1, "ncp-user"], [1, "ncp-empty"], [1, "ncp-hint"], [1, "spin"], [1, "ncp-user", 3, "click"], [1, "u-av"], [1, "u-name"], [1, "u-email"], [1, "ske"], [1, "ske-av"], [1, "ske-body"], [1, "ske-l"], [1, "ske-s"], [1, "nc-ico"], [1, "start-btn", 3, "click"], [1, "ci", 3, "click"], [1, "ci-av"], [1, "ci-dot"], [1, "ci-body"], [1, "ci-top"], [1, "ci-name"], [1, "ci-time"], [1, "ci-bot"], [1, "ci-prev"], [1, "typing-txt"], [1, "unread-badge"], [1, "wl"], [1, "wl-ring"], [1, "wl-ring", "r2"], [1, "wl-core"], [1, "chat-hdr"], [1, "back-btn"], [1, "hdr-av"], [1, "hdr-info"], [1, "hdr-name"], [1, "hdr-sub"], [1, "hdr-acts"], ["title", "Voice call", 1, "hact", "audio", 3, "click"], ["width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round"], ["d", "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"], ["title", "Video call", 1, "hact", "video", 3, "click"], ["points", "23 7 16 12 23 17 23 7"], ["x", "1", "y", "5", "width", "15", "height", "14", "rx", "2"], [1, "msgs", 3, "click"], [1, "msgs-spin"], [1, "mr", 3, "out"], [1, "mr"], [1, "ep"], [1, "inp-row"], [1, "emoji-tog", 3, "click"], [1, "inp-box"], [1, "inp", 3, "ngModelChange", "keydown.enter", "focus", "blur", "ngModel", "placeholder"], [1, "send-btn", 3, "click"], ["width", "18", "height", "18", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round"], ["x1", "22", "y1", "2", "x2", "11", "y2", "13"], ["points", "22 2 15 22 11 13 2 9 22 2"], ["width", "22", "height", "22", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2.5", "stroke-linecap", "round"], [1, "typing-ind"], [2, "color", "#008069", "font-style", "normal", "font-size", "12px"], [1, "st-dot"], [1, "m-av", 3, "background"], [1, "bub"], [1, "bub-ft"], [1, "bub-t"], [1, "ticks", 3, "read"], [1, "m-av"], [1, "ticks"], [1, "typing-bub"], [1, "ep", 3, "click"], [1, "ep-top"], ["placeholder", "\u{1F50D} Search emoji", 1, "ep-q", 3, "ngModelChange", "ngModel"], [1, "ep-cats"], [1, "ep-grid"], [1, "ep-e"], [1, "ep-cat", 3, "act"], [1, "ep-cat", 3, "click"], [1, "ep-e", 3, "click"]], template: function ChatComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 3);
      \u0275\u0275conditionalCreate(1, ChatComponent_Conditional_1_Template, 1, 1, "app-call", 4);
      \u0275\u0275conditionalCreate(2, ChatComponent_Conditional_2_Template, 12, 7, "div", 5);
      \u0275\u0275elementStart(3, "aside", 6)(4, "div", 7)(5, "div", 8);
      \u0275\u0275element(6, "div", 9);
      \u0275\u0275text(7, "Saylo");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(8, "div", 10)(9, "button", 11);
      \u0275\u0275listener("click", function ChatComponent_Template_button_click_9_listener() {
        return ctx.showSearch.set(true);
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(10, "svg", 12);
      \u0275\u0275element(11, "line", 13)(12, "line", 14);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(13, "div", 15);
      \u0275\u0275listener("click", function ChatComponent_Template_div_click_13_listener() {
        return ctx.logout();
      });
      \u0275\u0275text(14);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(15, "div", 16)(16, "div", 17);
      \u0275\u0275text(17);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 18)(19, "div", 19);
      \u0275\u0275text(20);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(21, "div", 20);
      \u0275\u0275element(22, "span", 21);
      \u0275\u0275text(23, "Online");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(24, "div", 22);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(25, "svg", 23);
      \u0275\u0275element(26, "circle", 24)(27, "line", 25);
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(28, "input", 26);
      \u0275\u0275twoWayListener("ngModelChange", function ChatComponent_Template_input_ngModelChange_28_listener($event) {
        \u0275\u0275twoWayBindingSet(ctx.filterQ, $event) || (ctx.filterQ = $event);
        return $event;
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275conditionalCreate(29, ChatComponent_Conditional_29_Template, 17, 4, "div", 27);
      \u0275\u0275elementStart(30, "div", 28);
      \u0275\u0275conditionalCreate(31, ChatComponent_Conditional_31_Template, 2, 1)(32, ChatComponent_Conditional_32_Template, 7, 0, "div", 29);
      \u0275\u0275repeaterCreate(33, ChatComponent_For_34_Template, 15, 13, "div", 30, _forTrack0);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(35, "main", 31);
      \u0275\u0275conditionalCreate(36, ChatComponent_Conditional_36_Template, 12, 0, "div", 32)(37, ChatComponent_Conditional_37_Template, 37, 17);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      let tmp_3_0;
      let tmp_4_0;
      let tmp_5_0;
      let tmp_6_0;
      let tmp_7_0;
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.activeCall() ? 1 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.incomingCall() && !ctx.activeCall() ? 2 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("open", !ctx.activeChat() || !ctx.isMobile());
      \u0275\u0275advance(10);
      \u0275\u0275styleProp("background", ctx.chatSvc.avatarColor(((tmp_3_0 = ctx.me()) == null ? null : tmp_3_0.name) || "U"));
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.chatSvc.initials(((tmp_4_0 = ctx.me()) == null ? null : tmp_4_0.name) || "U"));
      \u0275\u0275advance(2);
      \u0275\u0275styleProp("background", ctx.chatSvc.avatarColor(((tmp_5_0 = ctx.me()) == null ? null : tmp_5_0.name) || "U"));
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.chatSvc.initials(((tmp_6_0 = ctx.me()) == null ? null : tmp_6_0.name) || "U"));
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate((tmp_7_0 = ctx.me()) == null ? null : tmp_7_0.name);
      \u0275\u0275advance(8);
      \u0275\u0275twoWayProperty("ngModel", ctx.filterQ);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showSearch() ? 29 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.loading() ? 31 : !ctx.filtered().length ? 32 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.filtered());
      \u0275\u0275advance(2);
      \u0275\u0275classProp("open", ctx.activeChat() || !ctx.isMobile());
      \u0275\u0275advance();
      \u0275\u0275conditional(!ctx.activeChat() ? 36 : 37);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NgControlStatus, NgModel, CallComponent], styles: [`

[_nghost-%COMP%] {
  display: block;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  font-family: "Plus Jakarta Sans", sans-serif;
}
*[_ngcontent-%COMP%] {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.app[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: 340px 1fr;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: #f0f2f5;
  overflow: hidden;
  position: fixed;
  inset: 0;
}
.sb[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e9edef;
  overflow: hidden;
  height: 100%;
  position: relative;
}
.sb-hdr[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f2f5;
  flex-shrink: 0;
}
.logo[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 900;
  color: #111b21;
  letter-spacing: -1px;
}
.logo-dot[_ngcontent-%COMP%] {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #25D366,
      #128C7E);
  box-shadow: 0 0 8px rgba(37, 211, 102, 0.5);
}
.sb-hdr-acts[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hbtn[_ngcontent-%COMP%] {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
}
.hbtn[_ngcontent-%COMP%]:hover {
  background: #f0f2f5;
}
.my-av[_ngcontent-%COMP%] {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
}
.sb-me[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
}
.me-av[_ngcontent-%COMP%] {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.me-info[_ngcontent-%COMP%] {
  flex: 1;
}
.me-name[_ngcontent-%COMP%] {
  font-size: 13.5px;
  font-weight: 700;
  color: #111b21;
}
.me-st[_ngcontent-%COMP%] {
  font-size: 11px;
  color: #667781;
  display: flex;
  align-items: center;
  gap: 4px;
}
.online-dot[_ngcontent-%COMP%] {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25D366;
  display: inline-block;
}
.sb-search[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f2f5;
  margin: 8px 12px;
  border-radius: 10px;
  flex-shrink: 0;
}
.sb-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111b21;
  font-family: inherit;
}
.sb-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]::placeholder {
  color: #8696a0;
}
.sb-search[_ngcontent-%COMP%]   svg[_ngcontent-%COMP%] {
  color: #8696a0;
  flex-shrink: 0;
}
.new-chat-panel[_ngcontent-%COMP%] {
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 50;
  display: flex;
  flex-direction: column;
}
.ncp-hdr[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #008069;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}
.back-btn[_ngcontent-%COMP%] {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
}
.back-btn[_ngcontent-%COMP%]:hover {
  background: rgba(255, 255, 255, 0.15);
}
.ncp-search[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f2f5;
  margin: 8px 12px;
  border-radius: 10px;
  flex-shrink: 0;
}
.ncp-search[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111b21;
  font-family: inherit;
}
.ncp-load[_ngcontent-%COMP%] {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.ncp-user[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.1s;
}
.ncp-user[_ngcontent-%COMP%]:hover, 
.ncp-user[_ngcontent-%COMP%]:active {
  background: #f5f6f6;
}
.u-av[_ngcontent-%COMP%] {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.u-name[_ngcontent-%COMP%] {
  font-size: 15px;
  font-weight: 600;
  color: #111b21;
}
.u-email[_ngcontent-%COMP%] {
  font-size: 12px;
  color: #667781;
  margin-top: 2px;
}
.ncp-empty[_ngcontent-%COMP%], 
.ncp-hint[_ngcontent-%COMP%] {
  padding: 24px 16px;
  text-align: center;
  color: #8696a0;
  font-size: 13.5px;
}
.chat-list[_ngcontent-%COMP%] {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.chat-list[_ngcontent-%COMP%]::-webkit-scrollbar {
  width: 4px;
}
.chat-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  background: #d1d7db;
  border-radius: 2px;
}
.ske[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}
.ske-av[_ngcontent-%COMP%] {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f2f5;
  flex-shrink: 0;
  animation: _ngcontent-%COMP%_sk 1.4s ease infinite;
}
.ske-body[_ngcontent-%COMP%] {
  flex: 1;
}
.ske-l[_ngcontent-%COMP%] {
  height: 12px;
  background: #f0f2f5;
  border-radius: 6px;
  width: 60%;
  margin-bottom: 6px;
  animation: _ngcontent-%COMP%_sk 1.4s ease infinite;
}
.ske-s[_ngcontent-%COMP%] {
  height: 11px;
  background: #f0f2f5;
  border-radius: 6px;
  width: 80%;
  animation: _ngcontent-%COMP%_sk 1.4s ease infinite;
}
@keyframes _ngcontent-%COMP%_sk {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
.no-chats[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 10px;
  color: #8696a0;
  text-align: center;
}
.nc-ico[_ngcontent-%COMP%] {
  font-size: 40px;
}
.no-chats[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  margin: 0;
  font-size: 14px;
}
.start-btn[_ngcontent-%COMP%] {
  padding: 10px 24px;
  background: #008069;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  min-height: unset;
}
.start-btn[_ngcontent-%COMP%]:hover {
  background: #006b57;
}
.ci[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.1s;
  position: relative;
}
.ci[_ngcontent-%COMP%]:hover, 
.ci[_ngcontent-%COMP%]:active {
  background: #f5f6f6;
}
.ci.act[_ngcontent-%COMP%] {
  background: #f0f2f5;
}
.ci-av[_ngcontent-%COMP%] {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  position: relative;
}
.ci-dot[_ngcontent-%COMP%] {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d7db;
  border: 2px solid #fff;
}
.ci-dot.on[_ngcontent-%COMP%] {
  background: #25D366;
}
.ci-body[_ngcontent-%COMP%] {
  flex: 1;
  min-width: 0;
}
.ci-top[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}
.ci-name[_ngcontent-%COMP%] {
  font-size: 15px;
  font-weight: 600;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ci-time[_ngcontent-%COMP%] {
  font-size: 11.5px;
  color: #667781;
  flex-shrink: 0;
  margin-left: 6px;
}
.ci-bot[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}
.ci-prev[_ngcontent-%COMP%] {
  font-size: 13px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.ci-prev.unread[_ngcontent-%COMP%] {
  color: #111b21;
  font-weight: 500;
}
.typing-txt[_ngcontent-%COMP%] {
  color: #008069;
  font-style: normal;
}
.unread-badge[_ngcontent-%COMP%] {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: #25D366;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.main[_ngcontent-%COMP%] {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #efeae2;
  position: relative;
}
.main[_ngcontent-%COMP%]::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9b8' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  z-index: 0;
  pointer-events: none;
}
.welcome[_ngcontent-%COMP%] {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 20px;
}
.wl[_ngcontent-%COMP%] {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.wl-ring[_ngcontent-%COMP%] {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 128, 105, 0.2);
  animation: _ngcontent-%COMP%_wring 3s ease-in-out infinite;
}
.wl-ring.r2[_ngcontent-%COMP%] {
  inset: -12px;
  animation-delay: 0.5s;
  border-color: rgba(0, 128, 105, 0.1);
}
.wl-core[_ngcontent-%COMP%] {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #008069,
      #25D366);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 128, 105, 0.3);
}
@keyframes _ngcontent-%COMP%_wring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}
.welcome[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {
  font-size: 24px;
  font-weight: 800;
  color: #111b21;
  margin: 0;
}
.welcome[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {
  color: #667781;
  font-size: 14px;
  margin: 0;
}
.chat-hdr[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
  z-index: 2;
  position: relative;
  min-height: 60px;
}
.hdr-av[_ngcontent-%COMP%] {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.hdr-info[_ngcontent-%COMP%] {
  flex: 1;
  min-width: 0;
}
.hdr-name[_ngcontent-%COMP%] {
  font-size: 15.5px;
  font-weight: 700;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hdr-sub[_ngcontent-%COMP%] {
  font-size: 12px;
  color: #667781;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 1px;
}
.st-dot[_ngcontent-%COMP%] {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d1d7db;
  flex-shrink: 0;
}
.st-dot.on[_ngcontent-%COMP%] {
  background: #25D366;
}
.typing-ind[_ngcontent-%COMP%] {
  display: flex;
  gap: 2px;
  align-items: center;
}
.typing-ind[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #008069;
  animation: _ngcontent-%COMP%_ti 1.2s ease infinite;
}
.typing-ind[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-ind[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes _ngcontent-%COMP%_ti {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
.hdr-acts[_ngcontent-%COMP%] {
  display: flex;
  gap: 4px;
}
.hact[_ngcontent-%COMP%] {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  min-height: unset;
  min-width: unset;
  color: #54656f;
  background: none;
}
.hact[_ngcontent-%COMP%]:hover {
  background: #f0f2f5;
  color: #111b21;
}
.hact.audio[_ngcontent-%COMP%]:hover {
  color: #25D366;
}
.hact.video[_ngcontent-%COMP%]:hover {
  color: #0080ff;
}
.msgs[_ngcontent-%COMP%] {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overscroll-behavior: contain;
  position: relative;
  z-index: 1;
}
.msgs[_ngcontent-%COMP%]::-webkit-scrollbar {
  width: 4px;
}
.msgs[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.msgs-spin[_ngcontent-%COMP%] {
  display: flex;
  justify-content: center;
  padding: 30px;
  position: relative;
  z-index: 1;
}
.mr[_ngcontent-%COMP%] {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  animation: _ngcontent-%COMP%_mfade 0.18s ease forwards;
}
.mr.out[_ngcontent-%COMP%] {
  flex-direction: row-reverse;
}
@keyframes _ngcontent-%COMP%_mfade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.m-av[_ngcontent-%COMP%] {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  margin-bottom: 2px;
}
.bub[_ngcontent-%COMP%] {
  max-width: 70%;
  padding: 8px 12px 6px;
  border-radius: 10px;
  word-break: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.bub.inc[_ngcontent-%COMP%] {
  background: #fff;
  border-top-left-radius: 2px;
  color: #111b21;
}
.bub.out[_ngcontent-%COMP%] {
  background: #d9fdd3;
  border-top-right-radius: 2px;
  color: #111b21;
}
.bub[_ngcontent-%COMP%]   .del[_ngcontent-%COMP%] {
  color: #8696a0;
  font-style: italic;
  font-size: 13px;
}
.bub-ft[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  margin-top: 2px;
}
.bub-t[_ngcontent-%COMP%] {
  font-size: 11px;
  color: #8696a0;
}
.ticks[_ngcontent-%COMP%] {
  font-size: 12px;
  color: #8696a0;
  font-weight: 600;
}
.ticks.read[_ngcontent-%COMP%] {
  color: #53bdeb;
}
.typing-bub[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: #fff;
  border-radius: 10px;
  border-top-left-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.typing-bub[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #8696a0;
  animation: _ngcontent-%COMP%_tb 1.2s ease infinite;
}
.typing-bub[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-bub[_ngcontent-%COMP%]   span[_ngcontent-%COMP%]:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes _ngcontent-%COMP%_tb {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
.ep[_ngcontent-%COMP%] {
  position: absolute;
  bottom: 68px;
  left: 8px;
  width: min(320px, 100vw - 16px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 100;
  border: 1px solid #e9edef;
}
.ep-top[_ngcontent-%COMP%] {
  padding: 8px 10px;
}
.ep-q[_ngcontent-%COMP%] {
  width: 100%;
  padding: 8px 12px;
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  color: #111b21;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}
.ep-cats[_ngcontent-%COMP%] {
  display: flex;
  gap: 2px;
  padding: 4px 8px;
  border-bottom: 1px solid #f0f2f5;
  overflow-x: auto;
}
.ep-cats[_ngcontent-%COMP%]::-webkit-scrollbar {
  display: none;
}
.ep-cat[_ngcontent-%COMP%] {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 7px;
  border-radius: 8px;
  font-size: 18px;
  min-height: unset;
  min-width: unset;
  transition: background 0.1s;
}
.ep-cat.act[_ngcontent-%COMP%], 
.ep-cat[_ngcontent-%COMP%]:hover {
  background: #f0f2f5;
}
.ep-grid[_ngcontent-%COMP%] {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1px;
  padding: 6px;
  max-height: 180px;
  overflow-y: auto;
}
.ep-e[_ngcontent-%COMP%] {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  min-height: unset;
  min-width: unset;
  transition: background 0.1s;
}
.ep-e[_ngcontent-%COMP%]:hover, 
.ep-e[_ngcontent-%COMP%]:active {
  background: #f0f2f5;
}
.inp-row[_ngcontent-%COMP%] {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #f0f2f5;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}
.emoji-tog[_ngcontent-%COMP%] {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
  flex-shrink: 0;
  filter: grayscale(0.3);
}
.emoji-tog[_ngcontent-%COMP%]:hover, 
.emoji-tog.act[_ngcontent-%COMP%] {
  background: #d1d7db;
  filter: none;
}
.inp-box[_ngcontent-%COMP%] {
  flex: 1;
  background: #fff;
  border-radius: 22px;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.15s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.inp-box.focus[_ngcontent-%COMP%] {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.inp[_ngcontent-%COMP%] {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111b21;
  font-family: inherit;
  line-height: 1.4;
}
.inp[_ngcontent-%COMP%]::placeholder {
  color: #8696a0;
}
.send-btn[_ngcontent-%COMP%] {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #d1d7db;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  transition: all 0.2s;
  flex-shrink: 0;
  min-height: unset;
  min-width: unset;
}
.send-btn.ready[_ngcontent-%COMP%] {
  background: #008069;
  color: #fff;
  box-shadow: 0 3px 12px rgba(0, 128, 105, 0.35);
}
.send-btn[_ngcontent-%COMP%]:active {
  transform: scale(0.93);
}
.ring-toast[_ngcontent-%COMP%] {
  position: fixed;
  top: env(safe-area-inset-top, 0);
  top: max(env(safe-area-inset-top, 0px), 12px);
  right: 12px;
  z-index: 9998;
  background: #fff;
  border-radius: 18px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06);
  animation: _ngcontent-%COMP%_toast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 260px;
  max-width: 320px;
  cursor: pointer;
}
@keyframes _ngcontent-%COMP%_toast {
  from {
    transform: translateX(110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.rt-av[_ngcontent-%COMP%] {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.rt-info[_ngcontent-%COMP%] {
  flex: 1;
  min-width: 0;
}
.rt-name[_ngcontent-%COMP%] {
  font-size: 14.5px;
  font-weight: 700;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rt-sub[_ngcontent-%COMP%] {
  font-size: 12px;
  color: #667781;
  margin-top: 2px;
}
.rt-dec[_ngcontent-%COMP%] {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FF3B30;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
  flex-shrink: 0;
}
.rt-ans[_ngcontent-%COMP%] {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #25D366;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
  flex-shrink: 0;
}
.spin[_ngcontent-%COMP%] {
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #008069;
  border-radius: 50%;
  animation: _ngcontent-%COMP%_sp 0.7s linear infinite;
}
@keyframes _ngcontent-%COMP%_sp {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 768px) {
  .app[_ngcontent-%COMP%] {
    grid-template-columns: 1fr;
    position: fixed;
    inset: 0;
  }
  .sb[_ngcontent-%COMP%] {
    position: absolute;
    inset: 0;
    z-index: 5;
  }
  .sb[_ngcontent-%COMP%]:not(.open) {
    display: none;
  }
  .main[_ngcontent-%COMP%] {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  .main[_ngcontent-%COMP%]:not(.open) {
    display: none;
  }
  .bub[_ngcontent-%COMP%] {
    max-width: 80%;
  }
  .msgs[_ngcontent-%COMP%] {
    padding: 8px 10px;
  }
  .inp-row[_ngcontent-%COMP%] {
    padding: 6px 8px;
    padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
  }
  .ep[_ngcontent-%COMP%] {
    left: 0;
    right: 0;
    width: 100%;
    bottom: 62px;
    border-radius: 16px 16px 0 0;
  }
  .lv[_ngcontent-%COMP%] {
    width: 80px;
    height: 110px;
  }
}
/*# sourceMappingURL=chat.component.css.map */`] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ChatComponent, [{
    type: Component,
    args: [{ selector: "app-chat", standalone: true, imports: [CommonModule, FormsModule, CallComponent], template: `
<div class="app">

  @if(activeCall()){ <app-call [call]="activeCall()!" (callEnded)="onCallEnded()"/> }

  @if(incomingCall() && !activeCall()){
    <div class="ring-toast" (click)="answerIncoming()">
      <div class="rt-av" [style.background]="incomingCall()!.targetColor">{{incomingCall()!.targetInitials}}</div>
      <div class="rt-info">
        <div class="rt-name">{{incomingCall()!.targetName}}</div>
        <div class="rt-sub">{{incomingCall()!.type==='video'?'\u{1F4F9}':'\u{1F4DE}'}} Incoming {{incomingCall()!.type}} call</div>
      </div>
      <button class="rt-dec" (click)="$event.stopPropagation();declineIncoming()">\u2715</button>
      <button class="rt-ans" (click)="$event.stopPropagation();answerIncoming()">{{incomingCall()!.type==='video'?'\u{1F4F9}':'\u{1F4DE}'}}</button>
    </div>
  }

  <!-- SIDEBAR -->
  <aside class="sb" [class.open]="!activeChat() || !isMobile()">
    <div class="sb-hdr">
      <div class="logo"><div class="logo-dot"></div>Saylo</div>
      <div class="sb-hdr-acts">
        <button class="hbtn" (click)="showSearch.set(true)">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <div class="my-av" [style.background]="chatSvc.avatarColor(me()?.name||'U')" (click)="logout()">{{chatSvc.initials(me()?.name||'U')}}</div>
      </div>
    </div>

    <div class="sb-me">
      <div class="me-av" [style.background]="chatSvc.avatarColor(me()?.name||'U')">{{chatSvc.initials(me()?.name||'U')}}</div>
      <div class="me-info"><div class="me-name">{{me()?.name}}</div><div class="me-st"><span class="online-dot"></span>Online</div></div>
    </div>

    <div class="sb-search">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
      <input placeholder="Search conversations" [(ngModel)]="filterQ">
    </div>

    @if(showSearch()){
      <div class="new-chat-panel">
        <div class="ncp-hdr">
          <button class="back-btn" (click)="showSearch.set(false);peopleQ='';people.set([])">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span>New Chat</span>
        </div>
        <div class="ncp-search">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Search by name or email..." [(ngModel)]="peopleQ" (ngModelChange)="findPeople($event)" autofocus>
        </div>
        @if(searching()){ <div class="ncp-load"><div class="spin"></div></div> }
        @for(u of people(); track u._id){
          <div class="ncp-user" (click)="startChat(u._id)">
            <div class="u-av" [style.background]="chatSvc.avatarColor(u.name)">{{chatSvc.initials(u.name)}}</div>
            <div><div class="u-name">{{u.name}}</div><div class="u-email">{{u.email}}</div></div>
          </div>
        }
        @if(!searching() && peopleQ && !people().length){ <div class="ncp-empty">No users found</div> }
        @if(!peopleQ){ <div class="ncp-hint">Search to start a new conversation</div> }
      </div>
    }

    <div class="chat-list">
      @if(loading()){
        @for(i of [1,2,3,4]; track i){
          <div class="ske"><div class="ske-av"></div><div class="ske-body"><div class="ske-l"></div><div class="ske-s"></div></div></div>
        }
      }
      @else if(!filtered().length){
        <div class="no-chats"><div class="nc-ico">\u{1F4AC}</div><p>No conversations</p><button class="start-btn" (click)="showSearch.set(true)">Start chatting</button></div>
      }
      @for(c of filtered(); track c._id){
        <div class="ci" [class.act]="activeChat()?._id===c._id" (click)="pickChat(c)">
          <div class="ci-av" [style.background]="chatSvc.avatarColor(chatSvc.getChatName(c,myId()))">
            {{chatSvc.initials(chatSvc.getChatName(c,myId()))}}
            <span class="ci-dot" [class.on]="isOnline(c)"></span>
          </div>
          <div class="ci-body">
            <div class="ci-top">
              <span class="ci-name">{{chatSvc.getChatName(c,myId())}}</span>
              <span class="ci-time">{{fmtTime(c.lastMessage?.createdAt)}}</span>
            </div>
            <div class="ci-bot">
              <span class="ci-prev" [class.unread]="c.unreadCount>0">
                @if(typingIn(c._id)){<em class="typing-txt">typing...</em>}
                @else{{{preview(c)}}}
              </span>
              @if(c.unreadCount>0){ <span class="unread-badge">{{c.unreadCount>99?'99+':c.unreadCount}}</span> }
            </div>
          </div>
        </div>
      }
    </div>
  </aside>

  <!-- MAIN -->
  <main class="main" [class.open]="activeChat() || !isMobile()">
    @if(!activeChat()){
      <div class="welcome">
        <div class="wl"><div class="wl-ring"></div><div class="wl-ring r2"></div><div class="wl-core">S</div></div>
        <h2>Saylo</h2>
        <p>Send messages, make calls</p>
        <button class="start-btn" (click)="showSearch.set(true)">New Conversation</button>
      </div>
    } @else {

      <!-- HEADER -->
      <div class="chat-hdr">
        @if(isMobile()){
          <button class="back-btn" (click)="chatSvc.activeChat.set(null)">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
        }
        <div class="hdr-av" [style.background]="chatSvc.avatarColor(chatSvc.getChatName(activeChat()!,myId()))">{{chatSvc.initials(chatSvc.getChatName(activeChat()!,myId()))}}</div>
        <div class="hdr-info">
          <div class="hdr-name">{{chatSvc.getChatName(activeChat()!,myId())}}</div>
          <div class="hdr-sub">
            @if(typingIn(activeChat()!._id)){<span class="typing-ind"><span></span><span></span><span></span></span>&nbsp;<em style="color:#008069;font-style:normal;font-size:12px;">typing...</em>}
            @else{<span class="st-dot" [class.on]="isOnline(activeChat()!)"></span>{{isOnline(activeChat()!) ? 'Online' : 'Offline'}}}
          </div>
        </div>
        <div class="hdr-acts">
          <button class="hact audio" (click)="audioCall()" title="Voice call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.22 1.18 2 2 0 012.22 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          </button>
          <button class="hact video" (click)="videoCall()" title="Video call">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
          </button>
        </div>
      </div>

      <!-- MESSAGES -->
      <div class="msgs" #msgsEl (click)="showEmoji.set(false)">
        @if(loadingMsgs()){ <div class="msgs-spin"><div class="spin"></div></div> }
        @for(m of messages(); track m._id){
          <div class="mr" [class.out]="isOut(m)">
            @if(!isOut(m)){
              <div class="m-av" [style.background]="chatSvc.avatarColor(m.sender.name)">{{chatSvc.initials(m.sender.name)}}</div>
            }
            <div class="bub" [class.out]="isOut(m)" [class.inc]="!isOut(m)">
              <span [class.del]="m.isDeleted">{{m.isDeleted ? '\u{1F6AB} This message was deleted' : m.content}}</span>
              <div class="bub-ft">
                <span class="bub-t">{{fmtMsgTime(m.createdAt)}}</span>
                @if(isOut(m)){<span class="ticks" [class.read]="isRead(m)">{{isRead(m)?"\u2713\u2713":"\u2713"}}</span>}
              </div>
            </div>
          </div>
        }
        @if(typingIn(activeChat()!._id)){
          <div class="mr"><div class="typing-bub"><span></span><span></span><span></span></div></div>
        }
        <div #anchor></div>
      </div>

      <!-- EMOJI PICKER -->
      @if(showEmoji()){
        <div class="ep" (click)="$event.stopPropagation()">
          <div class="ep-top">
            <input class="ep-q" placeholder="\u{1F50D} Search emoji" [(ngModel)]="emojiQ" (ngModelChange)="filterEmoji()">
          </div>
          @if(!emojiQ){
            <div class="ep-cats">
              @for(c of CATS; track c.l){
                <button class="ep-cat" [class.act]="activeCat()===c.l" (click)="setCat(c)">{{c.i}}</button>
              }
            </div>
          }
          <div class="ep-grid">
            @for(e of emojiList(); track e){
              <button class="ep-e" (click)="insertEmoji(e)">{{e}}</button>
            }
          </div>
        </div>
      }

      <!-- INPUT -->
      <div class="inp-row">
        <button class="emoji-tog" [class.act]="showEmoji()" (click)="toggleEmoji($event)">\u{1F60A}</button>
        <div class="inp-box" [class.focus]="focused()">
          <input #inputEl class="inp" [(ngModel)]="txt" [placeholder]="'Message'" (ngModelChange)="onType()" (keydown.enter)="send()" (focus)="focused.set(true)" (blur)="focused.set(false);stopTyping()">
        </div>
        <button class="send-btn" [class.ready]="txt.trim()" (click)="send()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    }
  </main>
</div>
  `, styles: [`/* angular:styles/component:scss;ad38c35139ef149ddcd66adffee9ae38559d39a789d9196e5d7a2069f0b5a00b;C:/js_projects/saylo-v2/frontend/src/app/features/chat/chat.component.ts */
:host {
  display: block;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  font-family: "Plus Jakarta Sans", sans-serif;
}
* {
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
}
.app {
  display: grid;
  grid-template-columns: 340px 1fr;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  background: #f0f2f5;
  overflow: hidden;
  position: fixed;
  inset: 0;
}
.sb {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-right: 1px solid #e9edef;
  overflow: hidden;
  height: 100%;
  position: relative;
}
.sb-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f2f5;
  flex-shrink: 0;
}
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 900;
  color: #111b21;
  letter-spacing: -1px;
}
.logo-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #25D366,
      #128C7E);
  box-shadow: 0 0 8px rgba(37, 211, 102, 0.5);
}
.sb-hdr-acts {
  display: flex;
  align-items: center;
  gap: 10px;
}
.hbtn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
}
.hbtn:hover {
  background: #f0f2f5;
}
.my-av {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  cursor: pointer;
  flex-shrink: 0;
}
.sb-me {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
}
.me-av {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.me-info {
  flex: 1;
}
.me-name {
  font-size: 13.5px;
  font-weight: 700;
  color: #111b21;
}
.me-st {
  font-size: 11px;
  color: #667781;
  display: flex;
  align-items: center;
  gap: 4px;
}
.online-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #25D366;
  display: inline-block;
}
.sb-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f2f5;
  margin: 8px 12px;
  border-radius: 10px;
  flex-shrink: 0;
}
.sb-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111b21;
  font-family: inherit;
}
.sb-search input::placeholder {
  color: #8696a0;
}
.sb-search svg {
  color: #8696a0;
  flex-shrink: 0;
}
.new-chat-panel {
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 50;
  display: flex;
  flex-direction: column;
}
.ncp-hdr {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: #008069;
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
}
.back-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
}
.back-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}
.ncp-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f0f2f5;
  margin: 8px 12px;
  border-radius: 10px;
  flex-shrink: 0;
}
.ncp-search input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 14px;
  color: #111b21;
  font-family: inherit;
}
.ncp-load {
  display: flex;
  justify-content: center;
  padding: 20px;
}
.ncp-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.1s;
}
.ncp-user:hover,
.ncp-user:active {
  background: #f5f6f6;
}
.u-av {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.u-name {
  font-size: 15px;
  font-weight: 600;
  color: #111b21;
}
.u-email {
  font-size: 12px;
  color: #667781;
  margin-top: 2px;
}
.ncp-empty,
.ncp-hint {
  padding: 24px 16px;
  text-align: center;
  color: #8696a0;
  font-size: 13.5px;
}
.chat-list {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.chat-list::-webkit-scrollbar {
  width: 4px;
}
.chat-list::-webkit-scrollbar-thumb {
  background: #d1d7db;
  border-radius: 2px;
}
.ske {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
}
.ske-av {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #f0f2f5;
  flex-shrink: 0;
  animation: sk 1.4s ease infinite;
}
.ske-body {
  flex: 1;
}
.ske-l {
  height: 12px;
  background: #f0f2f5;
  border-radius: 6px;
  width: 60%;
  margin-bottom: 6px;
  animation: sk 1.4s ease infinite;
}
.ske-s {
  height: 11px;
  background: #f0f2f5;
  border-radius: 6px;
  width: 80%;
  animation: sk 1.4s ease infinite;
}
@keyframes sk {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}
.no-chats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  gap: 10px;
  color: #8696a0;
  text-align: center;
}
.nc-ico {
  font-size: 40px;
}
.no-chats p {
  margin: 0;
  font-size: 14px;
}
.start-btn {
  padding: 10px 24px;
  background: #008069;
  color: #fff;
  border: none;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s;
  min-height: unset;
}
.start-btn:hover {
  background: #006b57;
}
.ci {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background 0.1s;
  position: relative;
}
.ci:hover,
.ci:active {
  background: #f5f6f6;
}
.ci.act {
  background: #f0f2f5;
}
.ci-av {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  position: relative;
}
.ci-dot {
  position: absolute;
  bottom: 1px;
  right: 1px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #d1d7db;
  border: 2px solid #fff;
}
.ci-dot.on {
  background: #25D366;
}
.ci-body {
  flex: 1;
  min-width: 0;
}
.ci-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3px;
}
.ci-name {
  font-size: 15px;
  font-weight: 600;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ci-time {
  font-size: 11.5px;
  color: #667781;
  flex-shrink: 0;
  margin-left: 6px;
}
.ci-bot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
}
.ci-prev {
  font-size: 13px;
  color: #667781;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}
.ci-prev.unread {
  color: #111b21;
  font-weight: 500;
}
.typing-txt {
  color: #008069;
  font-style: normal;
}
.unread-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  background: #25D366;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.main {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  background: #efeae2;
  position: relative;
}
.main::before {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4c9b8' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  z-index: 0;
  pointer-events: none;
}
.welcome {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  text-align: center;
  padding: 20px;
}
.wl {
  position: relative;
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}
.wl-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(0, 128, 105, 0.2);
  animation: wring 3s ease-in-out infinite;
}
.wl-ring.r2 {
  inset: -12px;
  animation-delay: 0.5s;
  border-color: rgba(0, 128, 105, 0.1);
}
.wl-core {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background:
    linear-gradient(
      135deg,
      #008069,
      #25D366);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 900;
  color: #fff;
  box-shadow: 0 8px 24px rgba(0, 128, 105, 0.3);
}
@keyframes wring {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}
.welcome h2 {
  font-size: 24px;
  font-weight: 800;
  color: #111b21;
  margin: 0;
}
.welcome p {
  color: #667781;
  font-size: 14px;
  margin: 0;
}
.chat-hdr {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: #fff;
  border-bottom: 1px solid #e9edef;
  flex-shrink: 0;
  z-index: 2;
  position: relative;
  min-height: 60px;
}
.hdr-av {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.hdr-info {
  flex: 1;
  min-width: 0;
}
.hdr-name {
  font-size: 15.5px;
  font-weight: 700;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.hdr-sub {
  font-size: 12px;
  color: #667781;
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 1px;
}
.st-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #d1d7db;
  flex-shrink: 0;
}
.st-dot.on {
  background: #25D366;
}
.typing-ind {
  display: flex;
  gap: 2px;
  align-items: center;
}
.typing-ind span {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #008069;
  animation: ti 1.2s ease infinite;
}
.typing-ind span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-ind span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes ti {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
.hdr-acts {
  display: flex;
  gap: 4px;
}
.hact {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  min-height: unset;
  min-width: unset;
  color: #54656f;
  background: none;
}
.hact:hover {
  background: #f0f2f5;
  color: #111b21;
}
.hact.audio:hover {
  color: #25D366;
}
.hact.video:hover {
  color: #0080ff;
}
.msgs {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  overscroll-behavior: contain;
  position: relative;
  z-index: 1;
}
.msgs::-webkit-scrollbar {
  width: 4px;
}
.msgs::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 2px;
}
.msgs-spin {
  display: flex;
  justify-content: center;
  padding: 30px;
  position: relative;
  z-index: 1;
}
.mr {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  animation: mfade 0.18s ease forwards;
}
.mr.out {
  flex-direction: row-reverse;
}
@keyframes mfade {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.m-av {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 9px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
  margin-bottom: 2px;
}
.bub {
  max-width: 70%;
  padding: 8px 12px 6px;
  border-radius: 10px;
  word-break: break-word;
  position: relative;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.bub.inc {
  background: #fff;
  border-top-left-radius: 2px;
  color: #111b21;
}
.bub.out {
  background: #d9fdd3;
  border-top-right-radius: 2px;
  color: #111b21;
}
.bub .del {
  color: #8696a0;
  font-style: italic;
  font-size: 13px;
}
.bub-ft {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 3px;
  margin-top: 2px;
}
.bub-t {
  font-size: 11px;
  color: #8696a0;
}
.ticks {
  font-size: 12px;
  color: #8696a0;
  font-weight: 600;
}
.ticks.read {
  color: #53bdeb;
}
.typing-bub {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  background: #fff;
  border-radius: 10px;
  border-top-left-radius: 2px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
.typing-bub span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #8696a0;
  animation: tb 1.2s ease infinite;
}
.typing-bub span:nth-child(2) {
  animation-delay: 0.2s;
}
.typing-bub span:nth-child(3) {
  animation-delay: 0.4s;
}
@keyframes tb {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
.ep {
  position: absolute;
  bottom: 68px;
  left: 8px;
  width: min(320px, 100vw - 16px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.18);
  overflow: hidden;
  z-index: 100;
  border: 1px solid #e9edef;
}
.ep-top {
  padding: 8px 10px;
}
.ep-q {
  width: 100%;
  padding: 8px 12px;
  background: #f0f2f5;
  border: none;
  border-radius: 8px;
  font-size: 13.5px;
  color: #111b21;
  outline: none;
  font-family: inherit;
  box-sizing: border-box;
}
.ep-cats {
  display: flex;
  gap: 2px;
  padding: 4px 8px;
  border-bottom: 1px solid #f0f2f5;
  overflow-x: auto;
}
.ep-cats::-webkit-scrollbar {
  display: none;
}
.ep-cat {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px 7px;
  border-radius: 8px;
  font-size: 18px;
  min-height: unset;
  min-width: unset;
  transition: background 0.1s;
}
.ep-cat.act,
.ep-cat:hover {
  background: #f0f2f5;
}
.ep-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 1px;
  padding: 6px;
  max-height: 180px;
  overflow-y: auto;
}
.ep-e {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 22px;
  padding: 4px;
  border-radius: 8px;
  line-height: 1;
  min-height: unset;
  min-width: unset;
  transition: background 0.1s;
}
.ep-e:hover,
.ep-e:active {
  background: #f0f2f5;
}
.inp-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  padding-bottom: calc(8px + env(safe-area-inset-bottom, 0px));
  background: #f0f2f5;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
}
.emoji-tog {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
  flex-shrink: 0;
  filter: grayscale(0.3);
}
.emoji-tog:hover,
.emoji-tog.act {
  background: #d1d7db;
  filter: none;
}
.inp-box {
  flex: 1;
  background: #fff;
  border-radius: 22px;
  padding: 9px 16px;
  display: flex;
  align-items: center;
  transition: box-shadow 0.15s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}
.inp-box.focus {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
}
.inp {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 15px;
  color: #111b21;
  font-family: inherit;
  line-height: 1.4;
}
.inp::placeholder {
  color: #8696a0;
}
.send-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #d1d7db;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #54656f;
  transition: all 0.2s;
  flex-shrink: 0;
  min-height: unset;
  min-width: unset;
}
.send-btn.ready {
  background: #008069;
  color: #fff;
  box-shadow: 0 3px 12px rgba(0, 128, 105, 0.35);
}
.send-btn:active {
  transform: scale(0.93);
}
.ring-toast {
  position: fixed;
  top: env(safe-area-inset-top, 0);
  top: max(env(safe-area-inset-top, 0px), 12px);
  right: 12px;
  z-index: 9998;
  background: #fff;
  border-radius: 18px;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.06);
  animation: toast 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 260px;
  max-width: 320px;
  cursor: pointer;
}
@keyframes toast {
  from {
    transform: translateX(110%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
.rt-av {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
}
.rt-info {
  flex: 1;
  min-width: 0;
}
.rt-name {
  font-size: 14.5px;
  font-weight: 700;
  color: #111b21;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.rt-sub {
  font-size: 12px;
  color: #667781;
  margin-top: 2px;
}
.rt-dec {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #FF3B30;
  border: none;
  cursor: pointer;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
  flex-shrink: 0;
}
.rt-ans {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #25D366;
  border: none;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  min-height: unset;
  min-width: unset;
  flex-shrink: 0;
}
.spin {
  width: 22px;
  height: 22px;
  border: 2.5px solid rgba(0, 0, 0, 0.1);
  border-top-color: #008069;
  border-radius: 50%;
  animation: sp 0.7s linear infinite;
}
@keyframes sp {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 768px) {
  .app {
    grid-template-columns: 1fr;
    position: fixed;
    inset: 0;
  }
  .sb {
    position: absolute;
    inset: 0;
    z-index: 5;
  }
  .sb:not(.open) {
    display: none;
  }
  .main {
    position: absolute;
    inset: 0;
    z-index: 4;
  }
  .main:not(.open) {
    display: none;
  }
  .bub {
    max-width: 80%;
  }
  .msgs {
    padding: 8px 10px;
  }
  .inp-row {
    padding: 6px 8px;
    padding-bottom: calc(6px + env(safe-area-inset-bottom, 0px));
  }
  .ep {
    left: 0;
    right: 0;
    width: 100%;
    bottom: 62px;
    border-radius: 16px 16px 0 0;
  }
  .lv {
    width: 80px;
    height: 110px;
  }
}
/*# sourceMappingURL=chat.component.css.map */
`] }]
  }], null, { msgsEl: [{
    type: ViewChild,
    args: ["msgsEl"]
  }], anchor: [{
    type: ViewChild,
    args: ["anchor"]
  }], inputEl: [{
    type: ViewChild,
    args: ["inputEl"]
  }], onEsc: [{
    type: HostListener,
    args: ["document:keydown.escape"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ChatComponent, { className: "ChatComponent", filePath: "src/app/features/chat/chat.component.ts", lineNumber: 403 });
})();
export {
  ChatComponent
};
//# sourceMappingURL=chunk-7ZRTBBNH.js.map
