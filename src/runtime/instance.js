import { id } from "../../config.caw.js";

export default function (parentClass) {
  class skymen_FollowMouseManager {
    constructor() {}
    setMeEnabled(instance) {
      this.ignoreNextDisableMe = true;
      if (this.lastEnabled && this.lastEnabled !== instance)
        this.lastEnabled.enabled = false;
      if (instance.SetCursorSprite()) {
        this.lastEnabled = instance;
        instance._setTicking(true);
      } else {
        this.lastEnabled = null;
        instance.enabled = false;
      }
      this.ignoreNextDisableMe = false;
    }
    setMeDisabled(instance) {
      instance.RemoveCustomCursor(this.ignoreNextDisableMe);
      if (this.ignoreNextDisableMe) return;
      this.lastEnabled = null;
    }
  }
  return class extends parentClass {
    constructor() {
      super();
      const properties = this._getInitProperties();
      this._wasVisible = false;
      this._wasCollisionEnabled = false;
      this._wasEnabled = false;
      this._enabled = false;

      if (!globalThis.skymen_FollowMouseManagerInstance)
        globalThis.skymen_FollowMouseManagerInstance =
          new skymen_FollowMouseManager();
      let enabled = false;
      if (properties) {
        enabled = properties[0];
      }

      let onCreate = () => {
        this.enabled = enabled;
        this.removeEventListener("instancecreate", onCreate);
      };
      this.addEventListener("instancecreate", onCreate);
    }

    _canBeEnabled() {
      // check mouse plugin exists and instance is a sprite
      return !this.runtime.platformInfo.isMobile && !!this.runtime.mouse;
    }

    get enabled() {
      return this._enabled;
    }
    set enabled(val) {
      if (this._enabled === !!val) return;
      this._enabled = !!val;
      if (this._enabled) {
        globalThis.skymen_FollowMouseManagerInstance.setMeEnabled(this);
      } else {
        globalThis.skymen_FollowMouseManagerInstance.setMeDisabled(this);
      }
    }

    _trigger(method) {
      super._trigger(self.C3.Plugins[id].Cnds[method]);
    }

    _release() {
      super._release();
    }

    SetCursorSprite() {
      if (!this._canBeEnabled()) return false;
      this.runtime.mouse.setCursorObjectClass(this.instance.objectType);
      if (this._wasEnabled) return;
      this._wasEnabled = true;
      this._wasVisible = this.instance.isVisible;
      this._wasCollisionEnabled = this.instance.isCollisionEnabled;
      this.instance.isVisible = false;
      this.instance.isCollisionEnabled = false;
      return true;
    }

    RemoveCustomCursor(skipCursorReset = false) {
      if (!this._wasEnabled) return;
      this._setTicking(false);
      this._wasEnabled = false;
      if (!skipCursorReset) this.runtime.mouse.setCursorStyle("auto");
      this.instance.isVisible = this._wasVisible;
      this.instance.isCollisionEnabled = this._wasCollisionEnabled;
    }

    _saveToJson() {
      return {
        wasVisible: this._wasVisible,
        wasCollisionEnabled: this._wasCollisionEnabled,
        wasEnabled: this._wasEnabled,
        enabled: this.enabled,
      };
    }

    _tick() {
      this.SetCursorSprite();
    }

    _loadFromJson(o) {
      this._wasVisible = o.wasVisible;
      this._wasCollisionEnabled = o.wasCollisionEnabled;
      this._wasEnabled = o.wasEnabled;
      this.enabled = o.enabled;
    }
  };
}
