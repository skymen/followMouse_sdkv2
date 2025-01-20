import { action, condition, expression } from "../template/aceDefine.js";

const category = "general";

condition(
  category,
  "IsEnabled",
  {
    id: "isenabled",
    highlight: false,
    deprecated: false,
    listName: "Is Enabled",
    displayText: "{my}: Is Enabled",
    description: "Wether the behavior is enabled",
  },
  function () {
    return this.enabled;
  }
);

action(
  category,
  "SetEnabled",
  {
    id: "set-enabled",
    highlight: false,
    deprecated: false,
    listName: "Set Enabled",
    displayText: "{my}: Set {0}",
    description: "Enable or disable the behavior",
    params: [
      {
        type: "combo",
        id: "enabled",
        name: "Enabled",
        desc: "Enable or disable",
        initialValue: "enabled",
        items: [{ enabled: "Enabled" }, { disabled: "Disabled" }],
      },
    ],
  },
  function (enabled) {
    this.enabled = enabled === 0;
  }
);
