"use strict";
var e = require("node-appletv-x"), t = require("events");

class i {
  constructor(e) {
    this.connection = this.getConnection(e), this.event = new t.EventEmitter
  }

  async getConnection(t) {
    const i = e.parseCredentials(t);
    try {
      const [t] = await e.scan(i.uniqueIdentifier);
      return this.onError(t), this.onDeviceUpdate(t), t.openConnection(i)
    } catch (e) {
      throw e
    }
  }

  async deviceConnectedCount(e) {
    const {payload: t} = await e.sendIntroduction();
    return t.logicalDeviceCount
  }

  onError(e) {
    e.on("error", e => {
      console.error(e.message), console.error(e.stack)
    })
  }

  onNowPlaying(e) {
    e.on("nowPlaying", e => {
      console.log(e.toString())
    })
  }

  onDeviceUpdate(t) {
    t.on("message", ({type: t, payload: i}) => {
      t === e.Message.Type.DeviceInfoUpdate && this.event.emit("powerChanged", !!i.logicalDeviceCount)
    })
  }
}

class s {
  constructor(e = [], t) {
    this.collection = e, this.params = t
  }

  getServices() {
    return this.collection.map(e => new e(this.params).getService())
  }
}

class r {
  constructor(e) {
    this.root = e, this._isTurnedOn = !1, this.service = new e.service.Switch(e.config.name, ""), this.service.getCharacteristic(e.characteristic.On).on("get", this.getState.bind(this)).on("set", this.setState.bind(this)), this.setUpdateInterval()
  }

  getService() {
    return this.service
  }

  get isTurnedOn() {
    return this._isTurnedOn
  }

  set isTurnedOn(e) {
    this.isTurnedOn !== e && (this.root.log(`Updating the state: ${e}`), this._isTurnedOn = e, this.service.getCharacteristic(this.root.characteristic.On).updateValue(e))
  }

  async setState(t, i) {
    const s = await this.root.appleTv.connection;
    this.root.log(`Trigger setState for the AppleTV: ${t}`);
    try {
      t ? await s.sendKeyCommand(e.AppleTV.Key.Tv) : (await s.sendKeyCommand(e.AppleTV.Key.LongTv), await s.sendKeyCommand(e.AppleTV.Key.Select)), this.isTurnedOn = t, i(null)
    } catch (e) {
      i(e)
    }
  }

  getState(e) {
    e(null, this.isTurnedOn)
  }

  async setUpdateInterval() {
    const e = await this.root.appleTv.connection;
    let t;
    const i = async s => {
      try {
        const r = await this.root.appleTv.deviceConnectedCount(e);
        this.root.debug(JSON.stringify({deviceCount: r})), this.isTurnedOn = !!r, s && (t = setTimeout(i, this.root.config.updateStateFrequency, !0))
      } catch (e) {
        console.error(e)
      }
    };
    await i(!1), setTimeout(i, this.root.config.updateStateFrequency, !0)
  }
}

class n {
  constructor(e) {
    this.service = new e.service.AccessoryInformation("", ""), this.service.setCharacteristic(e.characteristic.Manufacturer, "Apple").setCharacteristic(e.characteristic.Model, "Apple TV").setCharacteristic(e.characteristic.SerialNumber, "V2PUAAKC").setCharacteristic(e.characteristic.FirmwareRevision, "13.3")
  }

  getService() {
    return this.service
  }
}

function c(e) {
  return new s([r, n], e)
}

class a {
  static register(e) {
    const {Service: t, Characteristic: s} = e.hap;
    e.registerAccessory(a.pluginName, a.platformName, class {
      constructor(e, t, s, r) {
        this.service = e, this.characteristic = t, this.log = s, this.configuration = r;
        const n = Object.assign(Object.assign({}, r), {
          updateStateFrequency: r.updateStateFrequency || 5e4,
          debug: r.debug || !1
        });
        if (void 0 === n.credentials) throw new TypeError("The credentials of Apple Tv are necessary. Make sure that you've added it to the object config.");
        const a = (...e) => {
          n.debug && s(...e)
        };
        s("Initialization in progress..."), a(JSON.stringify(n)), this.appleTv = new i(n.credentials), this.services = c.bind(null, {
          service: e,
          characteristic: t,
          log: s,
          config: n,
          debug: a,
          appleTv: this.appleTv
        })()
      }

      getServices() {
        return this.services.getServices()
      }
    }.bind(null, t, s))
  }
}

a.pluginName = "homebridge-apple-tv-lite", a.platformName = "AppleTvLite";
var o = a.register;
module.exports = o;
