// Name: Veneer
// ID: DragoVeneer
// Description: Quickly Render Sprites with other Images or Costumes
// By Drago Cuven <https://github.com/Drago-Cuven>
// Thanks to SharkPool
// Thanks to LilyMakesThings <https://scratch.mit.edu/users/LilyMakesThings/>
// Forked from Sharkpool's Turboskins -> LilyMakesThings's Skins

(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) throw new Error('Veneer must run unsandboxed!');

  const { Cast, BlockType, ArgumentType, vm } = Scratch;
  const runtime = vm.runtime;
  const render = vm.renderer;
  const { SVGSkin, BitmapSkin } = render.exports;
  const updateSkin = render.updateDrawableSkinId.bind(render);

  const skinTag = Symbol('DragoSkin');
  let allSkins = {};
  let skinsInUse = {};
  let customHitboxTargets = new Set();
  let cacheOriginalInput = false;
  let overwriteBehavior = 'overwrite';

  const makeTexture = async (url) => {
    if (url.startsWith('data:image/')) {
      const parts = url.split(',');
      const mime = parts[0].match(/data:([^;]+)/)[1] || 'image/png';
      const binary = atob(parts[1]);
      const arr = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
      const blob = new Blob([arr], { type: mime });
      return await createImageBitmap(blob);
    }
    const obj = await Scratch.fetch(url);
    const contentType = obj.headers.get('Content-Type');
    if (contentType == 'image/svg+xml') {
      const text = await obj.text();
      return ['override', text];
    }
    const blob = await obj.blob();
    return await createImageBitmap(blob);
  };

  const makeSkin = async (type, name, data) => {
    const source = data;
    if (type == 'url') {
      data = await makeTexture(data);
      if (data[0] == 'override') {
        type = 'svg';
        data = data[1];
      }
    }
    name = Cast.toString(name);
    const existingSkin = allSkins[name];
    if (existingSkin) {
      const skinData = existingSkin[skinTag];
      if (skinData.type != type) removeSkin(skinData.name);
      else {
        if (skinData.type == 'svg') existingSkin.setSVG(data);
        else existingSkin.setBitmap(data, 1);
        return;
      }
    }
    const skinId = render._nextSkinId++;
    let skin;
    if (type == 'svg') {
      skin = new SVGSkin(skinId, render);
      skin.setSVG(data);
    } else {
      skin = new BitmapSkin(skinId, render);
      skin.setBitmap(data, 1);
    }
    const tag = { type, name, data, hitbox: skinId };
    if (cacheOriginalInput) tag.source = source;
    skin[skinTag] = tag;
    allSkins[name] = skin;
    render._allSkins[skinId] = skin;
  };

  const removeSkin = (name) => {
    name = Cast.toString(name);
    const skin = allSkins[name];
    if (!skin) return;
    render.destroySkin(skin._id);
    delete allSkins[name];
  };

  const refreshTargets = () => {
    for (const target of runtime.targets) target.updateAllDrawableProperties();
    skinsInUse = {};
    customHitboxTargets.clear();
  };
  runtime.on('PROJECT_START', refreshTargets);
  runtime.on('PROJECT_STOP_ALL', refreshTargets);

  class DragoVeneer {
    constructor() {
      this.foldersState = {};
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
        if (!isOpen) {
          block.hideFromPalette = true;
        } else {
          block.hideFromPalette = block.hideFromPalette || false;
        }
        result.push(block);
      }

      this._folderStack.pop();
      return result;
    }

    _reloadBlocks() {
      vm.extensionManager.refreshBlocks('DragoVeneer');
      vm.runtime.emit('EXTENSION_REFRESH_BLOCKS', 'DragoVeneer');
    }

    getInfo() {
      return {
        id: 'DragoVeneer',
        name: 'Veneer',
        color1: '#9966ff',
        color2: '#800080',
        color3: '#8B0000',
        menuIconURI: '',
        blocks: [
          {
            opcode: 'createSkin',
            blockType: BlockType.COMMAND,
            text: 'create skin [IMG] named [NAME]',
            arguments: {
              IMG: { type: ArgumentType.STRING, defaultValue: '</svg>', exemptFromNormalization: true },
              NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'importImages',
            blockType: BlockType.COMMAND,
            text: 'import images [IMGARRAY] with names [NAMEARRAY]',
            arguments: {
              IMGARRAY: { type: ArgumentType.STRING, defaultValue: '[]', exemptFromNormalization: true },
              NAMEARRAY: { type: ArgumentType.STRING, defaultValue: '[]', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'deleteSkin',
            blockType: BlockType.COMMAND,
            text: 'delete skin named [NAME]',
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'deleteAll',
            blockType: BlockType.COMMAND,
            text: 'delete all skins'
          },
          {
            opcode: 'skinLoaded',
            blockType: BlockType.BOOLEAN,
            text: 'is skin [NAME] loaded?',
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'allSkinNames',
            blockType: BlockType.REPORTER,
            text: 'all skins'
          },
          '---',
          {
            opcode: 'setSkin',
            blockType: BlockType.COMMAND,
            text: 'set skin of [TARGET] to [NAME]',
            arguments: {
              TARGET: { type: ArgumentType.STRING, menu: 'TARGETS', defaultValue: '_myself_', exemptFromNormalization: true },
              NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'setCostumeSkin',
            blockType: BlockType.COMMAND,
            text: 'set skin of [TARGET] to [NAME] in [SCRAP]',
            arguments: {
              TARGET: { type: ArgumentType.STRING, menu: 'TARGETS', defaultValue: '_myself_', exemptFromNormalization: true },
              NAME: { type: ArgumentType.STRING, defaultValue: 'costume1', exemptFromNormalization: true },
              SCRAP: { type: ArgumentType.STRING, menu: 'TARGETS', defaultValue: '_myself_', exemptFromNormalization: true }
            }
          },
          '---',
          {
            opcode: 'restoreTarget',
            blockType: BlockType.COMMAND,
            text: 'restore skin of [TARGET]',
            arguments: {
              TARGET: { type: ArgumentType.STRING, menu: 'TARGETS', defaultValue: '_myself_', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'restoreSkin',
            blockType: BlockType.COMMAND,
            text: 'restore sprites with skin [NAME]',
            arguments: {
              NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true }
            }
          },
          '---',
          {
            opcode: 'currentSkin',
            blockType: BlockType.REPORTER,
            text: 'current skin of [TARGET]',
            arguments: {
              TARGET: { type: ArgumentType.STRING, menu: 'TARGETS', defaultValue: '_myself_', exemptFromNormalization: true }
            }
          },
          {
            opcode: 'attSkin',
            blockType: BlockType.REPORTER,
            text: '[THING] of skin [NAME]',
            arguments: {
              THING: { type: ArgumentType.STRING, menu: 'SKIN_ATTS', defaultValue: 'width', exemptFromNormalization: true },
              NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true }
            }
          },
          '---',
          ...this._makeFolder('Config', [
            {
              opcode: 'setCacheOriginalInput',
              blockType: BlockType.COMMAND,
              text: 'set cache original skin input [CACHE]',
              arguments: {
                CACHE: { type: ArgumentType.BOOLEAN, defaultValue: false, exemptFromNormalization: true }
              }
            },
            {
              opcode: 'getCacheOriginalInput',
              blockType: BlockType.BOOLEAN,
              text: 'cache original skin input?'
            },
            {
              opcode: 'setOverwriteBehavior',
              blockType: BlockType.COMMAND,
              text: 'set overwrite behavior [BEHAVIOR]',
              arguments: {
                BEHAVIOR: { type: ArgumentType.STRING, menu: 'overwriteBehaviorMenu', defaultValue: 'overwrite', exemptFromNormalization: true }
              }
            },
            {
              opcode: 'getOverwriteBehavior',
              blockType: BlockType.REPORTER,
              text: 'overwrite behavior'
            }
          ]),
          '---',
          ...this._makeFolder('Advanced', [
            {
              opcode: 'setRotation',
              blockType: BlockType.COMMAND,
              text: 'set rotation center of skin [NAME] to x [x] y [y]',
              arguments: {
                NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true },
                x: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true },
                y: { type: ArgumentType.NUMBER, defaultValue: 0, exemptFromNormalization: true }
              }
            },
            {
              opcode: 'setHitbox',
              blockType: BlockType.COMMAND,
              text: 'set hitbox of skin [NAME] to [SCRAP]',
              arguments: {
                NAME: { type: ArgumentType.STRING, defaultValue: 'skin-1', exemptFromNormalization: true },
                SCRAP: { type: ArgumentType.STRING, defaultValue: 'skin-2', exemptFromNormalization: true }
              }
            }
          ])
        ],
        menus: {
          TARGETS: { acceptReporters: true, items: 'getTargets' },
          SKIN_ATTS: {
            acceptReporters: true,
            items: ['width', 'height', 'rotation center x', 'rotation center y', 'type', 'source', 'users']
          },
          overwriteBehaviorMenu: {
            acceptReporters: true,
            items: ['overwrite', 'numberize']
          }
        }
      };
    }

    getTargets() {
      const items = [{ text: 'myself', value: '_myself_' }, { text: 'Stage', value: '_stage_' }];
      const targets = runtime.targets;
      for (let index = 1; index < targets.length; index++) {
        const target = targets[index];
        if (target.isOriginal) items.push({ text: target.getName(), value: target.getName() });
      }
      return items.length ? items : [''];
    }

    getSprite(name, util) {
      if (name == '_myself_') return util.target;
      if (name == '_stage_') return runtime.getTargetForStage();
      return runtime.getSpriteTargetByName(name);
    }

    async createSkin(args) {
      const img = Cast.toString(args.IMG);
      const name = args.NAME;
      let type = 'url';
      const trimmed = img.trim();
      if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml') || trimmed.startsWith('<!DOCTYPE svg')) {
        type = 'svg';
      }
      await makeSkin(type, name, img);
    }

    async importImages(args) {
      const imgs = Cast.toString(args.IMGARRAY);
      const names = Cast.toString(args.NAMEARRAY);
      let imgArr = [], nameArr = [];
      try { imgArr = JSON.parse(imgs); } catch { return; }
      try { nameArr = JSON.parse(names); } catch { return; }
      if (!Array.isArray(imgArr)) return;
      if (!Array.isArray(nameArr)) nameArr = [];

      const total = imgArr.length;
      let nameIdx = 0;
      let lastBaseName = '';
      let lastNum = 0;

      const getNextName = () => {
        if (nameIdx < nameArr.length) {
          const base = Cast.toString(nameArr[nameIdx++]);
          if (overwriteBehavior == 'numberize' && allSkins[base]) {
            let n = 1;
            while (allSkins[base + n]) n++;
            return base + n;
          }
          return base;
        } else {
          if (!lastBaseName) {
            lastBaseName = 'image';
            lastNum = 0;
          }
          if (overwriteBehavior == 'numberize') {
            let n = lastNum + 1;
            while (allSkins[lastBaseName + n]) n++;
            lastNum = n;
            return lastBaseName + lastNum;
          } else {
            return lastBaseName;
          }
        }
      };

      const promises = [];
      for (let i = 0; i < total; i++) {
        const img = imgArr[i];
        let name;
        if (i < nameArr.length) {
          name = getNextName();
          if (i == nameArr.length - 1) {
            lastBaseName = name.replace(/\d+$/, ''); 
            lastNum = 0;
          }
        } else {
          name = getNextName();
        }
        let type = 'url';
        const trimmed = Cast.toString(img).trim();
        if (trimmed.startsWith('<svg') || trimmed.startsWith('<?xml') || trimmed.startsWith('<!DOCTYPE svg')) {
          type = 'svg';
        }
        promises.push(makeSkin(type, name, img));
      }
      await Promise.all(promises);
    }

    deleteSkin(args) {
      const name = Cast.toString(args.NAME);
      for (const id in skinsInUse) {
        if (Object.hasOwn(skinsInUse, id) && skinsInUse[id].name == name) {
          delete skinsInUse[id];
          customHitboxTargets.delete(id);
        }
      }
      removeSkin(name);
    }

    deleteAll() {
      skinsInUse = {};
      customHitboxTargets.clear();
      const skins = Object.keys(allSkins);
      for (let i = 0; i < skins.length; i++) removeSkin(skins[i]);
    }

    skinLoaded(args) {
      const name = Cast.toString(args.NAME);
      const skin = allSkins[name];
      if (!skin) return false;
      if (skin[skinTag].type == 'svg') return skin._svgImageLoaded;
      return true;
    }

    allSkinNames() {
      return JSON.stringify(Object.keys(allSkins));
    }

    setSkin(args, util) {
      const target = this.getSprite(args.TARGET, util);
      const name = Cast.toString(args.NAME);
      const skin = allSkins[name];
      if (!target || !skin) return;
      updateSkin(target.drawableID, skin._id);
      skinsInUse[target.id] = { target, name };
      customHitboxTargets.delete(target.id);
    }

    setCostumeSkin(args, util) {
      const target = this.getSprite(args.TARGET, util);
      const scraper = this.getSprite(args.SCRAP, util);
      if (!target || !scraper) return;
      const name = Cast.toString(args.NAME);
      const skin = scraper.sprite.costumes_.find((a) => a.name == name);
      if (skin) {
        updateSkin(target.drawableID, skin.skinId);
        skinsInUse[target.id] = { target, name };
        customHitboxTargets.delete(target.id);
      }
    }

    restoreTarget(args, util) {
      const target = this.getSprite(args.TARGET, util);
      target.updateAllDrawableProperties();
      delete skinsInUse[target.id];
      customHitboxTargets.delete(target.id);
    }

    restoreSkin(args) {
      const name = Cast.toString(args.NAME);
      for (const id in skinsInUse) {
        if (Object.hasOwn(skinsInUse, id) && skinsInUse[id].name == name) {
          skinsInUse[id].target.updateAllDrawableProperties();
          delete skinsInUse[id];
          customHitboxTargets.delete(id);
        }
      }
    }

    currentSkin(args, util) {
      const target = this.getSprite(args.TARGET, util);
      const usedSkin = skinsInUse[target.id];
      return usedSkin ? usedSkin.name : '';
    }

    attSkin(args) {
      const name = Cast.toString(args.NAME);
      const skin = allSkins[name];
      if (!skin) return '';
      const tag = skin[skinTag];
      switch (args.THING) {
        case 'width': return skin.size[0];
        case 'height': return skin.size[1];
        case 'rotation center x': return skin._rotationCenter[0];
        case 'rotation center y': return skin._rotationCenter[1];
        case 'type': return tag.type;
        case 'source': {
          if (tag.source != undefined) return Cast.toString(tag.source);
          if (tag.type == 'svg') return Cast.toString(tag.data);
          const canvas = document.createElement('canvas');
          canvas.width = skin.size[0];
          canvas.height = skin.size[1];
          const ctx = canvas.getContext('2d');
          ctx.drawImage(tag.data, 0, 0);
          return canvas.toDataURL('image/png');
        }
        case 'users': {
          const users = [];
          for (const id in skinsInUse) {
            if (Object.hasOwn(skinsInUse, id) && skinsInUse[id].name == name) {
              const target = skinsInUse[id].target;
              users.push(`${target.getName()}${target.isOriginal ? '' : ' (Clone)'}`);
            }
          }
          return JSON.stringify(users);
        }
        default: return '';
      }
    }

    setCacheOriginalInput(args) {
      cacheOriginalInput = Cast.toBoolean(args.CACHE);
    }

    getCacheOriginalInput() {
      return cacheOriginalInput;
    }

    setOverwriteBehavior(args) {
      overwriteBehavior = Cast.toString(args.BEHAVIOR);
    }

    getOverwriteBehavior() {
      return overwriteBehavior;
    }

    setRotation(args) {
      const name = Cast.toString(args.NAME);
      const skin = allSkins[name];
      if (!skin) return;
      skin._rotationCenter = new Float32Array([
        Cast.toNumber(args.x), Cast.toNumber(args.y), 0
      ]);
      for (const id in skinsInUse) {
        if (Object.hasOwn(skinsInUse, id) && skinsInUse[id].name == name) {
          const drawable = render._allDrawables[skinsInUse[id].target.drawableID];
          if (drawable) drawable._skinWasAltered();
        }
      }
    }

    setHitbox(args) {
      const name = Cast.toString(args.NAME);
      const scraperName = Cast.toString(args.SCRAP);
      const skin = allSkins[name];
      const scraper = allSkins[scraperName];
      if (!skin || !scraper) return;
      const tag = skin[skinTag];
      tag.hitbox = name == scraperName ? skin._id : scraper._id;
    }
  }

  runtime.on('BEFORE_EXECUTE', () => {
    for (const id in skinsInUse) {
      if (!Object.hasOwn(skinsInUse, id)) continue;
      const obj = skinsInUse[id];
      const skin = allSkins[obj.name];
      if (!skin) continue;
      const tag = skin[skinTag];
      if (tag.hitbox != skin._id) {
        updateSkin(obj.target.drawableID, tag.hitbox);
        customHitboxTargets.add(id);
      }
    }
  });

  runtime.on('AFTER_EXECUTE', () => {
    for (const id of customHitboxTargets) {
      const obj = skinsInUse[id];
      if (!obj) {
        customHitboxTargets.delete(id);
        continue;
      }
      const skin = allSkins[obj.name];
      if (skin) updateSkin(obj.target.drawableID, skin._id);
      customHitboxTargets.delete(id);
    }
  });

  Scratch.extensions.register(new DragoVeneer());
})(Scratch);