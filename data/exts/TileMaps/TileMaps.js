// Name: Tile Maps
// ID: DragoTileMaps
// Description: Tile mapping with Map→Room→Layer→Tile hierarchy, fast sparse storage, and full import/export.
// By Drago Cuven <https://github.com/Drago-Cuven>

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) throw new Error('This extension must be ran unsandboxed.');

  const { Cast, BlockType, ArgumentType, vm, translate } = Scratch;
  const runtime = vm.runtime;

  const ext = {
    id: 'DragoTileMaps',
    name: 'Tile Maps',
    colors: ['#7d007d', '#5c005c', '#9e009e'],
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

  const safeJSONParse = (str) => {
    try { return JSON.parse(str); } catch { return null; }
  };

  class TileMapsExtension {
    constructor() {
      this.maps = new Map();
      this.focusMap = '';
      this.focusRoom = '';
      this.focusLayer = '';
      this.foldersState = {};
      this._folderStack = [];
      this._initDefaultMap();
    }

    _initDefaultMap() {
      const mapId = 'DefaultMap';
      if (!this.maps.has(mapId)) {
        const map = this._createMap(mapId);
        const roomId = 'DefaultRoom';
        const room = this._createRoom(map, roomId);
        const layerId = 'DefaultLayer';
        this._createLayer(room, layerId, 'tile');
        this.focusMap = mapId;
        this.focusRoom = roomId;
        this.focusLayer = layerId;
      }
    }

    _getMap(id) {
      if (!id) id = this.focusMap;
      return this.maps.get(id) || null;
    }

    _getRoom(mapId, roomId) {
      const map = this._getMap(mapId);
      if (!map) return null;
      if (!roomId) roomId = this.focusRoom;
      return map.rooms.get(roomId) || null;
    }

    _getLayer(mapId, roomId, layerId, layerMode) {
      const room = this._getRoom(mapId, roomId);
      if (!room) return null;
      if (!layerId) layerId = this.focusLayer;
      if (layerMode == 'number') {
        const num = Cast.toNumber(layerId);
        return this._getLayerByNumber(room, num);
      }
      return room.layers.get(layerId) || null;
    }

    _createMap(id) {
      if (this.maps.has(id)) {
        let newId = id + '1';
        let counter = 1;
        while (this.maps.has(newId)) newId = id + (++counter);
        id = newId;
      }
      const map = { id, rooms: new Map(), variables: {} };
      this.maps.set(id, map);
      return map;
    }

    _createRoom(map, id) {
      if (map.rooms.has(id)) {
        let newId = id + '1';
        let counter = 1;
        while (map.rooms.has(newId)) newId = id + (++counter);
        id = newId;
      }
      const room = { id, layers: new Map(), variables: {} };
      map.rooms.set(id, room);
      return room;
    }

    _createLayer(room, id, type) {
      if (room.layers.has(id)) {
        let newId = id + '1';
        let counter = 1;
        while (room.layers.has(newId)) newId = id + (++counter);
        id = newId;
      }
      const layer = {
        id,
        type: type || 'tile',
        width: 0,
        height: 0,
        tiles: new Map(),
        tileKeys: new Set(),
        variables: {}
      };
      room.layers.set(id, layer);
      return layer;
    }

    _getTile(layer, x, y) {
      const key = x + ',' + y;
      return layer.tiles.get(key) || null;
    }

    _setTile(layer, x, y, tileId) {
      const key = x + ',' + y;
      if (tileId == null || tileId === '') {
        if (layer.tiles.has(key)) {
          layer.tiles.delete(key);
          layer.tileKeys.delete(key);
        }
        return;
      }
      let tile = layer.tiles.get(key);
      if (!tile) {
        tile = { id: Cast.toString(tileId), variables: {} };
        layer.tiles.set(key, tile);
        layer.tileKeys.add(key);
      } else {
        tile.id = Cast.toString(tileId);
      }
    }

    _deleteTile(layer, x, y) {
      const key = x + ',' + y;
      if (layer.tiles.has(key)) {
        layer.tiles.delete(key);
        layer.tileKeys.delete(key);
      }
    }

    _getAllTileIds(layer) {
      const ids = [];
      for (const key of layer.tileKeys) {
        const tile = layer.tiles.get(key);
        if (tile) ids.push(tile.id);
      }
      return ids;
    }

    _getAllTileIdsInRoom(room) {
      const all = [];
      for (const layer of room.layers.values()) {
        for (const key of layer.tileKeys) {
          const tile = layer.tiles.get(key);
          if (tile) all.push(tile.id);
        }
      }
      return all;
    }

    _getLayerByNumber(room, num) {
      const layers = Array.from(room.layers.values());
      const idx = num - 1;
      return (idx >= 0 && idx < layers.length) ? layers[idx] : null;
    }

    _getRoomByNumber(map, num) {
      const rooms = Array.from(map.rooms.values());
      const idx = num - 1;
      return (idx >= 0 && idx < rooms.length) ? rooms[idx] : null;
    }

    _getMapByNumber(num) {
      const maps = Array.from(this.maps.values());
      const idx = num - 1;
      return (idx >= 0 && idx < maps.length) ? maps[idx] : null;
    }

    _parsePointInput(input, layer) {
      if (input == null || input === '') return null;
      const mode = input.mode || 'position';
      const value = input.value;
      if (mode == 'index') {
        const idx = Cast.toNumber(value);
        if (isNaN(idx) || idx < 1) return null;
        const w = layer.width || 1;
        const x = (idx - 1) % w;
        const y = Math.floor((idx - 1) / w);
        return { x, y };
      } else {
        if (typeof value == 'string') {
          const parts = value.split(',').map(s => parseFloat(s.trim()));
          if (parts.length == 2 && !parts.some(isNaN)) {
            return { x: Math.floor(parts[0]), y: Math.floor(parts[1]) };
          }
        } else if (Array.isArray(value) && value.length >= 2) {
          const x = Cast.toNumber(value[0]);
          const y = Cast.toNumber(value[1]);
          if (!isNaN(x) && !isNaN(y)) return { x: Math.floor(x), y: Math.floor(y) };
        } else if (typeof value == 'object' && value !== null) {
          const x = Cast.toNumber(value.x ?? value[0]);
          const y = Cast.toNumber(value.y ?? value[1]);
          if (!isNaN(x) && !isNaN(y)) return { x: Math.floor(x), y: Math.floor(y) };
        }
        return { x: 1, y: 1 };
      }
    }

    _ensureFocus(mapId, roomId, layerId) {
      if (mapId && this.maps.has(mapId)) this.focusMap = mapId;
      if (roomId && this._getRoom(mapId, roomId)) this.focusRoom = roomId;
      if (layerId && this._getLayer(mapId, roomId, layerId)) this.focusLayer = layerId;
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
      if (vm && vm.extensionManager && typeof vm.extensionManager.refreshBlocks == 'function') {
        vm.extensionManager.refreshBlocks(ext.id);
      }
    }

    _argDef(blockDef) {
      const args = blockDef.arguments || {};
      for (const key in args) {
        args[key].exemptFromNormalization = true;
      }
      return blockDef;
    }

    createNewMap(args) {
      let name = Cast.toString(args.NAME);
      if (!name || name == '') name = 'Map';
      const map = this._createMap(name);
      const room = this._createRoom(map, 'Room1');
      this._createLayer(room, 'Layer1', 'tile');
      this.focusMap = map.id;
      this.focusRoom = room.id;
      this.focusLayer = 'Layer1';
    }

    renameMap(args) {
      const map = this._getMap(args.MAP);
      if (!map) return;
      let newName = Cast.toString(args.NAME);
      if (!newName || newName == '') return;
      if (this.maps.has(newName)) {
        let counter = 1;
        let base = newName;
        while (this.maps.has(newName)) newName = base + (++counter);
      }
      if (this.focusMap == map.id) this.focusMap = newName;
      this.maps.delete(map.id);
      map.id = newName;
      this.maps.set(newName, map);
    }

    deleteMap(args) {
      const id = Cast.toString(args.MAP);
      if (this.maps.has(id)) {
        this.maps.delete(id);
        if (this.focusMap == id) this.focusMap = '';
      }
    }

    getMapIDs() {
      return engine.handleArray(Array.from(this.maps.keys()));
    }

    getMapVariable(args) {
      const map = this._getMap(args.MAP);
      if (!map) return '';
      const key = Cast.toString(args.KEY);
      return map.variables[key] !== undefined ? Cast.toString(map.variables[key]) : '';
    }

    setMapVariable(args) {
      const map = this._getMap(args.MAP);
      if (!map) return;
      const key = Cast.toString(args.KEY);
      const val = Cast.toString(args.VALUE);
      map.variables[key] = val;
    }

    createRoom(args) {
      const map = this._getMap(args.MAP);
      if (!map) return;
      let name = Cast.toString(args.NAME);
      if (!name || name == '') name = 'Room';
      const room = this._createRoom(map, name);
      this._createLayer(room, 'Layer1', 'tile');
      this.focusRoom = room.id;
      this.focusLayer = 'Layer1';
    }

    renameRoom(args) {
      const map = this._getMap(args.MAP);
      if (!map) return;
      const room = map.rooms.get(Cast.toString(args.ROOM));
      if (!room) return;
      let newName = Cast.toString(args.NAME);
      if (!newName || newName == '') return;
      if (map.rooms.has(newName)) {
        let counter = 1;
        let base = newName;
        while (map.rooms.has(newName)) newName = base + (++counter);
      }
      if (this.focusRoom == room.id) this.focusRoom = newName;
      map.rooms.delete(room.id);
      room.id = newName;
      map.rooms.set(newName, room);
    }

    deleteRoom(args) {
      const map = this._getMap(args.MAP);
      if (!map) return;
      const id = Cast.toString(args.ROOM);
      if (map.rooms.has(id)) {
        map.rooms.delete(id);
        if (this.focusRoom == id) this.focusRoom = '';
        if (this.focusLayer) this.focusLayer = '';
      }
    }

    getRoomIDs(args) {
      const map = this._getMap(args.MAP);
      if (!map) return engine.handleArray([]);
      return engine.handleArray(Array.from(map.rooms.keys()));
    }

    getRoomVariable(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return '';
      const key = Cast.toString(args.KEY);
      return room.variables[key] !== undefined ? Cast.toString(room.variables[key]) : '';
    }

    setRoomVariable(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return;
      const key = Cast.toString(args.KEY);
      const val = Cast.toString(args.VALUE);
      room.variables[key] = val;
    }


    createLayer(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return;
      let name = Cast.toString(args.NAME);
      if (!name || name == '') name = 'Layer';
      const type = Cast.toString(args.TYPE) || 'tile';
      const layer = this._createLayer(room, name, type);
      this.focusLayer = layer.id;
    }

    renameLayer(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return;
      const layer = room.layers.get(Cast.toString(args.LAYER));
      if (!layer) return;
      let newName = Cast.toString(args.NAME);
      if (!newName || newName == '') return;
      if (room.layers.has(newName)) {
        let counter = 1;
        let base = newName;
        while (room.layers.has(newName)) newName = base + (++counter);
      }
      if (this.focusLayer == layer.id) this.focusLayer = newName;
      room.layers.delete(layer.id);
      layer.id = newName;
      room.layers.set(newName, layer);
    }

    deleteLayer(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return;
      const id = Cast.toString(args.LAYER);
      if (room.layers.has(id)) {
        room.layers.delete(id);
        if (this.focusLayer == id) this.focusLayer = '';
      }
    }

    getLayerIDs(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return engine.handleArray([]);
      return engine.handleArray(Array.from(room.layers.keys()));
    }

    getLayerType(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return '';
      return Cast.toString(layer.type);
    }

    setLayerType(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return;
      layer.type = Cast.toString(args.TYPE);
    }

    setLayerDimensions(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return;
      layer.width = Math.max(0, Cast.toNumber(args.WIDTH));
      layer.height = Math.max(0, Cast.toNumber(args.HEIGHT));
    }

    getLayerWidth(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return 0;
      return Cast.toNumber(layer.width);
    }

    getLayerHeight(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return 0;
      return Cast.toNumber(layer.height);
    }

    getLayerVariable(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return '';
      const key = Cast.toString(args.KEY);
      return layer.variables[key] !== undefined ? Cast.toString(layer.variables[key]) : '';
    }

    setLayerVariable(args) {
      const layer = this._getLayer(args.MAP, args.ROOM, args.LAYER);
      if (!layer) return;
      const key = Cast.toString(args.KEY);
      const val = Cast.toString(args.VALUE);
      layer.variables[key] = val;
    }

    _resolveLayer(args) {
      const mode = Cast.toString(args.LAYERMODE);
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return null;
      let layer = null;
      if (mode == 'number') {
        const num = Cast.toNumber(args.LAYER);
        layer = this._getLayerByNumber(room, num);
      } else {
        layer = room.layers.get(Cast.toString(args.LAYER));
      }
      return layer;
    }

    setTile(args) {
      const layer = this._resolveLayer(args);
      if (!layer) return;
      const point = this._parsePointInput({ mode: args.MODE, value: args.POS }, layer);
      if (!point) return;
      const tileId = Cast.toString(args.TILE);
      this._setTile(layer, point.x, point.y, tileId);
    }

    getTile(args) {
      const layer = this._resolveLayer(args);
      if (!layer) return '';
      const point = this._parsePointInput({ mode: args.MODE, value: args.POS }, layer);
      if (!point) return '';
      const tile = this._getTile(layer, point.x, point.y);
      return tile ? Cast.toString(tile.id) : '';
    }

    deleteTile(args) {
      const layer = this._resolveLayer(args);
      if (!layer) return;
      const point = this._parsePointInput({ mode: args.MODE, value: args.POS }, layer);
      if (!point) return;
      this._deleteTile(layer, point.x, point.y);
    }

    getTileVariable(args) {
      const layer = this._resolveLayer(args);
      if (!layer) return '';
      const point = this._parsePointInput({ mode: args.MODE, value: args.POS }, layer);
      if (!point) return '';
      const tile = this._getTile(layer, point.x, point.y);
      if (!tile) return '';
      const key = Cast.toString(args.KEY);
      return tile.variables[key] !== undefined ? Cast.toString(tile.variables[key]) : '';
    }

    setTileVariable(args) {
      const layer = this._resolveLayer(args);
      if (!layer) return;
      const point = this._parsePointInput({ mode: args.MODE, value: args.POS }, layer);
      if (!point) return;
      const tile = this._getTile(layer, point.x, point.y);
      if (!tile) return;
      const key = Cast.toString(args.KEY);
      const val = Cast.toString(args.VALUE);
      tile.variables[key] = val;
    }

    getAllTilesInLayer(args) {
      const layer = this._resolveLayer(args);
      if (!layer) return engine.handleArray([]);
      return engine.handleArray(this._getAllTileIds(layer));
    }

    getAllTilesInLayerNumber(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return engine.handleArray([]);
      const num = Cast.toNumber(args.NUMBER);
      const layer = this._getLayerByNumber(room, num);
      if (!layer) return engine.handleArray([]);
      return engine.handleArray(this._getAllTileIds(layer));
    }

    getAllTilesInRoom(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return engine.handleArray([]);
      return engine.handleArray(this._getAllTileIdsInRoom(room));
    }

    setFocus(args) {
      const target = Cast.toString(args.TARGET);
      const name = Cast.toString(args.NAME);
      if (!name) return;
      if (target == 'map') {
        if (this.maps.has(name)) this.focusMap = name;
      } else if (target == 'room') {
        const map = this._getMap(this.focusMap);
        if (map && map.rooms.has(name)) this.focusRoom = name;
      } else if (target == 'layer') {
        const room = this._getRoom(this.focusMap, this.focusRoom);
        if (room && room.layers.has(name)) this.focusLayer = name;
      }
    }

    getFocusMap() { return Cast.toString(this.focusMap); }
    getFocusRoom() { return Cast.toString(this.focusRoom); }
    getFocusLayer() { return Cast.toString(this.focusLayer); }

    importRoom(args) {
      const map = this._getMap(args.MAP);
      if (!map) return;
      const obj = engine.handleObject(args.ROOMOBJ, false);
      if (!obj || typeof obj != 'object') return;
      const roomId = obj.id || 'ImportedRoom';
      const room = this._createRoom(map, roomId);
      if (obj.variables) room.variables = { ...obj.variables };
      if (Array.isArray(obj.layers)) {
        for (const ldata of obj.layers) {
          const layer = this._createLayer(room, ldata.id || 'Layer', ldata.type || 'tile');
          if (ldata.width !== undefined) layer.width = ldata.width;
          if (ldata.height !== undefined) layer.height = ldata.height;
          if (ldata.variables) layer.variables = { ...ldata.variables };
          if (Array.isArray(ldata.tiles)) {
            for (const tdata of ldata.tiles) {
              const x = Cast.toNumber(tdata.x);
              const y = Cast.toNumber(tdata.y);
              if (!isNaN(x) && !isNaN(y)) {
                const tile = { id: Cast.toString(tdata.id), variables: tdata.variables || {} };
                const key = x + ',' + y;
                layer.tiles.set(key, tile);
                layer.tileKeys.add(key);
              }
            }
          }
        }
      }
      this.focusRoom = room.id;
      if (room.layers.size > 0) this.focusLayer = Array.from(room.layers.keys())[0];
    }

    importMap(args) {
      const obj = engine.handleObject(args.MAPOBJ, false);
      if (!obj || typeof obj != 'object') return;
      let name = Cast.toString(args.NAME);
      if (!name || name == '') name = obj.id || 'Map';
      if (this.maps.has(name)) {
        let counter = 1;
        let base = name;
        while (this.maps.has(name)) name = base + (++counter);
      }
      const map = this._createMap(name);
      if (obj.variables) map.variables = { ...obj.variables };
      if (Array.isArray(obj.rooms)) {
        for (const rdata of obj.rooms) {
          const room = this._createRoom(map, rdata.id || 'Room');
          if (rdata.variables) room.variables = { ...rdata.variables };
          if (Array.isArray(rdata.layers)) {
            for (const ldata of rdata.layers) {
              const layer = this._createLayer(room, ldata.id || 'Layer', ldata.type || 'tile');
              if (ldata.width !== undefined) layer.width = ldata.width;
              if (ldata.height !== undefined) layer.height = ldata.height;
              if (ldata.variables) layer.variables = { ...ldata.variables };
              if (Array.isArray(ldata.tiles)) {
                for (const tdata of ldata.tiles) {
                  const x = Cast.toNumber(tdata.x);
                  const y = Cast.toNumber(tdata.y);
                  if (!isNaN(x) && !isNaN(y)) {
                    const tile = { id: Cast.toString(tdata.id), variables: tdata.variables || {} };
                    const key = x + ',' + y;
                    layer.tiles.set(key, tile);
                    layer.tileKeys.add(key);
                  }
                }
              }
            }
          }
        }
      }
      this.focusMap = map.id;
      if (map.rooms.size > 0) {
        this.focusRoom = Array.from(map.rooms.keys())[0];
        const room = map.rooms.get(this.focusRoom);
        if (room && room.layers.size > 0) this.focusLayer = Array.from(room.layers.keys())[0];
      }
    }

    exportMap(args) {
      const map = this._getMap(args.MAP);
      if (!map) return engine.handleObject({});
      const name = Cast.toString(args.NAME) || map.id || 'map';
      const obj = {
        id: name,
        variables: { ...map.variables },
        rooms: []
      };
      for (const room of map.rooms.values()) {
        const rObj = {
          id: room.id,
          variables: { ...room.variables },
          layers: []
        };
        for (const layer of room.layers.values()) {
          const lObj = {
            id: layer.id,
            type: layer.type,
            width: layer.width,
            height: layer.height,
            variables: { ...layer.variables },
            tiles: []
          };
          for (const key of layer.tileKeys) {
            const tile = layer.tiles.get(key);
            if (tile) {
              const [x, y] = key.split(',').map(Number);
              lObj.tiles.push({
                x, y,
                id: tile.id,
                variables: { ...tile.variables }
              });
            }
          }
          rObj.layers.push(lObj);
        }
        obj.rooms.push(rObj);
      }
      return engine.handleObject(obj);
    }

    exportRoom(args) {
      const room = this._getRoom(args.MAP, args.ROOM);
      if (!room) return engine.handleObject({});
      const name = Cast.toString(args.NAME) || room.id || 'room';
      const obj = {
        id: name,
        variables: { ...room.variables },
        layers: []
      };
      for (const layer of room.layers.values()) {
        const lObj = {
          id: layer.id,
          type: layer.type,
          width: layer.width,
          height: layer.height,
          variables: { ...layer.variables },
          tiles: []
        };
        for (const key of layer.tileKeys) {
          const tile = layer.tiles.get(key);
          if (tile) {
            const [x, y] = key.split(',').map(Number);
            lObj.tiles.push({
              x, y,
              id: tile.id,
              variables: { ...tile.variables }
            });
          }
        }
        obj.layers.push(lObj);
      }
      return engine.handleObject(obj);
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
          ...this._makeFolder("Map", [
            this._argDef({ opcode: 'createNewMap', blockType: BlockType.COMMAND, text: translate('create new map named [NAME]'), arguments: { NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'renameMap', blockType: BlockType.COMMAND, text: translate('rename map [MAP] to [NAME]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'deleteMap', blockType: BlockType.COMMAND, text: translate('delete map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.arrayBlock(this._argDef({ opcode: 'getMapIDs', blockType: BlockType.REPORTER, text: translate('all maps loaded') })),
            "---",
            this._argDef({ opcode: 'getMapVariable', blockType: BlockType.REPORTER, text: translate('map [MAP] variable [KEY]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, KEY: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'setMapVariable', blockType: BlockType.COMMAND, text: translate('set map [MAP] variable [KEY] to [VALUE]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, KEY: { type: ArgumentType.STRING, defaultValue: '' }, VALUE: { type: ArgumentType.STRING, defaultValue: '' } } }),
          ]),
          "---",
          ...this._makeFolder("Rooms", [
            this._argDef({ opcode: 'createRoom', blockType: BlockType.COMMAND, text: translate('create room named [NAME] in map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'renameRoom', blockType: BlockType.COMMAND, text: translate('rename room [ROOM] in map [MAP] to [NAME]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'deleteRoom', blockType: BlockType.COMMAND, text: translate('delete room [ROOM] from map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.arrayBlock(this._argDef({ opcode: 'getRoomIDs', blockType: BlockType.REPORTER, text: translate('all rooms in map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' } } })),
            "---",
            this._argDef({ opcode: 'getRoomVariable', blockType: BlockType.REPORTER, text: translate('room [ROOM] in map [MAP] variable [KEY]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, KEY: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'setRoomVariable', blockType: BlockType.COMMAND, text: translate('set room [ROOM] in map [MAP] variable [KEY] to [VALUE]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, KEY: { type: ArgumentType.STRING, defaultValue: '' }, VALUE: { type: ArgumentType.STRING, defaultValue: '' } } }),
          ]),
          "---",
          ...this._makeFolder("Layers", [
            this._argDef({ opcode: 'createLayer', blockType: BlockType.COMMAND, text: translate('create layer named [NAME] of type [TYPE] in room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' }, TYPE: { type: ArgumentType.STRING, defaultValue: 'tile' } } }),
            this._argDef({ opcode: 'renameLayer', blockType: BlockType.COMMAND, text: translate('rename layer [LAYER] in room [ROOM] of map [MAP] to [NAME]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'deleteLayer', blockType: BlockType.COMMAND, text: translate('delete layer [LAYER] from room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.arrayBlock(this._argDef({ opcode: 'getLayerIDs', blockType: BlockType.REPORTER, text: translate('all layers in room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' } } })),
            "---",
            this._argDef({ opcode: 'getLayerType', blockType: BlockType.REPORTER, text: translate('type of layer [LAYER] in room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'setLayerType', blockType: BlockType.COMMAND, text: translate('set type of layer [LAYER] in room [ROOM] of map [MAP] to [TYPE]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' }, TYPE: { type: ArgumentType.STRING, defaultValue: 'tile' } } }),
            "---",
            this._argDef({ opcode: 'setLayerDimensions', blockType: BlockType.COMMAND, text: translate('set layer [LAYER] in room [ROOM] of map [MAP] width [WIDTH] height [HEIGHT]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' }, WIDTH: { type: ArgumentType.NUMBER, defaultValue: 10 }, HEIGHT: { type: ArgumentType.NUMBER, defaultValue: 10 } } }),
            this._argDef({ opcode: 'getLayerWidth', blockType: BlockType.REPORTER, text: translate('width of layer [LAYER] in room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'getLayerHeight', blockType: BlockType.REPORTER, text: translate('height of layer [LAYER] in room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' } } }),
            "---",
            this._argDef({ opcode: 'getLayerVariable', blockType: BlockType.REPORTER, text: translate('layer [LAYER] in room [ROOM] of map [MAP] variable [KEY]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' }, KEY: { type: ArgumentType.STRING, defaultValue: '' } } }),
            this._argDef({ opcode: 'setLayerVariable', blockType: BlockType.COMMAND, text: translate('set layer [LAYER] in room [ROOM] of map [MAP] variable [KEY] to [VALUE]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' }, KEY: { type: ArgumentType.STRING, defaultValue: '' }, VALUE: { type: ArgumentType.STRING, defaultValue: '' } } }),
          ]),
          "---",
          ...this._makeFolder("Tiles", [
            this._argDef({ opcode: 'setTile', blockType: BlockType.COMMAND, text: translate('set tile at [MODE] [POS] on layer [LAYERMODE] [LAYER] in room [ROOM] of map [MAP] to [TILE]'), arguments: {
              MAP: { type: ArgumentType.STRING, defaultValue: '' },
              ROOM: { type: ArgumentType.STRING, defaultValue: '' },
              LAYERMODE: { type: ArgumentType.STRING, menu: 'layerModeMenu', defaultValue: 'name' },
              LAYER: { type: ArgumentType.STRING, defaultValue: '' },
              MODE: { type: ArgumentType.STRING, menu: 'indexPosMenu', defaultValue: 'position' },
              POS: { type: ArgumentType.STRING, defaultValue: '1,1' },
              TILE: { type: ArgumentType.STRING, defaultValue: '' }
            } }),
            this._argDef({ opcode: 'getTile', blockType: BlockType.REPORTER, text: translate('tile at [MODE] [POS] on layer [LAYERMODE] [LAYER] in room [ROOM] of map [MAP]'), arguments: {
              MAP: { type: ArgumentType.STRING, defaultValue: '' },
              ROOM: { type: ArgumentType.STRING, defaultValue: '' },
              LAYERMODE: { type: ArgumentType.STRING, menu: 'layerModeMenu', defaultValue: 'name' },
              LAYER: { type: ArgumentType.STRING, defaultValue: '' },
              MODE: { type: ArgumentType.STRING, menu: 'indexPosMenu', defaultValue: 'position' },
              POS: { type: ArgumentType.STRING, defaultValue: '1,1' }
            } }),
            this._argDef({ opcode: 'deleteTile', blockType: BlockType.COMMAND, text: translate('delete tile at [MODE] [POS] on layer [LAYERMODE] [LAYER] in room [ROOM] of map [MAP]'), arguments: {
              MAP: { type: ArgumentType.STRING, defaultValue: '' },
              ROOM: { type: ArgumentType.STRING, defaultValue: '' },
              LAYERMODE: { type: ArgumentType.STRING, menu: 'layerModeMenu', defaultValue: 'name' },
              LAYER: { type: ArgumentType.STRING, defaultValue: '' },
              MODE: { type: ArgumentType.STRING, menu: 'indexPosMenu', defaultValue: 'position' },
              POS: { type: ArgumentType.STRING, defaultValue: '1,1' }
            } }),
            "---",
            this._argDef({ opcode: 'getTileVariable', blockType: BlockType.REPORTER, text: translate('variable [KEY] of tile at [MODE] [POS] on layer [LAYERMODE] [LAYER] in room [ROOM] of map [MAP]'), arguments: {
              MAP: { type: ArgumentType.STRING, defaultValue: '' },
              ROOM: { type: ArgumentType.STRING, defaultValue: '' },
              LAYERMODE: { type: ArgumentType.STRING, menu: 'layerModeMenu', defaultValue: 'name' },
              LAYER: { type: ArgumentType.STRING, defaultValue: '' },
              MODE: { type: ArgumentType.STRING, menu: 'indexPosMenu', defaultValue: 'position' },
              POS: { type: ArgumentType.STRING, defaultValue: '1,1' },
              KEY: { type: ArgumentType.STRING, defaultValue: '' }
            } }),
            this._argDef({ opcode: 'setTileVariable', blockType: BlockType.COMMAND, text: translate('set variable [KEY] of tile at [MODE] [POS] on layer [LAYERMODE] [LAYER] in room [ROOM] of map [MAP] to [VALUE]'), arguments: {
              MAP: { type: ArgumentType.STRING, defaultValue: '' },
              ROOM: { type: ArgumentType.STRING, defaultValue: '' },
              LAYERMODE: { type: ArgumentType.STRING, menu: 'layerModeMenu', defaultValue: 'name' },
              LAYER: { type: ArgumentType.STRING, defaultValue: '' },
              MODE: { type: ArgumentType.STRING, menu: 'indexPosMenu', defaultValue: 'position' },
              POS: { type: ArgumentType.STRING, defaultValue: '1,1' },
              KEY: { type: ArgumentType.STRING, defaultValue: '' },
              VALUE: { type: ArgumentType.STRING, defaultValue: '' }
            } }),
            "---",
            engine.arrayBlock(this._argDef({ opcode: 'getAllTilesInLayer', blockType: BlockType.REPORTER, text: translate('all tiles in layer [LAYERMODE] [LAYER] of room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, LAYERMODE: { type: ArgumentType.STRING, menu: 'layerModeMenu', defaultValue: 'name' }, LAYER: { type: ArgumentType.STRING, defaultValue: '' } } })),
            engine.arrayBlock(this._argDef({ opcode: 'getAllTilesInLayerNumber', blockType: BlockType.REPORTER, text: translate('all tiles in layer # [NUMBER] of room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, NUMBER: { type: ArgumentType.NUMBER, defaultValue: 1 } } })),
            engine.arrayBlock(this._argDef({ opcode: 'getAllTilesInRoom', blockType: BlockType.REPORTER, text: translate('all tiles in room [ROOM] of map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' } } })),
          ]),
          "---",
          ...this._makeFolder("Focus", [
            this._argDef({ opcode: 'setFocus', blockType: BlockType.COMMAND, text: translate('set focus [TARGET] to [NAME]'), arguments: { TARGET: { type: ArgumentType.STRING, menu: 'focusTargetMenu', defaultValue: 'map' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            { opcode: 'getFocusMap', blockType: BlockType.REPORTER, text: translate('focus map') },
            { opcode: 'getFocusRoom', blockType: BlockType.REPORTER, text: translate('focus room') },
            { opcode: 'getFocusLayer', blockType: BlockType.REPORTER, text: translate('focus layer') },
          ]),
          "---",
          ...this._makeFolder("ImportExport", [
            this._argDef({ opcode: 'importRoom', blockType: BlockType.COMMAND, text: translate('import room [ROOMOBJ] into map [MAP]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOMOBJ: engine.objectInput({ type: ArgumentType.STRING, defaultValue: '{}' }) } }),
            this._argDef({ opcode: 'importMap', blockType: BlockType.COMMAND, text: translate('import map [MAPOBJ] as [NAME]'), arguments: { MAPOBJ: engine.objectInput({ type: ArgumentType.STRING, defaultValue: '{}' }), NAME: { type: ArgumentType.STRING, defaultValue: '' } } }),
            engine.objectBlock(this._argDef({ opcode: 'exportMap', blockType: BlockType.REPORTER, text: translate('export map [MAP] as [NAME]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } })),
            engine.objectBlock(this._argDef({ opcode: 'exportRoom', blockType: BlockType.REPORTER, text: translate('export room [ROOM] of map [MAP] as [NAME]'), arguments: { MAP: { type: ArgumentType.STRING, defaultValue: '' }, ROOM: { type: ArgumentType.STRING, defaultValue: '' }, NAME: { type: ArgumentType.STRING, defaultValue: '' } } })),
          ])
        ],
        menus: {
          focusTargetMenu: {
            acceptReporters: true,
            items: [
              { text: translate('map'), value: 'map' },
              { text: translate('room'), value: 'room' },
              { text: translate('layer'), value: 'layer' }
            ]
          },
          indexPosMenu: {
            acceptReporters: true,
            items: [
              { text: translate('index'), value: 'index' },
              { text: translate('position'), value: 'position' }
            ]
          },
          layerModeMenu: {
            acceptReporters: true,
            items: [
              { text: translate('name'), value: 'name' },
              { text: translate('number'), value: 'number' }
            ]
          }
        }
      };
    }
  }

  Scratch.extensions.register(new TileMapsExtension());
})(Scratch);