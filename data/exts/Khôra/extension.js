// Name: Khôra
// ID: DragoKhora
// Description: Vanilla-ish Threejs Extension with equivalents for everything scratch. simple to learn, then simpler to use.
// By Drago Cuven <https://github.com/Drago-Cuven>

(async function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) throw new Error('Khôra must be run unsandboxed.');

  const { Cast, BlockType, ArgumentType, vm, translate } = Scratch;
  const runtime = vm.runtime;
  const renderer = Scratch.renderer;

  const ext = {
    id: 'DragoKhora',
    name: 'Khôra',
    colors: ['#0000FF', '#0033AA', '#2A004F'],
    icon: '',
    hasArray: true,
    hasObject: true,
    hasVector: true,
    '3D': {
      three: 'https://cdn.jsdelivr.net/npm/three@0.182.0/build/three.module.js',
      orbit: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/controls/OrbitControls.js',
      octree: 'https://esm.sh/three@0.182.0/addons/math/Octree.js',
      model: {
        gltf: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/GLTFLoader.js',
        obj: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/OBJLoader.js',
        mtl: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/MTLLoader.js',
        fbx: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/FBXLoader.js'
      },
      texture: {
        rgbe: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/RGBELoader.js',
        exr: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/EXRLoader.js',
        dds: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/DDSLoader.js',
        tga: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/TGALoader.js',
        tiff: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/TIFFLoader.js',
        ktx: 'https://cdn.jsdelivr.net/npm/three@0.182.0/addons/loaders/KTXLoader.js'
      },
      decoder: {
        psd: 'https://cdn.jsdelivr.net/npm/ag-psd/dist/bundle.js'
      }
    }
  };

  const engine = {
    name: 'Scratch',
    Array: { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false },
    Object: { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false },
    Vector: { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, C: 2, hasCast: false }
  };

  const getType = (c, f) => (typeof c != 'undefined' && c != null ? c : f);

  engine.get = function() {
    const setVector = (bs, as) => {
      engine.Vector = {
        BT: getType(BlockType.VECTOR, BlockType.REPORTER),
        AT: getType(ArgumentType.VECTOR, ArgumentType.STRING),
        C: 2,
        hasCast: !!Cast.toVector
      };
      if (bs != undefined) engine.Vector.BS = bs;
      if (as != undefined) engine.Vector.AS = as;
    };

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
      engine.Vector = {
        BT: BlockType.REPORTER, AT: 'Vector', BS: 4, AS: 4, C: 2,
        forceOutputType: 'Vector', check: ['Vector'],
        hasCast: !!Cast.toVector
      };

      if (ext.hasArray && !vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray');
      if (ext.hasObject) {
        if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray');
        if (!vm.dogeiscutObject) vm.extensionManager.loadExtensionURL('https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js');
      }
      if (ext.hasVector && !vm.jwVector) vm.extensionManager.loadExtensionIdSync('jwVector');
      return;
    }

    const platformName = vm.runtime?.platform?.name;

    if (platformName == "TurboWarp" || platformName == "Mistwarp") {
      engine.name = platformName == "TurboWarp" ? 'Turbowarp' : 'Mistwarp';
      engine.Array = { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false };
      engine.Object = { BT: BlockType.REPORTER, AT: ArgumentType.STRING, BS: 3, AS: 3, hasCast: false };
      setVector(3, 3);
      return;
    }

    if (platformName == "Unsandboxed") {
      engine.name = 'Unsandboxed';
      engine.Array = { BT: getType(BlockType.ARRAY, 'ARRAY'), AT: getType(ArgumentType.ARRAY, 'ARRAY'), hasCast: !!Cast.toArray };
      engine.Object = { BT: getType(BlockType.OBJECT, 'OBJECT'), AT: getType(ArgumentType.OBJECT, 'OBJECT'), hasCast: !!Cast.toObject };
      engine.Vector = { BT: getType(BlockType.VECTOR, BlockType.REPORTER), AT: getType(ArgumentType.VECTOR, ArgumentType.STRING), C: 2, hasCast: !!Cast.toVector };
      return;
    }

    if (platformName == "NitroBolt") {
      engine.name = 'Nitrobolt';
      engine.Array = { BT: getType(BlockType.ARRAY, 'ARRAY'), AT: getType(ArgumentType.ARRAY, 'ARRAY'), hasCast: !!Cast.toArray };
      engine.Object = { BT: getType(BlockType.OBJECT, 'OBJECT'), AT: getType(ArgumentType.OBJECT, 'OBJECT'), hasCast: !!Cast.toObject };
      engine.Vector = {
        BT: getType(BlockType.ARRAY, 'ARRAY'),
        AT: getType(ArgumentType.ARRAY, 'ARRAY'),
        C: 2,
        hasCast: !!Cast.toVector
      };
      if (engine.Vector.BS == undefined) engine.Vector.BS = 3;
      if (engine.Vector.AS == undefined) engine.Vector.AS = 3;
      return;
    }

    engine.name = platformName || 'Scratch';
    engine.Array = { BT: getType(BlockType.ARRAY, BlockType.REPORTER), AT: getType(ArgumentType.ARRAY, ArgumentType.STRING), BS: 3, AS: 3, hasCast: !!Cast.toArray };
    engine.Object = { BT: getType(BlockType.OBJECT, BlockType.REPORTER), AT: getType(ArgumentType.OBJECT, ArgumentType.STRING), BS: 3, AS: 3, hasCast: !!Cast.toObject };
    setVector(3, 3);
  };

  engine.get();

  engine.canHandleArray = () => engine.Array.hasCast || engine.Array.BT != BlockType.REPORTER || (engine.name == 'Penguinmod' && vm.jwArray);
  engine.canHandleObject = () => engine.Object.hasCast || engine.Object.BT != BlockType.REPORTER || (engine.name == 'Penguinmod' && vm.dogeiscutObject);
  engine.canHandleVector = () => engine.Vector.hasCast || engine.Vector.BT != BlockType.REPORTER || (engine.name == 'Penguinmod' && vm.jwVector);

  engine.readArray = function(value, strict = true) {
    if (value == null) return [];
    if (Array.isArray(value)) return value;
    if (engine.name == 'Penguinmod' && vm.jwArray && value instanceof vm.jwArray.Type) {
      return value.array || [];
    }
    if (typeof value == 'string') {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed;
        if (strict) return [parsed];
        return parsed;
      } catch(e) {
        const parts = value.split(',').map(s => s.trim());
        if (parts.length > 1) {
          return parts.map(token => {
            const num = Number(token);
            return (token !== '' && !isNaN(num)) ? num : token;
          });
        } else if (parts.length == 1) {
          const token = parts[0];
          const num = Number(token);
          if (token !== '' && !isNaN(num)) return [num];
          return [token];
        } else {
          return [];
        }
      }
    }
    if (value && typeof value == 'object' && Symbol.iterator in value) {
      return Array.from(value);
    }
    if (strict) return [value];
    return value;
  };

  engine.writeArray = function(value) {
    if (engine.Array.hasCast && typeof Cast.toArray == 'function') {
      return Cast.toArray(value);
    }
    if (engine.name == 'Penguinmod' && vm.jwArray) {
      return new vm.jwArray.Type(value);
    }
    if (engine.canHandleArray() && engine.Array.BT != BlockType.REPORTER) {
      return value;
    }
    return JSON.stringify(value);
  };

  engine.readObject = function(value, strict = true) {
    if (value == null) return {};
    if (value && typeof value == 'object' && !Array.isArray(value)) return value;
    if (engine.name == 'Penguinmod' && vm.dogeiscutObject && value instanceof vm.dogeiscutObject.Type) {
      return value.object || value;
    }
    if (typeof value == 'string') {
      try {
        const parsed = JSON.parse(value);
        if (parsed && typeof parsed == 'object' && !Array.isArray(parsed)) return parsed;
        if (strict) return { value: parsed };
        return parsed;
      } catch(e) {
        if (strict) return { value: value };
        return value;
      }
    }
    if (strict) return { value: value };
    return value;
  };

  engine.writeObject = function(value) {
    if (engine.Object.hasCast && typeof Cast.toObject == 'function') {
      return Cast.toObject(value);
    }
    if (engine.name == 'Penguinmod' && vm.dogeiscutObject) {
      return new vm.dogeiscutObject.Type(value);
    }
    if (engine.canHandleObject() && engine.Object.BT != BlockType.REPORTER) {
      return value;
    }
    return JSON.stringify(value);
  };

  engine.readVector = function(value, strict = true) {
    const toArray = (v) => {
      if (Array.isArray(v) && v.length >= 2) return [Number(v[0]) || 0, Number(v[1]) || 0];
      if (v && typeof v == 'object') {
        if (engine.name == 'Penguinmod' && vm.jwVector && v instanceof vm.jwVector.Type) {
          return [v.x || 0, v.y || 0];
        }
        return [Number(v[0] ?? v.x ?? 0), Number(v[1] ?? v.y ?? 0)];
      }
      if (typeof v == 'string') {
        const parts = v.split(',').map(Number);
        if (parts.length == 2 && !parts.some(isNaN)) return parts;
      }
      return [0, 0];
    };
    let arr = toArray(value);
    if (arr.length < 2) arr = [0, 0];
    return arr;
  };

  engine.writeVector = function(value) {
    let arr;
    if (Array.isArray(value) && value.length >= 2) {
      arr = [Number(value[0]) || 0, Number(value[1]) || 0];
    } else if (value && typeof value == 'object') {
      arr = [Number(value[0] ?? value.x ?? 0), Number(value[1] ?? value.y ?? 0)];
    } else {
      arr = [0, 0];
    }
    if (engine.name == 'Unsandboxed' && vm.runtime && typeof vm.runtime.createBuiltInCustomTypeValue == 'function') {
      return vm.runtime.createBuiltInCustomTypeValue('vector', arr);
    }
    if (engine.Vector.hasCast && typeof Cast.toVector == 'function') {
      return Cast.toVector(arr);
    }
    if (engine.name == 'Penguinmod' && vm.jwVector) {
      return new vm.jwVector.Type(arr[0], arr[1]);
    }
    if (engine.name == 'Nitrobolt') {
      return new Float32Array(arr);
    }
    if (engine.canHandleVector() && engine.Vector.BT != BlockType.REPORTER) {
      return arr;
    }
    return arr.join(',');
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

  engine.vectorBlock = (blockDef, extra = {}) => {
    const newBlock = { ...blockDef };
    let useVector = ext.hasVector && (engine.name == 'Penguinmod' && vm.jwVector || engine.Vector.BT != BlockType.REPORTER || engine.Vector.hasCast);
    if (useVector) {
      newBlock.blockType = engine.Vector.BT;
      if (engine.Vector.BS != undefined) newBlock.blockShape = engine.Vector.BS;
      else delete newBlock.blockShape;
      if (engine.name == 'Penguinmod') newBlock.forceOutputType = 'Vector';
    } else if (ext.hasArray && engine.Array.BT != BlockType.REPORTER) {
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

  engine.vectorInput = (argDef) => {
    const newArg = { ...argDef };
    let usbType = newArg.USBVecType || 'magnitude';
    delete newArg.USBVecType;

    let useVector = ext.hasVector && (engine.name == 'Penguinmod' && vm.jwVector || engine.Vector.BT != BlockType.REPORTER || engine.Vector.hasCast);
    if (useVector) {
      if (engine.name == 'Penguinmod') {
        newArg.type = 'Vector';
        newArg.check = ['Vector'];
        newArg.exemptFromNormalization = true;
        if (engine.Vector.BS != undefined) newArg.shape = engine.Vector.BS;
      } else if (engine.name == 'Unsandboxed') {
        if (usbType == 'point') {
          newArg.type = ArgumentType.POSITION;
        } else {
          newArg.type = ArgumentType.VECTOR;
        }
      } else {
        newArg.type = engine.Vector.AT;
        if (engine.Vector.AS != undefined) newArg.shape = engine.Vector.AS;
      }
    } else if (ext.hasArray && engine.Array.BT != BlockType.REPORTER) {
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
    if (newArg.defaultValue == undefined) newArg.defaultValue = '0,0';
    return newArg;
  };

  const flattenDeep = (arr) => {
    const result = [];
    for (let item of arr) {
      if (Array.isArray(item)) {
        result.push(...flattenDeep(item));
      } else {
        result.push(item);
      }
    }
    return result;
  };

  const modalAPI = {
    _handlePMvsEM: (variableName) => {
      switch (variableName) {
        case "--menu-bar-background":
          return Scratch.extensions.isElectraMod
            ? "var(--menu-bar-background, hsla(244, 23%, 48%, 1))"
            : "var(--menu-bar-background, #009CCC)";
        case "--ui-modal-overlay":
          return Scratch.extensions.isElectraMod
            ? "var(--ui-modal-overlay, hsla(244, 23%, 48%, 0.9))"
            : "var(--ui-modal-overlay, hsla(194, 100%, 65%, 0.9))";
        default:
          break;
      }
    },
    _setupTheme: () => {
      if (typeof scaffolding !== "undefined") {
        modalAPI._menuBarBackground = "#0FBD8C";
        modalAPI._defaultBackgroundColor = "white";
        modalAPI._textColor = "black";
        modalAPI._buttonShadow = "hsla(0, 0%, 0%, 0.15)";
        modalAPI.fade = "#0FBD8CDD";
        modalAPI._shadowBorder = "hsla(0, 100%, 100%, 0.25)";
        return;
      }
      modalAPI._menuBarBackground = Scratch.extensions.isPenguinMod
        ? modalAPI._handlePMvsEM("--menu-bar-background")
        : "var(--menu-bar-background)";
      modalAPI._defaultBackgroundColor = Scratch.extensions.isPenguinMod
        ? document.body.getAttribute("theme") == "dark"
          ? "var(--ui-primary)"
          : "white"
        : "var(--ui-modal-background)";
      modalAPI._textColor = Scratch.extensions.isPenguinMod
        ? document.body.getAttribute("theme") == "dark"
          ? "white"
          : "black"
        : "var(--ui-modal-foreground)";
      modalAPI._buttonShadow = Scratch.extensions.isPenguinMod
        ? "hsla(0, 0%, 0%, 0.15)"
        : "var(--ui-black-transparent)";
      modalAPI.fade = modalAPI._handlePMvsEM("--ui-modal-overlay");
      modalAPI._shadowBorder = Scratch.extensions.isPenguinMod
        ? "hsla(0, 100%, 100%, 0.25)"
        : "var(--ui-white-transparent)";
    },
    openModal: (text) => {
      modalAPI._setupTheme();
      const bgFade = document.createElement("div");
      bgFade.style.width = "100%";
      bgFade.style.height = "100%";
      bgFade.style.position = "absolute";
      bgFade.style.left = "0px";
      bgFade.style.top = "0px";
      bgFade.style.backgroundColor = modalAPI.fade;
      bgFade.style.zIndex = "10001";
      document.body.appendChild(bgFade);

      const shaderManager = document.createElement("div");
      shaderManager.style.backgroundColor = modalAPI._menuBarBackground;
      shaderManager.style.width = "50%";
      shaderManager.style.height = "50%";
      shaderManager.style.position = "relative";
      shaderManager.style.top = "50%";
      shaderManager.style.left = "50%";
      shaderManager.style.borderRadius = "8px";
      shaderManager.style.borderColor = modalAPI._shadowBorder;
      shaderManager.style.borderWidth = "4px";
      shaderManager.style.borderStyle = "solid";
      shaderManager.style.aspectRatio = "5/3";
      shaderManager.style.transform = "translate(-50%,25%)";
      shaderManager.style.zIndex = "10002";
      shaderManager.style.textAlign = "center";
      shaderManager.style.color = "#ffffff";
      document.body.appendChild(shaderManager);

      const topText = document.createElement("div");
      topText.style.width = "100%";
      topText.style.height = "48px";
      topText.style.top = "0px";
      topText.style.left = "0px";
      topText.style.position = "absolute";
      topText.style.transform = "translate(0%,12px)";
      topText.style.fontSize = "24px";
      topText.textContent = text || "modal";
      shaderManager.appendChild(topText);

      const shaderPanel = document.createElement("div");
      shaderPanel.style.backgroundColor = modalAPI._defaultBackgroundColor;
      shaderPanel.style.width = "100%";
      shaderPanel.style.height = "calc(100% - 48px)";
      shaderPanel.style.position = "absolute";
      shaderPanel.style.top = "48px";
      shaderPanel.style.left = "0%";
      shaderPanel.style.borderBottomLeftRadius = "4px";
      shaderPanel.style.borderBottomRightRadius = "4px";
      shaderManager.appendChild(shaderPanel);

      const closeMenu = document.createElement("div");
      closeMenu.style.width = "1.75rem";
      closeMenu.style.height = "1.75rem";
      closeMenu.style.backgroundColor = modalAPI._buttonShadow;
      closeMenu.style.position = "absolute";
      closeMenu.style.left = "calc(100% - 2rem)";
      closeMenu.style.top = "0.25rem";
      closeMenu.style.borderRadius = "50%";
      closeMenu.style.alignItems = "center";
      closeMenu.style.justifyContent = "center";
      closeMenu.style.display = "flex";
      closeMenu.style.cursor = "pointer";
      closeMenu.style.transition = "all 0.15s ease-out";
      closeMenu.style.transform = "translate(-50%,25%)";
      closeMenu.onmouseenter = () => { closeMenu.style.transform = "translate(-50%,25%) scale(1.1,1.1)"; };
      closeMenu.onmouseleave = () => { closeMenu.style.transform = "translate(-50%,25%) scale(1,1)"; };
      closeMenu.onclick = () => {
        document.body.removeChild(bgFade);
        document.body.removeChild(shaderManager);
        if (window._vesselModalCleanup) window._vesselModalCleanup();
      };
      shaderManager.appendChild(closeMenu);

      const xImage = document.createElement("img");
      xImage.src = "data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA3LjQ4IDcuNDgiPjxkZWZzPjxzdHlsZT4uY2xzLTF7ZmlsbDpub25lO3N0cm9rZTojZmZmO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utd2lkdGg6MnB4O308L3N0eWxlPjwvZGVmcz48dGl0bGU+aWNvbi0tYWRkPC90aXRsZT48bGluZSBjbGFzcz0iY2xzLTEiIHgxPSIzLjc0IiB5MT0iNi40OCIgeDI9IjMuNzQiIHkyPSIxIi8+PGxpbmUgY2xhc3M9ImNscy0xIiB4MT0iMSIgeTE9IjMuNzQiIHgyPSI2LjQ4IiB5Mj0iMy43NCIvPjwvc3ZnPg==";
      xImage.style.width = "0.75rem";
      xImage.style.height = "0.75rem";
      xImage.style.margin = "0.25rem";
      xImage.style.transform = "rotate(45deg)";
      closeMenu.appendChild(xImage);

      return {
        shaderPanel: shaderPanel,
        closeFunc: () => {
          document.body.removeChild(bgFade);
          document.body.removeChild(shaderManager);
        },
        resizeFunc: (width, height) => {
          shaderManager.style.aspectRatio = width + "/" + height;
          shaderManager.style.width = width > height ? "auto" : width + "%";
          shaderManager.style.height = height >= width ? "auto" : height + "%";
        },
        nameFunc: (name) => {
          topText.textContent = name;
        },
      };
    }
  };

  let THREE, three, loopId, clock, dummyVector3, dummyEuler, dummyQuaternion;
  let realms = new Map();
  let activeRealm = 'default';
  let activeCamera = 'default';
  let current3DMode = 'on';
  let duplicateAction = 'rename';
  let sculptures = new Map();

  let threeReady = false;
  let isOff = false;
  let drawableId = null;

  let OctreeClass = null;
  let octree = null;

  let horoiMap = new Map(); // id -> { mesh, visible, type, originalAnimaId }

  function getCurrentRealmData() {
    if (isOff) return null;
    if (!realms.has(activeRealm)) {
      const scn = new THREE.Scene();
      scn.background = new THREE.Color(0xffffff);
      realms.set(activeRealm, { scene: scn, animas: new Map(), cameras: new Map(), vessels: new Map() });
      const [w, h] = renderer.getNativeSize();
      const cam = new THREE.PerspectiveCamera(90, w/h, 0.1, 1000);
      cam.position.z = 200;
      scn.add(cam);
      realms.get(activeRealm).cameras.set('default', cam);
      runtime.startHats('khora_realmCreated', { realmName: activeRealm });
    }
    return realms.get(activeRealm);
  }

  class KhoraSkin extends renderer.exports.Skin {
    constructor() {
      super(renderer._nextSkinId++, renderer);
      const gl = renderer.gl;
      this._texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this._texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      this.onNativeSizeChanged();
    }
    getTexture() { return this._texture; }
    updateTexture() {
      const gl = this._renderer.gl;
      gl.bindTexture(gl.TEXTURE_2D, this._texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, three.renderer.domElement);
      this.emitWasAltered();
    }
    updateSize() {
      const [w, h] = this._nativeSize;
      this._size = [w, h];
      three.renderer.setSize(w, h);
      const data = getCurrentRealmData();
      if (data) {
        const cam = data.cameras.get(activeCamera);
        if (cam) {
          const aspect = w / h;
          if (cam.isPerspectiveCamera) {
            cam.aspect = aspect;
          } else {
            cam.top = h / 50;
            cam.bottom = -h / 50;
            cam.right = w / 50;
            cam.left = -w / 50;
          }
          cam.updateProjectionMatrix();
        }
      }
      this.updateTexture();
    }
    onNativeSizeChanged() {
      this._nativeSize = renderer.getNativeSize();
      this._rotationCenter = [this._nativeSize[0] / 2, this._nativeSize[1] / 2];
      this.updateSize();
    }
    get size() { return this._nativeSize; }
    dispose() {
      if (this._texture) {
        this._renderer.gl.deleteTexture(this._texture);
        this._texture = null;
      }
      super.dispose();
    }
  }

  async function setupThree() {
    const THREEmodule = await import(ext['3D'].three);
    THREE = THREEmodule;
    const octreeModule = await import(ext['3D'].octree);
    OctreeClass = octreeModule.Octree;

    let canvas;
    try {
      const [w, h] = renderer.getNativeSize();
      canvas = new OffscreenCanvas(w, h);
    } catch (e) {
      canvas = document.createElement('canvas');
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      preserveDrawingBuffer: true,
      antialias: true,
      alpha: true
    });
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0x000000, 0);

    return renderer;
  }

  function setupSkin() {
    three.skin = new KhoraSkin();
    renderer._allSkins[three.skin.id] = three.skin;
    const id = renderer.createDrawable('pen');
    renderer.updateDrawableSkinId(id, three.skin.id);
    renderer._allDrawables[id].customDrawableName = 'Khôra Layer';
    if (renderer.markDrawableAsNoninteractive) {
      renderer.markDrawableAsNoninteractive(id);
    }
    return id;
  }

  function loop() {
    loopId = requestAnimationFrame(loop);
    if (isOff) return;
    const data = getCurrentRealmData();
    if (!data) return;
    const sceneObj = data.scene;
    const cam = data.cameras.get(activeCamera);
    if (sceneObj && cam) {
      if (octree) octree.update();
      three.renderer.render(sceneObj, cam);
      if (current3DMode !== 'hidden') {
        three.skin.updateTexture();
        renderer.dirty = true;
      }
    }
  }

  async function init() {
    const rendererObj = await setupThree();
    three = {
      renderer: rendererObj,
      skin: null,
    };
    drawableId = setupSkin();

    isOff = false;
    _reinitialize();

    clock = new THREE.Clock();
    dummyVector3 = new THREE.Vector3();
    dummyEuler = new THREE.Euler();
    dummyQuaternion = new THREE.Quaternion();

    runtime.on('STAGE_SIZE_CHANGED', () =>
      requestAnimationFrame(() => three.skin.onNativeSizeChanged())
    );

    loopId = requestAnimationFrame(loop);
    threeReady = true;

    if (typeof window !== 'undefined') {
      window.__khora = { THREE, scene: null, camera: null, renderer: three.renderer };
    }

    octree = new OctreeClass();
  }

  function _resetAll() {
    if (drawableId !== null && renderer._allDrawables[drawableId]) {
      renderer._allDrawables[drawableId].updateVisible(false);
    }
    for (let [key, data] of realms) {
      for (let [id, anima] of data.animas) {
        if (anima.group) anima.group.removeFromParent();
      }
      data.animas.clear();
      for (let [id, cam] of data.cameras) {
        data.scene.remove(cam);
      }
      data.cameras.clear();
      data.vessels.clear();
    }
    realms.clear();
    activeRealm = 'default';
    activeCamera = 'default';
    sculptures.clear();
    horoiMap.clear();
    isOff = true;
  }

  function _reinitialize() {
    if (!threeReady) return;
    const data = getCurrentRealmData();
    if (data) {
      if (drawableId !== null && renderer._allDrawables[drawableId]) {
        renderer._allDrawables[drawableId].updateVisible(true);
      }
      if (data.cameras.has('default')) {
        activeCamera = 'default';
      }
    }
    isOff = false;
  }

  function takeSnapshot(cam, mode) {
    if (!threeReady || !cam) return '';
    const renderer = three.renderer;
    const originalBackground = renderer.getClearColor();
    const originalAlpha = renderer.getClearAlpha();
    const sceneObj = getCurrentRealmData().scene;
    const origBg = sceneObj.background;

    if (mode == 'model') {
      sceneObj.background = null;
      renderer.setClearColor(0x000000, 0);
    } else {
      renderer.setClearColor(0x000000, 1);
    }

    renderer.render(sceneObj, cam);
    const dataURL = renderer.domElement.toDataURL('image/png');

    sceneObj.background = origBg;
    renderer.setClearColor(originalBackground, originalAlpha);
    return dataURL;
  }

  async function loadModel(type, url) {
    let loader;
    let data;
    if (url.startsWith('data:')) {
      const response = await fetch(url);
      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();
      data = arrayBuffer;
    } else {
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();
      data = buffer;
    }

    let extType = type;
    if (type == 'auto') {
      const ext = url.split('.').pop().split('?')[0].toLowerCase();
      const map = { 'glb': 'gltf', 'gltf': 'gltf', 'obj': 'obj', 'mtl': 'mtl', 'fbx': 'fbx' };
      extType = map[ext] || 'obj';
    }

    let loaderModule;
    switch (extType) {
      case 'gltf': {
        const mod = await import(ext['3D'].model.gltf);
        loader = new mod.GLTFLoader();
        break;
      }
      case 'obj': {
        const mod = await import(ext['3D'].model.obj);
        loader = new mod.OBJLoader();
        break;
      }
      case 'mtl': {
        const mod = await import(ext['3D'].model.mtl);
        loader = new mod.MTLLoader();
        break;
      }
      case 'fbx': {
        const mod = await import(ext['3D'].model.fbx);
        loader = new mod.FBXLoader();
        break;
      }
      default: {
        const mod = await import(ext['3D'].model.gltf);
        loader = new mod.GLTFLoader();
      }
    }

    let result;
    if (loader.parse) {
      result = await new Promise((resolve, reject) => {
        loader.parse(data, '', (obj) => resolve(obj), (err) => reject(err));
      });
    } else {
      result = await new Promise((resolve, reject) => {
        loader.load(url, (obj) => resolve(obj), undefined, (err) => reject(err));
      });
    }

    let group;
    if (result.isScene) {
      group = new THREE.Group();
      group.add(result);
    } else {
      group = result;
    }
    return group;
  }

  function getWorldPosition(anima) {
    if (!anima.group || !threeReady) return anima.position.slice();
    const pos = new THREE.Vector3(anima.position[0], anima.position[1], anima.position[2]);
    const pivot = new THREE.Vector3(anima.pivot[0], anima.pivot[1], anima.pivot[2]);
    const quat = new THREE.Quaternion(anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w);
    pivot.applyQuaternion(quat);
    pos.add(pivot);
    return [pos.x, pos.y, pos.z];
  }

  function getCostumeDataURL(target, costumeName) {
    const costumes = target.getCostumes();
    const idx = target.getCostumeIndexByName(costumeName);
    if (idx == -1) return null;
    const costume = costumes[idx];
    return costume.asset.encodeDataURI();
  }

  // Horoi helpers cus too complex without em
  function createHoroiMesh(type, params) {
    let geometry, material;
    const color = 0xff00ff;
    const transparent = true;
    const opacity = 0.3;
    if (type == 'box') {
      const w = params.width || 100;
      const h = params.height || 100;
      const d = params.depth || 100;
      geometry = new THREE.BoxGeometry(w, h, d);
    } else if (type == 'sphere') {
      const r = params.radius || 50;
      geometry = new THREE.SphereGeometry(r, 16, 16);
    } else if (type == 'mesh') {
      // Use model geometry (like pixel perfect stuff XD)
      geometry = params.geometry;
    } else {
      geometry = new THREE.BoxGeometry(100, 100, 100);
    }
    material = new THREE.MeshBasicMaterial({
      color: color,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
      emissive: color,
      emissiveIntensity: 0.5
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false; // hiding hitboxes... i mean Horoi
    return mesh;
  }

  function updateHoroiVisibility(id, visible) {
    const horos = horoiMap.get(id);
    if (!horos) return;
    horos.visible = visible;
    if (horos.mesh) horos.mesh.visible = visible;
  }

  function showAllHoroi(show) {
    for (let [id, horos] of horoiMap) {
      horos.visible = show;
      if (horos.mesh) horos.mesh.visible = show;
    }
  }

  class Khora {
    constructor() {
      this.foldersState = {};
      this._folderStack = [];
      this._deltaTime = 0;
      this._previousTime = 0;

      this._broadcastListeners = new Map();
      this._echoStartListeners = [];

      vm.runtime.on("BEFORE_EXECUTE", () => {
        const now = performance.now();
        if (this._previousTime == 0) {
          this._deltaTime = 1 / vm.runtime.frameLoop.framerate;
        } else {
          this._deltaTime = (now - this._previousTime) / 1000;
        }
        this._previousTime = now;
      });

      try {
        vm.runtime.on("AFTER_EXECUTE", () => {});
      } catch(e) {}
    }

    _toggleFolder(path) {
      this.foldersState[path] = !this.foldersState[path];
      this._reloadBlocks();
    }

    isDirOpen(path) {
      if (!path) return false;
      const parts = path.split('᯽');
      for (let i = 0; i < parts.length; i++) {
        const ancestor = parts.slice(0, i + 1).join('᯽');
        if (!this.foldersState[ancestor]) return false;
      }
      return true;
    }

    _hideFolderTree(folderResult, hide) {
      if (!hide) return folderResult;
      const result = [];
      for (let item of folderResult) {
        if (Array.isArray(item) && item.__isFolder) {
          result.push(this._hideFolderTree(item, true));
        } else if (item && typeof item == 'object' && (item.opcode || item.blockType == BlockType.LABEL)) {
          result.push({ ...item, hideFromPalette: true });
        } else {
          result.push(item);
        }
      }
      result.__isFolder = true;
      return result;
    }

    _makeFolder(folderName, blocks, extraProps = {}) {
      this._folderStack.push(folderName);
      const fullPath = this._folderStack.join('᯽');

      const isOpen = this.isDirOpen(fullPath);
      const toggleOpcode = 'toggleFolder_' + fullPath.replaceAll('᯽', '_');
      if (!this[toggleOpcode]) {
        this[toggleOpcode] = () => this._toggleFolder(fullPath);
      }

      let blockList = [];
      if (Array.isArray(blocks)) {
        blockList = blocks;
      } else if (blocks && typeof blocks == 'object') {
        blockList = [blocks];
      }

      const result = [
        {
          opcode: toggleOpcode,
          blockType: BlockType.BUTTON,
          text: folderName + ' ' + (isOpen ? '▼' : '▶'),
          func: toggleOpcode,
          hideFromPalette: false
        },
        {
          blockType: BlockType.LABEL,
          text: folderName,
          hideFromPalette: !isOpen
        }
      ];

      for (let item of blockList) {
        if (Array.isArray(item) && item.__isFolder) {
          if (!isOpen) {
            result.push(this._hideFolderTree(item, true));
          } else {
            result.push(item);
          }
          continue;
        }

        if (Array.isArray(item)) {
          for (let subItem of item) {
            if (subItem && typeof subItem == 'object' && subItem.opcode) {
              const merged = { ...subItem, ...extraProps };
              if (!isOpen) merged.hideFromPalette = true;
              result.push(merged);
            } else {
              result.push(subItem);
            }
          }
          continue;
        }

        if (item && typeof item == 'object' && item.opcode) {
          const merged = { ...item, ...extraProps };
          if (!isOpen) merged.hideFromPalette = true;
          result.push(merged);
        } else {
          result.push(item);
        }
      }

      result.__isFolder = true;
      this._folderStack.pop();
      return result;
    }

    _reloadBlocks() {
      vm.extensionManager.refreshBlocks(ext.id);
      runtime.emit('EXTENSION_REFRESH_BLOCKS', ext.id);
    }

    _getRealmData(realmId) {
      if (isOff) return null;
      if (!realms.has(realmId)) {
        const scn = new THREE.Scene();
        scn.background = new THREE.Color(0xffffff);
        const animas = new Map();
        const cameras = new Map();
        const vessels = new Map();
        realms.set(realmId, { scene: scn, animas: animas, cameras: cameras, vessels: vessels });
        runtime.startHats('khora_realmCreated', { realmName: realmId });
      }
      return realms.get(realmId);
    }

    _getCurrentRealmData() {
      if (isOff) return null;
      return this._getRealmData(activeRealm);
    }

    _createVesselObject(vessel) {
      if (!threeReady) return null;
      let obj;
      if (vessel.type === 'portrait') {
        const texture = new THREE.CanvasTexture(vessel.imageCanvas || vessel.imageDataURL);
        texture.colorSpace = THREE.SRGBColorSpace;
        const width = vessel.width || 100;
        const height = vessel.height || 100;
        const layers = Math.max(1, Math.round((vessel.scaleZ || 1) * 2));
        const group = new THREE.Group();
        const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.01 });
        for (let i = 0; i < layers; i++) {
          const sprite = new THREE.Sprite(mat.clone());
          const offset = (i / (layers - 1) - 0.5) * (layers > 1 ? 10 : 0);
          sprite.position.z = offset;
          sprite.scale.set(width, height, 1);
          group.add(sprite);
        }
        group.userData.layerCount = layers;
        group.userData.vesselType = 'portrait';
        group.userData.texture = texture;
        group.userData.width = width;
        group.userData.height = height;
        obj = group;
      } else {
        obj = new THREE.Group();
        obj.userData.vesselType = 'sculpture';
      }
      return obj;
    }

    _updateVesselForAnima(anima, realmData) {
      if (!anima.vesselName) {
        const geo = new THREE.PlaneGeometry(100, 100);
        const mat = new THREE.MeshBasicMaterial({ color: getEngineColor(), side: THREE.DoubleSide });
        const mesh = new THREE.Mesh(geo, mat);
        return mesh;
      }
      const vessel = realmData.vessels.get(anima.vesselName);
      if (!vessel) return null;
      return this._createVesselObject(vessel);
    }

    _createThreeAnima(anima, realmId) {
      if (!threeReady || isOff) return;
      const data = this._getRealmData(realmId);
      if (!data) return;
      const sceneObj = data.scene;
      const group = new THREE.Group();
      group.position.set(anima.position[0], anima.position[1], anima.position[2]);
      const q = new THREE.Quaternion(anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w);
      group.quaternion.copy(q);
      group.scale.set(anima.scale[0], anima.scale[1], anima.scale[2]);
      group.visible = anima.visible;

      const vesselObj = this._updateVesselForAnima(anima, data);
      if (vesselObj) {
        group.add(vesselObj);
        anima.meshObject = vesselObj;
      } else {
        anima.meshObject = null;
      }

      sceneObj.add(group);
      anima.group = group;

      // If anima has a horos attached, im gonna attach it later via setHoros
    }

    _applyAnimaTransform(anima) {
      if (!anima.group || !threeReady || isOff) return;
      const group = anima.group;
      group.position.set(anima.position[0], anima.position[1], anima.position[2]);
      const q = new THREE.Quaternion(anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w);
      group.quaternion.copy(q);
      group.scale.set(anima.scale[0], anima.scale[1], anima.scale[2]);
      group.visible = anima.visible;
      if (anima.meshObject) {
        anima.meshObject.position.set(anima.pivot[0], anima.pivot[1], anima.pivot[2]);
      }
      // Update attached horos
      if (anima.attachedHoros) {
        const horos = horoiMap.get(anima.attachedHoros);
        if (horos && horos.mesh) {
          horos.mesh.position.copy(group.position);
          horos.mesh.quaternion.copy(group.quaternion);
          horos.mesh.scale.copy(group.scale);
        }
      }
      // Update portrait layers
      if (anima.vesselType == 'portrait' && anima.group) {
        const groupData = anima.group.userData;
        if (groupData.vesselType == 'portrait') {
          const zScale = anima.scale[2] || 1;
          const layers = Math.max(1, Math.round(zScale * 2));
          if (groupData.layerCount !== layers) {
            const texture = groupData.texture;
            const w = groupData.width || 100;
            const h = groupData.height || 100;
            const newGroup = new THREE.Group();
            const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, alphaTest: 0.01 });
            for (let i = 0; i < layers; i++) {
              const sprite = new THREE.Sprite(mat.clone());
              const offset = (i / (layers - 1) - 0.5) * (layers > 1 ? 10 : 0);
              sprite.position.z = offset;
              sprite.scale.set(w * anima.scale[0], h * anima.scale[1], 1);
              newGroup.add(sprite);
            }
            newGroup.userData.layerCount = layers;
            newGroup.userData.vesselType = 'portrait';
            newGroup.userData.texture = texture;
            newGroup.userData.width = w;
            newGroup.userData.height = h;
            const parent = anima.group.parent;
            parent.remove(anima.group);
            newGroup.position.copy(anima.group.position);
            newGroup.quaternion.copy(anima.group.quaternion);
            newGroup.scale.copy(anima.group.scale);
            parent.add(newGroup);
            anima.group = newGroup;
            anima.meshObject = newGroup;
          } else {
            const sx = anima.scale[0] || 1;
            const sy = anima.scale[1] || 1;
            anima.group.children.forEach(child => {
              if (child.isSprite) {
                child.scale.set(anima.group.userData.width * sx, anima.group.userData.height * sy, 1);
              }
            });
          }
        }
      }
    }

    _rebuildAnima(anima, data) {
      if (anima.group) {
        anima.group.removeFromParent();
        while (anima.group.children.length) {
          anima.group.remove(anima.group.children[0]);
        }
      }
      const newObj = this._updateVesselForAnima(anima, data);
      if (newObj && anima.group) {
        anima.group.add(newObj);
        anima.meshObject = newObj;
      }
    }

    _eulerToQuat(euler, order) {
      if (!threeReady) return { x:0, y:0, z:0, w:1 };
      const e = new THREE.Euler(euler[0]*Math.PI/180, euler[1]*Math.PI/180, euler[2]*Math.PI/180, order || 'XYZ');
      const q = new THREE.Quaternion().setFromEuler(e);
      return { x: q.x, y: q.y, z: q.z, w: q.w };
    }

    _quatToEuler(q, order) {
      if (!threeReady) return [0,0,0];
      const quat = new THREE.Quaternion(q.x, q.y, q.z, q.w);
      const e = new THREE.Euler().setFromQuaternion(quat, order || 'XYZ');
      return [e.x * 180/Math.PI, e.y * 180/Math.PI, e.z * 180/Math.PI];
    }

    _createAnimaWithId(id, name, echoID) {
      const color = getEngineColor();
      const data = this._getCurrentRealmData();
      if (!data) return;
      let vesselName = name + '_portrait';
      if (!data.vessels.has(vesselName)) {
        const target = vm.runtime.getEditingTarget();
        let canvas;
        if (target) {
          const costumes = target.getCostumes();
          if (costumes.length > 0) {
            const costume = costumes[target.currentCostume];
            const url = costume.asset.encodeDataURI();
            const img = new Image();
            img.onload = () => {
              const c = document.createElement('canvas');
              c.width = img.width;
              c.height = img.height;
              const ctx = c.getContext('2d');
              ctx.drawImage(img, 0, 0);
              const vessel = {
                type: 'portrait',
                data: {},
                imageCanvas: c,
                imageDataURL: url,
                width: img.width,
                height: img.height,
                scaleZ: 1
              };
              data.vessels.set(vesselName, vessel);
              for (let [id, anima] of data.animas) {
                if (anima.vesselName == vesselName) {
                  this._rebuildAnima(anima, data);
                }
              }
            };
            img.src = url;
          }
        }
        if (!data.vessels.has(vesselName)) {
          const canvas = document.createElement('canvas');
          canvas.width = 100;
          canvas.height = 100;
          const ctx = canvas.getContext('2d');
          const hex = '#' + color.toString(16).padStart(6, '0');
          ctx.fillStyle = hex;
          ctx.fillRect(0, 0, 100, 100);
          const vessel = {
            type: 'portrait',
            data: {},
            imageCanvas: canvas,
            imageDataURL: canvas.toDataURL('image/png'),
            width: 100,
            height: 100,
            scaleZ: 1
          };
          data.vessels.set(vesselName, vessel);
        }
      }
      const anima = {
        id: id,
        name: name,
        echoID: echoID,
        position: [0, 0, 0],
        quaternion: { x:0, y:0, z:0, w:1 },
        scale: [1, 1, 1],
        pivot: [0, 0, 0],
        visible: true,
        vesselType: 'portrait',
        color: color,
        mesh: null,
        material: null,
        sculpture: null,
        vesselName: vesselName,
        variables: {},
        realm: activeRealm,
        parent: null,
        children: [],
        group: null,
        meshObject: null,
        attachedCamera: null,
        attachedHoros: null, // id of horos attached
        _texture: null,
        _vesselWidth: 100,
        _vesselHeight: 100,
        effects: {
          ghost: 0,
          brightness: 0,
          color: 0,
          red: 0,
          green: 0,
          blue: 0,
          wireframe: 0,
          lightingAffects: false
        }
      };
      data.animas.set(id, anima);
      this._createThreeAnima(anima, activeRealm);
    }

    vesselMenu() {
      const data = this._getCurrentRealmData();
      if (!data) return;
      const modal = modalAPI.openModal('Vessel Menu');
      const panel = modal.shaderPanel;

      const left = document.createElement('div');
      left.style.width = '40%';
      left.style.height = '100%';
      left.style.float = 'left';
      left.style.overflowY = 'auto';
      left.style.backgroundColor = modalAPI._defaultBackgroundColor;
      left.style.color = modalAPI._textColor;
      left.style.padding = '8px';
      panel.appendChild(left);

      const right = document.createElement('div');
      right.style.width = '60%';
      right.style.height = '100%';
      right.style.float = 'right';
      right.style.position = 'relative';
      panel.appendChild(right);

      const list = document.createElement('div');
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.gap = '4px';
      left.appendChild(list);

      function refreshList() {
        list.innerHTML = '';
        for (let [name, vessel] of data.vessels) {
          const item = document.createElement('div');
          item.style.padding = '4px';
          item.style.border = '1px solid #ccc';
          item.style.borderRadius = '4px';
          item.style.cursor = 'pointer';
          item.style.display = 'flex';
          item.style.alignItems = 'center';
          item.style.gap = '8px';
          item.style.backgroundColor = 'rgba(0,0,0,0.05)';
          const thumb = document.createElement('img');
          thumb.style.width = '40px';
          thumb.style.height = '40px';
          thumb.style.objectFit = 'contain';
          if (vessel.imageDataURL) thumb.src = vessel.imageDataURL;
          else thumb.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="40" height="40"%3E%3Crect width="40" height="40" fill="%23ccc"/%3E%3C/svg%3E';
          item.appendChild(thumb);
          const label = document.createElement('span');
          label.textContent = name;
          item.appendChild(label);
          item.onclick = () => {
            if (vessel.imageCanvas) {
              const previewCanvas = document.createElement('canvas');
              previewCanvas.width = 200;
              previewCanvas.height = 200;
              const ctx = previewCanvas.getContext('2d');
              ctx.drawImage(vessel.imageCanvas, 0, 0, 200, 200);
              right.innerHTML = '';
              const imgElem = document.createElement('img');
              imgElem.src = previewCanvas.toDataURL();
              imgElem.style.width = '100%';
              imgElem.style.height = '100%';
              imgElem.style.objectFit = 'contain';
              right.appendChild(imgElem);
            }
          };
          list.appendChild(item);
        }
        const addBtn = document.createElement('div');
        addBtn.textContent = '+ Create Vessel';
        addBtn.style.padding = '8px';
        addBtn.style.backgroundColor = '#4CAF50';
        addBtn.style.color = 'white';
        addBtn.style.borderRadius = '4px';
        addBtn.style.cursor = 'pointer';
        addBtn.style.textAlign = 'center';
        addBtn.onclick = () => {
          const name = prompt('Enter vessel name:');
          if (name) {
            const vessel = {
              type: 'portrait',
              data: {},
              imageCanvas: null,
              imageDataURL: null,
              width: 100,
              height: 100,
              scaleZ: 1
            };
            data.vessels.set(name, vessel);
            refreshList();
          }
        };
        list.appendChild(addBtn);
      }

      refreshList();
      window._vesselModalCleanup = () => {};
    }

    createHoros(args) {
      if (isOff) return;
      const id = Cast.toString(args.ID);
      const type = Cast.toString(args.TYPE);
      const params = engine.readObject(args.PARAMS, true);
      const mesh = createHoroiMesh(type, params);
      if (!mesh) return;
      const horos = { mesh, visible: false, type, params };
      horoiMap.set(id, horos);
      const data = this._getCurrentRealmData();
      if (data) data.scene.add(mesh);
      const animaName = Cast.toString(args.ANIMA);
      if (animaName) {
        const anima = data.animas.get(animaName);
        if (anima) {
          this.attachHoros({ ANIMA: animaName, HOROS: id });
        }
      }
    }

    deleteHoros(args) {
      if (isOff) return;
      const id = Cast.toString(args.ID);
      const horos = horoiMap.get(id);
      if (!horos) return;
      const data = this._getCurrentRealmData();
      if (data) data.scene.remove(horos.mesh);
      for (let [aid, anima] of data.animas) {
        if (anima.attachedHoros == id) {
          anima.attachedHoros = null;
        }
      }
      horoiMap.delete(id);
    }

    attachHoros(args) {
      if (isOff) return;
      const animaName = Cast.toString(args.ANIMA);
      const horosId = Cast.toString(args.HOROS);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(animaName);
      const horos = horoiMap.get(horosId);
      if (!anima || !horos) return;
      if (anima.attachedHoros) {
        const old = horoiMap.get(anima.attachedHoros);
        if (old) old.mesh.visible = false;
      }
      anima.attachedHoros = horosId;
      horos.mesh.position.copy(anima.group.position);
      horos.mesh.quaternion.copy(anima.group.quaternion);
      horos.mesh.scale.copy(anima.group.scale);
      horos.mesh.visible = horos.visible;
    }

    detachHoros(args) {
      if (isOff) return;
      const animaName = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(animaName);
      if (!anima) return;
      if (anima.attachedHoros) {
        const horos = horoiMap.get(anima.attachedHoros);
        if (horos) horos.mesh.visible = false;
        anima.attachedHoros = null;
      }
    }

    showHoros(args) {
      if (isOff) return;
      const target = Cast.toString(args.TARGET);
      if (target == 'all') {
        const show = Cast.toBoolean(args.SHOW);
        showAllHoroi(show);
      } else if (target == 'anima') {
        const animaName = Cast.toString(args.ANIMA);
        const data = this._getCurrentRealmData();
        if (!data) return;
        const anima = data.animas.get(animaName);
        if (!anima || !anima.attachedHoros) return;
        const horos = horoiMap.get(anima.attachedHoros);
        if (horos) {
          horos.visible = Cast.toBoolean(args.SHOW);
          horos.mesh.visible = horos.visible;
        }
      } else {
        const id = Cast.toString(args.TARGET);
        const horos = horoiMap.get(id);
        if (horos) {
          horos.visible = Cast.toBoolean(args.SHOW);
          horos.mesh.visible = horos.visible;
        }
      }
    }

    touchingHoros(args) {
      if (isOff) return false;
      const animaName = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return false;
      const anima = data.animas.get(animaName);
      if (!anima) return false;
      const pos = new THREE.Vector3(anima.position[0], anima.position[1], anima.position[2]);
      for (let [id, horos] of horoiMap) {
        if (!horos.visible) continue;
        const mesh = horos.mesh;
        if (!mesh) continue;
        const sphere = new THREE.Sphere();
        mesh.geometry.computeBoundingSphere();
        sphere.copy(mesh.geometry.boundingSphere);
        sphere.applyMatrix4(mesh.matrixWorld);
        const dist = pos.distanceTo(sphere.center);
        if (dist < sphere.radius + 50) return true;
      }
      return false;
    }

    distanceToHoros(args) {
      if (isOff) return Infinity;
      const animaName = Cast.toString(args.ANIMA);
      const horosId = Cast.toString(args.HOROS);
      const data = this._getCurrentRealmData();
      if (!data) return Infinity;
      const anima = data.animas.get(animaName);
      const horos = horoiMap.get(horosId);
      if (!anima || !horos) return Infinity;
      const pos = new THREE.Vector3(anima.position[0], anima.position[1], anima.position[2]);
      const mesh = horos.mesh;
      if (!mesh) return Infinity;
      const sphere = new THREE.Sphere();
      mesh.geometry.computeBoundingSphere();
      sphere.copy(mesh.geometry.boundingSphere);
      sphere.applyMatrix4(mesh.matrixWorld);
      return pos.distanceTo(sphere.center);
    }

    setEffect(args) {
      if (isOff) return;
      const animaName = Cast.toString(args.ANIMA);
      const effect = Cast.toString(args.EFFECT);
      const value = Cast.toNumber(args.VALUE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(animaName);
      if (!anima) return;
      if (!anima.effects) anima.effects = {};
      anima.effects[effect] = value;
      this._applyEffects(anima);
    }

    _applyEffects(anima) {
      if (!anima.group || !threeReady) return;
   
      const e = anima.effects || {};
      const ghost = e.ghost || 0;
      const brightness = e.brightness || 0;
      const color = e.color || 0;
      const red = e.red || 0;
      const green = e.green || 0;
      const blue = e.blue || 0;
      const wireframe = e.wireframe || 0;
      const lightingAffects = e.lightingAffects || false;

      anima.group.traverse((child) => {
        if (child.isMesh || child.isSprite) {
          if (child.material) {

            if (ghost !== 0) {
              const opacity = 1 - (ghost / 100);
              child.material.transparent = true;
              child.material.opacity = Math.max(0, Math.min(1, opacity));
            } else {
              child.material.opacity = 1;
            }

            if (brightness !== 0) {
              const b = brightness / 100;
              const color = new THREE.Color(b, b, b);
              child.material.emissive = color;
              child.material.emissiveIntensity = Math.abs(b);
            } else {
              child.material.emissive = new THREE.Color(0x000000);
              child.material.emissiveIntensity = 0;
            }
           
            if (color !== 0) {
             
            }
  
            const r = red / 100;
            const g = green / 100;
            const b2 = blue / 100;
            if (r !== 0 || g !== 0 || b2 !== 0) {
              const base = child.material.color;
              base.r = Math.max(0, Math.min(1, base.r + r));
              base.g = Math.max(0, Math.min(1, base.g + g));
              base.b = Math.max(0, Math.min(1, base.b + b2));
            }

            if (wireframe !== 0) {
              child.material.wireframe = true;
      
            } else {
              child.material.wireframe = false;
            }
         
            if (lightingAffects) {
              child.material.needsUpdate = true;
            }
            child.material.needsUpdate = true;
          }
        }
      });
    }

    lightingAffects(args) {
      if (isOff) return false;
      const animaName = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return false;
      const anima = data.animas.get(animaName);
      if (!anima) return false;
      return anima.effects?.lightingAffects || false;
    }

    setLightingAffects(args) {
      if (isOff) return;
      const animaName = Cast.toString(args.ANIMA);
      const val = Cast.toBoolean(args.VALUE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(animaName);
      if (!anima) return;
      if (!anima.effects) anima.effects = {};
      anima.effects.lightingAffects = val;
      this._applyEffects(anima);
    }

    set3DMode(args) {
      const mode = Cast.toString(args.MODE);
      if (mode == 'off') {
        if (current3DMode !== 'off') {
          _resetAll();
        }
        current3DMode = mode;
        if (drawableId !== null && renderer._allDrawables[drawableId]) {
          renderer._allDrawables[drawableId].updateVisible(false);
        }
      } else {
        if (current3DMode == 'off') {
          _reinitialize();
        }
        current3DMode = mode;
        if (drawableId !== null && renderer._allDrawables[drawableId]) {
          renderer._allDrawables[drawableId].updateVisible(mode !== 'hidden');
        }
      }
    }
    mode3D() { return current3DMode; }

    setRealm(args) {
      if (isOff) return;
      const name = Cast.toString(args.REALM);
      this._getRealmData(name);
      activeRealm = name;
    }
    deleteRealm(args) {
      if (isOff) return;
      const name = Cast.toString(args.REALM);
      if (name == 'default') return;
      if (realms.has(name)) {
        const data = realms.get(name);
        for (let [id, anima] of data.animas) {
          if (anima.group) anima.group.removeFromParent();
        }
        data.animas.clear();
        for (let [id, cam] of data.cameras) {
          data.scene.remove(cam);
        }
        data.cameras.clear();
        data.vessels.clear();
        realms.delete(name);
        if (activeRealm == name) activeRealm = 'default';
      }
    }
    currentRealm() { return isOff ? '' : activeRealm; }
    realmData(args) {
      if (isOff) return engine.writeObject({});
      const name = Cast.toString(args.REALM);
      const data = this._getRealmData(name);
      if (!data) return engine.writeObject({});
      return engine.writeObject({ name, animaCount: data.animas.size, cameraCount: data.cameras.size });
    }
    realms() {
      if (isOff) return engine.writeArray([]);
      return engine.writeArray(Array.from(realms.keys()));
    }
    setSkybox(args) {
      if (isOff) return;
      const realmName = Cast.toString(args.REALM);
      const color = args.COLOR;
      const data = this._getRealmData(realmName);
      if (data) {
        data.scene.background = new THREE.Color(color);
      }
    }
    whenRealmCreated() { return true; }

    createAnima(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      if (data.animas.has(name)) {
        switch (duplicateAction) {
          case 'ignore': return;
          case 'overwrite': {
            const old = data.animas.get(name);
            if (old.group) old.group.removeFromParent();
            data.animas.delete(name);
            break;
          }
          case 'rename': {
            let i = 1;
            while (data.animas.has(name + '#' + i)) i++;
            const newName = name + '#' + i;
            this._createAnimaWithId(newName, name, i);
            return;
          }
        }
      }
      this._createAnimaWithId(name, name, 0);
    }
    deleteAnima(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const toDelete = [];
      for (let [id, anima] of data.animas) {
        if (anima.name == name) toDelete.push(id);
      }
      for (let id of toDelete) {
        const anima = data.animas.get(id);
        if (anima.group) anima.group.removeFromParent();
        data.animas.delete(id);
      }
    }
    createEcho(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const origId = name;
      if (!data.animas.has(origId)) {
        this.createAnima({ ANIMA: name });
      }
      let i = 1;
      while (data.animas.has(name + '#' + i)) i++;
      const newId = name + '#' + i;
      const orig = data.animas.get(origId);
      const newAnima = {
        ...orig,
        id: newId,
        name: name,
        echoID: i,
        variables: { ...orig.variables },
        children: [],
        group: null,
        meshObject: null,
        attachedCamera: null,
        attachedHoros: null,
        effects: { ...orig.effects }
      };
      data.animas.set(newId, newAnima);
      this._createThreeAnima(newAnima, activeRealm);
      newAnima.position = [orig.position[0] + 10, orig.position[1] + 10, orig.position[2]];
      this._applyAnimaTransform(newAnima);
      runtime.startHats('khora_echoStart', { animaId: newId });
    }
    deleteEchoes(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const toDelete = [];
      for (let [id, anima] of data.animas) {
        if (anima.name == name && anima.echoID !== 0) toDelete.push(id);
      }
      for (let id of toDelete) {
        const anima = data.animas.get(id);
        if (anima.group) anima.group.removeFromParent();
        data.animas.delete(id);
      }
    }
    echoID(args) {
      if (isOff) return 0;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return 0;
      const anima = data.animas.get(name);
      return anima ? anima.echoID : 0;
    }
    isEcho(args) {
      if (isOff) return false;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return false;
      const anima = data.animas.get(name);
      return anima ? anima.echoID !== 0 : false;
    }
    setAnimaProperty(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const prop = Cast.toString(args.PROPERTY);
      const value = args.VALUE;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      switch (prop) {
        case 'position': {
          const arr = engine.readArray(value, true);
          if (Array.isArray(arr) && arr.length >= 3) anima.position = arr.slice(0,3);
          break;
        }
        case 'rotation': {
          const arr = engine.readArray(value, true);
          if (Array.isArray(arr) && arr.length >= 3) {
            const euler = arr.slice(0,3);
            anima.quaternion = this._eulerToQuat(euler);
          }
          break;
        }
        case 'quaternion': {
          const arr = engine.readArray(value, true);
          if (Array.isArray(arr) && arr.length >= 4) {
            anima.quaternion = { x: arr[0], y: arr[1], z: arr[2], w: arr[3] };
          }
          break;
        }
        case 'scale': {
          const arr = engine.readArray(value, true);
          if (Array.isArray(arr) && arr.length >= 3) anima.scale = arr.slice(0,3);
          break;
        }
        case 'pivot': {
          const arr = engine.readArray(value, true);
          if (Array.isArray(arr) && arr.length >= 3) anima.pivot = arr.slice(0,3);
          break;
        }
        case 'vessel': {
          const vesselName = Cast.toString(value);
          if (data.vessels.has(vesselName)) {
            anima.vesselName = vesselName;
            this._rebuildAnima(anima, data);
          }
          break;
        }
        case 'visible': anima.visible = Cast.toBoolean(value); break;
        default: anima.variables[prop] = value; return;
      }
      this._applyAnimaTransform(anima);
    }
    animaProperty(args) {
      if (isOff) return '';
      const name = Cast.toString(args.ANIMA);
      const prop = Cast.toString(args.PROPERTY);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const anima = data.animas.get(name);
      if (!anima) return '';
      switch (prop) {
        case 'position': return engine.writeArray(anima.position);
        case 'rotation': return engine.writeArray(this._quatToEuler(anima.quaternion));
        case 'quaternion': return engine.writeArray([anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w]);
        case 'scale': return engine.writeArray(anima.scale);
        case 'pivot': return engine.writeArray(anima.pivot);
        case 'vessel': return anima.vesselName || '';
        case 'visible': return anima.visible;
        default: return anima.variables[prop] || '';
      }
    }
    animaData(args) {
      if (isOff) return engine.writeObject({});
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeObject({});
      const anima = data.animas.get(name);
      if (!anima) return engine.writeObject({});
      const info = {
        name: anima.name,
        echoID: anima.echoID,
        position: anima.position,
        rotation: this._quatToEuler(anima.quaternion),
        quaternion: [anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w],
        scale: anima.scale,
        pivot: anima.pivot,
        vessel: anima.vesselName,
        visible: anima.visible,
        variables: anima.variables,
        effects: anima.effects
      };
      return engine.writeObject(info);
    }
    animae() {
      if (isOff) return engine.writeArray([]);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([]);
      return engine.writeArray(Array.from(data.animas.keys()));
    }

    setPosition(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const pos = engine.readArray(args.POSITION, true);
      if (!Array.isArray(pos) || pos.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.position = pos.slice(0,3);
        this._applyAnimaTransform(anima);
      }
    }
    setPositionAxis(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const value = Cast.toNumber(args.VALUE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx == undefined) return;
      anima.position[idx] = value;
      this._applyAnimaTransform(anima);
    }
    changePosition(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const delta = engine.readArray(args.POSITION, true);
      if (!Array.isArray(delta) || delta.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.position[0] += delta[0] || 0;
        anima.position[1] += delta[1] || 0;
        anima.position[2] += delta[2] || 0;
        this._applyAnimaTransform(anima);
      }
    }
    changePositionAxis(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const value = Cast.toNumber(args.VALUE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx == undefined) return;
      anima.position[idx] += value;
      this._applyAnimaTransform(anima);
    }
    position(args) {
      if (isOff) return engine.writeArray([0,0,0]);
      const name = Cast.toString(args.ANIMA);
      const type = Cast.toString(args.POSITION_TYPE);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([0,0,0]);
      const anima = data.animas.get(name);
      if (!anima) return engine.writeArray([0,0,0]);
      if (type == 'world') {
        return engine.writeArray(getWorldPosition(anima));
      }
      return engine.writeArray(anima.position);
    }

    setPivot(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const pos = engine.readArray(args.POSITION, true);
      if (!Array.isArray(pos) || pos.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.pivot = pos.slice(0,3);
        if (anima.meshObject) {
          anima.meshObject.position.set(anima.pivot[0], anima.pivot[1], anima.pivot[2]);
        }
      }
    }
    changePivotAxis(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const value = Cast.toNumber(args.VALUE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx == undefined) return;
      anima.pivot[idx] += value;
      if (anima.meshObject) {
        anima.meshObject.position.set(anima.pivot[0], anima.pivot[1], anima.pivot[2]);
      }
    }
    pivot(args) {
      if (isOff) return engine.writeArray([0,0,0]);
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([0,0,0]);
      const anima = data.animas.get(name);
      return anima ? engine.writeArray(anima.pivot) : engine.writeArray([0,0,0]);
    }

    turnWorld(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const degrees = Cast.toNumber(args.DEGREES);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      if (!threeReady) return;
      let axisVec;
      if (axis == 'X') axisVec = new THREE.Vector3(1,0,0);
      else if (axis == 'Y') axisVec = new THREE.Vector3(0,1,0);
      else if (axis == 'Z') axisVec = new THREE.Vector3(0,0,1);
      else return;
      const angle = degrees * Math.PI / 180;
      const q = new THREE.Quaternion().setFromAxisAngle(axisVec, angle);
      const current = new THREE.Quaternion(anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w);
      q.multiply(current);
      anima.quaternion = { x: q.x, y: q.y, z: q.z, w: q.w };
      this._applyAnimaTransform(anima);
    }
    setWorldAxis(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const degrees = Cast.toNumber(args.DEGREES);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      const euler = this._quatToEuler(anima.quaternion, 'XYZ');
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx == undefined) return;
      euler[idx] = degrees;
      anima.quaternion = this._eulerToQuat(euler, 'XYZ');
      this._applyAnimaTransform(anima);
    }
    getWorldAxis(args) {
      if (isOff) return 0;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const data = this._getCurrentRealmData();
      if (!data) return 0;
      const anima = data.animas.get(name);
      if (!anima) return 0;
      const euler = this._quatToEuler(anima.quaternion, 'XYZ');
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx == undefined) return 0;
      return euler[idx];
    }
    pointWorldDirection(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const x = Cast.toNumber(args.X);
      const y = Cast.toNumber(args.Y);
      const z = Cast.toNumber(args.Z);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima || !threeReady) return;
      const euler = new THREE.Euler(x*Math.PI/180, y*Math.PI/180, z*Math.PI/180, 'XYZ');
      const q = new THREE.Quaternion().setFromEuler(euler);
      anima.quaternion = { x: q.x, y: q.y, z: q.z, w: q.w };
      this._applyAnimaTransform(anima);
    }
    pointGloballyToward(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const target = Cast.toString(args.TARGET);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      const targetAnima = data.animas.get(target);
      if (!anima || !targetAnima || !threeReady) return;
      const pos = new THREE.Vector3(anima.position[0], anima.position[1], anima.position[2]);
      const targetPos = new THREE.Vector3(targetAnima.position[0], targetAnima.position[1], targetAnima.position[2]);
      const dir = new THREE.Vector3().subVectors(targetPos, pos).normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1), dir);
      anima.quaternion = { x: q.x, y: q.y, z: q.z, w: q.w };
      this._applyAnimaTransform(anima);
    }
    glideToOrientation(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const target = Cast.toString(args.TARGET);
      const secs = Cast.toNumber(args.SECS);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      const targetAnima = data.animas.get(target);
      if (!anima || !targetAnima) return;
      anima.quaternion = { ...targetAnima.quaternion };
      this._applyAnimaTransform(anima);
    }
    setOrientationMatch(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const target = Cast.toString(args.TARGET);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      const targetAnima = data.animas.get(target);
      if (!anima || !targetAnima) return;
      anima.quaternion = { ...targetAnima.quaternion };
      this._applyAnimaTransform(anima);
    }
    setQuaternion(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const q = engine.readArray(args.QUATERNION, true);
      if (!Array.isArray(q) || q.length < 4) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.quaternion = { x: q[0], y: q[1], z: q[2], w: q[3] };
        this._applyAnimaTransform(anima);
      }
    }
    rotateByQuaternion(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const q = engine.readArray(args.QUATERNION, true);
      if (!Array.isArray(q) || q.length < 4) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima || !threeReady) return;
      const q1 = new THREE.Quaternion(anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w);
      const q2 = new THREE.Quaternion(q[0], q[1], q[2], q[3]);
      q1.multiply(q2);
      anima.quaternion = { x: q1.x, y: q1.y, z: q1.z, w: q1.w };
      this._applyAnimaTransform(anima);
    }
    quaternion(args) {
      if (isOff) return engine.writeArray([0,0,0,1]);
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([0,0,0,1]);
      const anima = data.animas.get(name);
      return anima ? engine.writeArray([anima.quaternion.x, anima.quaternion.y, anima.quaternion.z, anima.quaternion.w]) : engine.writeArray([0,0,0,1]);
    }

    setVisibility(args) {
      const action = Cast.toString(args.ACTION);
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      if (action == 'show') {
        anima.visible = true;
      } else if (action == 'hide') {
        anima.visible = false;
      } else if (action == 'toggle') {
        anima.visible = !anima.visible;
      }
      if (anima.group) anima.group.visible = anima.visible;
    }
    visible(args) {
      if (isOff) return false;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return false;
      const anima = data.animas.get(name);
      return anima ? anima.visible : false;
    }

    createVessel(args) {
      if (isOff) return;
      const type = Cast.toString(args.TYPE);
      const name = Cast.toString(args.NAME);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const vessel = {
        type: type,
        data: {},
        imageDataURL: null,
        imageCanvas: null,
        width: 100,
        height: 100,
        scaleZ: 1
      };
      if (type == 'portrait') {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        const color = getEngineColor();
        const hex = '#' + color.toString(16).padStart(6, '0');
        ctx.fillStyle = hex;
        ctx.fillRect(0, 0, 100, 100);
        vessel.imageCanvas = canvas;
        vessel.imageDataURL = canvas.toDataURL('image/png');
      }
      data.vessels.set(name, vessel);
    }
    deleteVessel(args) {
      if (isOff) return;
      const name = Cast.toString(args.NAME);
      const data = this._getCurrentRealmData();
      if (!data) return;
      if (data.vessels.has(name)) {
        data.vessels.delete(name);
        for (let [id, anima] of data.animas) {
          if (anima.vesselName == name) {
            this._rebuildAnima(anima, data);
          }
        }
      }
    }
    setPortraitImageDataURL(args) {
      if (isOff) return;
      const vesselName = Cast.toString(args.VESSEL);
      const url = Cast.toString(args.DATAURL);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const vessel = data.vessels.get(vesselName);
      if (!vessel) return;
      if (vessel.type !== 'portrait') {
        vessel.type = 'portrait';
        vessel.data = {};
      }
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        vessel.imageCanvas = canvas;
        vessel.imageDataURL = url;
        vessel.width = img.width;
        vessel.height = img.height;
        for (let [id, anima] of data.animas) {
          if (anima.vesselName == vesselName) {
            this._rebuildAnima(anima, data);
          }
        }
      };
      img.src = url;
    }
    setPortraitImageCostume(args, util) {
      if (isOff) return;
      const vesselName = Cast.toString(args.VESSEL);
      const costume = Cast.toString(args.COSTUME);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const vessel = data.vessels.get(vesselName);
      if (!vessel) return;
      if (vessel.type !== 'portrait') {
        vessel.type = 'portrait';
        vessel.data = {};
      }
      const target = util.target;
      if (!target) return;
      const url = getCostumeDataURL(target, costume);
      if (!url) return;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        vessel.imageCanvas = canvas;
        vessel.imageDataURL = url;
        vessel.width = img.width;
        vessel.height = img.height;
        for (let [id, anima] of data.animas) {
          if (anima.vesselName == vesselName) {
            this._rebuildAnima(anima, data);
          }
        }
      };
      img.src = url;
    }

    setSculpture(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const sculptureName = Cast.toString(args.SCULPTURE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.sculpture = sculptureName;
        if (sculptures.has(sculptureName)) {
          anima.vesselType = 'sculpture';
          this._rebuildAnima(anima, data);
        }
      }
    }
    sculpture(args) {
      if (isOff) return '';
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const anima = data.animas.get(name);
      return anima ? anima.sculpture || '' : '';
    }
    async importSculpture(args) {
      if (isOff) return;
      const type = Cast.toString(args.TYPE);
      const name = Cast.toString(args.NAME);
      const url = Cast.toString(args.URL);
      try {
        const group = await loadModel(type, url);
        sculptures.set(name, group);
        const data = this._getCurrentRealmData();
        if (data) {
          for (let [id, anima] of data.animas) {
            if (anima.sculpture == name) {
              anima.vesselType = 'sculpture';
              this._rebuildAnima(anima, data);
            }
          }
        }
      } catch(e) {
        console.error('Failed to load sculpture:', e);
      }
    }

    setSize(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const size = Cast.toNumber(args.SIZE) / 100;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.scale = [size, size, size];
        this._applyAnimaTransform(anima);
      }
    }
    changeSize(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const amount = Cast.toNumber(args.AMOUNT) / 100;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.scale[0] += amount;
        anima.scale[1] += amount;
        anima.scale[2] += amount;
        this._applyAnimaTransform(anima);
      }
    }
    size(args) {
      if (isOff) return 100;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return 100;
      const anima = data.animas.get(name);
      return anima ? anima.scale[0] * 100 : 100;
    }
    setStretchAxis(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const value = Cast.toNumber(args.VALUE) / 100;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx !== undefined) {
        anima.scale[idx] = value;
        this._applyAnimaTransform(anima);
      }
    }
    setStretch(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const xyz = engine.readArray(args.XYZ, true);
      if (!Array.isArray(xyz) || xyz.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.scale = xyz.slice(0,3).map(v => v / 100);
        this._applyAnimaTransform(anima);
      }
    }
    changeStretchAxis(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const axis = Cast.toString(args.AXIS);
      const value = Cast.toNumber(args.VALUE) / 100;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      const idx = {X:0, Y:1, Z:2}[axis];
      if (idx !== undefined) {
        anima.scale[idx] += value;
        this._applyAnimaTransform(anima);
      }
    }
    changeStretch(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const delta = engine.readArray(args.XYZ, true);
      if (!Array.isArray(delta) || delta.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (anima) {
        anima.scale[0] += delta[0] / 100;
        anima.scale[1] += delta[1] / 100;
        anima.scale[2] += delta[2] / 100;
        this._applyAnimaTransform(anima);
      }
    }
    stretch(args) {
      if (isOff) return engine.writeArray([100,100,100]);
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([100,100,100]);
      const anima = data.animas.get(name);
      return anima ? engine.writeArray(anima.scale.map(v => v * 100)) : engine.writeArray([100,100,100]);
    }

    setEffect(args) { this.setEffect.bind(this)(args); } 

    whenEchoStart() { return true; }
    whenBroadcast() { return true; }
    broadcast(args) {
      if (isOff) return;
      const broadcast = Cast.toString(args.BROADCAST);
      const data = this._getCurrentRealmData();
      if (!data) return;
      for (let [id, anima] of data.animas) {
        runtime.startHats('khora_broadcast', { broadcast: broadcast, animaId: id });
      }
    }

    inRealm(args) {
      if (isOff) return false;
      const name = Cast.toString(args.REALM);
      return activeRealm == name;
    }
    asAnima() { return false; }

    animaExists(args) {
      if (isOff) return false;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return false;
      return data.animas.has(name);
    }
    animaRealm(args) {
      if (isOff) return '';
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const anima = data.animas.get(name);
      return anima ? anima.realm : '';
    }
    animaParent(args) {
      if (isOff) return '';
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const anima = data.animas.get(name);
      return anima ? anima.parent || '' : '';
    }
    animaChildren(args) {
      if (isOff) return engine.writeArray([]);
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([]);
      const anima = data.animas.get(name);
      return anima ? engine.writeArray(anima.children) : engine.writeArray([]);
    }
    animaChildCount(args) {
      if (isOff) return 0;
      const name = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return 0;
      const anima = data.animas.get(name);
      return anima ? anima.children.length : 0;
    }
    distanceTo(args) {
      if (isOff) return 0;
      const name = Cast.toString(args.ANIMA);
      const target = Cast.toString(args.TARGET);
      const data = this._getCurrentRealmData();
      if (!data) return 0;
      const a1 = data.animas.get(name);
      const a2 = data.animas.get(target);
      if (!a1 || !a2) return 0;
      const dx = a1.position[0] - a2.position[0];
      const dy = a1.position[1] - a2.position[1];
      const dz = a1.position[2] - a2.position[2];
      return Math.sqrt(dx*dx + dy*dy + dz*dz);
    }

    touchingHoros(args) { return this.touchingHoros.bind(this)(args); }
    distanceToHoros(args) { return this.distanceToHoros.bind(this)(args); }

    setAnimaVariable(args) {
      if (isOff) return;
      const name = Cast.toString(args.ANIMA);
      const varName = Cast.toString(args.VARIABLE);
      const value = args.VALUE;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const anima = data.animas.get(name);
      if (!anima) return;
      anima.variables[varName] = value;
    }
    animaVariable(args) {
      if (isOff) return '';
      const name = Cast.toString(args.ANIMA);
      const varName = Cast.toString(args.VARIABLE);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const anima = data.animas.get(name);
      if (!anima) return '';
      return anima.variables[varName] || '';
    }

    createCamera(args) {
      if (isOff) return;
      const name = Cast.toString(args.CAMERA);
      const type = Cast.toString(args.TYPE);
      const data = this._getCurrentRealmData();
      if (!data) return;
      let cam;
      if (type == 'perspective') {
        cam = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
      } else {
        cam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 1000);
      }
      cam.position.set(0, 0, 200);
      data.scene.add(cam);
      data.cameras.set(name, cam);
    }
    deleteCamera(args) {
      if (isOff) return;
      const name = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      if (data.cameras.has(name) && name !== 'default') {
        const cam = data.cameras.get(name);
        data.scene.remove(cam);
        data.cameras.delete(name);
        if (activeCamera == name) activeCamera = 'default';
      }
    }
    setActiveCamera(args) {
      if (isOff) return;
      const name = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      if (data.cameras.has(name)) {
        activeCamera = name;
        const cam = data.cameras.get(name);
        const [w, h] = three.skin._nativeSize;
        if (cam.isPerspectiveCamera) {
          cam.aspect = w / h;
        } else {
          cam.top = h / 50;
          cam.bottom = -h / 50;
          cam.right = w / 50;
          cam.left = -w / 50;
        }
        cam.updateProjectionMatrix();
      }
    }
    activeCamera() { return isOff ? '' : activeCamera; }
    snapshot(args) {
      const mode = Cast.toString(args.MODE);
      const camName = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const cam = data.cameras.get(camName);
      if (!cam) return '';
      return takeSnapshot(cam, mode);
    }
    setCameraPosition(args) {
      if (isOff) return;
      const camName = Cast.toString(args.CAMERA);
      const pos = engine.readArray(args.POSITION, true);
      if (!Array.isArray(pos) || pos.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const cam = data.cameras.get(camName);
      if (!cam) return;
      let attachedAnima = null;
      for (let [id, anima] of data.animas) {
        if (anima.attachedCamera == cam) {
          attachedAnima = anima;
          break;
        }
      }
      if (attachedAnima) {
        cam._offset = pos;
        const animaPos = new THREE.Vector3(attachedAnima.position[0], attachedAnima.position[1], attachedAnima.position[2]);
        const offset = new THREE.Vector3(pos[0], pos[1], pos[2]);
        cam.position.copy(animaPos.add(offset));
      } else {
        cam.position.set(pos[0], pos[1], pos[2]);
      }
    }
    changeCameraPosition(args) {
      if (isOff) return;
      const camName = Cast.toString(args.CAMERA);
      const delta = engine.readArray(args.POSITION, true);
      if (!Array.isArray(delta) || delta.length < 3) return;
      const data = this._getCurrentRealmData();
      if (!data) return;
      const cam = data.cameras.get(camName);
      if (!cam) return;
      let attachedAnima = null;
      for (let [id, anima] of data.animas) {
        if (anima.attachedCamera == cam) {
          attachedAnima = anima;
          break;
        }
      }
      if (attachedAnima) {
        if (!cam._offset) cam._offset = [0,0,0];
        cam._offset[0] += delta[0] || 0;
        cam._offset[1] += delta[1] || 0;
        cam._offset[2] += delta[2] || 0;
        const animaPos = new THREE.Vector3(attachedAnima.position[0], attachedAnima.position[1], attachedAnima.position[2]);
        const offset = new THREE.Vector3(cam._offset[0], cam._offset[1], cam._offset[2]);
        cam.position.copy(animaPos.add(offset));
      } else {
        cam.position.x += delta[0] || 0;
        cam.position.y += delta[1] || 0;
        cam.position.z += delta[2] || 0;
      }
    }
    getCameraPosition(args) {
      if (isOff) return engine.writeArray([0,0,0]);
      const camName = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return engine.writeArray([0,0,0]);
      const cam = data.cameras.get(camName);
      if (!cam) return engine.writeArray([0,0,0]);
      return engine.writeArray([cam.position.x, cam.position.y, cam.position.z]);
    }
    attachCamera(args) {
      if (isOff) return;
      const camName = Cast.toString(args.CAMERA);
      const animaName = Cast.toString(args.ANIMA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const cam = data.cameras.get(camName);
      const anima = data.animas.get(animaName);
      if (!cam || !anima) return;
      const offset = new THREE.Vector3().subVectors(cam.position, anima.group.position);
      cam._offset = [offset.x, offset.y, offset.z];
      anima.attachedCamera = cam;
    }
    detachCamera(args) {
      if (isOff) return;
      const camName = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return;
      const cam = data.cameras.get(camName);
      if (!cam) return;
      for (let [id, anima] of data.animas) {
        if (anima.attachedCamera == cam) {
          anima.attachedCamera = null;
          break;
        }
      }
      cam._offset = null;
    }
    attached(args) {
      if (isOff) return false;
      const camName = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return false;
      const cam = data.cameras.get(camName);
      if (!cam) return false;
      for (let [id, anima] of data.animas) {
        if (anima.attachedCamera == cam) return true;
      }
      return false;
    }
    attachedAnima(args) {
      if (isOff) return '';
      const camName = Cast.toString(args.CAMERA);
      const data = this._getCurrentRealmData();
      if (!data) return '';
      const cam = data.cameras.get(camName);
      if (!cam) return '';
      for (let [id, anima] of data.animas) {
        if (anima.attachedCamera == cam) return anima.name;
      }
      return '';
    }

    getInfo() {
      const menus = {
        MODE: { acceptReporters: true, items: ['on', 'off', 'hidden'] },
        AXIS: { acceptReporters: true, items: ['X', 'Y', 'Z'] },
        POSITION_TYPE: { acceptReporters: true, items: ['raw', 'world'] },
        VISIBILITY: { acceptReporters: true, items: ['show', 'hide', 'toggle'] },
        MESH_TYPE: { acceptReporters: true, items: ['auto', 'gltf', 'obj', 'fbx', 'mtl'] },
        STATE: { acceptReporters: true, items: ['on', 'off', 'toggle'] },
        broadcastMenu: { acceptReporters: true, items: ['message1', 'message2', 'message3'] },
        VESSEL_TYPE: { acceptReporters: true, items: ['portrait', 'sculpture'] },
        CAMERATYPE: { acceptReporters: true, items: ['perspective', 'orthographic'] },
        EFFECTS: { acceptReporters: true, items: ['ghost', 'brightness', 'color', 'red', 'green', 'blue', 'wireframe'] },
        HOROS_TYPE: { acceptReporters: true, items: ['box', 'sphere', 'mesh'] },
        HOROS_TARGET: { acceptReporters: true, items: ['all', 'anima', 'horos'] }
      };

      const blocks = flattenDeep([
        {
          blockType: BlockType.BUTTON,
          text: 'Vessel Menu',
          func: 'vesselMenu'
        },
        '---',
        ...this._makeFolder("3D", [
          { opcode: "set3DMode", blockType: BlockType.COMMAND, text: translate('set 3D mode [MODE]'), arguments: { MODE: { type: ArgumentType.STRING, menu: 'MODE', defaultValue: 'on', exemptFromNormalization: true } } },
          { opcode: "mode3D", blockType: BlockType.REPORTER, text: translate('3D mode') },
          this._makeFolder("Realms", [
            { opcode: "whenRealmCreated", blockType: BlockType.EVENT, text: translate('when realm [REALM] is created'), arguments: { REALM: { type: ArgumentType.STRING, defaultValue: 'default', exemptFromNormalization: true } }, isEdgeActivated: false },
            { opcode: "setRealm", blockType: BlockType.COMMAND, text: translate('set realm [REALM]'), arguments: { REALM: { type: ArgumentType.STRING, defaultValue: 'default', exemptFromNormalization: true } } },
            { opcode: "deleteRealm", blockType: BlockType.COMMAND, text: translate('delete realm [REALM]'), arguments: { REALM: { type: ArgumentType.STRING, defaultValue: 'default', exemptFromNormalization: true } } },
            { opcode: "currentRealm", blockType: BlockType.REPORTER, text: translate('current realm') },
            { opcode: "setSkybox", blockType: BlockType.COMMAND, text: translate('set skybox of realm [REALM] to color [COLOR]'), arguments: { REALM: { type: ArgumentType.STRING, defaultValue: 'default', exemptFromNormalization: true }, COLOR: { type: ArgumentType.COLOR, defaultValue: '#ffffff', exemptFromNormalization: true } } },
            engine.objectBlock({ opcode: "realmData", text: translate('realm [REALM] data'), arguments: { REALM: { type: ArgumentType.STRING, defaultValue: 'default', exemptFromNormalization: true } } }),
            engine.arrayBlock({ opcode: "realms", text: translate('realms') })
          ], { color1: '#0000FF', color2: '#0033AA', color3: '#0000FF' })
        ], { color1: '#0000FF', color2: '#0033AA', color3: '#0000FF' }),
        ...this._makeFolder("Animae", [
          { opcode: "createAnima", blockType: BlockType.COMMAND, text: translate('create anima [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "deleteAnima", blockType: BlockType.COMMAND, text: translate('delete anima [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "createEcho", blockType: BlockType.COMMAND, text: translate('create echo of [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "deleteEchoes", blockType: BlockType.COMMAND, text: translate('delete echoes of [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "echoID", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] echo ID'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "isEcho", blockType: BlockType.BOOLEAN, text: translate('anima [ANIMA] is echo?'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "setAnimaProperty", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] [PROPERTY] to [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, PROPERTY: { type: ArgumentType.STRING, defaultValue: 'position', exemptFromNormalization: true }, VALUE: { type: ArgumentType.STRING, defaultValue: '0,0,0', exemptFromNormalization: true } } },
          { opcode: "animaProperty", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] [PROPERTY]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, PROPERTY: { type: ArgumentType.STRING, defaultValue: 'position', exemptFromNormalization: true } } },
          engine.objectBlock({ opcode: "animaData", text: translate('anima [ANIMA] data'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } }),
          engine.arrayBlock({ opcode: "animae", text: translate('animae') }),
          { blockType: BlockType.LABEL, text: '_____' }
        ], { color1: '#0000FF', color2: '#0033AA', color3: '#0000FF' }),
        ...this._makeFolder("Motion 3D", [
          { opcode: "setPosition", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] position to [POSITION]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, POSITION: { type: ArgumentType.STRING, defaultValue: '0,0,0', exemptFromNormalization: true } } },
          { opcode: "setPositionAxis", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] [AXIS] position to [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'X', exemptFromNormalization: true }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true } } },
          '---',
          { opcode: "changePosition", blockType: BlockType.COMMAND, text: translate('change anima [ANIMA] position by [POSITION]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, POSITION: { type: ArgumentType.STRING, defaultValue: '0,0,0', exemptFromNormalization: true } } },
          { opcode: "changePositionAxis", blockType: BlockType.COMMAND, text: translate('change anima [ANIMA] [AXIS] position by [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'X', exemptFromNormalization: true }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 10, exemptFromNormalization: true } } },
          '---',
          engine.arrayBlock({ opcode: "position", text: translate('anima [ANIMA] [POSITION_TYPE] position'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, POSITION_TYPE: { type: ArgumentType.STRING, menu: 'POSITION_TYPE', defaultValue: 'world', exemptFromNormalization: true } } }),
          '---',
          this._makeFolder("Pivot", [
            { opcode: "setPivot", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] local pivot to [POSITION]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, POSITION: { type: ArgumentType.STRING, defaultValue: '0,0,0', exemptFromNormalization: true } } },
            { opcode: "changePivotAxis", blockType: BlockType.COMMAND, text: translate('change anima [ANIMA] local pivot [AXIS] by [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'X', exemptFromNormalization: true }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 10, exemptFromNormalization: true } } },
            engine.arrayBlock({ opcode: "pivot", text: translate('anima [ANIMA] local pivot'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } })
          ], { color1: '#4C97FF', color2: '#3373CC', color3: '#0000FF' }),
          this._makeFolder("Euler", [
            { opcode: "turnWorld", blockType: BlockType.COMMAND, text: translate('turn anima [ANIMA] world [AXIS] by [DEGREES] degrees'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'Y', exemptFromNormalization: true }, DEGREES: { type: ArgumentType.NUMBER, defaultValue: 15, exemptFromNormalization: true } } },
            { opcode: "setWorldAxis", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] world [AXIS] to [DEGREES] degrees'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'Y', exemptFromNormalization: true }, DEGREES: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true } } },
            { opcode: "pointWorldDirection", blockType: BlockType.COMMAND, text: translate('point anima [ANIMA] in world direction x: [X] y: [Y] z: [Z]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, X: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true }, Y: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true }, Z: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true } } },
            { opcode: "getWorldAxis", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] world [AXIS] direction'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'Y', exemptFromNormalization: true } } }
          ], { color1: '#4C97FF', color2: '#3373CC', color3: '#0000FF' }),
          this._makeFolder("Quaternion", [
            { opcode: "setQuaternion", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] quaternion to [QUATERNION]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, QUATERNION: { type: ArgumentType.STRING, defaultValue: '0,0,0,1', exemptFromNormalization: true } } },
            { opcode: "rotateByQuaternion", blockType: BlockType.COMMAND, text: translate('rotate anima [ANIMA] by quaternion [QUATERNION]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, QUATERNION: { type: ArgumentType.STRING, defaultValue: '0,0,0,1', exemptFromNormalization: true } } },
            { opcode: "pointGloballyToward", blockType: BlockType.COMMAND, text: translate('point anima [ANIMA] globally toward [TARGET]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, TARGET: { type: ArgumentType.STRING, defaultValue: 'target', exemptFromNormalization: true } } },
            { opcode: "glideToOrientation", blockType: BlockType.COMMAND, text: translate('glide [SECS] secs to world orientation of [TARGET]'), arguments: { SECS: { type: ArgumentType.NUMBER, defaultValue: 1, exemptFromNormalization: true }, TARGET: { type: ArgumentType.STRING, defaultValue: 'target', exemptFromNormalization: true } } },
            { opcode: "setOrientationMatch", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] world orientation to match [TARGET]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, TARGET: { type: ArgumentType.STRING, defaultValue: 'target', exemptFromNormalization: true } } },
            engine.arrayBlock({ opcode: "quaternion", text: translate('anima [ANIMA] quaternion'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } })
          ], { color1: '#4C97FF', color2: '#3373CC', color3: '#0000FF' }),
          { blockType: BlockType.LABEL, text: '_____' }
        ], { color1: '#4C97FF', color2: '#3373CC', color3: '#0000FF' }),
        ...this._makeFolder("Looks 3D", [
          { opcode: "setVisibility", blockType: BlockType.COMMAND, text: translate('[ACTION] anima [ANIMA]'), arguments: { ACTION: { type: ArgumentType.STRING, menu: 'VISIBILITY', defaultValue: 'show', exemptFromNormalization: true }, ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "visible", blockType: BlockType.BOOLEAN, text: translate('anima [ANIMA] visible?'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          this._makeFolder("Vessels", [
            { opcode: "createVessel", blockType: BlockType.COMMAND, text: translate('create new [TYPE] vessel named [NAME]'), arguments: { TYPE: { type: ArgumentType.STRING, menu: 'VESSEL_TYPE', defaultValue: 'portrait', exemptFromNormalization: true }, NAME: { type: ArgumentType.STRING, defaultValue: 'vessel', exemptFromNormalization: true } } },
            { opcode: "deleteVessel", blockType: BlockType.COMMAND, text: translate('delete vessel [NAME]'), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: 'vessel', exemptFromNormalization: true } } },
            { opcode: "setPortraitImageDataURL", blockType: BlockType.COMMAND, text: translate('set portrait image of vessel [VESSEL] to [DATAURL]'), arguments: { VESSEL: { type: ArgumentType.STRING, defaultValue: 'vessel', exemptFromNormalization: true }, DATAURL: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } },
            { opcode: "setPortraitImageCostume", blockType: BlockType.COMMAND, text: translate('set portrait image of vessel [VESSEL] to costume [COSTUME]'), arguments: { VESSEL: { type: ArgumentType.STRING, defaultValue: 'vessel', exemptFromNormalization: true }, COSTUME: { type: ArgumentType.COSTUME, defaultValue: '', exemptFromNormalization: true } } }
          ], { color1: '#9966FF', color2: '#7A4DCC', color3: '#0000FF' }),
          this._makeFolder("Sculpture", [
            { opcode: "setSculpture", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] sculpture to [SCULPTURE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, SCULPTURE: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } },
            { opcode: "sculpture", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] sculpture'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
            { opcode: "importSculpture", blockType: BlockType.COMMAND, text: translate('import sculpture [TYPE] as [NAME] from [URL]'), arguments: { TYPE: { type: ArgumentType.STRING, menu: 'MESH_TYPE', defaultValue: 'auto', exemptFromNormalization: true }, NAME: { type: ArgumentType.STRING, defaultValue: 'sculpture', exemptFromNormalization: true }, URL: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } }
          ], { color1: '#9966FF', color2: '#7A4DCC', color3: '#0000FF' }),
          this._makeFolder("Scale", [
            { opcode: "setSize", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] size to [SIZE] %'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, SIZE: { type: ArgumentType.NUMBER, defaultValue: 100, exemptFromNormalization: true } } },
            { opcode: "changeSize", blockType: BlockType.COMMAND, text: translate('change anima [ANIMA] size by [AMOUNT]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AMOUNT: { type: ArgumentType.NUMBER, defaultValue: 10, exemptFromNormalization: true } } },
            { opcode: "size", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] size'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
            { opcode: "setStretchAxis", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] stretch [AXIS] to [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'X', exemptFromNormalization: true }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 100, exemptFromNormalization: true } } },
            { opcode: "setStretch", blockType: BlockType.COMMAND, text: translate('set anima [ANIMA] stretch to [XYZ]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, XYZ: { type: ArgumentType.STRING, defaultValue: '100,100,100', exemptFromNormalization: true } } },
            { opcode: "changeStretchAxis", blockType: BlockType.COMMAND, text: translate('change anima [ANIMA] stretch [AXIS] by [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, AXIS: { type: ArgumentType.STRING, menu: 'AXIS', defaultValue: 'X', exemptFromNormalization: true }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 10, exemptFromNormalization: true } } },
            { opcode: "changeStretch", blockType: BlockType.COMMAND, text: translate('change anima [ANIMA] stretch by [XYZ]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, XYZ: { type: ArgumentType.STRING, defaultValue: '10,10,10', exemptFromNormalization: true } } },
            engine.arrayBlock({ opcode: "stretch", text: translate('anima [ANIMA] stretch'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } })
          ], { color1: '#9966FF', color2: '#7A4DCC', color3: '#0000FF' }),
          this._makeFolder("Effects", [
            { opcode: "setEffect", blockType: BlockType.COMMAND, text: translate('set [EFFECT] effect of anima [ANIMA] to [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, EFFECT: { type: ArgumentType.STRING, menu: 'EFFECTS', defaultValue: 'ghost', exemptFromNormalization: true }, VALUE: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true } } },
            { opcode: "setLightingAffects", blockType: BlockType.COMMAND, text: translate('lighting affects anima [ANIMA] ? [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, VALUE: { type: ArgumentType.BOOLEAN, defaultValue: false, exemptFromNormalization: true } } },
            { opcode: "lightingAffects", blockType: BlockType.BOOLEAN, text: translate('lighting affects anima [ANIMA]?'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } }
          ], { color1: '#9966FF', color2: '#7A4DCC', color3: '#0000FF' }),
          { blockType: BlockType.LABEL, text: '_____' }
        ], { color1: '#9966FF', color2: '#7A4DCC', color3: '#0000FF' }),
        ...this._makeFolder("Sound 3D", [], { color1: '#CF63CF', color2: '#A64BA6', color3: '#0000FF' }),
        ...this._makeFolder("Events 3D", [], { color1: '#FFBF00', color2: '#CC9900', color3: '#0000FF' }),
        ...this._makeFolder("Control 3D", [
          { opcode: "whenEchoStart", blockType: BlockType.EVENT, text: translate('when I start as echo'), isEdgeActivated: false },
          { opcode: "whenBroadcast", blockType: BlockType.EVENT, text: translate('when I receive [BROADCAST]'), arguments: { BROADCAST: { type: ArgumentType.STRING, menu: 'broadcastMenu', defaultValue: 'message1', exemptFromNormalization: true } }, isEdgeActivated: false },
          { opcode: "broadcast", blockType: BlockType.COMMAND, text: translate('broadcast [BROADCAST]'), arguments: { BROADCAST: { type: ArgumentType.STRING, menu: 'broadcastMenu', defaultValue: 'message1', exemptFromNormalization: true } } },
          { opcode: "inRealm", blockType: BlockType.CONDITIONAL, text: translate('in realm [REALM]'), arguments: { REALM: { type: ArgumentType.STRING, defaultValue: 'default', exemptFromNormalization: true } } },
          { opcode: "asAnima", blockType: BlockType.CONDITIONAL, text: translate('as anima [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { blockType: BlockType.LABEL, text: '_____' }
        ], { color1: '#FFAB19', color2: '#CC8800', color3: '#0000FF' }),
        ...this._makeFolder("Sensing 3D", [
          { opcode: "animaExists", blockType: BlockType.BOOLEAN, text: translate('anima [ANIMA] exists?'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "animaRealm", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] realm'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "animaParent", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] parent'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "animaChildren", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] children'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "animaChildCount", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] child count'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
          { opcode: "distanceTo", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] distance to [TARGET]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, TARGET: { type: ArgumentType.STRING, defaultValue: 'target', exemptFromNormalization: true } } },
          { blockType: BlockType.LABEL, text: '_____' },
          this._makeFolder("Horoi", [
            { opcode: "createHoros", blockType: BlockType.COMMAND, text: translate('create [TYPE] horos [ID] with params [PARAMS] for anima [ANIMA]'), arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'horos', exemptFromNormalization: true }, TYPE: { type: ArgumentType.STRING, menu: 'HOROS_TYPE', defaultValue: 'box', exemptFromNormalization: true }, PARAMS: { type: ArgumentType.STRING, defaultValue: '{"width":100,"height":100,"depth":100}', exemptFromNormalization: true }, ANIMA: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } },
            { opcode: "deleteHoros", blockType: BlockType.COMMAND, text: translate('delete horos [ID]'), arguments: { ID: { type: ArgumentType.STRING, defaultValue: 'horos', exemptFromNormalization: true } } },
            { opcode: "attachHoros", blockType: BlockType.COMMAND, text: translate('attach horos [HOROS] to anima [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, HOROS: { type: ArgumentType.STRING, defaultValue: 'horos', exemptFromNormalization: true } } },
            { opcode: "detachHoros", blockType: BlockType.COMMAND, text: translate('detach horos from anima [ANIMA]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
            { opcode: "showHoros", blockType: BlockType.COMMAND, text: translate('show horos [TARGET] ? [SHOW]'), arguments: { TARGET: { type: ArgumentType.STRING, menu: 'HOROS_TARGET', defaultValue: 'all', exemptFromNormalization: true }, SHOW: { type: ArgumentType.BOOLEAN, defaultValue: false, exemptFromNormalization: true }, ANIMA: { type: ArgumentType.STRING, defaultValue: '', exemptFromNormalization: true } } },
            { opcode: "touchingHoros", blockType: BlockType.BOOLEAN, text: translate('anima [ANIMA] touching any horos?'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
            { opcode: "distanceToHoros", blockType: BlockType.REPORTER, text: translate('distance from anima [ANIMA] to horos [HOROS]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, HOROS: { type: ArgumentType.STRING, defaultValue: 'horos', exemptFromNormalization: true } } }
          ], { color1: '#5CB1D6', color2: '#448DA6', color3: '#0000FF' })
        ], { color1: '#5CB1D6', color2: '#448DA6', color3: '#0000FF' }),
        ...this._makeFolder("Variables 3D", [
          { opcode: "setAnimaVariable", blockType: BlockType.COMMAND, text: translate('set anima variable [VARIABLE] of anima [ANIMA] to [VALUE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, VARIABLE: { type: ArgumentType.STRING, defaultValue: 'myvar', exemptFromNormalization: true }, VALUE: { type: ArgumentType.STRING, defaultValue: '0', exemptFromNormalization: true } } },
          { opcode: "animaVariable", blockType: BlockType.REPORTER, text: translate('anima [ANIMA] variable [VARIABLE]'), arguments: { ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true }, VARIABLE: { type: ArgumentType.STRING, defaultValue: 'myvar', exemptFromNormalization: true } } },
          { blockType: BlockType.LABEL, text: '_____' }
        ], { color1: '#FF8C1A', color2: '#CC7000', color3: '#0000FF' }),
        ...this._makeFolder("Camera 3D", [
          { opcode: "createCamera", blockType: BlockType.COMMAND, text: translate('create camera [CAMERA] type [TYPE]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true }, TYPE: { type: ArgumentType.STRING, menu: 'CAMERATYPE', defaultValue: 'perspective', exemptFromNormalization: true } } },
          { opcode: "deleteCamera", blockType: BlockType.COMMAND, text: translate('delete camera [CAMERA]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } },
          { opcode: "setActiveCamera", blockType: BlockType.COMMAND, text: translate('set active camera [CAMERA]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } },
          { opcode: "activeCamera", blockType: BlockType.REPORTER, text: translate('active camera') },
          { opcode: "snapshot", blockType: BlockType.REPORTER, text: translate('snapshot [MODE] view with camera [CAMERA]'), arguments: { MODE: { type: ArgumentType.STRING, menu: ['whole', 'model'], defaultValue: 'whole', exemptFromNormalization: true }, CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } },
          this._makeFolder("Attach", [
            { opcode: "attachCamera", blockType: BlockType.COMMAND, text: translate('attach camera [CAMERA] to anima [ANIMA]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true }, ANIMA: { type: ArgumentType.STRING, defaultValue: 'anima', exemptFromNormalization: true } } },
            { opcode: "detachCamera", blockType: BlockType.COMMAND, text: translate('detach camera [CAMERA]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } },
            { opcode: "attached", blockType: BlockType.BOOLEAN, text: translate('camera [CAMERA] attached?'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } },
            { opcode: "attachedAnima", blockType: BlockType.REPORTER, text: translate('camera [CAMERA] attached anima'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } }
          ], { color1: '#ff4d4d', color2: '#c43d3d', color3: '#0000FF' }),
          this._makeFolder("Motion", [
            { opcode: "setCameraPosition", blockType: BlockType.COMMAND, text: translate('set camera [CAMERA] position to [POSITION]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true }, POSITION: { type: ArgumentType.STRING, defaultValue: '0,0,0', exemptFromNormalization: true } } },
            { opcode: "changeCameraPosition", blockType: BlockType.COMMAND, text: translate('change camera [CAMERA] position by [POSITION]'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true }, POSITION: { type: ArgumentType.STRING, defaultValue: '0,0,0', exemptFromNormalization: true } } },
            engine.arrayBlock({ opcode: "getCameraPosition", text: translate('camera [CAMERA] position'), arguments: { CAMERA: { type: ArgumentType.STRING, defaultValue: 'camera', exemptFromNormalization: true } } })
          ], { color1: '#ff4d4d', color2: '#c43d3d', color3: '#0000FF' }),
          { blockType: BlockType.LABEL, text: '_____' }
        ], { color1: '#ff4d4d', color2: '#c43d3d', color3: '#0000FF' }),
        ...this._makeFolder("Lighting 3D", [], { color1: '#D68D00', color2: '#AB6F00', color3: '#0000FF' })
      ]);

      return {
        id: ext.id,
        name: ext.name,
        menuIconURI: ext.icon,
        color1: ext.colors[0],
        color2: ext.colors[1],
        color3: ext.colors[2],
        blocks: blocks,
        menus: menus
      };
    }
  }

  const engineColors = {
    'Turbowarp': '#ff4d4e',
    'Penguinmod': '#009bcc',
    'Nitrobolt': '#ff592b',
    'Unsandboxed': '#67747e',
    'Mistwarp': '#d399e5'
  };
  const fallbackColor = '#f9a83a';
  function getEngineColor() {
    const col = engineColors[engine.name] || fallbackColor;
    return parseInt(col.slice(1), 16);
  }

  await init();
  Scratch.extensions.register(new Khora());

})(Scratch);