// Name: My Extension
// ID: DragoTemplateExt
// Description: A template extension for my style
// By Drago Cuven <https://github.com/Drago-Cuven>

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) throw new Error('This extension must be ran unsandboxed.');

  const { Cast, BlockType, ArgumentType, vm, translate } = Scratch;
  const runtime = vm.runtime;

  const ext = {
    id: 'DragoTemplateExt',
    name: 'Drago Template',
    colors: ['#ab0000', '#780000', '#ff0000'],
    icon: '',
    hasArray: true,
    hasObject: true,
    hasVector: true
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
      setVector(3, 3);
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

  engine.handleVector = (value, strict = true) => {
    const toArray = (v) => {
      if (Array.isArray(v) && v.length >= 2) return [Number(v[0]) || 0, Number(v[1]) || 0];
      if (v && typeof v == 'object') return [Number(v.x ?? v[0] ?? 0), Number(v.y ?? v[1] ?? 0)];
      if (typeof v == 'string') {
        const parts = v.split(',').map(Number);
        if (parts.length == 2 && !parts.some(isNaN)) return parts;
      }
      return [0, 0];
    };
    let arr = toArray(value);

    if (engine.name == 'Unsandboxed' && vm.runtime && typeof vm.runtime.createBuiltInCustomTypeValue == 'function') {
      return vm.runtime.createBuiltInCustomTypeValue('vector', arr);
    }

    if (engine.Vector.hasCast) return Cast.toVector(arr);
    if (engine.canHandleVector()) {
      if (engine.name == 'Penguinmod' && vm.jwVector) return new vm.jwVector.Type(arr[0], arr[1]);
      return arr;
    }
    return arr;
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

  let clickyBlockyCount = 0;
  const externalFunction = () => ++clickyBlockyCount;

  class DragoTemplateExt {
    constructor() {
      this.foldersState = {};
      this.dynMenuNum = 0;
      this._folderStack = [];
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

    _makeFolder(folderName, blocks) {
      // Push current folder onto stack to build full path
      this._folderStack.push(folderName);
      const fullPath = this._folderStack.join('᯽');
      const isOpen = this.isDirOpen(fullPath);
      const toggleOpcode = 'toggleFolder_' + fullPath.replaceAll('᯽', '_');
      if (!this[toggleOpcode]) {
        this[toggleOpcode] = () => this._toggleFolder(fullPath);
      }

      // Flatten blocks (they may contain nested folders)
      let blockList = [];
      if (Array.isArray(blocks)) {
        blockList = blocks;
      } else if (blocks && typeof blocks == 'object') {
        blockList = [blocks];
      }
      const flatten = (arr) => arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), []);
      blockList = flatten(blockList);

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

      for (let block of blockList) {
        if (!isOpen) {
          block.hideFromPalette = true;
        } else {
          block.hideFromPalette = block.hideFromPalette || false;
        }
        result.push(block);
      }

      // Pop stack after processing this folder's contents
      this._folderStack.pop();
      return result;
    }

    getInfo() {
      const testFolder = this._makeFolder("testFolder", [
        { opcode: 'testFolderBlock', blockType: BlockType.REPORTER, text: 'test folder block' },
        this._makeFolder("testsubfolder", [
          { opcode: 'testSubFolderBlock', blockType: BlockType.REPORTER, text: 'test subfolder block' }
        ])
      ]);

      const blockTypesFolder = this._makeFolder("Block Types", [
        { opcode: 'hatBlock', blockType: BlockType.EVENT, text: translate('hat block'), isEdgeActivated: false },
        { opcode: 'commandBlock', blockType: BlockType.COMMAND, text: translate('command block') },
        { opcode: 'reporterBlock', blockType: BlockType.REPORTER, text: translate('reporter block') },
        { opcode: 'booleanBlock', blockType: BlockType.BOOLEAN, text: translate('boolean block') },
        engine.arrayBlock({ opcode: 'arrayBlock', blockType: BlockType.REPORTER, text: translate('array block') }),
        engine.objectBlock({ opcode: 'objectBlock', blockType: BlockType.REPORTER, text: translate('object block') }),
        engine.vectorBlock({ opcode: 'vectorBlock', blockType: BlockType.REPORTER, text: translate('vector') }),
        { opcode: 'capBlock', blockType: BlockType.COMMAND, text: translate('cap block'), isTerminal: true }
      ]);

      const infoFolder = this._makeFolder("Info", [
        { opcode: 'currentEngineReporter', blockType: BlockType.REPORTER, text: translate('current engine') },
        engine.arrayBlock({ opcode: 'soundsReporter', blockType: BlockType.REPORTER, text: translate('sounds') }),
        engine.arrayBlock({ opcode: 'costumesReporter', blockType: BlockType.REPORTER, text: translate('costumes') }),
        engine.arrayBlock({ opcode: 'targetsReporter', blockType: BlockType.REPORTER, text: translate('targets') }),
        engine.arrayBlock({
          opcode: 'listExtensions',
          blockType: BlockType.REPORTER,
          text: translate('loaded extensions'),
          hideFromPalette: false
        }),
        {
          opcode: 'targetFramerate',
          blockType: BlockType.REPORTER,
          text: translate('target framerate'),
          hideFromPalette: false
        },
        {
          opcode: 'currentFPS',
          blockType: BlockType.REPORTER,
          text: translate('current FPS'),
          hideFromPalette: false
        }
      ]);

      const menusFolder = this._makeFolder("Menus", [
        { opcode: 'myMenuReporter', blockType: BlockType.REPORTER, text: translate('menu') + ' [MYMENU]', arguments: { MYMENU: { type: ArgumentType.STRING, menu: 'MyMenu', defaultValue: 'Hoi!', exemptFromNormalization: true } } },
        { opcode: 'dynamicMenuReporter', blockType: BlockType.REPORTER, text: translate('dynamic') + ' [DYNMENU]', arguments: { DYNMENU: { type: ArgumentType.STRING, menu: 'DynMenu', defaultValue: '1', exemptFromNormalization: true } } },
        { opcode: 'dynamicSelect', blockType: BlockType.COMMAND, text: translate('dynamic select') + ' [NUMBER]', arguments: { NUMBER: { type: ArgumentType.STRING, menu: 'NumberMenu', defaultValue: '1', exemptFromNormalization: true } } },
        { opcode: 'getDynamicSelected', blockType: BlockType.REPORTER, text: translate('selected dynamic number') },
        { opcode: 'soundMenuReporter', blockType: BlockType.REPORTER, text: translate('sound') + ' [SOUNDMENU]', arguments: { SOUNDMENU: { type: ArgumentType.STRING, menu: 'SoundMenu', defaultValue: this.getSoundMenuItems()[0] || '', exemptFromNormalization: true } } },
        { opcode: 'costumeMenuReporter', blockType: BlockType.REPORTER, text: translate('costume') + ' [COSTUMEMENU]', arguments: { COSTUMEMENU: { type: ArgumentType.STRING, menu: 'CostumeMenu', defaultValue: this.getCostumeMenuItems()[0] || '', exemptFromNormalization: true } } },
        { opcode: 'targetMenuReporter', blockType: BlockType.REPORTER, text: translate('target') + ' [TARGETMENU]', arguments: { TARGETMENU: { type: ArgumentType.STRING, menu: 'TargetMenu', defaultValue: this.getTargetMenuItems()[0] || '', exemptFromNormalization: true } } }
      ]);

      const inputsFolder = this._makeFolder("Inputs", [
        { opcode: 'stringInputBlock', blockType: BlockType.REPORTER, text: translate('string') + ' [STRING]', arguments: { STRING: { type: ArgumentType.STRING, defaultValue: 'hello', exemptFromNormalization: true } } },
        { opcode: 'arraystring', blockType: BlockType.REPORTER, text: translate('array') + ' [STRARRY]', arguments: { STRARRY: { type: ArgumentType.STRING, defaultValue: '["a","b"]', exemptFromNormalization: true } } },
        { opcode: 'objectstring', blockType: BlockType.REPORTER, text: translate('object') + ' [STROBJ]', arguments: { STROBJ: { type: ArgumentType.STRING, defaultValue: '{"key":"value"}', exemptFromNormalization: true } } },
        engine.vectorBlock({ opcode: 'vectorUseBlock', blockType: BlockType.REPORTER, text: translate('vector x:') + ' [X] ' + translate('y:') + ' [Y]', arguments: { X: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true }, Y: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true } } }),
        { opcode: 'angleInputBlock', blockType: BlockType.REPORTER, text: translate('angle') + ' [ANGLE]', arguments: { ANGLE: { type: ArgumentType.ANGLE, defaultValue: 90, exemptFromNormalization: true } } },
        { opcode: 'colorInputBlock', blockType: BlockType.REPORTER, text: translate('color') + ' [COLOR]', arguments: { COLOR: { type: ArgumentType.COLOR, defaultValue: '#008d15', exemptFromNormalization: true } } },
        { opcode: 'pianoInputBlock', blockType: BlockType.REPORTER, text: translate('piano') + ' [PIANO]', arguments: { PIANO: { type: ArgumentType.NOTE, defaultValue: 60, exemptFromNormalization: true } } },
        { opcode: 'matrixInputBlock', blockType: BlockType.REPORTER, text: translate('matrix') + ' [MATRIX]', arguments: { MATRIX: { type: ArgumentType.MATRIX, defaultValue: [[1,2],[3,4]], exemptFromNormalization: true } } },
        { opcode: 'reporterInputBlock', blockType: BlockType.REPORTER, text: translate('reporter') + ' [REPORTER]', arguments: { REPORTER: { type: ArgumentType.REPORTER, defaultValue: 'value', exemptFromNormalization: true } } },
        { opcode: 'booleanInputBlock', blockType: BlockType.BOOLEAN, text: translate('boolean') + ' [BOOLEAN]', arguments: { BOOLEAN: { type: ArgumentType.BOOLEAN, defaultValue: false, exemptFromNormalization: true } } },
        engine.arrayBlock({ opcode: 'arrayInputBlock', blockType: BlockType.REPORTER, text: translate('array') + ' [ARRAY]', arguments: { ARRAY: engine.arrayInput({ type: ArgumentType.STRING, defaultValue: '[]', exemptFromNormalization: true }) } }),
        engine.objectBlock({ opcode: 'objectInputBlock', blockType: BlockType.REPORTER, text: translate('object') + ' [OBJECT]', arguments: { OBJECT: engine.objectInput({ type: ArgumentType.STRING, defaultValue: '{}', exemptFromNormalization: true }) } }),
        engine.vectorBlock({ opcode: 'vectorinputblock', blockType: BlockType.REPORTER, text: translate('vector') + ' [VECTOR]', arguments: { VECTOR: engine.vectorInput({ type: ArgumentType.STRING, defaultValue: '0,0', USBVecType: 'magnitude', exemptFromNormalization: true }) } }),
        engine.vectorBlock({ opcode: 'vectorpointblock', blockType: BlockType.REPORTER, text: translate('point vector') + ' [VECTOR]', arguments: { VECTOR: engine.vectorInput({ type: ArgumentType.STRING, defaultValue: '0,0', USBVecType: 'point', exemptFromNormalization: true }) } })
      ]);

      const allBlocks = [
        { opcode: 'rootReporter', blockType: BlockType.REPORTER, text: translate('root reporter') },
        ...testFolder,
        "---",
        ...blockTypesFolder,
        "---",
        ...infoFolder,
        "---",
        ...menusFolder,
        "---",
        ...inputsFolder,
        "---",
        { opcode: 'underTheFolders', blockType: BlockType.REPORTER, text: translate('under the folders'), color1: '#1e00ff', color2: '#003d66', color3: '#87ceeb' },
        { opcode: 'externalFunctionReporter', blockType: BlockType.REPORTER, text: translate('external function') }
      ];

      return {
        id: ext.id,
        name: ext.name,
        menuIconURI: ext.icon,
        color1: ext.colors[0],
        color2: ext.colors[1],
        color3: ext.colors[2],
        blocks: allBlocks,
        menus: {
          MyMenu: { acceptReporters: true, items: ["HoI!", "I'm", "a", "mEnu!"] },
          DynMenu: { acceptReporters: true, items: 'getDynMenuItems' },
          NumberMenu: { acceptReporters: true, items: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
          SoundMenu: { acceptReporters: true, items: 'getSoundMenuItems' },
          CostumeMenu: { acceptReporters: true, items: 'getCostumeMenuItems' },
          TargetMenu: { acceptReporters: true, items: 'getTargetMenuItems' }
        }
      };
    }

    rootReporter() { return "not in a folder :3"; }
    hatBlock() { return true; }
    commandBlock() { console.log("Hoi, I'm a command."); }
    reporterBlock() { return "Hoi, I'm a reporter."; }
    booleanBlock() { return true; }

    testFolderBlock() { return "I'm in a folder!"; }
    testSubFolderBlock() { return "I'm in a subfolder!"; }

    arrayBlock() { return engine.handleArray(["Hoi", "I'm", "an", "array"]); }
    objectBlock() { return engine.handleObject({ name: "Hoi, I'm an object." }); }
    vectorBlock() { return engine.handleVector([0, 0]); }
    capBlock() { console.log("Hoi, I'm a cap block."); }
    currentEngineReporter() { return engine.name; }
    soundsReporter(args, util) {
      const target = util.target;
      if (!target || !target.sprite) return engine.handleArray([]);
      return engine.handleArray(target.sprite.sounds.map(s => s.name));
    }
    costumesReporter(args, util) {
      const target = util.target;
      if (!target || !target.sprite) return engine.handleArray([]);
      return engine.handleArray(target.sprite.costumes.map(c => c.name));
    }
    targetsReporter() {
      const targets = runtime.targets;
      return engine.handleArray(targets.filter(t => !t.isStage).map(t => t.sprite.name));
    }

    listExtensions() {
      const extensions = vm.runtime.extensionManager._loadedExtensions;
      const result = [];
      for (const [id] of extensions) {
        result.push(id);
      }
      return engine.handleArray(result);
    }

    targetFramerate() {
      return Scratch.vm.runtime.frameLoop.framerate;
    }

    currentFPS() {
      const fl = Scratch.vm.runtime.frameLoop;
      return fl.getFPS ? fl.getFPS() : fl.fps || 0;
    }

    myMenuReporter(args) { return Cast.toString(args.MYMENU); }
    dynamicMenuReporter(args) { return Cast.toString(args.DYNMENU); }
    dynamicSelect(args) { this.dynMenuNum = Number(Cast.toString(args.NUMBER)); }
    getDynamicSelected() { return this.dynMenuNum; }
    soundMenuReporter(args) { return Cast.toString(args.SOUNDMENU); }
    costumeMenuReporter(args) { return Cast.toString(args.COSTUMEMENU); }
    targetMenuReporter(args) { return Cast.toString(args.TARGETMENU); }
    stringInputBlock(args) { return Cast.toString(args.STRING); }
    angleInputBlock(args) { return Cast.toString(args.ANGLE); }
    colorInputBlock(args) { return Cast.toString(args.COLOR); }
    pianoInputBlock(args) { return Cast.toString(args.PIANO); }
    matrixInputBlock(args) { return args.MATRIX; }
    reporterInputBlock(args) { return args.REPORTER != null ? Cast.toString(args.REPORTER) : ''; }
    booleanInputBlock(args) { return Cast.toBoolean(args.BOOLEAN); }
    arrayInputBlock(args) { return engine.handleArray(args.ARRAY, true); }
    objectInputBlock(args) { return engine.handleObject(args.OBJECT, true); }
    vectorinputblock(args) { return engine.handleVector(args.VECTOR, true); }
    vectorpointblock(args) { return engine.handleVector(args.VECTOR, true); }
    vectorUseBlock(args) {
      const x = Cast.toNumber(args.X);
      const y = Cast.toNumber(args.Y);
      return engine.handleVector([x, y], true);
    }
    arraystring(args) { return engine.handleArray(args.STRARRY, true); }
    objectstring(args) { return engine.handleObject(args.STROBJ, true); }
    underTheFolders() { return "unda da foldas, i have gone blue. hopefully, this remains true."; }
    externalFunctionReporter() { return externalFunction(); }

    getDynMenuItems() {
      const items = [];
      for (let i = 1; i <= 10; i++) {
        let label = i.toString();
        if (this.dynMenuNum == i) label += ' (selected)';
        items.push({ text: label, value: i.toString() });
      }
      return items;
    }
    getSoundMenuItems() {
      const target = runtime.getEditingTarget();
      if (!target || !target.sprite || target.sprite.sounds.length == 0) return ['(no sounds)'];
      return target.sprite.sounds.map(s => s.name);
    }
    getCostumeMenuItems() {
      const target = runtime.getEditingTarget();
      if (!target || !target.sprite || target.sprite.costumes.length == 0) return ['(no costumes)'];
      return target.sprite.costumes.map(c => c.name);
    }
    getTargetMenuItems() {
      const targets = runtime.targets.filter(t => !t.isStage);
      if (targets.length == 0) return ['(no sprites)'];
      return targets.map(t => t.sprite.name);
    }

    _reloadBlocks() {
      vm.extensionManager.refreshBlocks(ext.id);
      vm.runtime.emit('EXTENSION_REFRESH_BLOCKS', ext.id);
    }
  }

  Scratch.extensions.register(new DragoTemplateExt());

})(Scratch);