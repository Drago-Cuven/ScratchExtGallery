// Name: PNG Spritesheets
// ID: DragoPngSpritesheets
// Description:  Create and Export PNG Spritesheets
// By Drago Cuven <https://github.com/Drago-Cuven>

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) throw new Error('This extension must be ran unsandboxed.');

  const { Cast, BlockType, ArgumentType, vm, translate } = Scratch;
  const runtime = vm.runtime;

  const ext = {
    id: 'DragoPngSpritesheets',
    name: 'PNG Spritesheets',
    colors: ['#3347ff', '#296acc', '#1f5099'],
    icon: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4MC45Mjc2NCIgaGVpZ2h0PSI4MC45Mjc2NCIgdmlld0JveD0iMCwwLDgwLjkyNzY0LDgwLjkyNzY0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk5LjUzNjE4LC0xMzkuNTM2MTgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0xOTkuNTM2MTgsMTgwYzAsLTIyLjM0NzU1IDE4LjExNjI3LC00MC40NjM4MiA0MC40NjM4MiwtNDAuNDYzODJjMjIuMzQ3NTUsMCA0MC40NjM4MiwxOC4xMTYyNyA0MC40NjM4Miw0MC40NjM4MmMwLDIyLjM0NzU1IC0xOC4xMTYyNyw0MC40NjM4MiAtNDAuNDYzODIsNDAuNDYzODJjLTIyLjM0NzU1LDAgLTQwLjQ2MzgyLC0xOC4xMTYyNyAtNDAuNDYzODIsLTQwLjQ2MzgyeiIgZmlsbC1vcGFjaXR5PSIwLjUwMTk2IiBmaWxsPSIjMDAwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjAzLjc5OTU5LDE4MGMwLC0xOS45OTI5MyAxNi4yMDc0OCwtMzYuMjAwNDEgMzYuMjAwNDEsLTM2LjIwMDQxYzE5Ljk5MjkzLDAgMzYuMjAwNDEsMTYuMjA3NDggMzYuMjAwNDEsMzYuMjAwNDFjMCwxOS45OTI5MyAtMTYuMjA3NDgsMzYuMjAwNDEgLTM2LjIwMDQxLDM2LjIwMDQxYy0xOS45OTI5MywwIC0zNi4yMDA0MSwtMTYuMjA3NDggLTM2LjIwMDQxLC0zNi4yMDA0MXoiIGZpbGw9IiMyOTM5Y2MiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMDguMjc5MjUsMTc5Ljk5OTk4YzAsLTE3LjU1NzkgMTQuMjMzNDksLTMxLjc5MTM5IDMxLjc5MTM5LC0zMS43OTEzOWMxNy41NTc5LDAgMzEuNzkxMzksMTQuMjMzNDkgMzEuNzkxMzksMzEuNzkxMzljMCwxNy41NTc5IC0xNC4yMzM0OSwzMS43OTEzOSAtMzEuNzkxMzksMzEuNzkxMzljLTE3LjU1NzksMCAtMzEuNzkxMzksLTE0LjIzMzQ5IC0zMS43OTEzOSwtMzEuNzkxMzl6IiBmaWxsPSIjMzM0N2ZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjQyLjMwMzQzLDE3Ny45OTIxNnYtMy40NTUxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQyLjMwMzQzLDE2OS45ODQzOXYtMy40NTUxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjQyLjMwMzQzLDE1OC41MjE1M3YzLjQ1NTEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDIuMzEwOSwxNzcuOTk5NjJoMy40NTUxIiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMi41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjUwLjMxODY1LDE3Ny45OTk2MmgzLjQ1NTEiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIyLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNTguMzI2NDIsMTc3Ljk5OTYyaDMuNDU1MSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTIzMy43MzEwNCwxODQuMjY0MjdjMCwwIC0xLjU1NzU4LC0xOC4yMjUxNyAtMC45MzI1MywtMjEuNTg2NzZjMC42MjUwNSwtMy4zNjE2IDYuMTEzMjgsLTYuMjc2MDEgNi4xMTMyOCwtNi4yNzYwMXYyNy44NjI3NnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yMzUuODM3ODIsMTgxLjUwMTEyaDI3Ljg2Mjc2YzAsMCAtMi45MTQ0Miw1LjQ4ODIzIC02LjI3NjAxLDYuMTEzMjhjLTMuMzYxNiwwLjYyNTA2IC0yMS41ODY3NiwtMC45MzI1MyAtMjEuNTg2NzYsLTAuOTMyNTN6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjM1LjQ0OTI2LDE4OC42NTI3NGMtMi4yODg5OSwwIC00LjE0NDU5LC0xLjg1NTU5IC00LjE0NDU5LC00LjE0NDU5YzAsLTIuMjg4OTkgMS44NTU1OSwtNC4xNDQ1OSA0LjE0NDU5LC00LjE0NDU5YzIuMjg4OTksMCA0LjE0NDU5LDEuODU1NTkgNC4xNDQ1OSw0LjE0NDU5YzAsMi4yODg5OSAtMS44NTU1OSw0LjE0NDU5IC00LjE0NDU5LDQuMTQ0NTl6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjI2LjAzODM5LDE3Ny4yMDM4N2M1LjM3ODczLDAgOS43MzkwNSwyLjY5MDM2IDkuNzM5MDUsNi4wMDkwOWMwLDMuMzE4NzMgLTQuMzYwMzMsNi4wMDkwOSAtOS43MzkwNSw2LjAwOTA5Yy01LjM3ODczLDAgLTkuNzM5MDQsLTIuNjkwMzYgLTkuNzM5MDQsLTYuMDA5MDljMCwtMy4zMTg3MyA0LjM2MDMyLC02LjAwOTA5IDkuNzM5MDQsLTYuMDA5MDl6TTIxOS44MjIyNSwxODMuMjEyOTZjMCwxLjg5MzU2IDIuNzgzMDYsMy40Mjg1OCA2LjIxNjE0LDMuNDI4NThjMy40MzMwOCwwIDYuMjE2MTQsLTEuNTM1MDIgNi4yMTYxNCwtMy40Mjg1OGMwLC0xLjg5MzU2IC0yLjc4MzA2LC0zLjQyODU5IC02LjIxNjE0LC0zLjQyODU5Yy0zLjQzMzA4LDAgLTYuMjE2MTQsMS41MzUwMyAtNi4yMTYxNCwzLjQyODU5eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTI0Mi4zNjQ5NywxOTMuODU5NGMwLDUuMzc4NzMgLTIuNjkwMzYsOS43MzkwNSAtNi4wMDkwOSw5LjczOTA1Yy0zLjMxODczLDAgLTYuMDA5MDksLTQuMzYwMzMgLTYuMDA5MDksLTkuNzM5MDVjMCwtNS4zNzg3MyAyLjY5MDM2LC05LjczOTA1IDYuMDA5MDksLTkuNzM5MDVjMy4zMTg3MywwIDYuMDA5MDksNC4zNjAzMyA2LjAwOTA5LDkuNzM5MDV6TTIzNi4zNTU4OCwxODcuNjQzMjZjLTEuODkzNTYsMCAtMy40Mjg1OCwyLjc4MzA2IC0zLjQyODU4LDYuMjE2MTRjMCwzLjQzMzA4IDEuNTM1MDIsNi4yMTYxNCAzLjQyODU4LDYuMjE2MTRjMS44OTM1NSwwIDMuNDI4NTgsLTIuNzgzMDYgMy40Mjg1OCwtNi4yMTYxNGMwLC0zLjQzMzA4IC0xLjUzNTAyLC02LjIxNjE0IC0zLjQyODU4LC02LjIxNjE0eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6NDAuNDYzODIwMDAwMDAwMDM6NDAuNDYzODItLT4=",
    version: '1.2.0',
    hasArray: true,
    hasObject: true
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

  const safeJSONParse = (str) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  class PNGSHEETSEXT {
    constructor() {
      this.foldersState = {};
      this._folderStack = [];
      this.focusItems = { png: '', xml: '', json: '', ini: '' };
      this.canvases = {};
      this.grids = {};
      this.generalConfig = {
        resize: 'off',
        orientation: 'horizontal',
        padding: 6,
        dupeMissingFrames: 'off',
        keepOriginalCoordinates: false,
        adobeStyleXML: false,
        maxWidth: 0,
        smoothImages: true,
        imageName: 'spritesheet.png',
        resolution: '1',
        mergePriority: 'primary',
        mergeAction: 'overwrite',
        frameCutAnchor: 'center'
      };
      this.sheetUtilConfig = { frameCutAnchor: 'center' };
      this._imageCache = new Map();
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
        if (typeof block == 'string') {
          result.push(block);
        } else {
          if (!isOpen) block.hideFromPalette = true;
          else block.hideFromPalette = block.hideFromPalette || false;
          result.push(block);
        }
      }

      this._folderStack.pop();
      return result;
    }

    _reloadBlocks() {
      vm.extensionManager.refreshBlocks(ext.id);
      vm.runtime.emit('EXTENSION_REFRESH_BLOCKS', ext.id);
    }

    _getCanvas(name) {
      name = name || 'default';
      if (!this.canvases[name]) {
        const configCopy = { ...this.generalConfig };
        delete configCopy.mergePriority;
        delete configCopy.mergeAction;
        delete configCopy.frameCutAnchor;
        this.canvases[name] = {
          animations: {},
          frameMetadata: {},
          blankFrames: {},
          finalImage: '',
          sourceSheetImage: '',
          config: configCopy,
          animationVariables: {},
          frameVariables: {},
          customFrames: {},
          meta: { size: { w: 0, h: 0 } },
          cachedJSON: '',
          cachedPNG: '',
          needsReCache: true,
          originalData: null
        };
      }
      return this.canvases[name];
    }

    _setGeneralConfig(key, value) {
      this.generalConfig[key] = value;
      const globalKeys = ['mergePriority', 'mergeAction', 'frameCutAnchor'];
      if (globalKeys.includes(key)) return;
      for (const cName in this.canvases) {
        if (this.canvases[cName].config && key in this.canvases[cName].config) {
          this.canvases[cName].config[key] = value;
        }
      }
    }

    _getCanvasConfig(canvas, key) {
      const c = this._getCanvas(canvas);
      if (c.config && key in c.config) return c.config[key];
      if (key in this.generalConfig) return this.generalConfig[key];
      return undefined;
    }

    _setCanvasConfig(canvas, key, value) {
      const c = this._getCanvas(canvas);
      if (!c.config) c.config = {};
      c.config[key] = value;
      c.needsReCache = true;
    }

    _regenerateCanvas(canvasName) {
      return new Promise((resolve) => {
        const canvas = this._getCanvas(canvasName);
        if (!canvas.sourceSheetImage || !canvas.sourceSheetImage.startsWith('data:image/png')) {
          canvas.finalImage = '';
          canvas.cachedJSON = '';
          canvas.cachedPNG = '';
          canvas.needsReCache = false;
          resolve();
          return;
        }

        const anims = Object.keys(canvas.animations);
        if (anims.length == 0) {
          canvas.finalImage = '';
          canvas.cachedJSON = '';
          canvas.cachedPNG = '';
          canvas.needsReCache = false;
          resolve();
          return;
        }

        const extractPromises = [];
        for (const an of anims) {
          const metaArr = canvas.frameMetadata[an] || [];
          for (let i = 0; i < (canvas.animations[an]?.length || 0); i++) {
            if (canvas.animations[an][i] && canvas.animations[an][i] !== '') continue;
            const meta = metaArr[i];
            if (!meta) continue;
            const rotOff = meta.rotated ? 90 : 0;
            const smooth = (canvas.config && canvas.config.smoothImages != undefined) ? canvas.config.smoothImages : this.generalConfig.smoothImages;
            extractPromises.push(
              this._extractFrameFromSheet(canvas.sourceSheetImage, meta, rotOff, smooth, true)
                .then(dataUrl => {
                  if (dataUrl) canvas.animations[an][i] = dataUrl;
                  else canvas.animations[an][i] = '';
                })
            );
          }
        }

        Promise.all(extractPromises).then(() => {
          const cfg = canvas.config;
          const pad = cfg.padding, keep = cfg.keepOriginalCoordinates, smooth = cfg.smoothImages;
          const res = parseFloat(cfg.resolution) || 1, sc = Math.max(0.1, res);
          const frames = [];
          for (const an of anims) {
            const ma = canvas.frameMetadata[an] || [];
            for (let i = 0; i < (canvas.animations[an]?.length || 0); i++) {
              const du = canvas.animations[an][i];
              if (!du) continue;
              const meta = ma[i] || { x: 0, y: 0, width: 0, height: 0, frameX: 0, frameY: 0, frameWidth: 0, frameHeight: 0, flipX: false, flipY: false, rotated: false };
              frames.push({ dataUrl: du, meta, anim: an, index: i });
            }
          }
          if (frames.length == 0) {
            canvas.finalImage = '';
            canvas.cachedJSON = '';
            canvas.cachedPNG = '';
            canvas.needsReCache = false;
            resolve();
            return;
          }

          const applyScale = (obj) => {
            if (obj.x != undefined) obj.x = Math.round(obj.x * sc);
            if (obj.y != undefined) obj.y = Math.round(obj.y * sc);
            if (obj.width != undefined) obj.width = Math.round(obj.width * sc);
            if (obj.height != undefined) obj.height = Math.round(obj.height * sc);
            if (obj.frameX != undefined) obj.frameX = Math.round(obj.frameX * sc);
            if (obj.frameY != undefined) obj.frameY = Math.round(obj.frameY * sc);
            if (obj.frameWidth != undefined) obj.frameWidth = Math.round(obj.frameWidth * sc);
            if (obj.frameHeight != undefined) obj.frameHeight = Math.round(obj.frameHeight * sc);
          };

          const loadPromises = frames.map(f => new Promise(res => {
            const img = new Image();
            img.onload = () => { f.width = img.width; f.height = img.height; res(); };
            img.onerror = () => { f.width = f.meta.width; f.height = f.meta.height; res(); };
            img.src = f.dataUrl;
          }));

          Promise.all(loadPromises).then(() => {
            if (keep) {
              let maxX = 0, maxY = 0;
              for (const f of frames) {
                const sm = { ...f.meta };
                applyScale(sm);
                f.scaledMeta = sm;
                maxX = Math.max(maxX, sm.x + sm.width);
                maxY = Math.max(maxY, sm.y + sm.height);
              }
              const cel = document.createElement('canvas');
              cel.width = maxX; cel.height = maxY;
              const ctx = cel.getContext('2d');
              ctx.imageSmoothingEnabled = smooth;
              const draws = frames.map(f => new Promise(res => {
                const img = new Image();
                img.onload = () => {
                  const m = f.scaledMeta;
                  ctx.save();
                  if (m.flipX || m.flipY) {
                    ctx.translate(m.flipX ? m.width : 0, m.flipY ? m.height : 0);
                    ctx.scale(m.flipX ? -1 : 1, m.flipY ? -1 : 1);
                  }
                  if (m.rotated) {
                    ctx.translate(m.x + m.width/2, m.y + m.height/2);
                    ctx.rotate(Math.PI/2);
                    ctx.drawImage(img, -m.height/2, -m.width/2, m.height, m.width);
                  } else {
                    ctx.drawImage(img, m.x, m.y, m.width, m.height);
                  }
                  ctx.restore();
                  res();
                };
                img.onerror = () => res();
                img.src = f.dataUrl;
              }));
              Promise.all(draws).then(() => {
                cel.toBlob(blob => {
                  if (!blob) { canvas.finalImage = ''; canvas.cachedJSON = ''; canvas.cachedPNG = ''; canvas.needsReCache = false; resolve(); return; }
                  const rd = new FileReader();
                  rd.onloadend = () => {
                    canvas.finalImage = rd.result;
                    canvas.cachedPNG = rd.result;
                    canvas.meta.size = { w: cel.width, h: cel.height };
                    for (const f of frames) {
                      if (!canvas.frameMetadata[f.anim]) canvas.frameMetadata[f.anim] = [];
                      canvas.frameMetadata[f.anim][f.index] = f.scaledMeta;
                    }
                    canvas.cachedJSON = this._generateJSON(canvas);
                    canvas.needsReCache = false;
                    resolve();
                  };
                  rd.readAsDataURL(blob);
                }, 'image/png');
              });
            } else {
              this._packFrames(frames, cfg, smooth).then(pf => {
                for (const p of pf) applyScale(p);
                let cw = 0, ch = 0;
                for (const p of pf) { cw = Math.max(cw, p.packedX + p.width); ch = Math.max(ch, p.packedY + p.height); }
                const cel = document.createElement('canvas');
                cel.width = cw || 1; cel.height = ch || 1;
                const ctx = cel.getContext('2d');
                ctx.imageSmoothingEnabled = smooth;
                const draws = pf.map(p => new Promise(res => {
                  const img = new Image();
                  img.onload = () => { ctx.drawImage(img, p.packedX, p.packedY, p.width, p.height); res(); };
                  img.onerror = () => res();
                  img.src = p.dataUrl;
                }));
                Promise.all(draws).then(() => {
                  cel.toBlob(blob => {
                    if (!blob) { canvas.finalImage = ''; canvas.cachedJSON = ''; canvas.cachedPNG = ''; canvas.needsReCache = false; resolve(); return; }
                    const rd = new FileReader();
                    rd.onloadend = () => {
                      canvas.finalImage = rd.result;
                      canvas.cachedPNG = rd.result;
                      canvas.meta.size = { w: cel.width, h: cel.height };
                      for (const p of pf) {
                        const { anim, index } = p;
                        if (!canvas.frameMetadata[anim]) canvas.frameMetadata[anim] = [];
                        canvas.frameMetadata[anim][index] = {
                          x: p.packedX, y: p.packedY,
                          width: p.width, height: p.height,
                          frameX: 0, frameY: 0,
                          frameWidth: p.width, frameHeight: p.height,
                          flipX: false, flipY: false,
                          rotated: false
                        };
                      }
                      canvas.cachedJSON = this._generateJSON(canvas);
                      canvas.needsReCache = false;
                      resolve();
                    };
                    rd.readAsDataURL(blob);
                  }, 'image/png');
                });
              });
            }
          });
        });
      });
    }

    _generateJSON(canvas) {
      const meta = {
        app: 'Scratch Mod (Drago\'s Spritesheet Extension)',
        version: ext.version,
        image: canvas.config.imageName || this.generalConfig.imageName || 'spritesheet.png',
        format: 'RGBA8888',
        size: { w: canvas.meta.size.w || 0, h: canvas.meta.size.h || 0 },
        resolution: canvas.config.resolution || this.generalConfig.resolution || '1'
      };
      const d = { ATLAS: { SPRITES: [] }, meta: meta };
      for (const [anim, metaArr] of Object.entries(canvas.frameMetadata)) {
        if (!Array.isArray(metaArr)) continue;
        metaArr.forEach((md, i) => {
          if (!md) return;
          const entry = { SPRITE: { ...md } };
          entry.SPRITE.name = anim + i.toString().padStart(4, '0');
          d.ATLAS.SPRITES.push(entry);
        });
      }
      d.animations = {};
      d.frames = [];
      for (const [anim, metaArr] of Object.entries(canvas.frameMetadata)) {
        if (!Array.isArray(metaArr)) continue;
        d.animations[anim] = [];
        metaArr.forEach((md, i) => {
          if (!md) {
            d.animations[anim].push(null);
            return;
          }
          const fd = { ...md };
          fd.name = anim + i.toString().padStart(4, '0');
          d.animations[anim].push(fd);
          d.frames.push(fd);
        });
      }
      return JSON.stringify(d);
    }

    _packFrames(frames, cfg, smooth) {
      return new Promise(r => {
        const load = frames.map(f => new Promise(res => {
          const i = new Image();
          i.onload = () => res({ ...f, width: i.width, height: i.height });
          i.onerror = () => res({ ...f, width: f.meta.width, height: f.meta.height });
          i.src = f.dataUrl;
        }));
        Promise.all(load).then(fwd => {
          const pad = cfg.padding, maxW = cfg.maxWidth, orient = cfg.orientation;
          const packed = [];
          let cx = 0, cy = 0, rowH = 0;
          for (const f of fwd) {
            const w = f.width, h = f.height;
            if (orient == 'horizontal') {
              if (maxW > 0 && cx + w > maxW && cx > 0) { cx = 0; cy += rowH + pad; rowH = 0; }
              f.packedX = cx; f.packedY = cy;
              cx += w + pad; rowH = Math.max(rowH, h);
            } else {
              if (maxW > 0 && cy + h > maxW && cy > 0) { cy = 0; cx += rowH + pad; rowH = 0; }
              f.packedX = cx; f.packedY = cy;
              cy += h + pad; rowH = Math.max(rowH, w);
            }
            packed.push(f);
          }
          r(packed);
        });
      });
    }

    _generateUniqueName(canvas, baseName) {
      if (!canvas.animations[baseName]) return baseName;
      let newName = baseName + '-ALT';
      let counter = 1;
      while (canvas.animations[newName]) {
        newName = baseName + '-ALT' + (++counter);
      }
      return newName;
    }

    _renameAnimation(canvas, oldName, newName) {
      if (!canvas.animations[oldName]) return false;
      if (oldName == newName) return true;
      if (canvas.animations[newName]) {
        delete canvas.animations[newName];
        delete canvas.frameMetadata[newName];
        delete canvas.blankFrames[newName];
        delete canvas.animationVariables[newName];
        delete canvas.frameVariables[newName];
        delete canvas.customFrames[newName];
      }
      canvas.animations[newName] = canvas.animations[oldName];
      canvas.frameMetadata[newName] = canvas.frameMetadata[oldName];
      canvas.blankFrames[newName] = canvas.blankFrames[oldName];
      canvas.animationVariables[newName] = canvas.animationVariables[oldName];
      canvas.frameVariables[newName] = canvas.frameVariables[oldName];
      canvas.customFrames[newName] = canvas.customFrames[oldName];
      delete canvas.animations[oldName];
      delete canvas.frameMetadata[oldName];
      delete canvas.blankFrames[oldName];
      delete canvas.animationVariables[oldName];
      delete canvas.frameVariables[oldName];
      delete canvas.customFrames[oldName];
      return true;
    }

    _copyAnimationWithRename(source, target, anim, newName, overwrite, action) {
      if (!source.animations[anim]) return false;
      const destName = newName || anim;
      if (target.animations[destName]) {
        if (action == 'overwrite') {
          if (!overwrite) return false;
          delete target.animations[destName];
          delete target.frameMetadata[destName];
          delete target.blankFrames[destName];
          delete target.animationVariables[destName];
          delete target.frameVariables[destName];
          delete target.customFrames[destName];
        } else {
          if (overwrite) {
            const newTargetName = this._generateUniqueName(target, destName);
            this._renameAnimation(target, destName, newTargetName);
          } else {
            const newSourceName = this._generateUniqueName(target, destName);
            target.animations[newSourceName] = source.animations[anim].slice();
            target.frameMetadata[newSourceName] = source.frameMetadata[anim] ? source.frameMetadata[anim].slice() : [];
            target.blankFrames[newSourceName] = new Set(source.blankFrames[anim] || []);
            target.customFrames[newSourceName] = new Set(source.customFrames[anim] || []);
            target.animationVariables[newSourceName] = source.animationVariables[anim] ? { ...source.animationVariables[anim] } : {};
            target.frameVariables[newSourceName] = source.frameVariables[anim] ? JSON.parse(JSON.stringify(source.frameVariables[anim])) : {};
            return true;
          }
        }
      }
      target.animations[destName] = source.animations[anim].slice();
      target.frameMetadata[destName] = source.frameMetadata[anim] ? source.frameMetadata[anim].slice() : [];
      target.blankFrames[destName] = new Set(source.blankFrames[anim] || []);
      target.customFrames[destName] = new Set(source.customFrames[anim] || []);
      target.animationVariables[destName] = source.animationVariables[anim] ? { ...source.animationVariables[anim] } : {};
      target.frameVariables[destName] = source.frameVariables[anim] ? JSON.parse(JSON.stringify(source.frameVariables[anim])) : {};
      return true;
    }

    _addAllAnimations(source, target, overwrite, action) {
      for (const anim of Object.keys(source.animations)) {
        this._copyAnimationWithRename(source, target, anim, null, overwrite, action);
      }
    }

    _mergeCanvases(c1, c2, target, priority, action) {
      const first = priority == 'primary' ? c1 : c2;
      const second = priority == 'primary' ? c2 : c1;
      for (const anim of Object.keys(first.animations)) {
        this._copyAnimationWithRename(first, target, anim, null, true, action);
      }
      for (const anim of Object.keys(second.animations)) {
        this._copyAnimationWithRename(second, target, anim, null, false, action);
      }
    }

    _getArgDefs(blockDef) {
      const args = blockDef.arguments || {};
      for (const key in args) {
        args[key].exemptFromNormalization = true;
      }
      return blockDef;
    }

    _getGrid(name) {
      name = name || 'default';
      if (!this.grids[name]) {
        this.grids[name] = {
          dataurl: '',
          json: { cellCountX: 0, cellCountY: 0, cellWidth: 0, cellHeight: 0, padding: 0 },
          pendingModifications: {},
          cellOffsets: {},
          config: {
            smoothImages: false,
            anchoring: 'center',
            spriteResize: 'none',
            cellResize: 'scale up',
            dupeMissingCells: 'off',
            collectionXDir: 'left to right',
            collectionYDir: 'top to bottom',
            collectionPriority: 'x'
          },
          cellCache: {}
        };
      }
      return this.grids[name];
    }

    _resolveGridDimensions(grid) {
      const json = grid.json, url = grid.dataurl;
      return new Promise(r => {
        if (!url || !url.startsWith('data:image/png')) { r(json); return; }
        const i = new Image();
        i.onload = () => {
          const iw = i.width, ih = i.height;
          let cx = json.cellCountX || 0, cy = json.cellCountY || 0, cw = json.cellWidth || 0, ch = json.cellHeight || 0;
          if (cx == 0 && cw == 0) { cx = 1; cw = iw; }
          else if (cx == 0 && cw > 0) { cx = Math.floor(iw / cw); if (cx == 0) cx = 1; }
          else if (cx > 0 && cw == 0) { cw = Math.floor(iw / cx); }
          if (cy == 0 && ch == 0) { cy = 1; ch = ih; }
          else if (cy == 0 && ch > 0) { cy = Math.floor(ih / ch); if (cy == 0) cy = 1; }
          else if (cy > 0 && ch == 0) { ch = Math.floor(ih / cy); }
          json.cellCountX = cx; json.cellCountY = cy; json.cellWidth = cw; json.cellHeight = ch;
          r(json);
        };
        i.onerror = () => r(json);
        i.src = url;
      });
    }

    _rebuildGrid(grid, baseUrl, json, imgs, cfg) {
      return new Promise(r => {
        const cw = json.cellWidth, ch = json.cellHeight, cx = json.cellCountX, cy = json.cellCountY, pad = json.padding || 0;
        const tw = cx * cw + (cx - 1) * pad, th = cy * ch + (cy - 1) * pad;
        const canvas = document.createElement('canvas');
        canvas.width = tw; canvas.height = th;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = cfg.smoothImages;

        const drawPlaced = () => {
          const tasks = [];
          for (const item of imgs) {
            tasks.push(new Promise(res => {
              const img = new Image();
              img.onload = () => {
                const dx = item.x * (cw + pad) + (item.offsetX || 0);
                const dy = item.y * (ch + pad) + (item.offsetY || 0);
                let dw = img.width, dh = img.height;
                if (cfg.spriteResize == 'scale down') {
                  if (dw > cw || dh > ch) { const sc = Math.min(cw / dw, ch / dh); dw *= sc; dh *= sc; }
                } else if (cfg.spriteResize == 'scale up') {
                  if (dw < cw && dh < ch) { const sc = Math.min(cw / dw, ch / dh); dw *= sc; dh *= sc; }
                }
                let px = dx, py = dy;
                const anc = cfg.anchoring || 'center';
                switch (anc) {
                  case 'top left': px = dx; py = dy; break;
                  case 'top center': px = dx + (cw - dw) / 2; py = dy; break;
                  case 'top right': px = dx + cw - dw; py = dy; break;
                  case 'middle left': px = dx; py = dy + (ch - dh) / 2; break;
                  case 'center': px = dx + (cw - dw) / 2; py = dy + (ch - dh) / 2; break;
                  case 'middle right': px = dx + cw - dw; py = dy + (ch - dh) / 2; break;
                  case 'bottom left': px = dx; py = dy + ch - dh; break;
                  case 'bottom center': px = dx + (cw - dw) / 2; py = dy + ch - dh; break;
                  case 'bottom right': px = dx + cw - dw; py = dy + ch - dh; break;
                }
                ctx.drawImage(img, px, py, dw, dh);
                res();
              };
              img.onerror = () => res();
              img.src = item.img;
            }));
          }
          Promise.all(tasks).then(() => {
            canvas.toBlob(b => {
              if (!b) { r(); return; }
              const rd = new FileReader();
              rd.onloadend = () => {
                grid.dataurl = rd.result;
                grid.pendingModifications = {};
                grid.cellCache = {};
                r();
              };
              rd.readAsDataURL(b);
            }, 'image/png');
          });
        };

        if (baseUrl && baseUrl.startsWith('data:image/png')) {
          const bi = new Image();
          bi.onload = () => {
            for (let y = 0; y < cy; y++) {
              for (let x = 0; x < cx; x++) {
                const key = x + ',' + y;
                if (grid.pendingModifications[key] === undefined) {
                  const sx = x * cw, sy = y * ch, dx = x * (cw + pad), dy = y * (ch + pad);
                  ctx.drawImage(bi, sx, sy, cw, ch, dx, dy, cw, ch);
                }
              }
            }
            drawPlaced();
          };
          bi.onerror = () => drawPlaced();
          bi.src = baseUrl;
        } else drawPlaced();
      });
    }

    _getCellImageDataURL(grid, x, y) {
      const key = x + ',' + y;
      if (grid.cellCache[key]) return Promise.resolve(grid.cellCache[key]);
      return new Promise(r => {
        if (grid.pendingModifications[key] !== undefined && grid.pendingModifications[key] !== null) {
          grid.cellCache[key] = grid.pendingModifications[key];
          r(grid.pendingModifications[key]);
          return;
        }
        const url = grid.dataurl;
        if (!url || !url.startsWith('data:image/png')) { r(''); return; }
        this._resolveGridDimensions(grid).then(json => {
          const cw = json.cellWidth, ch = json.cellHeight, cx = json.cellCountX, cy = json.cellCountY;
          if (x >= cx || y >= cy) { r(''); return; }
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = cw; canvas.height = ch;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = grid.config.smoothImages;
            ctx.drawImage(img, x * cw, y * ch, cw, ch, 0, 0, cw, ch);
            canvas.toBlob(b => {
              if (!b) { r(''); return; }
              const rd = new FileReader();
              rd.onloadend = () => {
                const dataUrl = rd.result;
                grid.cellCache[key] = dataUrl;
                r(dataUrl);
              };
              rd.readAsDataURL(b);
            }, 'image/png');
          };
          img.onerror = () => r('');
          img.src = url;
        }).catch(() => r(''));
      });
    }

    _getOrderedCells(grid) {
      const json = grid.json;
      const cx = json.cellCountX || 1, cy = json.cellCountY || 1;
      const xDir = grid.config.collectionXDir || 'left to right';
      const yDir = grid.config.collectionYDir || 'top to bottom';
      const priority = grid.config.collectionPriority || 'x';
      const order = [];
      if (priority == 'x') {
        const yStart = yDir == 'top to bottom' ? 0 : cy - 1;
        const yEnd = yDir == 'top to bottom' ? cy : -1;
        const yStep = yDir == 'top to bottom' ? 1 : -1;
        for (let y = yStart; y != yEnd; y += yStep) {
          const xStart = xDir == 'left to right' ? 0 : cx - 1;
          const xEnd = xDir == 'left to right' ? cx : -1;
          const xStep = xDir == 'left to right' ? 1 : -1;
          for (let x = xStart; x != xEnd; x += xStep) {
            order.push({ x, y });
          }
        }
      } else {
        const xStart = xDir == 'left to right' ? 0 : cx - 1;
        const xEnd = xDir == 'left to right' ? cx : -1;
        const xStep = xDir == 'left to right' ? 1 : -1;
        for (let x = xStart; x != xEnd; x += xStep) {
          const yStart = yDir == 'top to bottom' ? 0 : cy - 1;
          const yEnd = yDir == 'top to bottom' ? cy : -1;
          const yStep = yDir == 'top to bottom' ? 1 : -1;
          for (let y = yStart; y != yEnd; y += yStep) {
            order.push({ x, y });
          }
        }
      }
      return order;
    }

    getInfo() {
      return {
        id: ext.id,
        name: ext.name,
        menuIconURI: ext.icon,
        color1: ext.colors[0],
        color2: ext.colors[1],
        color3: ext.colors[2],
        blocks: [
          ...this._makeFolder("Sheet Utilities", [
            this._getArgDefs({ opcode: 'getFocusItem', blockType: BlockType.REPORTER, text: translate('get focus [filetype]'), arguments: { filetype: { type: ArgumentType.STRING, menu: 'fileTypeMenu' } } }),
            this._getArgDefs({ opcode: 'setFocusItem', blockType: BlockType.COMMAND, text: translate('set focus [filetype] to [content]'), arguments: { filetype: { type: ArgumentType.STRING, menu: 'fileTypeMenu' }, content: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._getArgDefs({ opcode: 'clearFocusItem', blockType: BlockType.COMMAND, text: translate('clear focus [filetype]'), arguments: { filetype: { type: ArgumentType.STRING, menu: 'clearFileTypeMenu' } } }),
            "---",
            engine.arrayBlock(this._getArgDefs({ opcode: 'getImageDimensions', blockType: BlockType.REPORTER, text: translate('dimensions of png [DATAURL]'), arguments: { DATAURL: { type: ArgumentType.STRING, defaultValue: '' } } })),
            this._getArgDefs({ opcode: 'convertSvgToPng', blockType: BlockType.REPORTER, text: translate('convert svg [SVG] at scale [SCALE]% to png'), arguments: { SVG: { type: ArgumentType.STRING, defaultValue: '' }, SCALE: { type: ArgumentType.NUMBER, defaultValue: 100 } } }),
            this._getArgDefs({ opcode: 'rotatePng', blockType: BlockType.REPORTER, text: translate('rotate png [DATAURL] by [ANGLE] degrees'), arguments: { DATAURL: { type: ArgumentType.STRING, defaultValue: '' }, ANGLE: { type: ArgumentType.ANGLE, defaultValue: 90 } } }),
            this._getArgDefs({ opcode: 'getFrameCrop', blockType: BlockType.REPORTER, text: translate('get frame x:[X1] y:[Y1] to x:[X2] y:[Y2] of png [DATAURL]'), arguments: { X1: { type: ArgumentType.NUMBER, defaultValue: -32 }, Y1: { type: ArgumentType.NUMBER, defaultValue: -32 }, X2: { type: ArgumentType.NUMBER, defaultValue: 32 }, Y2: { type: ArgumentType.NUMBER, defaultValue: 32 }, DATAURL: { type: ArgumentType.STRING, defaultValue: '' } } }),
            "---",
            engine.arrayBlock(this._getArgDefs({ opcode: 'listAnimationsInData', blockType: BlockType.REPORTER, text: translate('list animations in [FORMAT] data [DATA]'), arguments: { FORMAT: { type: ArgumentType.STRING, menu: 'useFormat' }, DATA: { type: ArgumentType.STRING, defaultValue: '' } } })),
            "---",
            ...this._makeFolder("Util Configs", [
              this._getArgDefs({ opcode: 'setFrameCutAnchor', blockType: BlockType.COMMAND, text: translate('set frame cut anchor to [ANCHOR]'), arguments: { ANCHOR: { type: ArgumentType.STRING, menu: 'anchoringMenu' } } }),
              { opcode: 'getFrameCutAnchor', blockType: BlockType.REPORTER, text: translate('get frame cut anchor') }
            ])
          ]),
          "---",
          ...this._makeFolder("Sparrow Sheets", [
            this._getArgDefs({ opcode: 'importSparrowSheet', blockType: BlockType.COMMAND, text: translate('import sparrow sheet [DATAURL] with [TYPE] data [DATA] into canvas [CANVAS]'), arguments: { DATAURL: { type: ArgumentType.STRING, defaultValue: '' }, TYPE: { type: ArgumentType.STRING, menu: 'useFormat' }, DATA: { type: ArgumentType.STRING, defaultValue: '' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            engine.objectBlock(this._getArgDefs({ opcode: 'exportCanvas', blockType: BlockType.REPORTER, text: translate('export canvas [CANVAS] with [TYPE] data'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' }, TYPE: { type: ArgumentType.STRING, menu: 'exportFormatMenu' } } })),
            this._getArgDefs({ opcode: 'getCanvasAsset', blockType: BlockType.REPORTER, text: translate('get [ASSET] of canvas [CANVAS]'), arguments: { ASSET: { type: ArgumentType.STRING, menu: 'fileTypeMenu' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            "---",
            this._getArgDefs({ opcode: 'clearCanvas', blockType: BlockType.COMMAND, text: translate('clear canvas [CANVAS]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            engine.arrayBlock({ opcode: 'existingCanvases', blockType: BlockType.REPORTER, text: translate('existing canvases') }),
            this._getArgDefs({ opcode: 'removeCanvas', blockType: BlockType.COMMAND, text: translate('remove canvas [CANVAS]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            "---",
            this._getArgDefs({ opcode: 'preRecutSparrowSheet', blockType: BlockType.COMMAND, text: translate('pre/recut sparrow sheet for canvas [CANVAS]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'needToRecut', blockType: BlockType.BOOLEAN, text: translate('need to recut? canvas [CANVAS]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            "---",
            this._getArgDefs({ opcode: 'setSparrowSheetFrame', blockType: BlockType.COMMAND, text: translate('set frame [number] of animation [animation] to [dataurl] with rotation [rotation] in canvas [CANVAS]'), arguments: { number: { type: ArgumentType.NUMBER, defaultValue: -1 }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, dataurl: { type: ArgumentType.STRING, defaultValue: '' }, rotation: { type: ArgumentType.ANGLE, defaultValue: 90 }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'removeSparrowSheetFrame', blockType: BlockType.COMMAND, text: translate('remove frame [number] of animation [animation] from canvas [CANVAS]'), arguments: { number: { type: ArgumentType.NUMBER, defaultValue: -1 }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'removeSparrowSheetAnimation', blockType: BlockType.COMMAND, text: translate('remove animation [animation] from canvas [CANVAS]'), arguments: { animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'renameAnimation', blockType: BlockType.COMMAND, text: translate('rename animation [ANIM] in canvas [CANVAS] to [NAME]'), arguments: { ANIM: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.arrayBlock(this._getArgDefs({ opcode: 'getSparrowSheetAnimations', blockType: BlockType.REPORTER, text: translate('animations in canvas [CANVAS]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            this._getArgDefs({ opcode: 'getSparrowSheetFrameCount', blockType: BlockType.REPORTER, text: translate('frame count of animation [animation] in canvas [CANVAS]'), arguments: { animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'removeSparrowSheetAnimationByNumber', blockType: BlockType.COMMAND, text: translate('remove animation number [number] from canvas [CANVAS]'), arguments: { number: { type: ArgumentType.NUMBER, defaultValue: 0 }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'isSparrowSheetFrame', blockType: BlockType.BOOLEAN, text: translate('is frame [number] of animation [animation] in canvas [CANVAS] [type]'), arguments: { number: { type: ArgumentType.NUMBER, defaultValue: 1 }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' }, type: { type: ArgumentType.STRING, menu: 'frameTypeMenu' } } }),
            "---",
            this._getArgDefs({ opcode: 'getSparrowSheetFrame', blockType: BlockType.REPORTER, text: translate('get [mode] frame [number] of animation [anim] from canvas [CANVAS]'), arguments: { mode: { type: ArgumentType.STRING, menu: 'rawSetMenu', defaultValue: 'set' }, number: { type: ArgumentType.NUMBER, defaultValue: 1 }, anim: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'getSparrowSheetFrameFromData', blockType: BlockType.REPORTER, text: translate('get [mode] frame [number] of animation [anim] in sparrow spritesheet [dataurl] using [format] data [data]'), arguments: { mode: { type: ArgumentType.STRING, menu: 'rawSetMenu', defaultValue: 'set' }, number: { type: ArgumentType.NUMBER, defaultValue: 1 }, anim: { type: ArgumentType.STRING, defaultValue: 'idle' }, dataurl: { type: ArgumentType.STRING, defaultValue: 'dataurl here' }, format: { type: ArgumentType.STRING, menu: 'useFormat' }, data: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.arrayBlock(this._getArgDefs({ opcode: 'getAllFramesOfAnimation', blockType: BlockType.REPORTER, text: translate('get all frames of animation [ANIM] from sparrow spritesheet [DATAURL] using [FORMAT] data [DATA]'), arguments: { ANIM: { type: ArgumentType.STRING, defaultValue: 'Animation' }, DATAURL: { type: ArgumentType.STRING, defaultValue: '' }, FORMAT: { type: ArgumentType.STRING, menu: 'useFormat' }, DATA: { type: ArgumentType.STRING, defaultValue: '' } } })),
            engine.arrayBlock(this._getArgDefs({ opcode: 'allFramesOfAnimation', blockType: BlockType.REPORTER, text: translate('all [TYPE] of animation [ANIM] in canvas [CANVAS]'), arguments: { TYPE: { type: ArgumentType.STRING, menu: 'imageNameMenu' }, ANIM: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            engine.arrayBlock(this._getArgDefs({ opcode: 'allFramesInCanvas', blockType: BlockType.REPORTER, text: translate('all [TYPE] in canvas [CANVAS]'), arguments: { TYPE: { type: ArgumentType.STRING, menu: 'imageNameMenu' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            "---",
            this._getArgDefs({ opcode: 'isSparrowSheetDataValid', blockType: BlockType.BOOLEAN, text: translate('is sparrow sheet data [DATA] valid?'), arguments: { DATA: { type: ArgumentType.STRING, defaultValue: '' } } }),
            "---",
            this._getArgDefs({ opcode: 'doesAnimationExistInSparrowSheet', blockType: BlockType.BOOLEAN, text: translate('does animation [ANIM] exist in canvas [CANVAS]?'), arguments: { ANIM: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            engine.arrayBlock(this._getArgDefs({ opcode: 'getFrameCoordsInSparrowSheet', blockType: BlockType.REPORTER, text: translate('coords of frame [FRAME] of animation [ANIM] in canvas [CANVAS]'), arguments: { FRAME: { type: ArgumentType.NUMBER, defaultValue: 1 }, ANIM: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            "---",
            this._getArgDefs({ opcode: 'getAnimationVariable', blockType: BlockType.REPORTER, text: translate('get variable [variable] of animation [animation] in canvas [CANVAS]'), arguments: { variable: { type: ArgumentType.STRING, defaultValue: 'fps' }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'setAnimationVariable', blockType: BlockType.COMMAND, text: translate('set variable [variable] of animation [animation] in canvas [CANVAS] to [value]'), arguments: { variable: { type: ArgumentType.STRING, defaultValue: 'fps' }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' }, value: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._getArgDefs({ opcode: 'getFrameVariable', blockType: BlockType.REPORTER, text: translate('get variable [variable] of frame [number] of animation [animation] in canvas [CANVAS]'), arguments: { variable: { type: ArgumentType.STRING, defaultValue: 'duration' }, number: { type: ArgumentType.NUMBER, defaultValue: 1 }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'setFrameVariable', blockType: BlockType.COMMAND, text: translate('set variable [variable] of frame [number] of animation [animation] in canvas [CANVAS] to [value]'), arguments: { variable: { type: ArgumentType.STRING, defaultValue: 'duration' }, number: { type: ArgumentType.NUMBER, defaultValue: 1 }, animation: { type: ArgumentType.STRING, defaultValue: 'idle' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' }, value: { type: ArgumentType.STRING, defaultValue: '' } } }),
            "---",
            this._getArgDefs({ opcode: 'addCanvasToCanvas', blockType: BlockType.COMMAND, text: translate('add canvas [C1] to canvas [C2]'), arguments: { C1: { type: ArgumentType.STRING, defaultValue: 'default' }, C2: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'mergeCanvases', blockType: BlockType.COMMAND, text: translate('merge canvas [C1] to canvas [C2] into [C3]'), arguments: { C1: { type: ArgumentType.STRING, defaultValue: 'default' }, C2: { type: ArgumentType.STRING, defaultValue: 'default' }, C3: { type: ArgumentType.STRING, defaultValue: 'merged' } } }),
            this._getArgDefs({ opcode: 'addAnimationToCanvas', blockType: BlockType.COMMAND, text: translate('add animation [ANIM] from canvas [C1] to canvas [C2] as [NAME]'), arguments: { ANIM: { type: ArgumentType.STRING, defaultValue: 'idle' }, C1: { type: ArgumentType.STRING, defaultValue: 'default' }, C2: { type: ArgumentType.STRING, defaultValue: 'default' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            "---",
            ...this._makeFolder("Config", [
              ...this._makeFolder("General Config", [
                this._getArgDefs({ opcode: 'setGeneralResize', blockType: BlockType.COMMAND, text: translate('set general resize [resize]'), arguments: { resize: { type: ArgumentType.STRING, menu: 'resizeMenu', defaultValue: 'off' } } }),
                this._getArgDefs({ opcode: 'setGeneralOrientation', blockType: BlockType.COMMAND, text: translate('set general orientation [orientation]'), arguments: { orientation: { type: ArgumentType.STRING, menu: 'orientationMenu', defaultValue: 'horizontal' } } }),
                this._getArgDefs({ opcode: 'setGeneralPadding', blockType: BlockType.COMMAND, text: translate('set general padding [padding]'), arguments: { padding: { type: ArgumentType.NUMBER, defaultValue: 6 } } }),
                this._getArgDefs({ opcode: 'setGeneralDupeMissing', blockType: BlockType.COMMAND, text: translate('set general dupe missing frames [dupe]'), arguments: { dupe: { type: ArgumentType.STRING, menu: 'dupeMenu', defaultValue: 'off' } } }),
                this._getArgDefs({ opcode: 'setGeneralKeepOriginalCoordinates', blockType: BlockType.COMMAND, text: translate('set general keep original coordinates [flag]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: false } } }),
                this._getArgDefs({ opcode: 'setGeneralAdobeXML', blockType: BlockType.COMMAND, text: translate('set general adobe style XML [flag]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: false } } }),
                this._getArgDefs({ opcode: 'setGeneralMaxWidth', blockType: BlockType.COMMAND, text: translate('set general max width [width]'), arguments: { width: { type: ArgumentType.NUMBER, defaultValue: 0 } } }),
                this._getArgDefs({ opcode: 'setGeneralSmooth', blockType: BlockType.COMMAND, text: translate('set general image smoothing [flag]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: true } } }),
                this._getArgDefs({ opcode: 'setGeneralImageName', blockType: BlockType.COMMAND, text: translate('set general image name [name]'), arguments: { name: { type: ArgumentType.STRING, defaultValue: 'spritesheet.png' } } }),
                this._getArgDefs({ opcode: 'setGeneralResolution', blockType: BlockType.COMMAND, text: translate('set general export resolution [resolution]'), arguments: { resolution: { type: ArgumentType.STRING, defaultValue: '1' } } }),
                this._getArgDefs({ opcode: 'setGeneralMergePriority', blockType: BlockType.COMMAND, text: translate('set general merge priority [PRIORITY]'), arguments: { PRIORITY: { type: ArgumentType.STRING, menu: 'mergePriorityMenu', defaultValue: 'primary' } } }),
                this._getArgDefs({ opcode: 'setGeneralMergeAction', blockType: BlockType.COMMAND, text: translate('set general merge action [ACTION]'), arguments: { ACTION: { type: ArgumentType.STRING, menu: 'mergeActionMenu', defaultValue: 'overwrite' } } }),
                "---",
                this._getArgDefs({ opcode: 'setAllGeneralConfigs', blockType: BlockType.COMMAND, text: translate('set config options [OBJ]'), arguments: { OBJ: engine.objectInput({ type: ArgumentType.STRING, defaultValue: '{}' }) } }),
                this._getArgDefs({ opcode: 'getGeneralConfig', blockType: BlockType.REPORTER, text: translate('get config [config]'), arguments: { config: { type: ArgumentType.STRING, menu: 'generalConfigMenu' } } }),
                engine.objectBlock({ opcode: 'getAllGeneralConfigs', blockType: BlockType.REPORTER, text: translate('all config options') })
              ]),
              ...this._makeFolder("Canvas Config", [
                this._getArgDefs({ opcode: 'setSparrowSheetResize', blockType: BlockType.COMMAND, text: translate('set canvas resize [resize] for [CANVAS]'), arguments: { resize: { type: ArgumentType.STRING, menu: 'resizeMenu', defaultValue: 'off' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetOrientation', blockType: BlockType.COMMAND, text: translate('set canvas orientation [orientation] for [CANVAS]'), arguments: { orientation: { type: ArgumentType.STRING, menu: 'orientationMenu', defaultValue: 'horizontal' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetPadding', blockType: BlockType.COMMAND, text: translate('set canvas padding [padding] for [CANVAS]'), arguments: { padding: { type: ArgumentType.NUMBER, defaultValue: 6 }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetDupeMissing', blockType: BlockType.COMMAND, text: translate('set canvas dupe missing frames [dupe] for [CANVAS]'), arguments: { dupe: { type: ArgumentType.STRING, menu: 'dupeMenu', defaultValue: 'off' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetKeepOriginalCoordinates', blockType: BlockType.COMMAND, text: translate('set canvas keep original coordinates [flag] for [CANVAS]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: false }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetAdobeXML', blockType: BlockType.COMMAND, text: translate('set canvas adobe style XML [flag] for [CANVAS]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: false }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetMaxWidth', blockType: BlockType.COMMAND, text: translate('set canvas max width [width] for [CANVAS]'), arguments: { width: { type: ArgumentType.NUMBER, defaultValue: 0 }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetSmooth', blockType: BlockType.COMMAND, text: translate('set canvas image smoothing [flag] for [CANVAS]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: true }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetImageName', blockType: BlockType.COMMAND, text: translate('set canvas image name [name] for [CANVAS]'), arguments: { name: { type: ArgumentType.STRING, defaultValue: 'spritesheet.png' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                this._getArgDefs({ opcode: 'setSparrowSheetResolution', blockType: BlockType.COMMAND, text: translate('set canvas export resolution [resolution] for [CANVAS]'), arguments: { resolution: { type: ArgumentType.STRING, defaultValue: '1' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                "---",
                this._getArgDefs({ opcode: 'getCanvasConfig', blockType: BlockType.REPORTER, text: translate('get canvas config [config] for [CANVAS]'), arguments: { config: { type: ArgumentType.STRING, menu: 'generalConfigMenu' }, CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
                engine.objectBlock(this._getArgDefs({ opcode: 'getAllCanvasConfigs', blockType: BlockType.REPORTER, text: translate('all canvas config options for [CANVAS]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
                "---",
                this._getArgDefs({ opcode: 'setAllCanvasConfigs', blockType: BlockType.COMMAND, text: translate('set all canvas config options for [CANVAS] to [OBJ]'), arguments: { CANVAS: { type: ArgumentType.STRING, defaultValue: 'default' }, OBJ: engine.objectInput({ type: ArgumentType.STRING, defaultValue: '{}' }) } })
              ])
            ])
          ]),
          "---",
          ...this._makeFolder("Grid Sheets", [
            this._getArgDefs({ opcode: 'createNewGrid', blockType: BlockType.COMMAND, text: translate('create new grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'removeGrid', blockType: BlockType.COMMAND, text: translate('remove grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            engine.arrayBlock({ opcode: 'existingGrids', blockType: BlockType.REPORTER, text: translate('existing grids') }),
            "---",
            this._getArgDefs({ opcode: 'setGridSheet', blockType: BlockType.COMMAND, text: translate('set grid sheet [GRID] image: [image] with [format] data [data]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' }, image: { type: ArgumentType.STRING, defaultValue: '' }, format: { type: ArgumentType.STRING, menu: 'gridSetFormat', defaultValue: 'json' }, data: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._getArgDefs({ opcode: 'getGridSheetAsset', blockType: BlockType.REPORTER, text: translate('grid sheet asset [filetype] of grid [GRID]'), arguments: { filetype: { type: ArgumentType.STRING, menu: 'fileTypeMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'generateGridSheet', blockType: BlockType.COMMAND, text: translate('generate grid sheet [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'discardGridSheetModifications', blockType: BlockType.COMMAND, text: translate('remove modified grid sheet [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            engine.objectBlock(this._getArgDefs({ opcode: 'exportGrid', blockType: BlockType.REPORTER, text: translate('export grid [GRID] with [TYPE] data'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' }, TYPE: { type: ArgumentType.STRING, menu: 'exportFormatMenu' } } })),
            "---",
            engine.objectBlock(this._getArgDefs({ opcode: 'getCellDimensions', blockType: BlockType.REPORTER, text: translate('get cell dimensions of grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            engine.objectBlock(this._getArgDefs({ opcode: 'getSheetJSON', blockType: BlockType.REPORTER, text: translate('get sheet json of grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            engine.objectBlock(this._getArgDefs({ opcode: 'createGridData', blockType: BlockType.REPORTER, text: translate('create grid data columns: [x] rows: [y] width: [w] height: [h] padding: [p]'), arguments: { x: { type: ArgumentType.NUMBER, defaultValue: 1 }, y: { type: ArgumentType.NUMBER, defaultValue: 1 }, w: { type: ArgumentType.NUMBER, defaultValue: 0 }, h: { type: ArgumentType.NUMBER, defaultValue: 0 }, p: { type: ArgumentType.NUMBER, defaultValue: 0 } } })),
            "---",
            this._getArgDefs({ opcode: 'setCellImage', blockType: BlockType.COMMAND, text: translate('set cell column: [x] row: [y] to image: [image] offset x: [ox] y: [oy] in grid [GRID]'), arguments: { x: { type: ArgumentType.NUMBER, defaultValue: 1 }, y: { type: ArgumentType.NUMBER, defaultValue: 1 }, image: { type: ArgumentType.STRING, defaultValue: '' }, ox: { type: ArgumentType.NUMBER, defaultValue: 0 }, oy: { type: ArgumentType.NUMBER, defaultValue: 0 }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'removeCell', blockType: BlockType.COMMAND, text: translate('remove cell column: [x] row: [y] in grid [GRID]'), arguments: { x: { type: ArgumentType.NUMBER, defaultValue: 1 }, y: { type: ArgumentType.NUMBER, defaultValue: 1 }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'resizeCells', blockType: BlockType.COMMAND, text: translate('resize cells to width: [width] height: [height] in grid [GRID]'), arguments: { width: { type: ArgumentType.NUMBER, defaultValue: 100 }, height: { type: ArgumentType.NUMBER, defaultValue: 100 }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            "---",
            this._getArgDefs({ opcode: 'getCellImage', blockType: BlockType.REPORTER, text: translate('get cell column: [x] row: [y] from grid [GRID]'), arguments: { x: { type: ArgumentType.NUMBER, defaultValue: 1 }, y: { type: ArgumentType.NUMBER, defaultValue: 1 }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
            this._getArgDefs({ opcode: 'getExternalCell', blockType: BlockType.REPORTER, text: translate('get cell column: [x] row: [y] from image: [image] using [format] data [data]'), arguments: { x: { type: ArgumentType.NUMBER, defaultValue: 1 }, y: { type: ArgumentType.NUMBER, defaultValue: 1 }, image: { type: ArgumentType.STRING, defaultValue: '' }, format: { type: ArgumentType.STRING, menu: 'useFormat' }, data: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.objectBlock(this._getArgDefs({ opcode: 'getGridCuttingJSON', blockType: BlockType.REPORTER, text: translate('grid cutting json columns: [x] rows: [y]'), arguments: { x: { type: ArgumentType.NUMBER, defaultValue: 1 }, y: { type: ArgumentType.NUMBER, defaultValue: 1 } } })),
            "---",
            engine.arrayBlock(this._getArgDefs({ opcode: 'listGridSheetLine', blockType: BlockType.REPORTER, text: translate('list grid sheet [CR] [NUM] of grid [GRID]'), arguments: { CR: { type: ArgumentType.STRING, menu: 'gridLineMenu' }, NUM: { type: ArgumentType.NUMBER, defaultValue: 1 }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            engine.arrayBlock(this._getArgDefs({ opcode: 'allGridImages', blockType: BlockType.REPORTER, text: translate('all [TYPE] in grid [GRID]'), arguments: { TYPE: { type: ArgumentType.STRING, menu: 'gridCellTypeMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } })),
            "---",
            this._getArgDefs({ opcode: 'isGridSheetDataValid', blockType: BlockType.BOOLEAN, text: translate('is grid sheet data [DATA] valid?'), arguments: { DATA: { type: ArgumentType.STRING, defaultValue: '' } } }),
            "---",
            ...this._makeFolder("Grid Config", [
              this._getArgDefs({ opcode: 'setGridSheetSmooth', blockType: BlockType.COMMAND, text: translate('grid sheet config [GRID]: image smoothing [flag]'), arguments: { flag: { type: ArgumentType.BOOLEAN, defaultValue: false }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridSheetPadding', blockType: BlockType.COMMAND, text: translate('grid sheet config [GRID]: padding [padding]'), arguments: { padding: { type: ArgumentType.NUMBER, defaultValue: 0 }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridSheetAnchoring', blockType: BlockType.COMMAND, text: translate('grid sheet config [GRID]: anchoring [anchoring]'), arguments: { anchoring: { type: ArgumentType.STRING, menu: 'anchoringMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridSheetSpriteResize', blockType: BlockType.COMMAND, text: translate('grid sheet config [GRID]: resize sprite [spriteResize]'), arguments: { spriteResize: { type: ArgumentType.STRING, menu: 'spriteResizeMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridSheetCellResize', blockType: BlockType.COMMAND, text: translate('grid sheet config [GRID]: resize cells [cellResize]'), arguments: { cellResize: { type: ArgumentType.STRING, menu: 'cellResizeMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridSheetDupeMissingCells', blockType: BlockType.COMMAND, text: translate('grid sheet config [GRID]: dupe missing cells [dupe]'), arguments: { dupe: { type: ArgumentType.STRING, menu: 'dupeCellsMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'getGridSheetConfig', blockType: BlockType.REPORTER, text: translate('grid sheet config [config] of grid [GRID]'), arguments: { config: { type: ArgumentType.STRING, menu: 'gridConfigMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridCollectionXDir', blockType: BlockType.COMMAND, text: translate('set grid collection x direction [XDIR] for grid [GRID]'), arguments: { XDIR: { type: ArgumentType.STRING, menu: 'xDirMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'getGridCollectionXDir', blockType: BlockType.REPORTER, text: translate('grid collection x direction of grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridCollectionYDir', blockType: BlockType.COMMAND, text: translate('set grid collection y direction [YDIR] for grid [GRID]'), arguments: { YDIR: { type: ArgumentType.STRING, menu: 'yDirMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'getGridCollectionYDir', blockType: BlockType.REPORTER, text: translate('grid collection y direction of grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'setGridCollectionPriority', blockType: BlockType.COMMAND, text: translate('set grid collection priority [PDIR] for grid [GRID]'), arguments: { PDIR: { type: ArgumentType.STRING, menu: 'priorityDirMenu' }, GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } }),
              this._getArgDefs({ opcode: 'getGridCollectionPriority', blockType: BlockType.REPORTER, text: translate('grid collection priority of grid [GRID]'), arguments: { GRID: { type: ArgumentType.STRING, defaultValue: 'default' } } })
            ])
          ])
        ],
        menus: {
          fileTypeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('png'), value: 'png' },
              { text: translate('xml'), value: 'xml' },
              { text: translate('json'), value: 'json' },
              { text: translate('ini'), value: 'ini' }
            ]
          },
          exportFormatMenu: {
            acceptReporters: true,
            items: [
              { text: translate('xml'), value: 'xml' },
              { text: translate('json'), value: 'json' },
              { text: translate('ini'), value: 'ini' }
            ]
          },
          clearFileTypeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('all'), value: 'all' },
              { text: translate('png'), value: 'png' },
              { text: translate('xml'), value: 'xml' },
              { text: translate('json'), value: 'json' },
              { text: translate('ini'), value: 'ini' }
            ]
          },
          useFormat: {
            acceptReporters: true,
            items: [
              { text: translate('xml'), value: 'xml' },
              { text: translate('json'), value: 'json' },
              { text: translate('ini'), value: 'ini' }
            ]
          },
          getFormat: {
            acceptReporters: true,
            items: [
              { text: translate('detect'), value: 'detect' },
              { text: translate('xml'), value: 'xml' },
              { text: translate('json'), value: 'json' },
              { text: translate('ini'), value: 'ini' }
            ]
          },
          gridSetFormat: {
            acceptReporters: true,
            items: [
              { text: translate('json'), value: 'json' },
              { text: translate('xml'), value: 'xml' },
              { text: translate('ini'), value: 'ini' }
            ]
          },
          resizeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('off'), value: 'off' },
              { text: translate('up'), value: 'up' },
              { text: translate('down'), value: 'down' }
            ]
          },
          orientationMenu: {
            acceptReporters: true,
            items: [
              { text: translate('horizontal'), value: 'horizontal' },
              { text: translate('vertical'), value: 'vertical' }
            ]
          },
          dupeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('off'), value: 'off' },
              { text: translate('behind'), value: 'behind' },
              { text: translate('forward'), value: 'forward' }
            ]
          },
          frameTypeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('nonexistent'), value: 'nonexistent' },
              { text: translate('blank'), value: 'blank' }
            ]
          },
          rawSetMenu: {
            acceptReporters: true,
            items: [
              { text: translate('set'), value: 'set' },
              { text: translate('raw'), value: 'raw' }
            ]
          },
          generalConfigMenu: {
            acceptReporters: true,
            items: [
              { text: translate('resize'), value: 'resize' },
              { text: translate('orientation'), value: 'orientation' },
              { text: translate('padding'), value: 'padding' },
              { text: translate('dupe missing frames'), value: 'dupeMissingFrames' },
              { text: translate('keep original coordinates'), value: 'keepOriginalCoordinates' },
              { text: translate('adobe style XML'), value: 'adobeStyleXML' },
              { text: translate('max width'), value: 'maxWidth' },
              { text: translate('image smoothing'), value: 'smoothImages' },
              { text: translate('image name'), value: 'imageName' },
              { text: translate('export resolution'), value: 'resolution' },
              { text: translate('merge priority'), value: 'mergePriority' },
              { text: translate('merge action'), value: 'mergeAction' }
            ]
          },
          anchoringMenu: {
            acceptReporters: true,
            items: [
              { text: translate('center'), value: 'center' },
              { text: translate('top left'), value: 'top left' },
              { text: translate('top center'), value: 'top center' },
              { text: translate('top right'), value: 'top right' },
              { text: translate('middle left'), value: 'middle left' },
              { text: translate('middle right'), value: 'middle right' },
              { text: translate('bottom left'), value: 'bottom left' },
              { text: translate('bottom center'), value: 'bottom center' },
              { text: translate('bottom right'), value: 'bottom right' }
            ]
          },
          spriteResizeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('none'), value: 'none' },
              { text: translate('scale up'), value: 'scale up' },
              { text: translate('scale down'), value: 'scale down' }
            ]
          },
          cellResizeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('scale up'), value: 'scale up' },
              { text: translate('scale down'), value: 'scale down' }
            ]
          },
          dupeCellsMenu: {
            acceptReporters: true,
            items: [
              { text: translate('off'), value: 'off' },
              { text: translate('by X'), value: 'by X' },
              { text: translate('by Y'), value: 'by Y' }
            ]
          },
          gridConfigMenu: {
            acceptReporters: true,
            items: [
              { text: translate('image smoothing'), value: 'smoothImages' },
              { text: translate('padding'), value: 'padding' },
              { text: translate('anchoring'), value: 'anchoring' },
              { text: translate('resize sprite'), value: 'spriteResize' },
              { text: translate('resize cells'), value: 'cellResize' },
              { text: translate('dupe missing cells'), value: 'dupeMissingCells' }
            ]
          },
          gridLineMenu: {
            acceptReporters: true,
            items: [
              { text: translate('column'), value: 'column' },
              { text: translate('row'), value: 'row' }
            ]
          },
          mergePriorityMenu: {
            acceptReporters: true,
            items: [
              { text: translate('primary'), value: 'primary' },
              { text: translate('secondary'), value: 'secondary' }
            ]
          },
          mergeActionMenu: {
            acceptReporters: true,
            items: [
              { text: translate('overwrite'), value: 'overwrite' },
              { text: translate('alt-ify'), value: 'alt-ify' }
            ]
          },
          imageNameMenu: {
            acceptReporters: true,
            items: [
              { text: translate('images'), value: 'images' },
              { text: translate('names'), value: 'names' }
            ]
          },
          gridCellTypeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('images'), value: 'images' },
              { text: translate('numberid'), value: 'numberid' }
            ]
          },
          xDirMenu: {
            acceptReporters: true,
            items: [
              { text: translate('left to right'), value: 'left to right' },
              { text: translate('right to left'), value: 'right to left' }
            ]
          },
          yDirMenu: {
            acceptReporters: true,
            items: [
              { text: translate('top to bottom'), value: 'top to bottom' },
              { text: translate('bottom to top'), value: 'bottom to top' }
            ]
          },
          priorityDirMenu: {
            acceptReporters: true,
            items: [
              { text: translate('x'), value: 'x' },
              { text: translate('y'), value: 'y' }
            ]
          }
        }
      };
    }

    setGeneralResize(args) { this._setGeneralConfig('resize', Cast.toString(args.resize)); }
    setGeneralOrientation(args) { this._setGeneralConfig('orientation', Cast.toString(args.orientation)); }
    setGeneralPadding(args) { this._setGeneralConfig('padding', Math.max(0, Cast.toNumber(args.padding))); }
    setGeneralDupeMissing(args) { this._setGeneralConfig('dupeMissingFrames', Cast.toString(args.dupe)); }
    setGeneralKeepOriginalCoordinates(args) { this._setGeneralConfig('keepOriginalCoordinates', Cast.toBoolean(args.flag)); }
    setGeneralAdobeXML(args) { this._setGeneralConfig('adobeStyleXML', Cast.toBoolean(args.flag)); }
    setGeneralMaxWidth(args) { this._setGeneralConfig('maxWidth', Math.max(0, Cast.toNumber(args.width))); }
    setGeneralSmooth(args) { this._setGeneralConfig('smoothImages', Cast.toBoolean(args.flag)); }
    setGeneralImageName(args) { this._setGeneralConfig('imageName', Cast.toString(args.name)); }
    setGeneralResolution(args) { this._setGeneralConfig('resolution', Cast.toString(args.resolution)); }
    setGeneralMergePriority(args) { this._setGeneralConfig('mergePriority', Cast.toString(args.PRIORITY) || 'primary'); }
    setGeneralMergeAction(args) { this._setGeneralConfig('mergeAction', Cast.toString(args.ACTION) || 'overwrite'); }

    getGeneralConfig(args) {
      const key = Cast.toString(args.config);
      if (key in this.generalConfig) {
        const val = this.generalConfig[key];
        if (typeof val == 'boolean') return Cast.toBoolean(val);
        if (typeof val == 'number') return Cast.toNumber(val);
        return Cast.toString(val);
      }
      return '';
    }

    getAllGeneralConfigs() {
      return engine.handleObject(this.generalConfig);
    }

    setAllGeneralConfigs(args) {
      const obj = engine.handleObject(args.OBJ, false);
      if (typeof obj == 'object' && obj !== null) {
        for (const key in obj) {
          if (key in this.generalConfig) {
            let val = obj[key];
            const current = this.generalConfig[key];
            if (typeof current == 'boolean') val = Cast.toBoolean(val);
            else if (typeof current == 'number') val = Cast.toNumber(val);
            else val = Cast.toString(val);
            this._setGeneralConfig(key, val);
          }
        }
      }
    }

    getCanvasConfig(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const key = Cast.toString(args.config);
      const val = this._getCanvasConfig(canvasName, key);
      if (val === undefined) return '';
      if (typeof val == 'boolean') return Cast.toBoolean(val);
      if (typeof val == 'number') return Cast.toNumber(val);
      return Cast.toString(val);
    }

    getAllCanvasConfigs(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const c = this._getCanvas(canvasName);
      const fullConfig = { ...this.generalConfig };
      delete fullConfig.mergePriority;
      delete fullConfig.mergeAction;
      delete fullConfig.frameCutAnchor;
      if (c.config) {
        for (const key in c.config) {
          if (key in fullConfig) fullConfig[key] = c.config[key];
        }
      }
      return engine.handleObject(fullConfig);
    }

    setAllCanvasConfigs(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const obj = engine.handleObject(args.OBJ, false);
      if (typeof obj == 'object' && obj !== null) {
        const c = this._getCanvas(canvasName);
        if (!c.config) c.config = {};
        for (const key in obj) {
          if (key in c.config || key in this.generalConfig) {
            if (key == 'mergePriority' || key == 'mergeAction' || key == 'frameCutAnchor') continue;
            let val = obj[key];
            const current = this.generalConfig[key] !== undefined ? this.generalConfig[key] : c.config[key];
            if (typeof current == 'boolean') val = Cast.toBoolean(val);
            else if (typeof current == 'number') val = Cast.toNumber(val);
            else val = Cast.toString(val);
            c.config[key] = val;
          }
        }
        c.needsReCache = true;
      }
    }

    setSparrowSheetResize(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'resize', Cast.toString(args.resize));
    }

    setSparrowSheetOrientation(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'orientation', Cast.toString(args.orientation));
    }

    setSparrowSheetPadding(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'padding', Math.max(0, Cast.toNumber(args.padding)));
    }

    setSparrowSheetDupeMissing(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'dupeMissingFrames', Cast.toString(args.dupe));
    }

    setSparrowSheetKeepOriginalCoordinates(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'keepOriginalCoordinates', Cast.toBoolean(args.flag));
    }

    setSparrowSheetAdobeXML(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'adobeStyleXML', Cast.toBoolean(args.flag));
    }

    setSparrowSheetMaxWidth(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'maxWidth', Math.max(0, Cast.toNumber(args.width)));
    }

    setSparrowSheetSmooth(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'smoothImages', Cast.toBoolean(args.flag));
    }

    setSparrowSheetImageName(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'imageName', Cast.toString(args.name));
    }

    setSparrowSheetResolution(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      this._setCanvasConfig(canvasName, 'resolution', Cast.toString(args.resolution));
    }

    addCanvasToCanvas(args) {
      const name1 = Cast.toString(args.C1) || 'default';
      const name2 = Cast.toString(args.C2) || 'default';
      const c1 = this._getCanvas(name1);
      const c2 = this._getCanvas(name2);
      const priority = this.generalConfig.mergePriority;
      const action = this.generalConfig.mergeAction;
      const overwrite = (priority == 'primary');
      this._addAllAnimations(c1, c2, overwrite, action);
      c2.needsReCache = true;
      return Promise.resolve();
    }

    mergeCanvases(args) {
      const name1 = Cast.toString(args.C1) || 'default';
      const name2 = Cast.toString(args.C2) || 'default';
      const name3 = Cast.toString(args.C3) || 'merged';
      const c1 = this._getCanvas(name1);
      const c2 = this._getCanvas(name2);
      this.canvases[name3] = {
        animations: {},
        frameMetadata: {},
        blankFrames: {},
        finalImage: '',
        sourceSheetImage: '',
        config: { ...this.generalConfig },
        animationVariables: {},
        frameVariables: {},
        customFrames: {},
        meta: { size: { w: 0, h: 0 } },
        cachedJSON: '',
        cachedPNG: '',
        needsReCache: true,
        originalData: null
      };
      delete this.canvases[name3].config.mergePriority;
      delete this.canvases[name3].config.mergeAction;
      delete this.canvases[name3].config.frameCutAnchor;
      const target = this.canvases[name3];
      const priority = this.generalConfig.mergePriority;
      const action = this.generalConfig.mergeAction;
      this._mergeCanvases(c1, c2, target, priority, action);
      target.needsReCache = true;
      return Promise.resolve();
    }

    addAnimationToCanvas(args) {
      const anim = Cast.toString(args.ANIM);
      const name1 = Cast.toString(args.C1) || 'default';
      const name2 = Cast.toString(args.C2) || 'default';
      const newName = Cast.toString(args.NAME) || null;
      if (!anim) return Promise.resolve();
      const c1 = this._getCanvas(name1);
      const c2 = this._getCanvas(name2);
      if (!c1.animations[anim]) return Promise.resolve();
      const priority = this.generalConfig.mergePriority;
      const action = this.generalConfig.mergeAction;
      const overwrite = (priority == 'primary');
      this._copyAnimationWithRename(c1, c2, anim, newName, overwrite, action);
      c2.needsReCache = true;
      return Promise.resolve();
    }

    renameAnimation(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const oldName = Cast.toString(args.ANIM);
      const newName = Cast.toString(args.NAME);
      if (oldName && newName && oldName != newName) {
        if (this._renameAnimation(canvas, oldName, newName)) {
          canvas.needsReCache = true;
        }
      }
      return Promise.resolve();
    }

    existingCanvases() {
      return engine.handleArray(Object.keys(this.canvases));
    }

    removeCanvas(args) {
      const name = Cast.toString(args.CANVAS);
      if (this.canvases[name]) {
        delete this.canvases[name];
      }
    }

    needToRecut(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      return Cast.toBoolean(this._getCanvas(canvasName).needsReCache);
    }

    setFocusItem(args) {
      const ft = args.filetype;
      if (ft in this.focusItems) this.focusItems[ft] = Cast.toString(args.content);
    }

    clearFocusItem(args) {
      const ft = args.filetype;
      if (ft == 'all') {
        for (const key in this.focusItems) this.focusItems[key] = '';
      } else if (ft in this.focusItems) {
        this.focusItems[ft] = '';
      }
    }

    getFocusItem(args) {
      const ft = args.filetype;
      return Cast.toString(ft in this.focusItems ? this.focusItems[ft] : '');
    }

    convertSvgToPng(args) {
      return new Promise(resolve => {
        const svgString = Cast.toString(args.SVG);
        const scale = Math.max(1, Cast.toNumber(args.SCALE) || 100) / 100;
        if (!svgString || typeof svgString != 'string') { resolve(''); return; }
        const blob = new Blob([svgString], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          let w = img.naturalWidth;
          let h = img.naturalHeight;
          if (w == 0 && h == 0) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svgString, 'image/svg+xml');
            const svgEl = doc.documentElement;
            if (svgEl) {
              const vb = svgEl.getAttribute('viewBox');
              if (vb) {
                const parts = vb.split(/\s+/);
                if (parts.length == 4) {
                  w = parseFloat(parts[2]) || 300;
                  h = parseFloat(parts[3]) || 150;
                }
              }
              if (w == 0 && h == 0) {
                w = parseFloat(svgEl.getAttribute('width')) || 300;
                h = parseFloat(svgEl.getAttribute('height')) || 150;
              }
            }
            if (w == 0 && h == 0) { w = 300; h = 150; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(w * scale);
          canvas.height = Math.round(h * scale);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(blobResult => {
            URL.revokeObjectURL(url);
            if (!blobResult) { resolve(''); return; }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blobResult);
          }, 'image/png');
        };
        img.onerror = () => { URL.revokeObjectURL(url); resolve(''); };
        img.src = url;
      });
    }

    getImageDimensions(args) {
      return new Promise(resolve => {
        const dataurl = Cast.toString(args.DATAURL);
        if (!dataurl || !dataurl.startsWith('data:image/png')) { resolve(engine.handleArray([])); return; }
        const img = new Image();
        img.onload = () => resolve(engine.handleArray([img.width, img.height]));
        img.onerror = () => resolve(engine.handleArray([0, 0]));
        img.src = dataurl;
      });
    }

    rotatePng(args) {
      return new Promise(resolve => {
        const dataurl = Cast.toString(args.DATAURL);
        const angle = Cast.toNumber(args.ANGLE) || 90;
        if (!dataurl || !dataurl.startsWith('data:image/png')) { resolve(''); return; }
        const img = new Image();
        img.onload = () => {
          const rad = angle * Math.PI / 180;
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.translate(canvas.width / 2, canvas.height / 2);
          ctx.rotate(rad);
          ctx.drawImage(img, -img.width / 2, -img.height / 2);
          canvas.toBlob(blob => {
            if (!blob) { resolve(''); return; }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          }, 'image/png');
        };
        img.onerror = () => resolve('');
        img.src = dataurl;
      });
    }

    setFrameCutAnchor(args) {
      this._setGeneralConfig('frameCutAnchor', Cast.toString(args.ANCHOR));
      this.sheetUtilConfig.frameCutAnchor = Cast.toString(args.ANCHOR);
    }

    getFrameCutAnchor() {
      return Cast.toString(this.generalConfig.frameCutAnchor || 'center');
    }

    getFrameCrop(args) {
      return new Promise(resolve => {
        const x1 = Cast.toNumber(args.X1);
        const y1 = Cast.toNumber(args.Y1);
        const x2 = Cast.toNumber(args.X2);
        const y2 = Cast.toNumber(args.Y2);
        const dataurl = Cast.toString(args.DATAURL);
        if (!dataurl || !dataurl.startsWith('data:image/png')) { resolve(''); return; }
        const img = new Image();
        img.onload = () => {
          const w = img.width;
          const h = img.height;
          if (w == 0 || h == 0) { resolve(''); return; }
          let anchorX, anchorY;
          const anchor = this.generalConfig.frameCutAnchor || 'center';
          switch (anchor) {
            case 'top left': anchorX = 0; anchorY = 0; break;
            case 'top center': anchorX = w / 2; anchorY = 0; break;
            case 'top right': anchorX = w; anchorY = 0; break;
            case 'middle left': anchorX = 0; anchorY = h / 2; break;
            case 'center': anchorX = w / 2; anchorY = h / 2; break;
            case 'middle right': anchorX = w; anchorY = h / 2; break;
            case 'bottom left': anchorX = 0; anchorY = h; break;
            case 'bottom center': anchorX = w / 2; anchorY = h; break;
            case 'bottom right': anchorX = w; anchorY = h; break;
            default: anchorX = w / 2; anchorY = h / 2;
          }
          const srcX1 = anchorX + x1;
          const srcY1 = anchorY + y1;
          const srcX2 = anchorX + x2;
          const srcY2 = anchorY + y2;
          const cropW = Math.abs(srcX2 - srcX1) + 1;
          const cropH = Math.abs(srcY2 - srcY1) + 1;
          const startX = Math.min(srcX1, srcX2);
          const startY = Math.min(srcY1, srcY2);
          const canvas = document.createElement('canvas');
          canvas.width = cropW;
          canvas.height = cropH;
          const ctx = canvas.getContext('2d');
          const srcCanvas = document.createElement('canvas');
          srcCanvas.width = w;
          srcCanvas.height = h;
          const srcCtx = srcCanvas.getContext('2d');
          srcCtx.drawImage(img, 0, 0);
          const srcData = srcCtx.getImageData(0, 0, w, h);
          const destData = ctx.createImageData(cropW, cropH);
          for (let dy = 0; dy < cropH; dy++) {
            for (let dx = 0; dx < cropW; dx++) {
              let sx = (startX + dx) % w;
              let sy = (startY + dy) % h;
              if (sx < 0) sx += w;
              if (sy < 0) sy += h;
              const srcIdx = (sy * w + sx) * 4;
              const destIdx = (dy * cropW + dx) * 4;
              destData.data[destIdx] = srcData.data[srcIdx];
              destData.data[destIdx + 1] = srcData.data[srcIdx + 1];
              destData.data[destIdx + 2] = srcData.data[srcIdx + 2];
              destData.data[destIdx + 3] = srcData.data[srcIdx + 3];
            }
          }
          ctx.putImageData(destData, 0, 0);
          canvas.toBlob(blob => {
            if (!blob) { resolve(''); return; }
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          }, 'image/png');
        };
        img.onerror = () => resolve('');
        img.src = dataurl;
      });
    }

    listAnimationsInData(args) {
      const format = Cast.toString(args.FORMAT);
      const data = Cast.toString(args.DATA);
      const parsed = this.parseSheetData(data, format);
      return engine.handleArray(Object.keys(parsed.animations));
    }

    importSparrowSheet(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const dataurl = Cast.toString(args.DATAURL);
        const format = Cast.toString(args.TYPE);
        const data = Cast.toString(args.DATA);
        const canvas = this._getCanvas(canvasName);
        if (dataurl) canvas.sourceSheetImage = dataurl;
        canvas.finalImage = '';
        canvas.cachedJSON = '';
        canvas.cachedPNG = '';
        canvas.needsReCache = true;
        canvas.originalData = data;
        if (data && (format == 'xml' || format == 'json' || format == 'ini')) {
          const sheetData = this.parseSheetData(data, format);
          canvas.frameMetadata = {};
          canvas.animations = {};
          canvas.customFrames = {};
          canvas.blankFrames = {};
          for (const [anim, frames] of Object.entries(sheetData.animations)) {
            if (!Array.isArray(frames)) continue;
            canvas.frameMetadata[anim] = [];
            canvas.animations[anim] = [];
            canvas.customFrames[anim] = new Set();
            canvas.blankFrames[anim] = new Set();
            frames.forEach((f, i) => {
              if (!f) {
                canvas.animations[anim][i] = null;
                canvas.frameMetadata[anim][i] = null;
                canvas.blankFrames[anim].add(i);
              } else {
                canvas.frameMetadata[anim][i] = { ...f };
                canvas.animations[anim][i] = undefined;
              }
            });
          }
        }
        resolve();
      });
    }

    exportCanvas(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const type = Cast.toString(args.TYPE);
        const canvas = this._getCanvas(canvasName);
        if (canvas.needsReCache) {
          this._regenerateCanvas(canvasName).then(() => {
            resolve(this._exportCanvasSync(canvasName, type));
          });
        } else {
          resolve(this._exportCanvasSync(canvasName, type));
        }
      });
    }

    _exportCanvasSync(canvasName, type) {
      const canvas = this._getCanvas(canvasName);
      if (type == 'png') {
        if (!canvas.cachedPNG && canvas.needsReCache) {
          return engine.handleObject({ png: '', data: '' });
        }
        const png = canvas.cachedPNG || canvas.finalImage || '';
        return engine.handleObject({ png: png, data: '' });
      }
      if (type == 'json') {
        if (!canvas.cachedJSON && canvas.needsReCache) {
          return engine.handleObject({ png: '', data: '' });
        }
        return engine.handleObject({ png: '', data: canvas.cachedJSON || '' });
      }
      const meta = {
        app: 'Scratch Mod (Drago\'s Spritesheet Extension)',
        version: ext.version,
        image: canvas.config.imageName || this.generalConfig.imageName || 'spritesheet.png',
        format: 'RGBA8888',
        size: { w: canvas.meta.size.w || 0, h: canvas.meta.size.h || 0 },
        resolution: canvas.config.resolution || this.generalConfig.resolution || '1'
      };
      let data = '';
      if (type == 'xml') {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        const adobe = (canvas.config && canvas.config.adobeStyleXML != undefined) ? canvas.config.adobeStyleXML : this.generalConfig.adobeStyleXML;
        if (adobe) xml = '<!--  Created with Drago\'s Sparrow Sheets Scratch Extension  -->\n' + xml;
        xml += '<TextureAtlas imagePath="' + meta.image + '" width="' + meta.size.w + '" height="' + meta.size.h + '"';
        xml += ' app="' + meta.app + '" version="' + meta.version + '" format="' + meta.format + '" resolution="' + meta.resolution + '">\n';
        for (const [anim, metaArr] of Object.entries(canvas.frameMetadata)) {
          if (!Array.isArray(metaArr)) continue;
          metaArr.forEach((md, i) => {
            if (!md) return;
            let attrs = '    <SubTexture name="' + anim + i.toString().padStart(4, '0') + '"';
            attrs += ' x="' + md.x + '" y="' + md.y + '" width="' + md.width + '" height="' + md.height + '"';
            if (md.frameX || md.frameY || md.frameWidth != md.width || md.frameHeight != md.height) {
              attrs += ' frameX="' + md.frameX + '" frameY="' + md.frameY + '" frameWidth="' + md.frameWidth + '" frameHeight="' + md.frameHeight + '"';
            }
            if (md.flipX) attrs += ' flipX="true"';
            if (md.flipY) attrs += ' flipY="true"';
            if (md.rotated) attrs += ' rotated="true"';
            attrs += '/>\n';
            xml += attrs;
          });
        }
        xml += '</TextureAtlas>';
        data = xml;
      } else if (type == 'ini') {
        let res = '';
        res += '[meta]\n';
        res += 'app=' + meta.app + '\n';
        res += 'version=' + meta.version + '\n';
        res += 'image=' + meta.image + '\n';
        res += 'format=' + meta.format + '\n';
        res += 'size.w=' + meta.size.w + '\n';
        res += 'size.h=' + meta.size.h + '\n';
        res += 'resolution=' + meta.resolution + '\n\n';
        const anims = Object.keys(canvas.frameMetadata);
        res += '[data]\n';
        res += 'animations=' + anims.join(',') + '\n\n';
        for (const [anim, metaArr] of Object.entries(canvas.frameMetadata)) {
          if (!Array.isArray(metaArr)) continue;
          metaArr.forEach((md, i) => {
            if (!md) return;
            res += '[' + anim + '-' + i + ']\n';
            res += 'x=' + md.x + '\n';
            res += 'y=' + md.y + '\n';
            res += 'width=' + md.width + '\n';
            res += 'height=' + md.height + '\n';
            res += 'frameX=' + (md.frameX || 0) + '\n';
            res += 'frameY=' + (md.frameY || 0) + '\n';
            res += 'frameWidth=' + (md.frameWidth || md.width) + '\n';
            res += 'frameHeight=' + (md.frameHeight || md.height) + '\n';
            res += 'flipX=' + (md.flipX ? 'true' : 'false') + '\n';
            res += 'flipY=' + (md.flipY ? 'true' : 'false') + '\n';
            res += 'rotated=' + (md.rotated ? 'true' : 'false') + '\n\n';
          });
        }
        data = res;
      }
      const png = canvas.cachedPNG || canvas.finalImage || '';
      return engine.handleObject({ png: png, data: data });
    }

    getCanvasAsset(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const asset = Cast.toString(args.ASSET);
        const canvas = this._getCanvas(canvasName);
        if (canvas.needsReCache) {
          this._regenerateCanvas(canvasName).then(() => {
            resolve(this._getAssetSync(canvasName, asset));
          });
        } else {
          resolve(this._getAssetSync(canvasName, asset));
        }
      });
    }

    _getAssetSync(canvasName, asset) {
      const canvas = this._getCanvas(canvasName);
      if (asset == 'png') {
        return Cast.toString(canvas.cachedPNG || canvas.finalImage || '');
      }
      if (asset == 'json') {
        return Cast.toString(canvas.cachedJSON || '');
      }
      const meta = {
        app: 'Scratch Mod (Drago\'s Spritesheet Extension)',
        version: ext.version,
        image: canvas.config.imageName || this.generalConfig.imageName || 'spritesheet.png',
        format: 'RGBA8888',
        size: { w: canvas.meta.size.w || 0, h: canvas.meta.size.h || 0 },
        resolution: canvas.config.resolution || this.generalConfig.resolution || '1'
      };
      if (asset == 'xml') {
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n';
        const adobe = (canvas.config && canvas.config.adobeStyleXML != undefined) ? canvas.config.adobeStyleXML : this.generalConfig.adobeStyleXML;
        if (adobe) xml = '<!--  Created with Drago\'s Sparrow Sheets Scratch Extension  -->\n' + xml;
        xml += '<TextureAtlas imagePath="' + meta.image + '" width="' + meta.size.w + '" height="' + meta.size.h + '"';
        xml += ' app="' + meta.app + '" version="' + meta.version + '" format="' + meta.format + '" resolution="' + meta.resolution + '">\n';
        for (const [anim, metaArr] of Object.entries(canvas.frameMetadata)) {
          if (!Array.isArray(metaArr)) continue;
          metaArr.forEach((md, i) => {
            if (!md) return;
            let attrs = '    <SubTexture name="' + anim + i.toString().padStart(4, '0') + '"';
            attrs += ' x="' + md.x + '" y="' + md.y + '" width="' + md.width + '" height="' + md.height + '"';
            if (md.frameX || md.frameY || md.frameWidth != md.width || md.frameHeight != md.height) {
              attrs += ' frameX="' + md.frameX + '" frameY="' + md.frameY + '" frameWidth="' + md.frameWidth + '" frameHeight="' + md.frameHeight + '"';
            }
            if (md.flipX) attrs += ' flipX="true"';
            if (md.flipY) attrs += ' flipY="true"';
            if (md.rotated) attrs += ' rotated="true"';
            attrs += '/>\n';
            xml += attrs;
          });
        }
        xml += '</TextureAtlas>';
        return xml;
      }
      if (asset == 'ini') {
        let res = '';
        res += '[meta]\n';
        res += 'app=' + meta.app + '\n';
        res += 'version=' + meta.version + '\n';
        res += 'image=' + meta.image + '\n';
        res += 'format=' + meta.format + '\n';
        res += 'size.w=' + meta.size.w + '\n';
        res += 'size.h=' + meta.size.h + '\n';
        res += 'resolution=' + meta.resolution + '\n\n';
        const anims = Object.keys(canvas.frameMetadata);
        res += '[data]\n';
        res += 'animations=' + anims.join(',') + '\n\n';
        for (const [anim, metaArr] of Object.entries(canvas.frameMetadata)) {
          if (!Array.isArray(metaArr)) continue;
          metaArr.forEach((md, i) => {
            if (!md) return;
            res += '[' + anim + '-' + i + ']\n';
            res += 'x=' + md.x + '\n';
            res += 'y=' + md.y + '\n';
            res += 'width=' + md.width + '\n';
            res += 'height=' + md.height + '\n';
            res += 'frameX=' + (md.frameX || 0) + '\n';
            res += 'frameY=' + (md.frameY || 0) + '\n';
            res += 'frameWidth=' + (md.frameWidth || md.width) + '\n';
            res += 'frameHeight=' + (md.frameHeight || md.height) + '\n';
            res += 'flipX=' + (md.flipX ? 'true' : 'false') + '\n';
            res += 'flipY=' + (md.flipY ? 'true' : 'false') + '\n';
            res += 'rotated=' + (md.rotated ? 'true' : 'false') + '\n\n';
          });
        }
        return res;
      }
      return '';
    }

    clearCanvas(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        this.canvases[canvasName] = {
          animations: {},
          frameMetadata: {},
          blankFrames: {},
          finalImage: '',
          sourceSheetImage: '',
          config: { ...this.generalConfig },
          animationVariables: {},
          frameVariables: {},
          customFrames: {},
          meta: { size: { w: 0, h: 0 } },
          cachedJSON: '',
          cachedPNG: '',
          needsReCache: false,
          originalData: null
        };
        delete this.canvases[canvasName].config.mergePriority;
        delete this.canvases[canvasName].config.mergeAction;
        delete this.canvases[canvasName].config.frameCutAnchor;
        resolve();
      });
    }

    setSparrowSheetFrame(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const canvas = this._getCanvas(canvasName);
        let frameNum = Cast.toNumber(args.number);
        const anim = Cast.toString(args.animation);
        const dataurl = Cast.toString(args.dataurl);
        const rotation = Cast.toNumber(args.rotation) || 90;
        if (!anim || !dataurl || !dataurl.startsWith('data:image/png')) { resolve(); return; }
        if (frameNum == 0) { resolve(); return; }
        if (!canvas.animations[anim]) {
          canvas.animations[anim] = [];
          canvas.frameMetadata[anim] = [];
          canvas.blankFrames[anim] = new Set();
          canvas.customFrames[anim] = new Set();
        }
        const curLen = canvas.animations[anim].length;
        if (frameNum < 0) {
          frameNum = curLen + Math.abs(frameNum);
        } else if (frameNum > 0) {
          frameNum--;
        }
        const dupe = (canvas.config && canvas.config.dupeMissingFrames != undefined) ? canvas.config.dupeMissingFrames : this.generalConfig.dupeMissingFrames;
        if (frameNum > curLen) {
          let lastExisting = null;
          for (let i = curLen - 1; i >= 0; i--) {
            if (canvas.animations[anim][i] !== undefined && canvas.animations[anim][i] !== null) {
              lastExisting = i;
              break;
            }
          }
          if (dupe == 'off') {
            for (let i = curLen; i < frameNum; i++) {
              canvas.animations[anim][i] = null;
              canvas.frameMetadata[anim][i] = null;
              canvas.blankFrames[anim].add(i);
            }
          } else if (dupe == 'forward') {
            const lastImg = lastExisting !== null ? canvas.animations[anim][lastExisting] : null;
            const lastMeta = lastExisting !== null ? canvas.frameMetadata[anim][lastExisting] : null;
            for (let i = curLen; i < frameNum; i++) {
              canvas.animations[anim][i] = lastImg;
              canvas.frameMetadata[anim][i] = lastMeta;
            }
          } else if (dupe == 'behind') {
            for (let i = curLen; i < frameNum; i++) {
              canvas.animations[anim][i] = dataurl;
            }
          }
        }
        const img = new Image();
        img.onload = () => {
          const meta = {
            x: 0, y: 0, width: img.width, height: img.height,
            frameX: 0, frameY: 0, frameWidth: img.width, frameHeight: img.height,
            flipX: false, flipY: false, rotated: false
          };
          canvas.animations[anim][frameNum] = dataurl;
          canvas.frameMetadata[anim][frameNum] = meta;
          canvas.blankFrames[anim].delete(frameNum);
          canvas.customFrames[anim].add(frameNum);

          const offset = rotation - 90;
          if (offset == 0) {
            meta.rotated = false;
            delete canvas.frameVariables[anim]?.[frameNum]?.rotation;
          } else if (offset == 90 || offset == -270) {
            meta.rotated = true;
            delete canvas.frameVariables[anim]?.[frameNum]?.rotation;
          } else {
            meta.rotated = false;
            if (!canvas.frameVariables[anim]) canvas.frameVariables[anim] = {};
            if (!canvas.frameVariables[anim][frameNum]) canvas.frameVariables[anim][frameNum] = {};
            canvas.frameVariables[anim][frameNum].rotation = offset;
          }
          canvas.needsReCache = true;
          resolve();
        };
        img.onerror = () => resolve();
        img.src = dataurl;
      });
    }

    removeSparrowSheetFrame(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const canvas = this._getCanvas(canvasName);
        let frameNum = Cast.toNumber(args.number);
        const anim = Cast.toString(args.animation);
        if (!anim || !canvas.animations[anim]) { resolve(); return; }
        if (frameNum == 0) { resolve(); return; }
        if (frameNum < 0) {
          frameNum = canvas.animations[anim].length + Math.abs(frameNum);
        } else if (frameNum > 0) {
          frameNum--;
        }
        if (frameNum >= 0 && frameNum < canvas.animations[anim].length) {
          delete canvas.animations[anim][frameNum];
          delete canvas.frameMetadata[anim][frameNum];
          canvas.blankFrames[anim].delete(frameNum);
          canvas.customFrames[anim]?.delete(frameNum);
          canvas.needsReCache = true;
        }
        resolve();
      });
    }

    removeSparrowSheetAnimation(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const canvas = this._getCanvas(canvasName);
        const anim = Cast.toString(args.animation);
        if (anim && canvas.animations[anim]) {
          delete canvas.animations[anim];
          delete canvas.frameMetadata[anim];
          delete canvas.blankFrames[anim];
          delete canvas.animationVariables[anim];
          delete canvas.frameVariables[anim];
          delete canvas.customFrames[anim];
          canvas.needsReCache = true;
        }
        resolve();
      });
    }

    getSparrowSheetAnimations(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      return engine.handleArray(Object.keys(this._getCanvas(canvasName).animations));
    }

    getSparrowSheetFrameCount(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const anim = Cast.toString(args.animation);
      return canvas.animations[anim] ? Cast.toNumber(canvas.animations[anim].length) : 0;
    }

    removeSparrowSheetAnimationByNumber(args) {
      return new Promise((resolve) => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const canvas = this._getCanvas(canvasName);
        let idx = Cast.toNumber(args.number);
        const names = Object.keys(canvas.animations);
        if (idx == -1) idx = names.length - 1;
        if (idx >= 0 && idx < names.length) {
          const name = names[idx];
          delete canvas.animations[name];
          delete canvas.frameMetadata[name];
          delete canvas.blankFrames[name];
          delete canvas.animationVariables[name];
          delete canvas.frameVariables[name];
          delete canvas.customFrames[name];
          canvas.needsReCache = true;
        }
        resolve();
      });
    }

    isSparrowSheetFrame(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const frameNum = Cast.toNumber(args.number) > 0 ? Cast.toNumber(args.number) - 1 : 0;
      const anim = Cast.toString(args.animation);
      const type = Cast.toString(args.type);
      if (!anim || !canvas.animations[anim]) return type == 'nonexistent';
      const frames = canvas.animations[anim];
      if (frameNum >= frames.length) return type == 'nonexistent';
      const f = frames[frameNum];
      if (type == 'blank') return f == null || (canvas.blankFrames[anim] && canvas.blankFrames[anim].has(frameNum));
      if (type == 'nonexistent') return f == undefined;
      return false;
    }

    doesAnimationExistInSparrowSheet(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      return Cast.toBoolean(Cast.toString(args.ANIM) in this._getCanvas(canvasName).animations);
    }

    getFrameCoordsInSparrowSheet(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      let f = Cast.toNumber(args.FRAME);
      const anim = Cast.toString(args.ANIM);
      if (!canvas.frameMetadata[anim]) return engine.handleArray([]);
      if (f > 0) f--;
      const metaArr = canvas.frameMetadata[anim];
      if (f < 0 || f >= metaArr.length || !metaArr[f]) return engine.handleArray([]);
      return engine.handleArray([metaArr[f].x, metaArr[f].y]);
    }

    getAnimationVariable(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const anim = Cast.toString(args.animation);
      const key = Cast.toString(args.variable);
      const vars = canvas.animationVariables[anim];
      return vars && key in vars ? Cast.toString(vars[key]) : '';
    }

    setAnimationVariable(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const anim = Cast.toString(args.animation);
      const key = Cast.toString(args.variable);
      const val = Cast.toString(args.value);
      if (!canvas.animationVariables[anim]) canvas.animationVariables[anim] = {};
      canvas.animationVariables[anim][key] = val;
    }

    getFrameVariable(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const anim = Cast.toString(args.animation);
      let frameNum = Cast.toNumber(args.number);
      if (frameNum > 0) frameNum--;
      const key = Cast.toString(args.variable);
      const vars = canvas.frameVariables[anim]?.[frameNum];
      return vars && key in vars ? Cast.toString(vars[key]) : '';
    }

    setFrameVariable(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      const canvas = this._getCanvas(canvasName);
      const anim = Cast.toString(args.animation);
      let frameNum = Cast.toNumber(args.number);
      if (frameNum > 0) frameNum--;
      const key = Cast.toString(args.variable);
      const val = Cast.toString(args.value);
      if (!canvas.frameVariables[anim]) canvas.frameVariables[anim] = {};
      if (!canvas.frameVariables[anim][frameNum]) canvas.frameVariables[anim][frameNum] = {};
      canvas.frameVariables[anim][frameNum][key] = val;
      if (key == 'rotated' || key == 'frameX' || key == 'frameY' || key == 'frameWidth' || key == 'frameHeight' || key == 'flipX' || key == 'flipY') {
        if (canvas.frameMetadata[anim] && canvas.frameMetadata[anim][frameNum]) {
          if (key == 'rotated') canvas.frameMetadata[anim][frameNum].rotated = (val == 'true');
          else if (key == 'frameX') canvas.frameMetadata[anim][frameNum].frameX = parseFloat(val) || 0;
          else if (key == 'frameY') canvas.frameMetadata[anim][frameNum].frameY = parseFloat(val) || 0;
          else if (key == 'frameWidth') canvas.frameMetadata[anim][frameNum].frameWidth = parseFloat(val) || 0;
          else if (key == 'frameHeight') canvas.frameMetadata[anim][frameNum].frameHeight = parseFloat(val) || 0;
          else if (key == 'flipX') canvas.frameMetadata[anim][frameNum].flipX = (val == 'true');
          else if (key == 'flipY') canvas.frameMetadata[anim][frameNum].flipY = (val == 'true');
          canvas.animations[anim][frameNum] = undefined;
          canvas.needsReCache = true;
        }
      }
    }

    preRecutSparrowSheet(args) {
      const canvasName = Cast.toString(args.CANVAS) || 'default';
      return this._regenerateCanvas(canvasName);
    }

    _getUprightSprite(url, meta, rotOff, smooth) {
      return new Promise(r => {
        const i = new Image();
        i.onload = () => {
          let { x, y, width, height, flipX, flipY, rotated } = meta;
          let sc = document.createElement('canvas');
          sc.width = width;
          sc.height = height;
          let ctx = sc.getContext('2d');
          ctx.imageSmoothingEnabled = smooth;
          ctx.drawImage(i, x, y, width, height, 0, 0, width, height);

          if (rotated) {
            const rc = document.createElement('canvas');
            rc.width = height;
            rc.height = width;
            const rctx = rc.getContext('2d');
            rctx.imageSmoothingEnabled = smooth;
            rctx.translate(rc.width / 2, rc.height / 2);
            rctx.rotate(-Math.PI / 2);
            rctx.drawImage(sc, -width / 2, -height / 2);
            sc = rc;
          }

          if (flipX || flipY) {
            const fc = document.createElement('canvas');
            fc.width = sc.width;
            fc.height = sc.height;
            const fctx = fc.getContext('2d');
            fctx.imageSmoothingEnabled = smooth;
            if (flipX && flipY) {
              fctx.translate(fc.width, fc.height);
              fctx.scale(-1, -1);
            } else if (flipX) {
              fctx.translate(fc.width, 0);
              fctx.scale(-1, 1);
            } else if (flipY) {
              fctx.translate(0, fc.height);
              fctx.scale(1, -1);
            }
            fctx.drawImage(sc, 0, 0);
            sc = fc;
          }

          if (rotOff != 0) {
            const rc = document.createElement('canvas');
            rc.width = sc.width;
            rc.height = sc.height;
            const rctx = rc.getContext('2d');
            rctx.imageSmoothingEnabled = smooth;
            rctx.translate(rc.width / 2, rc.height / 2);
            rctx.rotate(-rotOff * Math.PI / 180);
            rctx.drawImage(sc, -sc.width / 2, -sc.height / 2);
            sc = rc;
          }

          sc.toBlob(b => {
            if (!b) { r(''); return; }
            const rd = new FileReader();
            rd.onloadend = () => r(rd.result);
            rd.readAsDataURL(b);
          }, 'image/png');
        };
        i.onerror = () => r('');
        i.src = url;
      });
    }

    _extractFrameFromSheet(url, meta, rotOff, smooth, container = false) {
      return new Promise(r => {
        this._getUprightSprite(url, meta, rotOff, smooth).then(su => {
          if (!su) { r(''); return; }
          const i = new Image();
          i.onload = () => {
            const uw = i.width, uh = i.height;
            if (!container) {
              const c = document.createElement('canvas');
              c.width = uw;
              c.height = uh;
              const ctx = c.getContext('2d');
              ctx.imageSmoothingEnabled = smooth;
              ctx.drawImage(i, 0, 0);
              c.toBlob(b => {
                if (!b) { r(''); return; }
                const rd = new FileReader();
                rd.onloadend = () => r(rd.result);
                rd.readAsDataURL(b);
              }, 'image/png');
              return;
            }
            const fw = meta.frameWidth || meta.width;
            const fh = meta.frameHeight || meta.height;
            const ox = -(meta.frameX || 0);
            const oy = -(meta.frameY || 0);
            const c = document.createElement('canvas');
            c.width = fw;
            c.height = fh;
            const ctx = c.getContext('2d');
            ctx.imageSmoothingEnabled = smooth;
            ctx.drawImage(i, ox, oy);
            c.toBlob(b => {
              if (!b) { r(''); return; }
              const rd = new FileReader();
              rd.onloadend = () => r(rd.result);
              rd.readAsDataURL(b);
            }, 'image/png');
          };
          i.onerror = () => r('');
          i.src = su;
        }).catch(() => r(''));
      });
    }

    getSparrowSheetFrame(args) {
      return new Promise((resolve) => {
        const cn = Cast.toString(args.CANVAS) || 'default';
        const c = this._getCanvas(cn);
        const mode = Cast.toString(args.mode) || 'set';
        let num = Cast.toNumber(args.number);
        if (num > 0) num--;
        const an = Cast.toString(args.anim);
        if (!c.animations[an] || num < 0 || num >= c.animations[an].length) { resolve(''); return; }
        if (mode == 'raw') {
          const meta = c.frameMetadata[an] && c.frameMetadata[an][num];
          if (!meta || !c.sourceSheetImage) { resolve(''); return; }
          const rotOff = meta.rotated ? 90 : 0;
          const smooth = (c.config && c.config.smoothImages != undefined) ? c.config.smoothImages : this.generalConfig.smoothImages;
          this._extractFrameFromSheet(c.sourceSheetImage, meta, rotOff, smooth, false)
            .then(resolve)
            .catch(() => resolve(''));
        } else {
          const cached = c.animations[an][num];
          if (cached !== undefined && cached !== null && cached !== '') {
            resolve(cached);
          } else {
            const meta = c.frameMetadata[an] && c.frameMetadata[an][num];
            if (!meta || !c.sourceSheetImage) { resolve(''); return; }
            const rotOff = meta.rotated ? 90 : 0;
            const smooth = (c.config && c.config.smoothImages != undefined) ? c.config.smoothImages : this.generalConfig.smoothImages;
            this._extractFrameFromSheet(c.sourceSheetImage, meta, rotOff, smooth, true)
              .then(dataUrl => {
                if (dataUrl) {
                  c.animations[an][num] = dataUrl;
                  resolve(dataUrl);
                } else {
                  resolve('');
                }
              })
              .catch(() => resolve(''));
          }
        }
      });
    }

    getSparrowSheetFrameFromData(args) {
      const mode = Cast.toString(args.mode) || 'set';
      return new Promise(r => {
        const num = Cast.toNumber(args.number);
        const an = Cast.toString(args.anim);
        const url = Cast.toString(args.dataurl);
        const fmt = Cast.toString(args.format);
        const data = Cast.toString(args.data);
        let f = num;
        if (f > 0) f--;
        const sd = this.parseSheetData(data, fmt);
        const af = sd.animations[an];
        if (!af || f < 0 || f >= af.length || !af[f]) { r(''); return; }
        const meta = af[f];
        if (!url || !url.startsWith('data:image/png')) { r(''); return; }
        const rotOff = meta.rotated ? 90 : 0;
        const container = (mode == 'set');
        this._extractFrameFromSheet(url, meta, rotOff, false, container)
          .then(r)
          .catch(() => r(''));
      });
    }

    getAllFramesOfAnimation(args) {
      return new Promise(r => {
        const an = Cast.toString(args.ANIM);
        const url = Cast.toString(args.DATAURL);
        const fmt = Cast.toString(args.FORMAT);
        const data = Cast.toString(args.DATA);
        const sd = this.parseSheetData(data, fmt);
        const af = sd.animations[an];
        if (!af || !url || !url.startsWith('data:image/png')) { r(engine.handleArray([])); return; }
        const valid = [];
        for (let i = 0; i < af.length; i++) if (af[i]) valid.push({ meta: af[i], index: i });
        if (valid.length == 0) { r(engine.handleArray([])); return; }
        const proms = valid.map(f => this._extractFrameFromSheet(url, f.meta, f.meta.rotated ? 90 : 0, false, true));
        Promise.all(proms).then(res => r(engine.handleArray(res)));
      });
    }

    allFramesOfAnimation(args) {
      return new Promise(resolve => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const anim = Cast.toString(args.ANIM);
        const type = Cast.toString(args.TYPE);
        const canvas = this._getCanvas(canvasName);
        if (!canvas.animations[anim]) { resolve(engine.handleArray([])); return; }
        const frames = canvas.animations[anim];
        if (type == 'names') {
          const names = frames.map((_, i) => anim + i.toString().padStart(4, '0'));
          resolve(engine.handleArray(names));
          return;
        }
        const promises = frames.map((f, i) => {
          if (f !== undefined && f !== null && f !== '') return Promise.resolve(f);
          const meta = canvas.frameMetadata[anim] && canvas.frameMetadata[anim][i];
          if (!meta || !canvas.sourceSheetImage) return Promise.resolve('');
          const rotOff = meta.rotated ? 90 : 0;
          const smooth = (canvas.config && canvas.config.smoothImages != undefined) ? canvas.config.smoothImages : this.generalConfig.smoothImages;
          return this._extractFrameFromSheet(canvas.sourceSheetImage, meta, rotOff, smooth, true);
        });
        Promise.all(promises).then(results => {
          resolve(engine.handleArray(results));
        });
      });
    }

    allFramesInCanvas(args) {
      return new Promise(resolve => {
        const canvasName = Cast.toString(args.CANVAS) || 'default';
        const type = Cast.toString(args.TYPE);
        const canvas = this._getCanvas(canvasName);
        const anims = Object.keys(canvas.animations);
        if (anims.length == 0) { resolve(engine.handleArray([])); return; }
        const allPromises = [];
        for (const anim of anims) {
          const frames = canvas.animations[anim];
          for (let i = 0; i < frames.length; i++) {
            if (type == 'names') {
              allPromises.push(Promise.resolve(anim + i.toString().padStart(4, '0')));
            } else {
              const f = frames[i];
              if (f !== undefined && f !== null && f !== '') {
                allPromises.push(Promise.resolve(f));
              } else {
                const meta = canvas.frameMetadata[anim] && canvas.frameMetadata[anim][i];
                if (!meta || !canvas.sourceSheetImage) {
                  allPromises.push(Promise.resolve(''));
                } else {
                  const rotOff = meta.rotated ? 90 : 0;
                  const smooth = (canvas.config && canvas.config.smoothImages != undefined) ? canvas.config.smoothImages : this.generalConfig.smoothImages;
                  allPromises.push(this._extractFrameFromSheet(canvas.sourceSheetImage, meta, rotOff, smooth, true));
                }
              }
            }
          }
        }
        Promise.all(allPromises).then(results => {
          resolve(engine.handleArray(results));
        });
      });
    }

    isSparrowSheetDataValid(args) {
      const data = Cast.toString(args.DATA);
      if (!data) return false;
      const format = this.detectFormat(data);
      const parsed = this.parseSheetData(data, format);
      const frames = Object.values(parsed.animations).flat().filter(f => f != null);
      return frames.length > 0;
    }

    createNewGrid(args) {
      const name = Cast.toString(args.GRID) || 'default';
      this.grids[name] = {
        dataurl: '',
        json: { cellCountX: 0, cellCountY: 0, cellWidth: 0, cellHeight: 0, padding: 0 },
        pendingModifications: {},
        cellOffsets: {},
        config: {
          smoothImages: false,
          anchoring: 'center',
          spriteResize: 'none',
          cellResize: 'scale up',
          dupeMissingCells: 'off',
          collectionXDir: 'left to right',
          collectionYDir: 'top to bottom',
          collectionPriority: 'x'
        },
        cellCache: {}
      };
    }

    removeGrid(args) {
      const name = Cast.toString(args.GRID);
      if (this.grids[name]) delete this.grids[name];
    }

    existingGrids() {
      return engine.handleArray(Object.keys(this.grids));
    }

    setGridSheet(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      const img = Cast.toString(args.image);
      const fmt = Cast.toString(args.format);
      const data = Cast.toString(args.data);
      grid.dataurl = img || '';
      grid.pendingModifications = {};
      grid.cellOffsets = {};
      if (data) {
        const parsed = safeJSONParse(data);
        if (parsed) {
          grid.json = {
            cellCountX: parsed.cellCountX || 0,
            cellCountY: parsed.cellCountY || 0,
            cellWidth: parsed.cellWidth || 0,
            cellHeight: parsed.cellHeight || 0,
            padding: parsed.padding || 0
          };
          if (parsed.offsets) grid.cellOffsets = parsed.offsets;
        } else {
          grid.json = { cellCountX: 0, cellCountY: 0, cellWidth: 0, cellHeight: 0, padding: 0 };
        }
      } else {
        grid.json = { cellCountX: 0, cellCountY: 0, cellWidth: 0, cellHeight: 0, padding: 0 };
      }
    }

    getGridSheetAsset(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      const t = Cast.toString(args.filetype);
      if (t == 'png' || t == 'dataurl') return Cast.toString(grid.dataurl || '');
      if (t == 'json') {
        const j = grid.json;
        return engine.handleObject({
          cellCountX: j.cellCountX,
          cellCountY: j.cellCountY,
          cellWidth: j.cellWidth,
          cellHeight: j.cellHeight,
          padding: j.padding || 0,
          offsets: grid.cellOffsets,
          config: grid.config
        });
      }
      if (t == 'xml') {
        const j = grid.json;
        const cw = j.cellWidth || 0, ch = j.cellHeight || 0, cx = j.cellCountX || 0, cy = j.cellCountY || 0, pad = j.padding || 0;
        let xml = '<?xml version="1.0" encoding="utf-8"?>\n<TextureAtlas imagePath="gridsheet.png">\n';
        for (let y = 0; y < cy; y++) {
          for (let x = 0; x < cx; x++) {
            const nameCell = 'cell_' + x + '_' + y;
            const sx = x * (cw + pad), sy = y * (ch + pad);
            xml += '    <SubTexture name="' + nameCell + '" x="' + sx + '" y="' + sy + '" width="' + cw + '" height="' + ch + '"/>\n';
          }
        }
        xml += '</TextureAtlas>';
        return xml;
      }
      if (t == 'ini') {
        const j = grid.json;
        const cw = j.cellWidth || 0, ch = j.cellHeight || 0, cx = j.cellCountX || 0, cy = j.cellCountY || 0, pad = j.padding || 0;
        let ini = '';
        for (let y = 0; y < cy; y++) {
          ini += '[row_' + y + ']\n[frames]\n';
          for (let x = 0; x < cx; x++) {
            const sx = x * (cw + pad), sy = y * (ch + pad);
            ini += sx + ',' + sy + ',' + cw + ',' + ch + '\n';
          }
          ini += '\n';
        }
        return ini;
      }
      return '';
    }

    generateGridSheet(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return new Promise(r => {
        this._resolveGridDimensions(grid).then(json => {
          const mods = grid.pendingModifications, old = grid.dataurl, cfg = grid.config;
          const smooth = cfg.smoothImages, cellResize = cfg.cellResize, spriteResize = cfg.spriteResize, anchoring = cfg.anchoring, pad = json.padding || 0, dupe = cfg.dupeMissingCells;
          let cw = json.cellWidth, ch = json.cellHeight, cx = json.cellCountX, cy = json.cellCountY;
          const placed = [];
          for (const k of Object.keys(mods)) {
            const mod = mods[k];
            if (mod == null) continue;
            const [x, y] = k.split(',').map(Number);
            const off = grid.cellOffsets[k] || { dx: 0, dy: 0 };
            placed.push({ x, y, img: mod, offsetX: off.dx, offsetY: off.dy });
          }
          const dims = placed.map(item => new Promise(res => {
            const i = new Image();
            i.onload = () => { item.width = i.width; item.height = i.height; res(); };
            i.onerror = () => { item.width = 0; item.height = 0; res(); };
            i.src = item.img;
          }));
          Promise.all(dims).then(() => {
            if (dupe == 'by X' || dupe == 'by Y') {
              const filled = {};
              for (const item of placed) filled[item.x + ',' + item.y] = item;
              for (let y = 0; y < cy; y++) {
                for (let x = 0; x < cx; x++) {
                  if (!filled[x + ',' + y]) {
                    if (dupe == 'by X' && x > 0) {
                      const nb = filled[(x - 1) + ',' + y];
                      if (nb) { placed.push({ ...nb, x, y }); filled[x + ',' + y] = true; }
                    } else if (dupe == 'by Y' && y > 0) {
                      const nb = filled[x + ',' + (y - 1)];
                      if (nb) { placed.push({ ...nb, x, y }); filled[x + ',' + y] = true; }
                    }
                  }
                }
              }
            }
            if (cellResize == 'scale down') {
              const dims2 = placed.map(p => Math.min(p.width, p.height) || 0);
              const minDim = Math.min(...dims2.filter(d => d > 0));
              if (minDim > 0 && minDim < Infinity) { cw = minDim; ch = minDim; }
            } else if (cellResize == 'scale up') {
              const dims2 = placed.map(p => Math.max(p.width, p.height) || 0);
              const maxDim = Math.max(...dims2.filter(d => d > 0));
              if (maxDim > 0) { cw = maxDim; ch = maxDim; }
            }
            json.cellWidth = cw; json.cellHeight = ch;
            this._rebuildGrid(grid, old, json, placed, cfg).then(r);
          }).catch(() => r());
        }).catch(() => r());
      });
    }

    discardGridSheetModifications(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.pendingModifications = {};
      grid.cellOffsets = {};
    }

    setCellImage(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      let x = Cast.toNumber(args.x), y = Cast.toNumber(args.y);
      const img = Cast.toString(args.image), ox = Cast.toNumber(args.ox) || 0, oy = Cast.toNumber(args.oy) || 0;
      if (!img || !img.startsWith('data:image/png')) return;
      if (x == 0 || y == 0) return;
      const json = grid.json, cx = json.cellCountX || 1, cy = json.cellCountY || 1;
      if (x < 0) x = cx + Math.abs(x); else if (x > 0) x = x - 1;
      if (y < 0) y = cy + Math.abs(y); else if (y > 0) y = y - 1;
      x = Math.max(0, x); y = Math.max(0, y);
      grid.pendingModifications[x + ',' + y] = img;
      grid.cellOffsets[x + ',' + y] = { dx: ox, dy: oy };
    }

    removeCell(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      let x = Cast.toNumber(args.x), y = Cast.toNumber(args.y);
      if (x == 0 || y == 0) return;
      const json = grid.json, cx = json.cellCountX || 1, cy = json.cellCountY || 1;
      if (x < 0) x = cx + Math.abs(x); else if (x > 0) x = x - 1;
      if (y < 0) y = cy + Math.abs(y); else if (y > 0) y = y - 1;
      x = Math.max(0, x); y = Math.max(0, y);
      grid.pendingModifications[x + ',' + y] = null;
      delete grid.cellOffsets[x + ',' + y];
    }

    resizeCells(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.json.cellWidth = Math.max(1, Cast.toNumber(args.width));
      grid.json.cellHeight = Math.max(1, Cast.toNumber(args.height));
    }

    getCellImage(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return new Promise(r => {
        let x = Cast.toNumber(args.x), y = Cast.toNumber(args.y);
        if (x == 0 || y == 0) { r(''); return; }
        if (x > 0) x--; else if (x < 0) x = (grid.json.cellCountX || 1) + Math.abs(x);
        if (y > 0) y--; else if (y < 0) y = (grid.json.cellCountY || 1) + Math.abs(y);
        x = Math.max(0, x); y = Math.max(0, y);
        this._resolveGridDimensions(grid).then(json => {
          if (!grid.dataurl || !grid.dataurl.startsWith('data:image/png')) { r(''); return; }
          const smooth = grid.config.smoothImages, cw = json.cellWidth, ch = json.cellHeight, cx = json.cellCountX, cy = json.cellCountY;
          if (x >= cx || y >= cy) { r(''); return; }
          const key = x + ',' + y;
          if (grid.pendingModifications[key] !== undefined && grid.pendingModifications[key] !== null) {
            r(grid.pendingModifications[key]);
            return;
          }
          const i = new Image();
          i.onload = () => {
            const c = document.createElement('canvas');
            c.width = cw; c.height = ch;
            const ctx = c.getContext('2d');
            ctx.imageSmoothingEnabled = smooth;
            ctx.drawImage(i, x * cw, y * ch, cw, ch, 0, 0, cw, ch);
            c.toBlob(b => {
              if (!b) { r(''); return; }
              const rd = new FileReader();
              rd.onloadend = () => r(rd.result);
              rd.readAsDataURL(b);
            }, 'image/png');
          };
          i.onerror = () => r('');
          i.src = grid.dataurl;
        }).catch(() => r(''));
      });
    }

    getExternalCell(args) {
      return new Promise(r => {
        const x = Math.max(1, Cast.toNumber(args.x)) - 1, y = Math.max(1, Cast.toNumber(args.y)) - 1;
        const imgSrc = Cast.toString(args.image), fmt = Cast.toString(args.format), data = Cast.toString(args.data);
        if (!imgSrc || !imgSrc.startsWith('data:image/png')) { r(''); return; }
        const parsed = this.parseSheetData(data, fmt);
        const frames = parsed.frames;
        const gridW = this.grids['default']?.json?.cellCountX || Math.ceil(Math.sqrt(frames.length));
        const idx = y * gridW + x;
        if (idx < 0 || idx >= frames.length) { r(''); return; }
        const fd = frames[idx];
        const img = new Image();
        img.onload = () => {
          const fw = fd.frameWidth || fd.width, fh = fd.frameHeight || fd.height;
          const c = document.createElement('canvas');
          c.width = fd.width; c.height = fd.height;
          const ctx = c.getContext('2d');
          ctx.imageSmoothingEnabled = false;
          if (fd.flipX || fd.flipY) {
            ctx.translate(fd.flipX ? fd.width : 0, fd.flipY ? fd.height : 0);
            ctx.scale(fd.flipX ? -1 : 1, fd.flipY ? -1 : 1);
          }
          ctx.drawImage(img, fd.x, fd.y, fw, fh, -fd.frameX, -fd.frameY, fd.width, fd.height);
          const out = document.createElement('canvas');
          out.width = fw; out.height = fh;
          out.getContext('2d').drawImage(c, 0, 0);
          out.toBlob(b => {
            if (!b) { r(''); return; }
            const rd = new FileReader();
            rd.onloadend = () => r(rd.result);
            rd.readAsDataURL(b);
          }, 'image/png');
        };
        img.onerror = () => r('');
        img.src = imgSrc;
      });
    }

    getGridCuttingJSON(args) {
      const x = Math.max(1, Cast.toNumber(args.x)), y = Math.max(1, Cast.toNumber(args.y));
      return engine.handleObject({ cellCountX: x, cellCountY: y, cellWidth: 0, cellHeight: 0, padding: 0 });
    }

    getCellDimensions(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return new Promise(r => {
        this._resolveGridDimensions(grid).then(json => {
          r(engine.handleObject({
            cellWidth: json.cellWidth || 0,
            cellHeight: json.cellHeight || 0,
            padding: json.padding || 0
          }));
        }).catch(() => r(engine.handleObject({})));
      });
    }

    getSheetJSON(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      const j = grid.json;
      return engine.handleObject({
        cellCountX: j.cellCountX,
        cellCountY: j.cellCountY,
        cellWidth: j.cellWidth,
        cellHeight: j.cellHeight,
        padding: j.padding || 0,
        offsets: grid.cellOffsets,
        config: grid.config
      });
    }

    createGridData(args) {
      return engine.handleObject({
        cellCountX: Math.max(0, Cast.toNumber(args.x)),
        cellCountY: Math.max(0, Cast.toNumber(args.y)),
        cellWidth: Math.max(0, Cast.toNumber(args.w)),
        cellHeight: Math.max(0, Cast.toNumber(args.h)),
        padding: Math.max(0, Cast.toNumber(args.p))
      });
    }

    listGridSheetLine(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return new Promise(r => {
        const mode = Cast.toString(args.CR), num = Math.max(1, Cast.toNumber(args.NUM) || 1);
        this._resolveGridDimensions(grid).then(json => {
          const cx = json.cellCountX || 1, cy = json.cellCountY || 1;
          const cells = [];
          if (mode == 'column') {
            if (num > cx) { r(engine.handleArray([])); return; }
            for (let row = 1; row <= cy; row++) cells.push(this.getCellImage({ x: num, y: row, GRID: name }));
          } else {
            if (num > cy) { r(engine.handleArray([])); return; }
            for (let col = 1; col <= cx; col++) cells.push(this.getCellImage({ x: col, y: num, GRID: name }));
          }
          Promise.all(cells).then(res => r(engine.handleArray(res)));
        }).catch(() => r(engine.handleArray([])));
      });
    }

    allGridImages(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      const type = Cast.toString(args.TYPE);
      return new Promise(resolve => {
        this._resolveGridDimensions(grid).then(json => {
          if (type == 'numberid') {
            const order = this._getOrderedCells(grid);
            const ids = order.map(({x, y}) => (x+1) + '-' + (y+1));
            resolve(engine.handleArray(ids));
            return;
          }
          const order = this._getOrderedCells(grid);
          const promises = order.map(({x, y}) => this._getCellImageDataURL(grid, x, y));
          Promise.all(promises).then(results => {
            resolve(engine.handleArray(results));
          });
        }).catch(() => resolve(engine.handleArray([])));
      });
    }

    exportGrid(args) {
      return new Promise((resolve) => {
        const name = Cast.toString(args.GRID) || 'default';
        const type = Cast.toString(args.TYPE);
        const grid = this._getGrid(name);
        const png = grid.dataurl || '';
        let data = '';
        if (type == 'json') {
          data = JSON.stringify(grid.json);
        } else if (type == 'xml') {
          const j = grid.json;
          const cw = j.cellWidth || 0, ch = j.cellHeight || 0, cx = j.cellCountX || 0, cy = j.cellCountY || 0, pad = j.padding || 0;
          let xml = '<?xml version="1.0" encoding="utf-8"?>\n<TextureAtlas imagePath="gridsheet.png">\n';
          for (let y = 0; y < cy; y++) {
            for (let x = 0; x < cx; x++) {
              const nameCell = 'cell_' + x + '_' + y;
              const sx = x * (cw + pad), sy = y * (ch + pad);
              xml += '    <SubTexture name="' + nameCell + '" x="' + sx + '" y="' + sy + '" width="' + cw + '" height="' + ch + '"/>\n';
            }
          }
          xml += '</TextureAtlas>';
          data = xml;
        } else if (type == 'ini') {
          const j = grid.json;
          const cw = j.cellWidth || 0, ch = j.cellHeight || 0, cx = j.cellCountX || 0, cy = j.cellCountY || 0, pad = j.padding || 0;
          let ini = '';
          for (let y = 0; y < cy; y++) {
            ini += '[row_' + y + ']\n[frames]\n';
            for (let x = 0; x < cx; x++) {
              const sx = x * (cw + pad), sy = y * (ch + pad);
              ini += sx + ',' + sy + ',' + cw + ',' + ch + '\n';
            }
            ini += '\n';
          }
          data = ini;
        }
        resolve(engine.handleObject({ png: png, data: data }));
      });
    }

    isGridSheetDataValid(args) {
      const data = Cast.toString(args.DATA);
      if (!data) return false;
      const parsed = safeJSONParse(data);
      if (!parsed) return false;
      return (parsed.cellCountX !== undefined && parsed.cellCountY !== undefined);
    }

    setGridSheetSmooth(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.smoothImages = Cast.toBoolean(args.flag);
    }

    setGridSheetPadding(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.json.padding = Math.max(0, Cast.toNumber(args.padding));
    }

    setGridSheetAnchoring(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.anchoring = Cast.toString(args.anchoring);
    }

    setGridSheetSpriteResize(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.spriteResize = Cast.toString(args.spriteResize);
    }

    setGridSheetCellResize(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.cellResize = Cast.toString(args.cellResize);
    }

    setGridSheetDupeMissingCells(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.dupeMissingCells = Cast.toString(args.dupe);
    }

    getGridSheetConfig(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      const k = Cast.toString(args.config);
      const cfg = grid.config;
      const json = grid.json;
      switch (k) {
        case 'smoothImages': return Cast.toBoolean(cfg.smoothImages);
        case 'padding': return Cast.toNumber(json.padding || 0);
        case 'anchoring': return Cast.toString(cfg.anchoring);
        case 'spriteResize': return Cast.toString(cfg.spriteResize);
        case 'cellResize': return Cast.toString(cfg.cellResize);
        case 'dupeMissingCells': return Cast.toString(cfg.dupeMissingCells);
        default: return '';
      }
    }

    setGridCollectionXDir(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.collectionXDir = Cast.toString(args.XDIR);
    }

    getGridCollectionXDir(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return Cast.toString(grid.config.collectionXDir || 'left to right');
    }

    setGridCollectionYDir(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.collectionYDir = Cast.toString(args.YDIR);
    }

    getGridCollectionYDir(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return Cast.toString(grid.config.collectionYDir || 'top to bottom');
    }

    setGridCollectionPriority(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      grid.config.collectionPriority = Cast.toString(args.PDIR);
    }

    getGridCollectionPriority(args) {
      const name = Cast.toString(args.GRID) || 'default';
      const grid = this._getGrid(name);
      return Cast.toString(grid.config.collectionPriority || 'x');
    }

    detectFormat(data) {
      if (!data || typeof data != 'string') return 'xml';
      const trimmed = data.trim();
      if (trimmed.startsWith('<?xml') || trimmed.startsWith('<TextureAtlas')) return 'xml';
      if (trimmed.startsWith('{') && trimmed.endsWith('}')) return 'json';
      if (trimmed.startsWith('[') && trimmed.includes('-')) return 'ini';
      if (trimmed.includes('=') && (trimmed.includes('\n[') || trimmed.startsWith('['))) return 'ini';
      return 'xml';
    }

    parseSheetData(data, format) {
      if (format == 'detect') format = this.detectFormat(data);
      if (!data) return { animations: {}, frames: [] };

      if (format == 'xml') {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data, 'text/xml');
        const subTextures = xmlDoc.getElementsByTagName('SubTexture');
        const animations = {};
        const frames = [];
        for (let i = 0; i < subTextures.length; i++) {
          const sub = subTextures[i];
          const name = sub.getAttribute('name');
          if (!name) continue;
          let animName = name;
          let frameNum = 0;
          const match = name.match(/^(.*?)(\d{4})$/);
          if (match) {
            animName = match[1];
            frameNum = parseInt(match[2], 10);
          }
          if (!animations[animName]) animations[animName] = [];
          const rotated = sub.getAttribute('rotated') == 'true';
          const fw = parseInt(sub.getAttribute('width'));
          const fh = parseInt(sub.getAttribute('height'));
          animations[animName][frameNum] = {
            name,
            x: parseInt(sub.getAttribute('x')),
            y: parseInt(sub.getAttribute('y')),
            width: fw,
            height: fh,
            frameX: parseInt(sub.getAttribute('frameX') || '0'),
            frameY: parseInt(sub.getAttribute('frameY') || '0'),
            frameWidth: parseInt(sub.getAttribute('frameWidth') || (rotated ? fh : fw)),
            frameHeight: parseInt(sub.getAttribute('frameHeight') || (rotated ? fw : fh)),
            flipX: sub.getAttribute('flipX') == 'true',
            flipY: sub.getAttribute('flipY') == 'true',
            rotated: rotated
          };
          frames.push(animations[animName][frameNum]);
        }
        return { animations, frames };
      }

      if (format == 'json') {
        let json;
        try { json = JSON.parse(data); } catch { return { animations: {}, frames: [] }; }
        if (!json) return { animations: {}, frames: [] };
        const animations = {};
        const frames = [];
        const spriteArray = json.ATLAS && json.ATLAS.SPRITES ? json.ATLAS.SPRITES : (json.frames || []);
        for (const entry of spriteArray) {
          const sub = (entry.SPRITE) ? entry.SPRITE : entry;
          const name = sub.name || sub.SN || '';
          if (!name) continue;
          let animName = name;
          let frameNum = 0;
          const match = name.match(/^(.*?)(\d{4})$/);
          if (match) {
            animName = match[1];
            frameNum = parseInt(match[2], 10);
          }
          if (!animations[animName]) animations[animName] = [];
          const fw = parseInt(sub.width || sub.w || '0');
          const fh = parseInt(sub.height || sub.h || '0');
          const rotated = (sub.rotated == 'true' || sub.rotated == true);
          animations[animName][frameNum] = {
            name,
            x: parseInt(sub.x || '0'),
            y: parseInt(sub.y || '0'),
            width: fw,
            height: fh,
            frameX: parseInt(sub.frameX || '0'),
            frameY: parseInt(sub.frameY || '0'),
            frameWidth: parseInt(sub.frameWidth || (rotated ? fh : fw)),
            frameHeight: parseInt(sub.frameHeight || (rotated ? fw : fh)),
            flipX: (sub.flipX == 'true' || sub.flipX == true),
            flipY: (sub.flipY == 'true' || sub.flipY == true),
            rotated: rotated
          };
          frames.push(animations[animName][frameNum]);
        }
        return { animations, frames };
      }

      if (format == 'ini') {
        const animations = {};
        const frames = [];
        const lines = data.split('\n');
        let currentAnim = null;
        let currentFrame = -1;
        let currentSection = null;
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            const section = trimmed.slice(1, -1);
            if (section == 'meta') {
              currentSection = 'meta';
            } else if (section == 'data') {
              currentSection = 'data';
            } else {
              const parts = section.split('-');
              if (parts.length == 2) {
                currentAnim = parts[0];
                currentFrame = parseInt(parts[1], 10);
                if (!animations[currentAnim]) animations[currentAnim] = [];
                currentSection = 'frame';
              } else {
                currentSection = null;
              }
            }
          } else if (trimmed && trimmed.includes('=')) {
            const [key, value] = trimmed.split('=').map(s => s.trim());
            if (currentSection == 'frame' && currentAnim && currentFrame >= 0) {
              if (!animations[currentAnim][currentFrame]) {
                animations[currentAnim][currentFrame] = { name: currentAnim + currentFrame.toString().padStart(4, '0') };
              }
              const frame = animations[currentAnim][currentFrame];
              switch(key) {
                case 'x': frame.x = parseInt(value, 10); break;
                case 'y': frame.y = parseInt(value, 10); break;
                case 'width': frame.width = parseInt(value, 10); break;
                case 'height': frame.height = parseInt(value, 10); break;
                case 'frameX': frame.frameX = parseInt(value, 10); break;
                case 'frameY': frame.frameY = parseInt(value, 10); break;
                case 'frameWidth': frame.frameWidth = parseInt(value, 10); break;
                case 'frameHeight': frame.frameHeight = parseInt(value, 10); break;
                case 'flipX': frame.flipX = (value == 'true'); break;
                case 'flipY': frame.flipY = (value == 'true'); break;
                case 'rotated': frame.rotated = (value == 'true'); break;
              }
            }
          }
        }
        for (const anim of Object.keys(animations)) {
          const arr = animations[anim];
          const maxIdx = Math.max(...Object.keys(arr).map(Number));
          const filled = [];
          for (let i = 0; i <= maxIdx; i++) {
            if (arr[i]) filled.push(arr[i]);
            else filled.push(null);
          }
          animations[anim] = filled;
        }
        const framesList = [];
        for (const anim of Object.keys(animations)) {
          for (const f of animations[anim]) {
            if (f) framesList.push(f);
          }
        }
        return { animations, frames: framesList };
      }
      return { animations: {}, frames: [] };
    }
  }

  Scratch.extensions.register(new PNGSHEETSEXT());
})(Scratch);