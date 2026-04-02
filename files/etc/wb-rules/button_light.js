var blink_state = false;

defineVirtualDevice('button_light', {
  title: 'button light control',
  cells: {
    light1: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
    light2: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
    light3: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
    blink1: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
    blink2: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
    blink3: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
  },
});

obj=readConfig("/etc/wb-mqtt-serial.conf")
device = "WB-MWAC"
if (obj.ports[0].devices[0].device_type == "WB-MWAC-v2 ver2") {
  out = "Output K2"
} else if (obj.ports[0].devices[0].device_type == "WB-MWAC") {
  out = "K2"
}

defineRule('light1_state_rule', {
  whenChanged: device + '/' + out,
  then: function (newValue, devName, cellName) {
    dev['button_light']['light1'] = newValue;
  },
});

defineRule('light2_state_rule', {
  whenChanged: 'WB-MDM3/K2',
  then: function (newValue, devName, cellName) {
    dev['button_light']['light2'] = newValue;
  },
});

defineRule('light3_state_rule', {
  whenChanged: 'WB-MDM3/K1',
  then: function (newValue, devName, cellName) {
    dev['button_light']['light3'] = newValue;
  },
});

defineRule('SB1_light_control', {
  whenChanged: 'button_light/light1',
  then: function (newValue, devName, cellName) {
    dev['WB-MR6C']['K1'] = newValue;
  },
});

defineRule('SB2_light_control', {
  whenChanged: 'button_light/light2',
  then: function (newValue, devName, cellName) {
    dev['WB-MR6C']['K2'] = newValue;
  },
});

defineRule('SB3_light_control', {
  whenChanged: 'button_light/light3',
  then: function (newValue, devName, cellName) {
    dev['WB-MR6C']['K3'] = newValue;
  },
});

var interval = setInterval(function () {
  blink_state = !blink_state;
  if (dev['button_light']['blink1'] && !dev['power_control']['power_fail']) {
    dev['WB-MR6C']['K1'] = blink_state;
  } else {
    dev['WB-MR6C']['K1'] = dev['button_light']['light1'];
  }
  if (dev['button_light']['blink2'] && !dev['power_control']['power_fail']) {
    dev['WB-MR6C']['K2'] = blink_state;
  } else {
    dev['WB-MR6C']['K2'] = dev['button_light']['light2'];
  }
  if (dev['button_light']['blink3'] && !dev['power_control']['power_fail']) {
    dev['WB-MR6C']['K3'] = blink_state;
  } else {
    dev['WB-MR6C']['K3'] = dev['button_light']['light3'];
  }
}, 1000);

