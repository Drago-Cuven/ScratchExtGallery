// Name: Node Data
// ID: DragoNodeData
// Description: Access filesystem, environment, and system info via Node.js (unsandboxed)
// By Drago Cuven <https://github.com/Drago-Cuven>

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) throw new Error('This extension must be ran unsandboxed.');

  const { Cast, BlockType, ArgumentType, vm, translate } = Scratch;
  const runtime = vm.runtime;

  const ext = {
    id: 'DragoNodeData',
    name: translate('Node Data'),
    colors: ['#31c300ff', '#419c00ff', '#196000ff'],
    icon: '',
    hasArray: true,
    hasObject: true,
    hasVector: false
  };

  const engine = {
    name: 'Scratch',
    Array: { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false },
    Object: { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false }
  };

  const getType = (c, f) => (typeof c != 'undefined' && c != null ? c : f);

  engine.get = function() {
    if (Scratch.extensions.isPenguinMod) {
      engine.name = 'Penguinmod';
      engine.Array = {
        BT: BlockType.REPORTER, AT: 'Array', BS: 3, AS: 3,
        forceOutputType: 'Array', check: ['Array'],
        hasCast: !!Cast.toArray
      };
      engine.Object = {
        BT: BlockType.REPORTER, AT: 'Object', BS: 5, AS: 5,
        forceOutputType: 'Object', check: ['Object'],
        hasCast: !!Cast.toObject
      };

      if (ext.hasArray && !vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray');
      if (ext.hasObject) {
        if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray');
        if (!vm.dogeiscutObject) vm.extensionManager.loadExtensionURL('https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js');
      }
      return;
    }

    const platformName = vm.runtime?.platform?.name;

    if (platformName == "TurboWarp" || platformName == "Mistwarp") {
      engine.name = platformName == "TurboWarp" ? 'Turbowarp' : 'Mistwarp';
      engine.Array = { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false };
      engine.Object = { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false };
      return;
    }

    if (platformName == "Unsandboxed") {
      engine.name = 'Unsandboxed';
      engine.Array = { BT: getType(BlockType.ARRAY, 'ARRAY'), AT: getType(ArgumentType.ARRAY, 'ARRAY'), hasCast: !!Cast.toArray };
      engine.Object = { BT: getType(BlockType.OBJECT, 'OBJECT'), AT: getType(ArgumentType.OBJECT, 'OBJECT'), hasCast: !!Cast.toObject };
      return;
    }

    if (platformName == "NitroBolt") {
      engine.name = 'Nitrobolt';
      engine.Array = { BT: getType(BlockType.ARRAY, 'ARRAY'), AT: getType(ArgumentType.ARRAY, 'ARRAY'), hasCast: !!Cast.toArray };
      engine.Object = { BT: getType(BlockType.OBJECT, 'OBJECT'), AT: getType(ArgumentType.OBJECT, 'OBJECT'), hasCast: !!Cast.toObject };
      return;
    }

    engine.name = platformName || 'Scratch';
    engine.Array = { BT: getType(BlockType.ARRAY, BlockType.REPORTER), AT: getType(ArgumentType.ARRAY, ArgumentType.STRING), BS: 3, AS: 3, hasCast: !!Cast.toArray };
    engine.Object = { BT: getType(BlockType.OBJECT, BlockType.REPORTER), AT: getType(ArgumentType.OBJECT, ArgumentType.STRING), BS: 3, AS: 3, hasCast: !!Cast.toObject };
  };

  engine.get();

  engine.canHandleArray = () => engine.Array.hasCast || engine.Array.BT != BlockType.REPORTER || (engine.name == 'Penguinmod' && vm.jwArray);
  engine.canHandleObject = () => engine.Object.hasCast || engine.Object.BT != BlockType.REPORTER || (engine.name == 'Penguinmod' && vm.dogeiscutObject);

  engine.handleArray = (value, strict = true) => {
    if (value == null) {
      if (engine.Array.hasCast) return Cast.toArray([]);
      if (engine.name == 'Penguinmod' && vm.jwArray) return new vm.jwArray.Type([]);
      return engine.canHandleArray() ? [] : '[]';
    }
    if (!engine.canHandleArray()) {
      let parsed = typeof value == 'string' ? JSON.parse(value) : value;
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
      return '[]';
    }
    let parsed = typeof value == 'string' ? JSON.parse(value) : value;
    if (!Array.isArray(parsed)) parsed = strict ? [parsed] : parsed;
    if (engine.Array.hasCast) return Cast.toArray(parsed);
    if (engine.name == 'Penguinmod') return new vm.jwArray.Type(parsed);
    return parsed;
  };

  engine.handleObject = (value, strict = true) => {
    if (value == null) {
      if (engine.Object.hasCast) return Cast.toObject({});
      if (engine.name == 'Penguinmod' && vm.dogeiscutObject) return new vm.dogeiscutObject.Type({});
      return engine.canHandleObject() ? {} : '{}';
    }
    if (!engine.canHandleObject()) {
      let parsed = typeof value == 'string' ? JSON.parse(value) : value;
      if (parsed && typeof parsed == 'object' && !Array.isArray(parsed)) return JSON.stringify(parsed);
      return '{}';
    }
    let parsed = typeof value == 'string' ? JSON.parse(value) : value;
    if (!parsed || typeof parsed != 'object' || Array.isArray(parsed)) {
      parsed = strict ? { value: parsed } : parsed;
    }
    if (engine.Object.hasCast) return Cast.toObject(parsed);
    if (engine.name == 'Penguinmod') return new vm.dogeiscutObject.Type(parsed);
    return parsed;
  };

  engine.arrayBlock = (blockDef, extra = {}) => {
    const newBlock = { ...blockDef };
    if (ext.hasArray) {
      newBlock.blockType = engine.Array.BT;
      if (engine.Array.BS != undefined) newBlock.blockShape = engine.Array.BS;
      else delete newBlock.blockShape;
      if (engine.name == 'Penguinmod') newBlock.forceOutputType = 'Array';
    } else {
      newBlock.blockType = BlockType.REPORTER;
      newBlock.blockShape = 3;
      delete newBlock.forceOutputType;
      delete newBlock.check;
    }
    return { ...newBlock, ...extra };
  };

  engine.objectBlock = (blockDef, extra = {}) => {
    const newBlock = { ...blockDef };
    if (ext.hasObject) {
      newBlock.blockType = engine.Object.BT;
      if (engine.Object.BS != undefined) newBlock.blockShape = engine.Object.BS;
      else delete newBlock.blockShape;
      if (engine.name == 'Penguinmod') newBlock.forceOutputType = 'Object';
    } else {
      newBlock.blockType = BlockType.REPORTER;
      newBlock.blockShape = 2;
      delete newBlock.forceOutputType;
      delete newBlock.check;
    }
    return { ...newBlock, ...extra };
  };

  engine.arrayInput = (argDef) => {
    const newArg = { ...argDef };
    if (ext.hasArray) {
      if (engine.name == 'Penguinmod') {
        newArg.type = 'Array';
        newArg.check = ['Array'];
        newArg.exemptFromNormalization = true;
        if (engine.Array.BS != undefined) newArg.shape = engine.Array.BS;
      } else {
        newArg.type = engine.Array.AT;
        if (engine.Array.AS != undefined) newArg.shape = engine.Array.AS;
      }
    } else {
      newArg.type = ArgumentType.STRING;
    }
    if (newArg.defaultValue == undefined) newArg.defaultValue = '[]';
    return newArg;
  };

  engine.objectInput = (argDef) => {
    const newArg = { ...argDef };
    if (ext.hasObject) {
      if (engine.name == 'Penguinmod') {
        newArg.type = 'Object';
        newArg.check = ['Object'];
        newArg.exemptFromNormalization = true;
        if (engine.Object.BS != undefined) newArg.shape = engine.Object.BS;
      } else {
        newArg.type = engine.Object.AT;
        if (engine.Object.AS != undefined) newArg.shape = engine.Object.AS;
      }
    } else {
      newArg.type = ArgumentType.STRING;
    }
    if (newArg.defaultValue == undefined) newArg.defaultValue = '{}';
    return newArg;
  };

  const hasNodeJS = typeof process !== "undefined" && !!process.versions && !!process.versions.node;
  const isPackaged = !window.ReduxStore?.getState && !!window.scaffolding?.runtime;
  let safeguardAlerts = true;
  if (hasNodeJS) {
    const scratchNodeEnv = process.env.ScratchNodeJSFreedom;
    if (isPackaged || (scratchNodeEnv && scratchNodeEnv.toString() == 'true')) {
      safeguardAlerts = false;
    } else {
      safeguardAlerts = true;
    }
  }
  let safeguardBypass = false;
  let curOS = null;
  let fs, path, child_process, dns, os;
  if (hasNodeJS) {
    fs = require("fs");
    path = require("path");
    child_process = require("child_process");
    dns = require("dns");
    os = require("os");
  }

  function isWineEnvironment() {
    if (!hasNodeJS) return false;
    if (process.env.WINEPREFIX || process.env.WINEARCH || process.env.WINE || process.env.WINELOADER) return true;
    try {
      const user = os.userInfo().username;
      if (user == 'steamuser') return true;
    } catch (e) {}
    return false;
  }

  function isVirtualMachine() {
    if (!hasNodeJS) return false;
    try {
      const product = fs.readFileSync('/sys/class/dmi/id/product_name', 'utf8').toLowerCase();
      return product.includes('virtualbox') || product.includes('vmware') || product.includes('qemu') || product.includes('kvm');
    } catch (e) {}
    try {
      const output = child_process.execSync('systemd-detect-virt', { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] }).trim();
      return output != 'none';
    } catch (e) {}
    return false;
  }

  (function initOS() {
    if (hasNodeJS) {
      curOS = {
        platform: os.platform(),
        arch: os.arch(),
        homedir: os.homedir(),
        username: os.userInfo().username,
        hostname: os.hostname(),
        isWindows: os.platform() == 'win32',
        isMac: os.platform() == 'darwin',
        isLinux: os.platform() == 'linux',
        isAndroid: os.platform() == 'android',
        release: os.release(),
        uptime: os.uptime,
        totalmem: os.totalmem,
        freemem: os.freemem,
        desktopEnvironment: (function() {
          if (!hasNodeJS) return 'Unknown';
          if (process.platform == 'win32') return 'Windows';
          if (process.platform == 'darwin') return 'macOS';
          if (process.platform == 'linux') {
            const de = process.env.XDG_CURRENT_DESKTOP || process.env.GDMSESSION || process.env.DESKTOP_SESSION || '';
            if (de.toLowerCase().includes('gnome')) return 'GNOME';
            if (de.toLowerCase().includes('kde') || de.toLowerCase().includes('plasma')) return 'KDE';
            if (de.toLowerCase().includes('xfce')) return 'XFCE';
            if (de.toLowerCase().includes('lxqt')) return 'LXQt';
            if (de.toLowerCase().includes('lxde')) return 'LXDE';
            if (de.toLowerCase().includes('cinnamon')) return 'Cinnamon';
            if (de.toLowerCase().includes('mate')) return 'MATE';
            if (de.toLowerCase().includes('budgie')) return 'Budgie';
            if (de.toLowerCase().includes('sway')) return 'Sway';
            if (de.toLowerCase().includes('i3')) return 'i3';
            if (de.toLowerCase().includes('awesome')) return 'Awesome';
            if (de.toLowerCase().includes('openbox')) return 'Openbox';
            if (de.toLowerCase().includes('fluxbox')) return 'Fluxbox';
            if (de) return de.split(' ')[0];
            try {
              const output = child_process.execSync('echo $XDG_CURRENT_DESKTOP', { encoding: 'utf8', shell: true, stdio: ['pipe','pipe','ignore'] }).trim();
              if (output) return output.split(' ')[0];
            } catch(e) {}
            return 'Unknown';
          }
          return 'Unknown';
        })(),
        statfs: function(device) {
          try {
            if (this.isWindows && !isWineEnvironment()) {
              const drive = device.charAt(0).toUpperCase() + ":";
              try {
                const raw = child_process.execSync(`wmic logicaldisk where "caption='${drive}'" get size,freespace /value`, { encoding: 'utf8', windowsHide: true, stdio: ['pipe','pipe','ignore'] });
                const lines = raw.trim().split('\r\n');
                let total = 0, free = 0;
                for (const line of lines) {
                  if (line.startsWith('Size=')) total = parseInt(line.split('=')[1]);
                  if (line.startsWith('FreeSpace=')) free = parseInt(line.split('=')[1]);
                }
                if (total == 0 && free == 0) throw new Error("wmic returned zero");
                return { bsize: 512, blocks: total/512, bfree: free/512 };
              } catch {
                try {
                  const ps = child_process.execSync(`powershell -Command "Get-WmiObject Win32_LogicalDisk -Filter \\"DeviceID='${drive}'\\" | Select-Object Size,FreeSpace | ConvertTo-Json"`, { encoding: 'utf8', windowsHide: true, stdio: ['pipe','pipe','ignore'] });
                  const data = JSON.parse(ps.trim());
                  const total = parseInt(data.Size) || 0;
                  const free = parseInt(data.FreeSpace) || 0;
                  if (total == 0) throw new Error("powershell returned zero");
                  return { bsize: 512, blocks: total/512, bfree: free/512 };
                } catch {
                  return { bsize: 4096, blocks: 0, bfree: 0 };
                }
              }
            } else {
              const raw = child_process.execSync(`df -B1 "${device}"`, { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] });
              const lines = raw.trim().split('\n');
              if (lines.length < 2) return { bsize: 4096, blocks: 0, bfree: 0 };
              const parts = lines[1].trim().split(/\s+/);
              if (parts.length < 4) return { bsize: 4096, blocks: 0, bfree: 0 };
              const total = parseInt(parts[1], 10);
              const free = parseInt(parts[3], 10);
              return { bsize: 1, blocks: total, bfree: free };
            }
          } catch (e) {
            return { bsize: 4096, blocks: 0, bfree: 0 };
          }
        },
        getConnectionInfo: async function() {
          let type = 'Unknown';
          try {
            if (this.isLinux && !isWineEnvironment()) {
              try {
                const nmcli = child_process.execSync('nmcli -t -f TYPE,DEVICE connection show --active', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
                if (nmcli.includes('802-11-wireless')) {
                  type = 'Wi-Fi';
                } else if (nmcli.includes('802-3-ethernet')) {
                  type = 'Ethernet';
                } else if (nmcli.includes('gsm') || nmcli.includes('cdma')) {
                  type = 'Cellular';
                }
              } catch {
                const iw = child_process.execSync('iwconfig 2>/dev/null | grep -i "essid"', { encoding: 'utf8', shell: true, stdio: ['pipe', 'pipe', 'ignore'] });
                type = iw ? 'Wi-Fi' : 'Ethernet';
              }
            }
            else if (this.isWindows || isWineEnvironment()) {
              try {
                const wlan = child_process.execSync('netsh wlan show interfaces', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
                if (wlan.includes('SSID')) {
                  type = 'Wi-Fi';
                } else {
                  const eth = child_process.execSync('ipconfig', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
                  if (eth.includes('Ethernet adapter')) {
                    type = 'Ethernet';
                  }
                }
                try {
                  const mbn = child_process.execSync('netsh mbn show interfaces', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
                  if (mbn.includes('Profile')) {
                    type = 'Cellular';
                  }
                } catch {}
              } catch {}
            }
            else if (this.isMac) {
              try {
                const sp = child_process.execSync('system_profiler SPAirPortDataType', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
                if (sp.includes('SSID')) {
                  type = 'Wi-Fi';
                } else {
                  type = 'Ethernet';
                }
                try {
                  const sp2 = child_process.execSync('system_profiler SPNetworkDataType', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
                  if (sp2.includes('WWAN') || sp2.includes('Cellular')) {
                    type = 'Cellular';
                  }
                } catch {}
              } catch {
                type = 'Ethernet';
              }
            }
          } catch (e) {}
          return type;
        },
        isProxyEnabled: async function() {
          try {
            if (this.isWindows && !isWineEnvironment()) {
              const reg = child_process.execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
              return reg.includes('0x1');
            } else if (this.isMac) {
              const sc = child_process.execSync('scutil --proxy', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
              return sc.includes('HTTPEnable : 1') || sc.includes('HTTPSEnable : 1');
            } else {
              const env = process.env;
              return !!(env.http_proxy || env.https_proxy || env.HTTP_PROXY || env.HTTPS_PROXY);
            }
          } catch { return false; }
        },
        isRouterReachable: async function() {
          try {
            const ifaces = os.networkInterfaces();
            for (const name in ifaces) {
              for (const iface of ifaces[name]) {
                if (!iface.internal && iface.family == 'IPv4') {
                  return true;
                }
              }
            }
            return false;
          } catch { return false; }
        },
        isInternetReachable: async function() {
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            const result = await dns.promises.lookup('google.com', { family: 4, signal: controller.signal });
            clearTimeout(timeout);
            return !!result.address;
          } catch {
            return false;
          }
        },
        getCurrentExecutableInfo: function() {
          if (!hasNodeJS) return null;
          return {
            name: path.basename(process.execPath).replace(/\.exe$/i, ''),
            directory: path.dirname(process.execPath),
            pid: process.pid,
            ppid: process.ppid,
            args: process.argv,
            execPath: process.execPath
          };
        },
        resolveFilePath: function(baseDir, filename) {
          if (!hasNodeJS) return "";
          const fixed = Cast.toString(filename).replace(/\\/g, "/");
          if (path.isAbsolute(fixed)) return path.resolve(fixed);
          return path.resolve(baseDir, fixed);
        },
        formatBytes: function(bytes) {
          if (bytes==0) return "0 B";
          const k = 1024, sizes = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"];
          const i = Math.floor(Math.log(bytes)/Math.log(k));
          return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + " " + sizes[i];
        },
        convertBytes: function(bytes, format) {
          const sizes = { B:1, KB:1024, MB:1024**2, GB:1024**3, TB:1024**4, PB:1024**5, EB:1024**6, ZB:1024**7, YB:1024**8 };
          const unit = Cast.toString(format).toUpperCase();
          return bytes / (sizes[unit] || 1);
        },
        env: process.env,
      };
    } else {
      const ua = navigator.userAgent;
      let isWindows = /Windows/i.test(ua);
      let isMac = /Mac OS X|Macintosh/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua);
      let isLinux = /Linux/i.test(ua) && !/Android/i.test(ua);
      let isAndroid = /Android/i.test(ua);
      let isIOS = /iPhone|iPad|iPod/i.test(ua);
      curOS = {
        platform: isWindows ? 'win32' : isMac ? 'darwin' : isLinux ? 'linux' : isAndroid ? 'android' : isIOS ? 'ios' : 'unknown',
        arch: 'unknown',
        homedir: '',
        username: '',
        hostname: '',
        isWindows, isMac, isLinux, isAndroid, isIOS,
        release: '',
        desktopEnvironment: (function() {
          if (isWindows) return 'Windows';
          if (isMac) return 'macOS';
          if (isLinux) {
            return 'Unknown';
          }
          return 'Unknown';
        })(),
        getConnectionInfo: async function() {
          const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
          let type = 'Wi-Fi';
          if (connection) {
            if (connection.type) {
              if (connection.type == 'wifi') type = 'Wi-Fi';
              else if (connection.type == 'ethernet') type = 'Ethernet';
              else if (connection.type == 'cellular') type = 'Cellular';
              else if (connection.type == 'bluetooth') type = 'Bluetooth';
              else if (connection.type == 'other' || connection.type == 'unknown') type = 'Unknown';
            }
          }
          return type;
        },
        isProxyEnabled: async function() { return false; },
        isRouterReachable: async function() {
          return navigator.onLine;
        },
        isInternetReachable: async function() {
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);
            const res = await fetch('https://www.google.com/favicon.ico', { method: 'HEAD', signal: controller.signal, mode: 'no-cors' });
            clearTimeout(timeoutId);
            return true;
          } catch {
            return false;
          }
        },
        getCurrentExecutableInfo: function() { return null; },
        resolveFilePath: function() { return ""; },
        formatBytes: function(bytes) { return this.formatBytesFallback(bytes); },
        formatBytesFallback: function(bytes) {
          if (bytes==0) return "0 B";
          const k = 1024, sizes = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"];
          const i = Math.floor(Math.log(bytes)/Math.log(k));
          return parseFloat((bytes/Math.pow(k,i)).toFixed(2)) + " " + sizes[i];
        },
        convertBytes: function(bytes, format) {
          const sizes = { B:1, KB:1024, MB:1024**2, GB:1024**3, TB:1024**4, PB:1024**5, EB:1024**6, ZB:1024**7, YB:1024**8 };
          const unit = Cast.toString(format).toUpperCase();
          return bytes / (sizes[unit] || 1);
        },
      };
    }
  })();

  function getDrive(pathl, allowMany) {
    const match = Array.from(String(pathl).matchAll(/(^.+:\\)(.*$)/gi))[0];
    if (!match || !match[1]) return null;
    if (!allowMany && match[1].length != 3) return null;
    return match[1].slice(0, match[1].indexOf(":\\"));
  }
  function getRootWIN(defaultable) {
    if (!hasNodeJS) return null;
    const L = getDrive(process.env["SYSTEMROOT"] || process.env["SystemRoot"] || defaultable || "");
    if (L == void 0) return null;
    return `${L}:\\`;
  }

  class NodeDataExtension {
    constructor() {
      this.foldersState = {};
      if (hasNodeJS) {
        this.focusDirectory = path.dirname(process.execPath);
        process.chdir(this.focusDirectory);
      } else {
        this.focusDirectory = "";
      }
      this.lastUploadedFile = null;
      this.lastUploadSuccess = false;
      this.lastFilePickerSuccess = false;
      this.lastDownloadSuccess = false;
      this.lastPickedFolder = "";
      this._deviceInfoCache = [];
      this._deviceLabelMap = new Map();
      this._deviceLabels = [];
      this._deviceInfoCacheTime = 0;
      this.alertMessages = {
        read: (details) => `Read file?\nFile: ${details.filename}\nPath: ${details.path}`,
        write: (details) => `Write to file "${details.filename}"?`,
        delete: (details) => `Delete "${details.filename}"?`,
        env: (details) => details.value ? `Set environment variable ${details.name} = ${details.value}?` : `Delete environment variable ${details.name}?`,
        open: (details) => `Open file?\nFile: ${details.filename}\nPath: ${details.path}`,
        openInApp: (details) => `Open "${details.filename}" in ${details.app}?`,
        symlink: (details) => `Create symlink from "${details.source}" to "${details.dest}"?`,
        convert: (details) => `Convert data to file "${details.filename}"?`,
        createDir: (details) => `Create folder "${details.foldername}"?`,
        upload: () => `Upload a file?`,
        download: () => `Download a file?`,
        url: (details) => `Open URL ${details.url}?`
      };
      this._loadSafeguardState();
    }

    _toggleFolder(path) {
      this.foldersState[path] = !this.foldersState[path];
      this._reloadBlocks();
    }

    isDirOpen(path) {
      if (!path) return false;
      const parts = path.split('/');
      for (let i = 0; i < parts.length; i++) {
        const ancestor = parts.slice(0, i + 1).join('/');
        if (!this.foldersState[ancestor]) return false;
      }
      return true;
    }

    _makeFolder(directory, blocks) {
      let blockList = [];
      if (Array.isArray(blocks)) {
        blockList = blocks;
      } else if (blocks && typeof blocks == 'object') {
        blockList = [blocks];
      }
      const flatten = (arr) => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
      blockList = flatten(blockList);

      const isOpen = this.isDirOpen(directory);
      const folderName = directory.split('/').pop();
      const toggleOpcode = 'toggleFolder_' + directory.replaceAll('/', '_');
      if (!this[toggleOpcode]) {
        this[toggleOpcode] = () => this._toggleFolder(directory);
      }

      const result = [
        {
          opcode: toggleOpcode,
          blockType: BlockType.BUTTON,
          text: folderName +  ' ' + (isOpen ? '▼' : '▶'),
          func: toggleOpcode,
          hideFromPalette: false
        },
        {
          blockType: BlockType.LABEL,
          text: folderName,
          hideFromPalette: !isOpen
        }
      ];

      for (let block of blockList) {
        if (!isOpen) {
          block.hideFromPalette = true;
        } else {
          block.hideFromPalette = block.hideFromPalette || false;
        }
        result.push(block);
      }

      return result;
    }

    _reloadBlocks() {
      vm.extensionManager.refreshBlocks(ext.id);
      vm.runtime.emit('EXTENSION_REFRESH_BLOCKS', ext.id);
    }

    async _loadSafeguardState() {
      try {
        if (Scratch.extensions.extensionStorage) {
          const alerts = await Scratch.extensions.extensionStorage.get('safeguardAlerts');
          const bypass = await Scratch.extensions.extensionStorage.get('safeguardBypass');
          if (alerts !== undefined) safeguardAlerts = alerts;
          if (bypass !== undefined) safeguardBypass = bypass;
        }
      } catch (e) {}
    }

    async _saveSafeguardState() {
      try {
        if (Scratch.extensions.extensionStorage) {
          await Scratch.extensions.extensionStorage.set('safeguardAlerts', safeguardAlerts);
          await Scratch.extensions.extensionStorage.set('safeguardBypass', safeguardBypass);
        }
      } catch (e) {}
    }

    _checkSafeguard(operation, details) {
      if (!hasNodeJS || safeguardBypass || !safeguardAlerts || isPackaged) return true;
      let msg = this.alertMessages[operation] ? this.alertMessages[operation](details) : `Are you sure you want to ${operation}?`;
      msg += "\n\nClick OK to continue, Cancel to deny.";
      const allowed = confirm(msg);
      if (allowed) console.log(`[Node Data] User allowed ${operation}`);
      return allowed;
    }

    _isSensitiveReadPath(filePath) {
      if (!hasNodeJS) return false;
      const lower = filePath.toLowerCase();
      const homedir = curOS.homedir.toLowerCase();
      const sensitive = curOS.isWindows
        ? [path.join(homedir,'downloads'), path.join(homedir,'appdata'), path.join(homedir,'application data'),
           'c:\\windows', 'c:\\system32', 'c:\\program files', 'c:\\programdata', 'c:\\']
        : curOS.isMac
        ? [path.join(homedir,'downloads'), path.join(homedir,'library','application support'),
           path.join(homedir,'library','caches'), '/applications', '/system', '/library', '/private',
           '/bin', '/sbin', '/usr', '/etc', '/var', '/']
        : [path.join(homedir,'downloads'), path.join(homedir,'.config'), path.join(homedir,'.cache'),
           path.join(homedir,'.local','share'), '/etc', '/bin', '/sbin', '/usr', '/var', '/lib',
           '/sys', '/proc', '/root', '/'];
      return sensitive.some(s => lower.includes(s.toLowerCase()));
    }

    _resolveFilePath(filename) {
      if (!hasNodeJS) return "";
      return curOS.resolveFilePath(this.focusDirectory, filename);
    }

    _convertBytes(bytes, format) {
      return curOS.convertBytes(bytes, format);
    }

    _formatBytes(bytes) {
      return curOS.formatBytes(bytes);
    }

    _filterByContentType(type, ext) {
      const map = {
        files: [], media: [".mp3",".wav",".ogg",".aac",".flac",".mp4",".avi",".mov",".wmv",".flv",".webm"],
        audio: [".mp3",".wav",".ogg",".aac",".flac",".m4a",".wma",".aiff",".au"],
        midi: [".mid",".midi"],
        images: [".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg"],
        videos: [".mp4",".avi",".mov",".wmv",".flv",".webm",".mkv"],
        "context files": [".json",".xml",".txt",".csv",".ini",".cfg",".conf",".yaml",".yml",".properties"],
        "code files": [".js",".lua",".hx",".py",".java",".c",".cpp",".h",".cs",".php",".html",".css",".ts",".rs",".go",".rb",".pl",".sh",".bat",".ps1",".md"]
      };
      const key = Cast.toString(type).toLowerCase();
      if (map[key]) return map[key];
      if (key.startsWith(".")) return [key];
      return map.files;
    }

    _copyFolderRecursive(src, dest) {
      if (!hasNodeJS) return;
      if (!fs.existsSync(src) || !fs.statSync(src).isDirectory()) return;
      if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
      fs.readdirSync(src).forEach(item => {
        const s = path.join(src, item);
        const d = path.join(dest, item);
        fs.statSync(s).isDirectory() ? this._copyFolderRecursive(s, d) : fs.copyFileSync(s, d);
      });
    }

    _dataUrlToBuffer(dataUrl) {
      const m = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!m) throw new Error("Invalid data URL");
      return Buffer.from(m[2], "base64");
    }

    _detectFileTypeFromBuffer(buffer) {
      if (buffer.length < 8) return "bin";
      const h = buffer.slice(0,8);
      if (h[0]==0x50 && h[1]==0x4b && (h[2]==0x03||h[2]==0x05||h[2]==0x07) && (h[3]==0x04||h[3]==0x06||h[3]==0x08)) return "zip";
      if (h[0]==0x52 && h[1]==0x61 && h[2]==0x72 && h[3]==0x21) return "rar";
      if (h[0]==0x37 && h[1]==0x7a && h[2]==0xbc && h[3]==0xaf) return "7z";
      if (h[0]==0x1f && h[1]==0x8b) return "gz";
      if (buffer.length>=512 && this._looksLikeTar(buffer.slice(0,512))) return "tar";
      if (h[0]==0x89 && h[1]==0x50 && h[2]==0x4e && h[3]==0x47) return "png";
      if (h[0]==0xff && h[1]==0xd8 && h[2]==0xff) return "jpg";
      if (h[0]==0x47 && h[1]==0x49 && h[2]==0x46) return "gif";
      if (h[0]==0x25 && h[1]==0x50 && h[2]==0x44 && h[3]==0x46) return "pdf";
      return "bin";
    }

    _looksLikeTar(header) {
      let printable = 0;
      for (let i=0;i<100;i++) if ((header[i]>=0x20&&header[i]<=0x7e)||header[i]==0) printable++;
      return printable > 80;
    }

    _refreshDeviceInfoCache() {
      if (!hasNodeJS) { this._deviceInfoCache = []; return; }
      const now = Date.now();
      if (this._deviceLabelMap.size > 0 && (now - this._deviceInfoCacheTime) < 2000) return;
      this._deviceInfoCache = [];
      this._deviceLabelMap.clear();
      this._deviceLabels = [];
      try {
        if (curOS.isLinux) {
          if (isWineEnvironment()) {
            for (let i = 65; i <= 90; i++) {
              const letter = String.fromCharCode(i);
              const drivePath = letter + ':\\';
              try {
                fs.accessSync(drivePath);
                let realPath = '';
                try {
                  realPath = fs.realpathSync(drivePath);
                } catch (e) {
                  realPath = drivePath;
                }
                const dev = {
                  name: letter + ':',
                  label: letter + ':/',
                  mountpoint: realPath,
                  rm: false,
                  rota: false,
                  tran: '',
                  model: '',
                  fstype: '',
                  isHome: letter == 'C'
                };
                this._deviceInfoCache.push(dev);
                this._deviceLabelMap.set(dev.label, dev.name);
                this._deviceLabels.push(dev.label);
              } catch (e) {}
            }
          } else {
            let homeDiskName = '';
            try {
              homeDiskName = child_process.execSync("lsblk -no pkname $(df / | tail -n1 | awk '{print $1}')", { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] }).trim();
            } catch (e) {}
            const output = child_process.execSync('lsblk -J -o NAME,LABEL,PARTLABEL,FSTYPE,MOUNTPOINTS,TYPE,RM,ROTA,TRAN,MODEL', { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] });
            const data = JSON.parse(output);
            const blockdevices = data.blockdevices || [];
            const disks = [];
            function collectDisks(devices) {
              for (const dev of devices) {
                const name = (dev.name || '').toLowerCase();
                if (name.startsWith('zram') || name.startsWith('loop') || name.startsWith('ram')) continue;
                if (dev.type == 'disk') {
                  const mountpoint = dev.mountpoints || dev.mountpoint;
                  if (mountpoint && ((Array.isArray(mountpoint) && mountpoint.includes('[SWAP]')) || mountpoint == '[SWAP]')) continue;
                  disks.push(dev);
                }
                if (dev.children && dev.children.length) {
                  collectDisks(dev.children);
                }
              }
            }
            collectDisks(blockdevices);
            const homeDiskIndex = disks.findIndex(d => d.name == homeDiskName);
            if (homeDiskIndex >= 0) {
              const [homeDisk] = disks.splice(homeDiskIndex, 1);
              disks.unshift(homeDisk);
            }
            for (const disk of disks) {
              const isHome = (disk == disks[0] && homeDiskName && disk.name == homeDiskName);
              const children = disk.children || [];
              let label = '';
              if (isHome) {
                label = 'Home';
              } else {
                for (const child of children) {
                  if (child.label) { label = child.label; break; }
                  if (child.partlabel) { label = child.partlabel; break; }
                }
                if (!label) label = disk.name || 'Unknown';
              }
              let chosenChild = null;
              if (isHome) {
                chosenChild = children.find(child => {
                  const mp = child.mountpoints || child.mountpoint;
                  return mp && ((Array.isArray(mp) && mp.includes('/')) || mp == '/');
                });
                if (!chosenChild) {
                  for (const child of children) {
                    const mp = child.mountpoints || child.mountpoint;
                    if (mp && (!Array.isArray(mp) || mp.length > 0) && !((Array.isArray(mp) && mp.includes('[SWAP]')) || mp == '[SWAP]')) {
                      chosenChild = child;
                      break;
                    }
                  }
                }
              } else {
                for (const child of children) {
                  const mp = child.mountpoints || child.mountpoint;
                  if (mp && (!Array.isArray(mp) || mp.length > 0) && !((Array.isArray(mp) && mp.includes('[SWAP]')) || mp == '[SWAP]')) {
                    chosenChild = child;
                    break;
                  }
                }
              }
              let mountpoint = '';
              let fstype = '';
              if (chosenChild) {
                const mp = chosenChild.mountpoints || chosenChild.mountpoint;
                mountpoint = Array.isArray(mp) ? mp[0] : mp;
                fstype = chosenChild.fstype || '';
              }
              const rm = disk.rm == true || disk.name.toLowerCase().startsWith('mmcblk') || (disk.tran || '').toLowerCase() == 'usb' || (disk.tran || '').toLowerCase() == 'sd';
              const devInfo = {
                name: disk.name,
                label: label,
                mountpoint: mountpoint,
                rm: rm,
                rota: disk.rota == true,
                tran: disk.tran || '',
                model: disk.model || '',
                fstype: fstype,
                children: children,
                isHome: isHome
              };
              this._deviceInfoCache.push(devInfo);
              this._deviceLabelMap.set(label, disk.name);
              this._deviceLabels.push(label);
            }
          }
        } else if (curOS.isWindows) {
          let disks = [];
          try {
            const psScript = `Get-WmiObject Win32_DiskDrive | Select-Object DeviceID,Model,MediaType,InterfaceType,Size | ConvertTo-Json`;
            const diskRaw = child_process.execSync(`powershell -Command "${psScript}"`, { encoding: 'utf8', windowsHide: true, stdio: ['pipe','pipe','ignore'] });
            disks = JSON.parse(diskRaw);
            if (!Array.isArray(disks)) disks = [disks];
          } catch (e) { disks = []; }
          const systemDrive = (process.env.SystemDrive || process.env.SYSTEMDRIVE || 'C:').toUpperCase();
          const volRaw = child_process.execSync('wmic logicaldisk get caption,volumename,filesystem,drivetype,size /format:csv', { encoding: 'utf8', windowsHide: true, stdio: ['pipe','pipe','ignore'] });
          const volLines = volRaw.trim().split('\n');
          const volumes = [];
          if (volLines.length > 1) {
            const headers = volLines[0].split(',');
            for (let i = 1; i < volLines.length; i++) {
              const cols = volLines[i].split(',');
              if (cols.length < 5) continue;
              volumes.push({ name: cols[1].trim(), label: cols[2].trim(), fstype: cols[3].trim(), drivetype: cols[4].trim(), size: cols[5].trim() });
            }
          }
          const systemVolIndex = volumes.findIndex(v => (v.name.charAt(0) + ':').toUpperCase() == systemDrive);
          if (systemVolIndex >= 0) {
            const [sysVol] = volumes.splice(systemVolIndex, 1);
            volumes.unshift(sysVol);
          }
          for (const vol of volumes) {
            const dev = {
              name: vol.name,
              label: vol.label || vol.name,
              fstype: vol.fstype,
              mountpoint: vol.name + '\\',
              rm: vol.drivetype == '2',
              rota: true,
              tran: '',
              model: '',
              isHome: (vol.name.charAt(0) + ':').toUpperCase() == systemDrive
            };
            const driveLetter = vol.name.charAt(0);
            const matchingDisk = disks.find(d => d.DeviceID && d.DeviceID.includes(driveLetter));
            if (matchingDisk) {
              dev.model = matchingDisk.Model || '';
              dev.tran = matchingDisk.InterfaceType || '';
              if (matchingDisk.MediaType && matchingDisk.MediaType.includes('SSD')) dev.rota = false;
            }
            this._deviceInfoCache.push(dev);
            this._deviceLabelMap.set(dev.label, dev.name);
            this._deviceLabels.push(dev.label);
          }
        } else if (curOS.isMac) {
          const output = child_process.execSync('diskutil list -plist', { encoding: 'utf8', stdio: ['pipe','pipe','ignore'] });
          const devices = [];
          const diskRegex = /<dict>[\s\S]*?<\/dict>/g;
          const dicts = output.match(diskRegex) || [];
          for (const dict of dicts) {
            const nameMatch = dict.match(/<key>DeviceIdentifier<\/key>\s*<string>(.*?)<\/string>/);
            const partLabelMatch = dict.match(/<key>PartitionName<\/key>\s*<string>(.*?)<\/string>/);
            const mountMatch = dict.match(/<key>MountPoint<\/key>\s*<string>(.*?)<\/string>/);
            const fsMatch = dict.match(/<key>FilesystemName<\/key>\s*<string>(.*?)<\/string>/);
            const removableMatch = dict.match(/<key>Removable<\/key>\s*<(true|false)\/>/);
            if (nameMatch) {
              const dev = {
                name: nameMatch[1],
                label: '',
                fstype: fsMatch ? fsMatch[1] : '',
                mountpoint: mountMatch ? mountMatch[1] : '',
                rm: removableMatch ? removableMatch[1] == 'true' : false,
                rota: true,
                tran: '',
                model: '',
                isHome: false
              };
              devices.push(dev);
            }
          }
          const rootDevice = devices.find(d => d.mountpoint == '/');
          if (rootDevice) {
            const idx = devices.indexOf(rootDevice);
            if (idx > 0) {
              devices.splice(idx, 1);
              devices.unshift(rootDevice);
            }
          }
          for (const dev of devices) {
            if (dev == rootDevice) {
              dev.label = dev.label || dev.partlabel || dev.name;
              dev.isHome = true;
            } else {
              dev.label = dev.label || dev.partlabel || dev.name;
            }
            this._deviceInfoCache.push(dev);
            this._deviceLabelMap.set(dev.label, dev.name);
            this._deviceLabels.push(dev.label);
          }
        }
      } catch (e) {
        this._deviceInfoCache = [];
        this._deviceLabelMap.clear();
        this._deviceLabels = [];
      }
      if (this._deviceLabels.length == 0) {
        this._deviceLabels = ['no devices'];
        this._deviceLabelMap.set('no devices', '');
      }
      this._deviceInfoCacheTime = now;
    }

    _getDeviceByDisplayLabel(label) {
      this._refreshDeviceInfoCache();
      if (label == 'no devices') return null;
      const name = this._deviceLabelMap.get(label);
      if (!name) return null;
      return this._deviceInfoCache.find(d => d.name == name) || null;
    }

    _getFirstDeviceLabel() {
      this._refreshDeviceInfoCache();
      return this._deviceLabels[0] || 'no devices';
    }

    safeguarding() {
      if (!hasNodeJS) return "";
      if (safeguardAlerts) {
        if (!confirm("DANGER! DISABLING SAFEGUARD ALLOWS FULL COMPUTER ACCESS WITHOUT WARNING!\n\nClick OK to confirm, Cancel to deny.")) {
          console.log("[Node Data] User cancelled disabling safeguard alerts");
          return "";
        }
        safeguardAlerts = false;
        safeguardBypass = true;
        console.warn("[Node Data] SAFEGUARD DISABLED AND BYPASS ENABLED: Full system access permitted without warnings");
      } else {
        safeguardAlerts = true;
        safeguardBypass = false;
        console.warn("[Node Data] SAFEGUARD ENABLED: Security alerts restored");
      }
      this._saveSafeguardState();
      this._reloadBlocks();
      return "";
    }

    isNodeJS() { return hasNodeJS; }
    nodeVersion() { return hasNodeJS ? process.versions.node : ""; }

    userOrComputerName(args) {
      const t = Cast.toString(args.type);
      if (t == "user") return hasNodeJS ? curOS.username : "";
      if (t == "computer") return hasNodeJS ? curOS.hostname : "";
      return "";
    }

    setFocusDirectory(args) {
      if (!hasNodeJS) return "";
      try {
        const newDir = path.resolve(Cast.toString(args.directory));
        if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
          this.focusDirectory = newDir;
          process.chdir(newDir);
        }
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to set focus directory: ${e.message}`);
      }
      return "";
    }

    forceFocusDirectory(args) {
      if (!hasNodeJS) return "";
      try {
        const newDir = path.resolve(Cast.toString(args.directory));
        if (!fs.existsSync(newDir) || !fs.statSync(newDir).isDirectory()) {
          if (safeguardAlerts && !safeguardBypass && !confirm(`Create new directory "${newDir}"?`)) {
            console.error(`[Node Data] SAFEGUARD BLOCKED: Creating directory "${newDir}" was cancelled by user`);
            return this.setFocusDirectory(args);
          }
          fs.mkdirSync(newDir, { recursive: true });
        }
        if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
          this.focusDirectory = newDir;
          process.chdir(newDir);
        }
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to force focus directory: ${e.message}`);
      }
      return "";
    }

    getFocusDirectory() { return hasNodeJS ? this.focusDirectory : ""; }

    convertToFullDirectory(args) {
      if (!hasNodeJS) return this.focusDirectory;
      try {
        let dirStr = Cast.toString(args.directory).replace(/\//g, path.sep);
        if (dirStr == ".") dirStr = this.focusDirectory;
        else if (dirStr == "..") dirStr = path.dirname(this.focusDirectory);
        else if (dirStr.startsWith("." + path.sep)) dirStr = path.join(this.focusDirectory, dirStr.substring(2));
        else if (dirStr.startsWith(".." + path.sep)) {
          let levels = 0, temp = dirStr;
          while (temp.startsWith(".." + path.sep)) {
            levels++;
            temp = temp.substring(3);
          }
          let base = this.focusDirectory;
          for (let i=0; i<levels; i++) base = path.dirname(base);
          dirStr = path.join(base, temp);
        }
        if (!path.isAbsolute(dirStr)) dirStr = path.resolve(this.focusDirectory, dirStr);
        dirStr = path.normalize(dirStr);
        if (Cast.toString(args.validity) != "valid") return dirStr;
        if (fs.existsSync(dirStr) && fs.statSync(dirStr).isDirectory()) return dirStr;
        let current = dirStr, lastValid = null;
        while (current != path.dirname(current)) {
          if (fs.existsSync(current) && fs.statSync(current).isDirectory()) {
            lastValid = current;
            break;
          }
          current = path.dirname(current);
        }
        if (fs.existsSync(current) && fs.statSync(current).isDirectory()) lastValid = current;
        return lastValid || this.focusDirectory;
      } catch (e) {
        return this.focusDirectory;
      }
    }

    directoryBookmark(args) {
      if (!hasNodeJS) return "";
      const homedir = curOS.homedir;
      switch (Cast.toString(args.type)) {
        case "current executable": return path.dirname(process.execPath);
        case "root": return curOS.isWindows ? (getRootWIN(process.execPath) || "C:\\") : "/";
        case "user": return homedir;
        case "appdata": return curOS.isWindows ? process.env.APPDATA||path.join(homedir,"AppData","Roaming") : curOS.isMac ? path.join(homedir,"Library","Application Support") : process.env.XDG_CONFIG_HOME||path.join(homedir,".config");
        case "localdata": return curOS.isWindows ? process.env.LOCALAPPDATA||path.join(homedir,"AppData","Local") : curOS.isMac ? path.join(homedir,"Library","Application Support") : process.env.XDG_DATA_HOME||path.join(homedir,".local","share");
        case "download": return path.join(homedir,"Downloads");
        case "documents": return path.join(homedir,"Documents");
        case "desktop": return path.join(homedir,"Desktop");
        case "music": return path.join(homedir,"Music");
        case "video": return curOS.isMac ? path.join(homedir,"Movies") : path.join(homedir,"Videos");
        case "picture": return path.join(homedir,"Pictures");
        default: return "";
      }
    }

    endFolderOfDirectory(args) {
      if (!hasNodeJS) {
        const s = Cast.toString(args.directory);
        const idx = Math.max(s.lastIndexOf('/'), s.lastIndexOf('\\'));
        return idx >= 0 ? s.slice(idx+1) : s;
      }
      try {
        return path.basename(path.resolve(Cast.toString(args.directory)));
      } catch { return ""; }
    }

    readFile(args) { return this._readFileImpl(args.filename, args.format); }
    _readFileImpl(filename, format) {
      if (!hasNodeJS) return "";
      const filePath = this._resolveFilePath(filename);
      if (this._isSensitiveReadPath(filePath) && safeguardAlerts && !safeguardBypass && !this._checkSafeguard("read", { filename, path: filePath })) return "";
      try {
        if (!fs.existsSync(filePath)) return "";
        const fmt = Cast.toString(format);
        if (fmt == "text") return fs.readFileSync(filePath, "utf8");
        if (fmt == "base64") return fs.readFileSync(filePath).toString("base64");
        if (fmt == "dataurl") {
          const buffer = fs.readFileSync(filePath);
          const base64 = buffer.toString("base64");
          const mimeMap = { ".txt":"text/plain", ".html":"text/html", ".css":"text/css", ".js":"application/javascript", ".json":"application/json", ".png":"image/png", ".jpg":"image/jpeg", ".jpeg":"image/jpeg", ".gif":"image/gif", ".svg":"image/svg+xml", ".mp3":"audio/mpeg", ".wav":"audio/wav", ".mp4":"video/mp4", ".pdf":"application/pdf" };
          const ext = path.extname(filePath).toLowerCase();
          const mime = mimeMap[ext] || "application/octet-stream";
          return `data:${mime};base64,${base64}`;
        }
        return fs.readFileSync(filePath, "utf8");
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to read file "${filename}": ${e.message}`);
        return "";
      }
    }

    fileNameWithoutExtension(args) {
      if (!hasNodeJS) {
        const s = Cast.toString(args.filename);
        const i = s.lastIndexOf(".");
        if (i > 0 && i > s.lastIndexOf("/") && i > s.lastIndexOf("\\")) return s.substring(0, i);
        return s;
      }
      try {
        return path.parse(Cast.toString(args.filename)).name;
      } catch {
        const s = Cast.toString(args.filename);
        const i = s.lastIndexOf(".");
        return i==-1 ? s : s.substring(0,i);
      }
    }

    writeAppendFile(args) { return this._writeAppendFileImpl(args.filename, args.action, args.content); }
    _writeAppendFileImpl(filename, action, content) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("write", { filename })) return "";
      try {
        const filePath = this._resolveFilePath(filename);
        const cont = Cast.toString(content);
        if (Cast.toString(action) == "write") fs.writeFileSync(filePath, cont);
        else fs.appendFileSync(filePath, cont);
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to write file "${filename}": ${e.message}`);
      }
      return "";
    }

    moveCopyRename(args) { return this._moveCopyRenameImpl(args.source, args.action, args.dest); }
    _moveCopyRenameImpl(source, action, dest) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard(Cast.toString(action), { source, dest })) return "";
      try {
        const src = this._resolveFilePath(source);
        const dst = this._resolveFilePath(dest);
        if (!fs.existsSync(src)) return "";
        const act = Cast.toString(action);
        if (act == "move" || act == "rename") fs.renameSync(src, dst);
        else if (act == "copy") fs.statSync(src).isDirectory() ? this._copyFolderRecursive(src, dst) : fs.copyFileSync(src, dst);
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to ${action} from "${source}" to "${dest}": ${e.message}`);
      }
      return "";
    }

    deleteFileFolder(args) { return this._deleteFileFolderImpl(args.path); }
    _deleteFileFolderImpl(p) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("delete", { filename: p })) return "";
      try {
        const target = this._resolveFilePath(p);
        if (!fs.existsSync(target)) return "";
        if (fs.statSync(target).isDirectory()) fs.rmSync(target, { recursive: true, force: true });
        else fs.unlinkSync(target);
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to delete "${p}": ${e.message}`);
      }
      return "";
    }

    convertData(args) { return this._convertDataImpl(args.data, args.name, args.directory); }
    _convertDataImpl(data, name, directory) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("convert", { filename: name })) return "";
      try {
        if (data == "dataurl/base64") return "";
        let base64, mime = "application/octet-stream";
        if (data.startsWith("data:")) {
          const m = data.match(/^data:([^;]+);base64,(.+)$/);
          if (!m) throw new Error("Invalid data URL");
          mime = m[1];
          base64 = m[2];
        } else base64 = data;
        const extMap = { "image/png":"png","image/jpeg":"jpg","image/jpg":"jpg","image/gif":"gif","image/bmp":"bmp","image/webp":"webp","image/svg+xml":"svg",
          "audio/mpeg":"mp3","audio/wav":"wav","audio/ogg":"ogg","audio/aac":"aac","audio/flac":"flac",
          "video/mp4":"mp4","video/avi":"avi","video/quicktime":"mov","video/x-ms-wmv":"wmv","video/webm":"webm",
          "text/plain":"txt","application/json":"json","application/xml":"xml","text/xml":"xml","application/pdf":"pdf","text/html":"html","text/css":"css","application/javascript":"js",
          "application/zip":"zip","application/x-zip-compressed":"zip","application/x-rar-compressed":"rar","application/x-tar":"tar","application/gzip":"gz","application/x-7z-compressed":"7z" };
        let finalName = name;
        if (!path.extname(name)) {
          let ext = extMap[mime] || "bin";
          if (ext == "bin") {
            const buf = Buffer.from(base64, "base64");
            ext = this._detectFileTypeFromBuffer(buf);
          }
          finalName = `${name}.${ext}`;
        }
        const dirPath = this._resolveFilePath(directory);
        if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
        fs.writeFileSync(path.join(dirPath, finalName), Buffer.from(base64, "base64"));
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to convert data to file "${name}": ${e.message}`);
      }
      return "";
    }

    createFolder(args) { return this._createFolderImpl(args.foldername); }
    _createFolderImpl(foldername) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("createDir", { foldername })) return "";
      try {
        const fp = this._resolveFilePath(foldername);
        if (!fs.existsSync(fp)) fs.mkdirSync(fp, { recursive: true });
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to create folder "${foldername}": ${e.message}`);
      }
      return "";
    }

    openFile(args) { return this._openFileImpl(args.filename); }
    _openFileImpl(filename) {
      if (!hasNodeJS) return "";
      const fp = this._resolveFilePath(filename);
      if (this._isSensitiveReadPath(fp) && safeguardAlerts && !safeguardBypass && !this._checkSafeguard("open", { filename, path: fp })) return "";
      try {
        if (!fs.existsSync(fp)) return "";
        if (curOS.isWindows) child_process.exec(`start "" "${fp}"`);
        else if (curOS.isMac) child_process.exec(`open "${fp}"`);
        else child_process.exec(`xdg-open "${fp}"`);
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to open file "${filename}": ${e.message}`);
      }
      return "";
    }

    openFileInApp(args) { return this._openFileInAppImpl(args.filename, args.app); }
    _openFileInAppImpl(filename, app) {
      if (!hasNodeJS) return "";
      const fp = this._resolveFilePath(filename), appName = Cast.toString(app);
      if (this._isSensitiveReadPath(fp) && safeguardAlerts && !safeguardBypass && !this._checkSafeguard("openInApp", { filename, app: appName, path: fp })) return "";
      try {
        if (!fs.existsSync(fp)) return "";
        if (curOS.isWindows) child_process.exec(`"${appName}" "${fp}"`, e => { if(e) this._openFileImpl(filename); });
        else if (curOS.isMac) child_process.exec(`open -a "${appName}" "${fp}"`, e => { if(e) this._openFileImpl(filename); });
        else child_process.exec(`${appName} "${fp}"`, e => { if(e) this._openFileImpl(filename); });
      } catch (e) {
        this._openFileImpl(filename);
      }
      return "";
    }

    allInDirectory(args) {
      if (!hasNodeJS) return engine.handleArray([]);
      try {
        const dir = path.resolve(Cast.toString(args.directory));
        if (!fs.existsSync(dir)) return engine.handleArray([]);
        const items = fs.readdirSync(dir);
        const showExt = Cast.toString(args.extension) == "with extension";
        const allowed = this._filterByContentType(Cast.toString(args.type), "");
        let filtered = items.filter(i => {
          const full = path.join(dir, i);
          if (!fs.statSync(full).isFile()) return false;
          const ext = path.extname(i).toLowerCase();
          return allowed.length==0 || allowed.includes(ext);
        });
        if (!showExt) filtered = filtered.map(i => path.basename(i, path.extname(i)));
        return engine.handleArray(filtered);
      } catch (e) {
        return engine.handleArray([]);
      }
    }

    allFoldersInDirectory(args) {
      if (!hasNodeJS) return engine.handleArray([]);
      try {
        const dir = path.resolve(Cast.toString(args.directory));
        if (!fs.existsSync(dir)) return engine.handleArray([]);
        const folders = fs.readdirSync(dir).filter(i => fs.statSync(path.join(dir,i)).isDirectory());
        return engine.handleArray(folders);
      } catch (e) {
        return engine.handleArray([]);
      }
    }

    fileSize(args) {
      if (!hasNodeJS) return 0;
      try {
        const fp = this._resolveFilePath(args.name);
        if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) return 0;
        return this._convertBytes(fs.statSync(fp).size, args.format);
      } catch (e) { return 0; }
    }

    fileSizePure(args) {
      if (!hasNodeJS) return Cast.toString(args.type)=="pure"?0:"0 B";
      try {
        const fp = this._resolveFilePath(args.name);
        if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) return Cast.toString(args.type)=="pure"?0:"0 B";
        const size = fs.statSync(fp).size;
        return Cast.toString(args.type)=="pure" ? size : this._formatBytes(size);
      } catch (e) { return Cast.toString(args.type)=="pure"?0:"0 B"; }
    }

    fileExists(args) {
      if (!hasNodeJS) return false;
      try {
        const fp = this._resolveFilePath(args.filename);
        return fs.existsSync(fp) && fs.statSync(fp).isFile();
      } catch { return false; }
    }

    folderExists(args) {
      if (!hasNodeJS) return false;
      try {
        const fp = this._resolveFilePath(args.foldername);
        return fs.existsSync(fp) && fs.statSync(fp).isDirectory();
      } catch { return false; }
    }

    isDirectory(args) {
      if (!hasNodeJS) return false;
      try {
        const fp = this._resolveFilePath(args.path);
        return fs.existsSync(fp) && fs.statSync(fp).isDirectory();
      } catch { return false; }
    }

    isDirectoryCommandValid(args) {
      if (!hasNodeJS) return false;
      try {
        const dir = Cast.toString(args.directory);
        const resolved = this.convertToFullDirectory({ directory: dir, validity: "any" });
        if (!fs.existsSync(resolved)) return false;
        const stat = fs.statSync(resolved);
        const ct = Cast.toString(args.content);
        if (ct == "file") return stat.isFile();
        if (ct == "folder") return stat.isDirectory();
        if (!stat.isFile()) return false;
        const ext = path.extname(resolved).toLowerCase();
        if (ct == "media") return [".mp3",".wav",".ogg",".aac",".flac",".mp4",".avi",".mov",".wmv",".flv",".webm",".mkv",".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg"].includes(ext);
        if (ct == "audio") return [".mp3",".wav",".ogg",".aac",".flac",".m4a",".wma",".aiff",".au"].includes(ext);
        if (ct == "image") return [".jpg",".jpeg",".png",".gif",".bmp",".webp",".svg"].includes(ext);
        if (ct == "video") return [".mp4",".avi",".mov",".wmv",".flv",".webm",".mkv"].includes(ext);
        if (ct == "music") return [".mp3",".wav",".ogg",".aac",".flac",".m4a",".wma",".aiff",".au",".mid",".midi"].includes(ext);
        return false;
      } catch { return false; }
    }

    countLines(args) {
      if (!hasNodeJS) return 0;
      try {
        const fp = this._resolveFilePath(args.filename);
        if (!fs.existsSync(fp) || !fs.statSync(fp).isFile()) return 0;
        const content = fs.readFileSync(fp, "utf8");
        if (content.trim() == "") return 0;
        return content.split("\n").length;
      } catch { return 0; }
    }

    createSymlink(args) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("symlink", { source: args.target, dest: args.linkname })) return "";
      try {
        fs.symlinkSync(this._resolveFilePath(args.target), this._resolveFilePath(args.linkname));
      } catch (e) {
        vm.runtime.reportError(`[Node Data] Failed to create symlink: ${e.message}`);
      }
      return "";
    }

    isSymlink(args) {
      if (!hasNodeJS) return false;
      try {
        const fp = this._resolveFilePath(args.path);
        if (!fs.existsSync(fp)) return false;
        return fs.lstatSync(fp).isSymbolicLink();
      } catch { return false; }
    }

    getAbsolutePath(args) {
      if (!hasNodeJS) return "";
      try {
        return path.resolve(this.focusDirectory, Cast.toString(args.relative));
      } catch { return ""; }
    }

    getStorageDevicesMenuArray() {
      if (!hasNodeJS) return ["no devices"];
      this._refreshDeviceInfoCache();
      if (!this._deviceLabels || this._deviceLabels.length == 0) return ["no devices"];
      return [...this._deviceLabels];
    }

    storageDevicesFormatted(args) {
      this._refreshDeviceInfoCache();
      const mode = Cast.toString(args.type);
      if (mode == 'names') {
        const names = [];
        for (const label of this._deviceLabels) {
          if (label == 'no devices') continue;
          const name = this._deviceLabelMap.get(label);
          if (name) names.push(name);
        }
        return engine.handleArray(names);
      } else {
        return engine.handleArray(this._deviceLabels);
      }
    }

    isDeviceAccessibleRemovable(args) {
      let device = args.device;
      if (!device || device == 'no devices') device = this._getFirstDeviceLabel();
      if (device == 'no devices') return false;
      const dev = this._getDeviceByDisplayLabel(device);
      if (!dev) return false;
      const prop = Cast.toString(args.property);
      if (prop == 'accessible') return true;
      if (prop == 'removable') return dev.rm;
      if (prop == 'mounted') return !!(dev.mountpoint && dev.mountpoint.trim());
      return false;
    }

    deviceDirectory(args) {
      let device = args.device;
      if (!device || device == 'no devices') device = this._getFirstDeviceLabel();
      if (device == 'no devices') return '';
      const dev = this._getDeviceByDisplayLabel(device);
      if (!dev) return '';
      const whichVal = Cast.toString(args.which);
      if (whichVal == 'main') {
        if (dev.isHome && hasNodeJS) return curOS.homedir || '';
        return dev.mountpoint || '';
      }
      return dev.mountpoint || '';
    }

    deviceType(args) {
      let device = args.device;
      if (!device || device == 'no devices') device = this._getFirstDeviceLabel();
      if (device == 'no devices') return 'Unknown';
      const dev = this._getDeviceByDisplayLabel(device);
      if (!dev) return 'Unknown';
      const tran = (dev.tran || '').toLowerCase();
      const model = (dev.model || '').toLowerCase();
      const name = dev.name.toLowerCase();
      if (tran == 'nvme') return 'NVMe SSD';
      if (tran == 'sata') {
        if (dev.rota) return 'HDD';
        return 'SSD';
      }
      if (tran == 'usb' || tran == 'sd') return 'External';
      if (name.startsWith('mmcblk')) return 'SD/eMMC';
      if (dev.rm && !tran) return 'Removable';
      if (model.includes('ssd')) return 'SSD';
      if (model.includes('hd') || model.includes('hard')) return 'HDD';
      return 'Unknown';
    }

    deviceFormat(args) {
      let device = args.device;
      if (!device || device == 'no devices') device = this._getFirstDeviceLabel();
      if (device == 'no devices') return '';
      const dev = this._getDeviceByDisplayLabel(device);
      if (!dev) return '';
      return dev.fstype || '';
    }

    storageInfo(args) {
      let device = args.device;
      if (!device || device == 'no devices') device = this._getFirstDeviceLabel();
      if (device == 'no devices') return 0;
      return this._storageInfoImpl(args.type, device, args.format);
    }
    _storageInfoImpl(type, device, format) {
      if (!hasNodeJS) return 0;
      const typeStr = Cast.toString(type);
      const fmt = Cast.toString(format);
      const dev = this._getDeviceByDisplayLabel(Cast.toString(device));
      if (!dev || !dev.mountpoint) return 0;
      try {
        const s = curOS.statfs(dev.mountpoint);
        const bytes = typeStr == "total" ? s.bsize * s.blocks : s.bsize * s.bfree;
        return this._convertBytes(bytes, fmt);
      } catch { return 0; }
    }

    isUsingVMWine(args) {
      const t = Cast.toString(args.type);
      if (t == 'wine') return isWineEnvironment();
      if (t == 'vm') return isVirtualMachine();
      return false;
    }

    osInfo(args) {
      const t = Cast.toString(args.type);
      if (t == "desktopEnvironment") {
        if (!hasNodeJS) return 'Unknown';
        return curOS.desktopEnvironment;
      }
      if (!hasNodeJS) {
        if (t == "type") {
          if (curOS.isWindows) return "Windows";
          if (curOS.isMac) return "macOS";
          if (curOS.isLinux) return "Linux";
          if (curOS.isAndroid) return "Android";
          if (curOS.isIOS) return "iOS";
          return "Unknown";
        }
        if (t == "platform") return curOS.platform;
        if (t == "distro") {
          if (curOS.isWindows) {
            const ua = navigator.userAgent;
            const match = ua.match(/Windows NT (\d+\.\d+)/);
            if (match) {
              const ver = match[1];
              if (ver == '10.0') return "Windows 10/11";
              if (ver == '6.1') return "Windows 7";
              if (ver == '6.2') return "Windows 8";
              if (ver == '6.3') return "Windows 8.1";
              return `Windows NT ${ver}`;
            }
            return "Windows";
          }
          if (curOS.isMac) {
            const ua = navigator.userAgent;
            const match = ua.match(/Mac OS X (\d+[._]\d+)/);
            if (match) return `macOS ${match[1].replace('_', '.')}`;
            return "macOS";
          }
          if (curOS.isAndroid) return "Android";
          if (curOS.isLinux) return "Linux";
          return "Unknown";
        }
        return "";
      }
      if (t == "type") {
        if (curOS.isWindows) return "Windows";
        if (curOS.isMac) return "macOS";
        if (curOS.isLinux) return "Linux";
        if (curOS.isAndroid) return "Android";
        return "Unknown";
      }
      if (t == "platform") return curOS.platform;
      if (t == "distro") {
        if (curOS.isWindows) {
          const release = curOS.release;
          const major = parseInt(release.split('.')[0]);
          if (release.startsWith('10.0')) {
            const build = parseInt(release.split('.')[2] || '0');
            if (build >= 22000) return "Windows 11";
            else return "Windows 10";
          } else if (major == 6) {
            const minor = parseInt(release.split('.')[1]);
            if (minor == 1) return "Windows 7";
            if (minor == 2) return "Windows 8";
            if (minor == 3) return "Windows 8.1";
          } else if (major == 5) {
            if (release.includes('5.1')) return "Windows XP";
            if (release.includes('5.0')) return "Windows 2000";
          }
          return `Windows ${release}`;
        }
        if (curOS.isMac) {
          const release = curOS.release;
          const [major, minor] = release.split('.').map(Number);
          if (major == 21) return "macOS Monterey";
          if (major == 20) return "macOS Big Sur";
          if (major == 19) return "macOS Catalina";
          if (major == 18) return "macOS Mojave";
          if (major == 17) return "macOS High Sierra";
          if (major == 16) return "macOS Sierra";
          if (major == 15) return "OS X El Capitan";
          if (major == 14) return "OS X Yosemite";
          if (major == 13) return "OS X Mavericks";
          return `macOS ${release}`;
        }
        if (curOS.isLinux) {
          try {
            const release = fs.readFileSync("/etc/os-release","utf8");
            const line = release.split("\n").find(l=>l.startsWith("PRETTY_NAME="));
            if (line) return line.split("=")[1].replace(/"/g,"");
          } catch {}
          try {
            const issue = fs.readFileSync("/etc/issue","utf8").trim();
            if (issue) return issue;
          } catch {}
          return "Linux";
        }
        if (curOS.isAndroid) return "Android";
        return "Unknown";
      }
      return "";
    }

    getCpuArch() {
      if (hasNodeJS) return curOS.arch;
      const platform = navigator.platform || "";
      if (/Win64|Win32/.test(platform)) return platform.includes("64") ? "x64" : "x86";
      if (/MacIntel/.test(platform)) return "x64";
      if (/Linux x86_64/.test(navigator.userAgent)) return "x64";
      if (/Linux i686/.test(navigator.userAgent)) return "x86";
      return "unknown";
    }

    memoryInfo(args) {
      if (!hasNodeJS) return 0;
      const t = Cast.toString(args.type);
      let total = BigInt(curOS.totalmem());
      let free = BigInt(curOS.freemem());
      if (t == "total") return Number(total);
      if (t == "free") return Number(free);
      if (t == "used") return Number(total - free);
      return 0;
    }

    getUptime(args) {
      if (!hasNodeJS) return 0;
      const seconds = BigInt(Math.floor(curOS.uptime()));
      const units = {
        seconds: 1n,
        minutes: 60n,
        hours: 3600n,
        days: 86400n,
        weeks: 604800n,
        months: 2592000n,
        years: 31536000n
      };
      const u = Cast.toString(args.unit);
      const divisor = units[u] || 1n;
      const result = seconds / divisor;
      return Number(result);
    }

    openSite(args) { return this._openSiteImpl(args.url); }
    _openSiteImpl(url) {
      const urlStr = Cast.toString(url);
      if (!hasNodeJS) { window.open(urlStr, '_blank'); return ""; }
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("url", { url: urlStr })) {
        console.error(`[Node Data] SAFEGUARD BLOCKED: Opening URL "${urlStr}" was cancelled by user`);
        return "";
      }
      try {
        if (curOS.isWindows) child_process.exec(`start "" "${urlStr}"`);
        else if (curOS.isMac) child_process.exec(`open "${urlStr}"`);
        else child_process.exec(`xdg-open "${urlStr}"`);
      } catch (e) {}
      return "";
    }

    async isConnected(args) {
      const t = Cast.toString(args.target);
      if (t == "internet") return curOS.isInternetReachable();
      else return curOS.isRouterReachable();
    }

    async connectionType() {
      const type = await curOS.getConnectionInfo();
      return type;
    }

    getEnv(args) {
      if (!hasNodeJS) return "";
      try {
        const val = curOS.env[args.name] || "";
        if (args.name.toUpperCase() == "PATH") {
          const delim = curOS.isWindows ? ";" : ":";
          return JSON.stringify(val.split(delim).filter(p=>p.trim()));
        }
        if (val.includes(";") || val.includes(":") || val.includes(",")) {
          let parts;
          if (val.includes(";")) parts = val.split(";").filter(p=>p.trim());
          else if (val.includes(":")) parts = val.split(":").filter(p=>p.trim());
          else if (val.includes(",")) parts = val.split(",").filter(p=>p.trim());
          if (parts && parts.length>1) return JSON.stringify(parts);
        }
        if (val.includes("=") && !val.includes(";") && !val.includes(":")) {
          const lines = val.split("\n").filter(l=>l.trim());
          if (lines.length>1) {
            const obj = {};
            lines.forEach(l=>{ let i=l.indexOf("="); if(i!=-1) obj[l.slice(0,i).trim()] = l.slice(i+1).trim(); });
            return JSON.stringify(obj);
          } else if (lines.length==1 && lines[0].includes("=")) {
            const i = lines[0].indexOf("=");
            return JSON.stringify({ [lines[0].slice(0,i).trim()]: lines[0].slice(i+1).trim() });
          }
        }
        return val;
      } catch { return ""; }
    }

    setEnv(args) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("env", { name: args.name, value: args.value })) {
        console.error(`[Node Data] SAFEGUARD BLOCKED: Setting environment variable "${args.name}" was cancelled by user`);
        return "";
      }
      try {
        curOS.env[args.name] = Cast.toString(args.value);
      } catch (e) {}
      return "";
    }

    deleteEnv(args) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("env", { name: args.name })) {
        console.error(`[Node Data] SAFEGUARD BLOCKED: Deleting environment variable "${args.name}" was cancelled by user`);
        return "";
      }
      try {
        delete curOS.env[args.name];
      } catch (e) {}
      return "";
    }

    listEnv() {
      if (!hasNodeJS) return engine.handleObject({});
      try {
        return engine.handleObject(curOS.env);
      } catch { return engine.handleObject({}); }
    }

    loadEnvFile(args) {
      if (!hasNodeJS) return "";
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("load env file", { filename: args.path, operation: "load environment variables" })) return "";
      try {
        const resolved = this._resolveFilePath(args.path);
        if (!fs.existsSync(resolved)) return "";
        const content = fs.readFileSync(resolved, "utf8");
        content.split("\n").forEach(l => {
          l = l.trim();
          if (!l || l.startsWith("#")) return;
          let i = l.indexOf("=");
          if (i==-1) return;
          let key = l.slice(0,i).trim();
          let val = l.slice(i+1).trim().replace(/^['"]|['"]$/g, "");
          curOS.env[key] = val;
        });
      } catch (e) {}
      return "";
    }

    parseEnvFile(args) {
      if (!hasNodeJS) return engine.handleObject({});
      if (safeguardAlerts && !safeguardBypass && !this._checkSafeguard("parse env file", { filename: args.path, operation: "parse environment file" })) return engine.handleObject({});
      try {
        const resolved = this._resolveFilePath(args.path);
        if (!fs.existsSync(resolved)) return engine.handleObject({});
        const content = fs.readFileSync(resolved, "utf8");
        const obj = {};
        content.split("\n").forEach(l => {
          l = l.trim();
          if (!l || l.startsWith("#")) return;
          let i = l.indexOf("=");
          if (i==-1) return;
          obj[l.slice(0,i).trim()] = l.slice(i+1).trim().replace(/^['"]|['"]$/g, "");
        });
        return engine.handleObject(obj);
      } catch { return engine.handleObject({}); }
    }

    uploadFile(args) {
      if (hasNodeJS && safeguardAlerts && !safeguardBypass && !this._checkSafeguard("upload", {})) { this.lastUploadSuccess = false; return ""; }
      try {
        const input = document.createElement("input");
        input.type = "file";
        let acceptExt = Cast.toString(args.ext).trim();
        if (acceptExt) {
          if (!acceptExt.startsWith(".")) acceptExt = "." + acceptExt;
          input.accept = acceptExt;
        }
        this.lastUploadSuccess = false;
        input.onchange = (e) => {
          const file = e.target.files[0];
          if (!file) { this.lastUploadSuccess = false; return; }
          const reader = new FileReader();
          reader.onload = (ev) => {
            this.lastUploadSuccess = true;
            const dataUrl = ev.target.result;
            this.lastUploadedFile = {
              content: dataUrl,
              name: file.name,
              unextendedName: (function(n) { const i = n.lastIndexOf("."); return i > 0 ? n.substring(0,i) : n; })(file.name),
              directory: hasNodeJS ? this.focusDirectory : "",
              size: file.size,
              formattedSize: this._formatBytes(file.size),
              extension: (function(n) { const i = n.lastIndexOf("."); return i > 0 ? n.substring(i+1) : ""; })(file.name)
            };
            if (hasNodeJS) {
              try {
                const buffer = this._dataUrlToBuffer(dataUrl);
                const filePath = path.join(this.focusDirectory, file.name);
                fs.writeFileSync(filePath, buffer);
              } catch (err) {
                vm.runtime.reportError(`[Node Data] Upload write error: ${err.message}`);
              }
            }
          };
          reader.onerror = () => { this.lastUploadSuccess = false; };
          reader.readAsDataURL(file);
        };
        input.click();
      } catch (e) { this.lastUploadSuccess = false; }
      return "";
    }

    uploadSuccessful() { return this.lastUploadSuccess; }

    async askForFile(args) {
      if (hasNodeJS && safeguardAlerts && !safeguardBypass && !this._checkSafeguard("read", { filename: "user_selected_file", path: "user selection" })) {
        this.lastFilePickerSuccess = false;
        return "";
      }
      try {
        const input = document.createElement("input");
        input.type = "file";
        const exts = Cast.toString(args.ext).trim();
        if (exts) input.accept = exts.split(" ").map(e => e.startsWith(".")?e:"."+e).join(",");
        this.lastFilePickerSuccess = false;
        return new Promise(resolve => {
          input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) { this.lastFilePickerSuccess = false; resolve(""); return; }
            const reader = new FileReader();
            reader.onload = (ev) => {
              this.lastFilePickerSuccess = true;
              this.lastUploadedFile = {
                content: ev.target.result,
                name: file.name,
                unextendedName: (function(n) { const i = n.lastIndexOf("."); return i > 0 ? n.substring(0,i) : n; })(file.name),
                directory: hasNodeJS ? this.focusDirectory : "",
                size: file.size,
                formattedSize: this._formatBytes(file.size),
                extension: (function(n) { const i = n.lastIndexOf("."); return i > 0 ? n.substring(i+1) : ""; })(file.name)
              };
              resolve(ev.target.result);
            };
            reader.onerror = () => { this.lastFilePickerSuccess = false; resolve(""); };
            reader.readAsDataURL(file);
          };
          input.oncancel = () => { this.lastFilePickerSuccess = false; resolve(""); };
          input.click();
        });
      } catch { this.lastFilePickerSuccess = false; return ""; }
    }

    gotFileSuccessfully() { return this.lastFilePickerSuccess; }

    lastUploadedFileProperty(args) {
      if (!this.lastUploadedFile) return "";
      switch (Cast.toString(args.thing)) {
        case "content": return this.lastUploadedFile.content;
        case "name": return this.lastUploadedFile.name;
        case "unextended name": return this.lastUploadedFile.unextendedName;
        case "directory": return this.lastUploadedFile.directory;
        case "size": return this.lastUploadedFile.size;
        case "formatted size": return this.lastUploadedFile.formattedSize;
        case "extension": return this.lastUploadedFile.extension;
        default: return "";
      }
    }

    downloadContent(args) {
      this.lastDownloadSuccess = false;
      try {
        let blob, filename = Cast.toString(args.nameandext);
        const content = args.content;
        if (content.startsWith("data:")) {
          const m = content.match(/^data:([^;]+);base64,(.+)$/);
          if (!m) { return ""; }
          const byteStr = atob(m[2]);
          const bytes = new Uint8Array(byteStr.length);
          for (let i=0;i<byteStr.length;i++) bytes[i] = byteStr.charCodeAt(i);
          blob = new Blob([bytes], { type: m[1] });
        } else {
          blob = new Blob([content], { type: "text/plain" });
        }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
        this.lastDownloadSuccess = true;
      } catch (e) { this.lastDownloadSuccess = false; }
      return "";
    }

    downloadSuccessful() { return this.lastDownloadSuccess; }

    pickFolder() {
      try {
        const input = document.createElement("input");
        input.type = "file";
        input.webkitdirectory = true;
        input.directory = true;
        input.onchange = (e) => {
          const files = e.target.files;
          if (files.length>0) {
            const relPath = files[0].webkitRelativePath;
            const sep = relPath.includes('/') ? '/' : '\\';
            const folderRel = relPath.substring(0, relPath.lastIndexOf(sep));
            if (hasNodeJS) {
              this.lastPickedFolder = path.resolve(this.focusDirectory, folderRel);
            } else {
              this.lastPickedFolder = folderRel;
            }
          }
        };
        input.click();
      } catch (e) {}
      return "";
    }

    lastPickedFolderDirectory() { return this.lastPickedFolder; }

    getInfo() {
      const translate = Scratch.translate;
      return {
        id: ext.id,
        name: ext.name,
        color1: ext.colors[0],
        color2: ext.colors[1],
        color3: ext.colors[2],
        blocks: [
          { opcode: 'safeguarding', blockType: BlockType.BUTTON, text: hasNodeJS ? (safeguardAlerts ? translate('Disable Alerts') : translate('Enable Alerts')) : translate('no functionality') },
          { blockType: BlockType.LABEL, text: translate('Node.js Required'), hideFromPalette: hasNodeJS },
          { opcode: 'isNodeJS', blockType: BlockType.BOOLEAN, text: translate('node.js available?') },
          { opcode: 'nodeVersion', blockType: BlockType.REPORTER, text: translate('node.js version') },
          "---",

          ...this._makeFolder('Directory', [
            { opcode: 'setFocusDirectory', blockType: BlockType.COMMAND, text: translate('set focus directory to [directory]'), arguments: { directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } },
            { opcode: 'forceFocusDirectory', blockType: BlockType.COMMAND, text: translate('force focus directory to [directory]'), arguments: { directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } },
            { opcode: 'getFocusDirectory', blockType: BlockType.REPORTER, text: translate('focus directory') },
            { opcode: 'convertToFullDirectory', blockType: BlockType.REPORTER, text: translate('convert [directory] to full directory [validity]'), arguments: { directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true }, validity: { type: ArgumentType.STRING, menu: 'validityOptions', defaultValue: 'valid', exemptFromNormalization: true } } },
            { opcode: 'directoryBookmark', blockType: BlockType.REPORTER, text: translate('[type] directory'), arguments: { type: { type: ArgumentType.STRING, menu: 'directoryBookmarks', defaultValue: 'current executable', exemptFromNormalization: true } } },
            { opcode: 'endFolderOfDirectory', blockType: BlockType.REPORTER, text: translate('end folder of [directory]'), arguments: { directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } },
          ]),

          ...this._makeFolder('Files', [
            { opcode: 'readFile', blockType: BlockType.REPORTER, text: translate('read file [filename] as [format]'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true }, format: { type: ArgumentType.STRING, menu: 'readableFormats', defaultValue: 'text', exemptFromNormalization: true } } },
            { opcode: 'fileNameWithoutExtension', blockType: BlockType.REPORTER, text: translate('[filename] without extension'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'mysong.mp3', exemptFromNormalization: true } } },
            { opcode: 'writeAppendFile', blockType: BlockType.COMMAND, text: translate('to file [filename] [action] [content]'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true }, action: { type: ArgumentType.STRING, menu: 'writeAppendMenu', defaultValue: 'write', exemptFromNormalization: true }, content: { type: ArgumentType.STRING, defaultValue: 'Hello World', exemptFromNormalization: true } } },
            { opcode: 'moveCopyRename', blockType: BlockType.COMMAND, text: translate('to file/folder [source] [action] to [dest]'), arguments: { source: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true }, action: { type: ArgumentType.STRING, menu: 'moveCopyRenameMenu', defaultValue: 'move', exemptFromNormalization: true }, dest: { type: ArgumentType.STRING, defaultValue: 'new.txt', exemptFromNormalization: true } } },
            { opcode: 'deleteFileFolder', blockType: BlockType.COMMAND, text: translate('delete file/folder [path]'), arguments: { path: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true } } },
            { opcode: 'convertData', blockType: BlockType.COMMAND, text: translate('convert data [data] to file named [name] at [directory]'), arguments: { data: { type: ArgumentType.STRING, defaultValue: 'dataurl/base64', exemptFromNormalization: true }, name: { type: ArgumentType.STRING, defaultValue: 'file', exemptFromNormalization: true }, directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } },
            { opcode: 'createFolder', blockType: BlockType.COMMAND, text: translate('create folder [foldername]'), arguments: { foldername: { type: ArgumentType.STRING, defaultValue: 'NewFolder', exemptFromNormalization: true } } },
            { opcode: 'openFile', blockType: BlockType.COMMAND, text: translate('open file [filename]'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true } } },
            { opcode: 'openFileInApp', blockType: BlockType.COMMAND, text: translate('open file [filename] in application [app]'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true }, app: { type: ArgumentType.STRING, defaultValue: 'notepad', exemptFromNormalization: true } } },
            engine.arrayBlock({ opcode: 'allInDirectory', blockType: BlockType.REPORTER, text: translate('all [type] in [directory] [extension]'), arguments: { type: { type: ArgumentType.STRING, menu: 'contentType', defaultValue: 'files', exemptFromNormalization: true }, directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true }, extension: { type: ArgumentType.STRING, menu: 'extensionType', defaultValue: 'with extension', exemptFromNormalization: true } } }),
            engine.arrayBlock({ opcode: 'allFoldersInDirectory', blockType: BlockType.REPORTER, text: translate('all folders in [directory]'), arguments: { directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } }),
            { opcode: 'fileSize', blockType: BlockType.REPORTER, text: translate('size of file [name] in [format]'), arguments: { name: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true }, format: { type: ArgumentType.STRING, menu: 'sizeFormat', defaultValue: 'KB', exemptFromNormalization: true } } },
            { opcode: 'fileSizePure', blockType: BlockType.REPORTER, text: translate('[type] size of file [name]'), arguments: { type: { type: ArgumentType.STRING, menu: 'sizePureType', defaultValue: 'pure', exemptFromNormalization: true }, name: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true } } },
            { opcode: 'fileExists', blockType: BlockType.BOOLEAN, text: translate('file [filename] exists?'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true } } },
            { opcode: 'folderExists', blockType: BlockType.BOOLEAN, text: translate('folder [foldername] exists?'), arguments: { foldername: { type: ArgumentType.STRING, defaultValue: 'NewFolder', exemptFromNormalization: true } } },
            { opcode: 'isDirectory', blockType: BlockType.BOOLEAN, text: translate('is [path] a directory?'), arguments: { path: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } },
            { opcode: 'isDirectoryCommandValid', blockType: BlockType.BOOLEAN, text: translate('does [directory] point to [content]?'), arguments: { directory: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true }, content: { type: ArgumentType.STRING, menu: 'contentTypePoint', defaultValue: 'file', exemptFromNormalization: true } } },
            { opcode: 'countLines', blockType: BlockType.REPORTER, text: translate('count lines in file [filename]'), arguments: { filename: { type: ArgumentType.STRING, defaultValue: 'test.txt', exemptFromNormalization: true } } },
            { opcode: 'createSymlink', blockType: BlockType.COMMAND, text: translate('create symbolic link from [target] to [linkname]'), arguments: { target: { type: ArgumentType.STRING, defaultValue: 'target.txt', exemptFromNormalization: true }, linkname: { type: ArgumentType.STRING, defaultValue: 'link.txt', exemptFromNormalization: true } } },
            { opcode: 'isSymlink', blockType: BlockType.BOOLEAN, text: translate('is [path] a symbolic link?'), arguments: { path: { type: ArgumentType.STRING, defaultValue: 'link.txt', exemptFromNormalization: true } } },
            { opcode: 'getAbsolutePath', blockType: BlockType.REPORTER, text: translate('get absolute path of [relative]'), arguments: { relative: { type: ArgumentType.STRING, defaultValue: '.', exemptFromNormalization: true } } },
          ]),

          ...this._makeFolder('Computer Info', [
            { opcode: 'userOrComputerName', blockType: BlockType.REPORTER, text: translate('[type] name'), arguments: { type: { type: ArgumentType.STRING, menu: 'nameTypeMenu', defaultValue: 'user', exemptFromNormalization: true } } },
            { opcode: 'isUsingVMWine', blockType: BlockType.BOOLEAN, text: translate('is using [type]?'), arguments: { type: { type: ArgumentType.STRING, menu: 'vmWineMenu', defaultValue: 'wine', exemptFromNormalization: true } } },
            engine.arrayBlock({ opcode: 'storageDevicesFormatted', blockType: BlockType.REPORTER, text: translate('storage device [type]'), arguments: { type: { type: ArgumentType.STRING, menu: 'storageLabelMode', defaultValue: 'labels', exemptFromNormalization: true } } }),
            { opcode: 'isDeviceAccessibleRemovable', blockType: BlockType.BOOLEAN, text: translate('is [device] [property]?'), arguments: { device: { type: ArgumentType.STRING, menu: 'storageDevicesMenu', defaultValue: '', exemptFromNormalization: true }, property: { type: ArgumentType.STRING, menu: 'devicePropertyMenu', defaultValue: 'accessible', exemptFromNormalization: true } } },
            { opcode: 'deviceDirectory', blockType: BlockType.REPORTER, text: translate('[which] directory of [device]'), arguments: { which: { type: ArgumentType.STRING, menu: 'deviceDirectoryWhich', defaultValue: 'main', exemptFromNormalization: true }, device: { type: ArgumentType.STRING, menu: 'storageDevicesMenu', defaultValue: '', exemptFromNormalization: true } } },
            { opcode: 'deviceType', blockType: BlockType.REPORTER, text: translate('device type of [device]'), arguments: { device: { type: ArgumentType.STRING, menu: 'storageDevicesMenu', defaultValue: '', exemptFromNormalization: true } } },
            { opcode: 'deviceFormat', blockType: BlockType.REPORTER, text: translate('format of [device]'), arguments: { device: { type: ArgumentType.STRING, menu: 'storageDevicesMenu', defaultValue: '', exemptFromNormalization: true } } },
            { opcode: 'storageInfo', blockType: BlockType.REPORTER, text: translate('[type] storage of [device] in [format]'), arguments: { type: { type: ArgumentType.STRING, menu: 'storageTypeMenu', defaultValue: 'free', exemptFromNormalization: true }, device: { type: ArgumentType.STRING, menu: 'storageDevicesMenu', defaultValue: '', exemptFromNormalization: true }, format: { type: ArgumentType.STRING, menu: 'sizeFormat', defaultValue: 'GB', exemptFromNormalization: true } } },
            { opcode: 'osInfo', blockType: BlockType.REPORTER, text: translate('os [type]'), arguments: { type: { type: ArgumentType.STRING, menu: 'osInfoMenu', defaultValue: 'distro', exemptFromNormalization: true } } },
            { opcode: 'getCpuArch', blockType: BlockType.REPORTER, text: translate('cpu architecture') },
            { opcode: 'memoryInfo', blockType: BlockType.REPORTER, text: translate('memory [type]'), arguments: { type: { type: ArgumentType.STRING, menu: 'memoryTypeMenu', defaultValue: 'total', exemptFromNormalization: true } } },
            { opcode: 'getUptime', blockType: BlockType.REPORTER, text: translate('system uptime in [unit]'), arguments: { unit: { type: ArgumentType.STRING, menu: 'uptimeUnitMenu', defaultValue: 'seconds', exemptFromNormalization: true } } },
          ]),

          ...this._makeFolder('Internet', [
            { opcode: 'openSite', blockType: BlockType.COMMAND, text: translate('open url [url] in default browser'), arguments: { url: { type: ArgumentType.STRING, defaultValue: 'https://google.com', exemptFromNormalization: true } } },
            { opcode: 'isConnected', blockType: BlockType.BOOLEAN, text: translate('is connected to [target]?'), arguments: { target: { type: ArgumentType.STRING, menu: 'connectionTargetMenu', defaultValue: 'internet', exemptFromNormalization: true } } },
            { opcode: 'connectionType', blockType: BlockType.REPORTER, text: translate('connection type') },
          ]),

          ...this._makeFolder('Environment', [
            { opcode: 'getEnv', blockType: BlockType.REPORTER, text: translate('environment variable [name]'), arguments: { name: { type: ArgumentType.STRING, defaultValue: 'PATH', exemptFromNormalization: true } } },
            { opcode: 'setEnv', blockType: BlockType.COMMAND, text: translate('set environment variable [name] to [value]'), arguments: { name: { type: ArgumentType.STRING, defaultValue: 'MY_VAR', exemptFromNormalization: true }, value: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } },
            { opcode: 'deleteEnv', blockType: BlockType.COMMAND, text: translate('delete environment variable [name]'), arguments: { name: { type: ArgumentType.STRING, defaultValue: 'MY_VAR', exemptFromNormalization: true } } },
            engine.objectBlock({ opcode: 'listEnv', blockType: BlockType.REPORTER, text: translate('all environment variables') }),
            { opcode: 'loadEnvFile', blockType: BlockType.COMMAND, text: translate('load environment variables from .env file at [path]'), arguments: { path: { type: ArgumentType.STRING, defaultValue: '.env', exemptFromNormalization: true } } },
            engine.objectBlock({ opcode: 'parseEnvFile', blockType: BlockType.REPORTER, text: translate('parse .env file [path]'), arguments: { path: { type: ArgumentType.STRING, defaultValue: '.env', exemptFromNormalization: true } } }),
          ]),

          ...this._makeFolder('Import Export', [
            { opcode: 'uploadFile', blockType: BlockType.COMMAND, text: translate('upload file with extension [ext]'), arguments: { ext: { type: ArgumentType.STRING, defaultValue: 'txt', exemptFromNormalization: true } } },
            { opcode: 'uploadSuccessful', blockType: BlockType.BOOLEAN, text: translate('upload successful?') },
            { opcode: 'askForFile', blockType: BlockType.REPORTER, text: translate('ask for file with extension [ext]'), arguments: { ext: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } },
            { opcode: 'gotFileSuccessfully', blockType: BlockType.BOOLEAN, text: translate('got file successfully?') },
            { opcode: 'lastUploadedFileProperty', blockType: BlockType.REPORTER, text: translate('[thing] of last uploaded file'), arguments: { thing: { type: ArgumentType.STRING, menu: 'lastUploadedFileProperties', defaultValue: 'content', exemptFromNormalization: true } } },
            { opcode: 'downloadContent', blockType: BlockType.COMMAND, text: translate('download content [content] as [nameandext]'), arguments: { content: { type: ArgumentType.STRING, defaultValue: 'Hello World', exemptFromNormalization: true }, nameandext: { type: ArgumentType.STRING, defaultValue: 'example.txt', exemptFromNormalization: true } } },
            { opcode: 'downloadSuccessful', blockType: BlockType.BOOLEAN, text: translate('download successful?') },
            { opcode: 'pickFolder', blockType: BlockType.COMMAND, text: translate('pick folder') },
            { opcode: 'lastPickedFolderDirectory', blockType: BlockType.REPORTER, text: translate('directory of last folder picked') },
          ]),
        ],
        menus: {
          contentType: { acceptReporters: true, items: [
            { text: translate('files'), value: 'files' },
            { text: translate('media'), value: 'media' },
            { text: translate('audio'), value: 'audio' },
            { text: translate('midi'), value: 'midi' },
            { text: translate('images'), value: 'images' },
            { text: translate('videos'), value: 'videos' },
            { text: translate('context files'), value: 'context files' },
            { text: translate('code files'), value: 'code files' }
          ] },
          contentTypePoint: { acceptReporters: true, items: [
            { text: translate('file'), value: 'file' },
            { text: translate('folder'), value: 'folder' },
            { text: translate('media'), value: 'media' },
            { text: translate('audio'), value: 'audio' },
            { text: translate('image'), value: 'image' },
            { text: translate('video'), value: 'video' },
            { text: translate('music'), value: 'music' }
          ] },
          extensionType: { acceptReporters: true, items: [
            { text: translate('with extension'), value: 'with extension' },
            { text: translate('without extension'), value: 'without extension' }
          ] },
          sizeFormat: { acceptReporters: true, items: ['B','KB','MB','GB','TB','PB','EB','ZB','YB'] },
          sizePureType: { acceptReporters: true, items: [
            { text: translate('pure'), value: 'pure' },
            { text: translate('formatted'), value: 'formatted' }
          ] },
          storageDevicesMenu: { acceptReporters: true, items: 'getStorageDevicesMenuArray' },
          storageLabelMode: { acceptReporters: true, items: [
            { text: translate('labels'), value: 'labels' },
            { text: translate('names'), value: 'names' }
          ] },
          devicePropertyMenu: { acceptReporters: true, items: [
            { text: translate('accessible'), value: 'accessible' },
            { text: translate('removable'), value: 'removable' },
            { text: translate('mounted'), value: 'mounted' }
          ] },
          deviceDirectoryWhich: { acceptReporters: true, items: [
            { text: translate('main'), value: 'main' },
            { text: translate('accessible'), value: 'accessible' }
          ] },
          storageTypeMenu: { acceptReporters: true, items: [
            { text: translate('total'), value: 'total' },
            { text: translate('free'), value: 'free' }
          ] },
          directoryBookmarks: { acceptReporters: true, items: [
            { text: translate('current executable'), value: 'current executable' },
            { text: translate('root'), value: 'root' },
            { text: translate('user'), value: 'user' },
            { text: translate('appdata'), value: 'appdata' },
            { text: translate('localdata'), value: 'localdata' },
            { text: translate('download'), value: 'download' },
            { text: translate('documents'), value: 'documents' },
            { text: translate('desktop'), value: 'desktop' },
            { text: translate('music'), value: 'music' },
            { text: translate('video'), value: 'video' },
            { text: translate('picture'), value: 'picture' }
          ] },
          readableFormats: { acceptReporters: true, items: [
            { text: translate('text'), value: 'text' },
            { text: translate('dataurl'), value: 'dataurl' },
            { text: translate('base64'), value: 'base64' }
          ] },
          validityOptions: { acceptReporters: true, items: [
            { text: translate('valid'), value: 'valid' },
            { text: translate('any'), value: 'any' }
          ] },
          lastUploadedFileProperties: { acceptReporters: true, items: [
            { text: translate('content'), value: 'content' },
            { text: translate('name'), value: 'name' },
            { text: translate('unextended name'), value: 'unextended name' },
            { text: translate('directory'), value: 'directory' },
            { text: translate('size'), value: 'size' },
            { text: translate('formatted size'), value: 'formatted size' },
            { text: translate('extension'), value: 'extension' }
          ] },
          fileModes: { acceptReporters: true, items: ['r','w','a','r+','w+','a+'] },
          osInfoMenu: { acceptReporters: true, items: [
            { text: translate('distro'), value: 'distro' },
            { text: translate('type'), value: 'type' },
            { text: translate('platform'), value: 'platform' },
            { text: translate('desktop environment'), value: 'desktopEnvironment' }
          ] },
          memoryTypeMenu: { acceptReporters: true, items: [
            { text: translate('total'), value: 'total' },
            { text: translate('free'), value: 'free' },
            { text: translate('used'), value: 'used' }
          ] },
          writeAppendMenu: { acceptReporters: true, items: [
            { text: translate('write'), value: 'write' },
            { text: translate('append'), value: 'append' }
          ] },
          moveCopyRenameMenu: { acceptReporters: true, items: [
            { text: translate('move'), value: 'move' },
            { text: translate('copy'), value: 'copy' },
            { text: translate('rename'), value: 'rename' }
          ] },
          connectionTargetMenu: { acceptReporters: true, items: [
            { text: translate('internet'), value: 'internet' },
            { text: translate('router'), value: 'router' }
          ] },
          vmWineMenu: { acceptReporters: true, items: [
            { text: translate('wine'), value: 'wine' },
            { text: translate('vm'), value: 'vm' }
          ] },
          nameTypeMenu: { acceptReporters: true, items: [
            { text: translate('user'), value: 'user' },
            { text: translate('computer'), value: 'computer' }
          ] },
          uptimeUnitMenu: { acceptReporters: true, items: [
            { text: translate('seconds'), value: 'seconds' },
            { text: translate('minutes'), value: 'minutes' },
            { text: translate('hours'), value: 'hours' },
            { text: translate('days'), value: 'days' },
            { text: translate('weeks'), value: 'weeks' },
            { text: translate('months'), value: 'months' },
            { text: translate('years'), value: 'years' }
          ] }
        }
      };
    }
  }

  Scratch.extensions.register(new NodeDataExtension());
})(Scratch);