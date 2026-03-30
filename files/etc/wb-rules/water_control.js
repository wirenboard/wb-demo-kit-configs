defineVirtualDevice('water_control', {
  title: 'Water Control',
  cells: {
    alarm: {
      type: 'switch',
      value: false,
      readonly: true,
    },
    valve: {
      type: 'switch',
      value: false,
      readonly: false,
    },
    reset_fail: {
      type: 'pushbutton',
      value: false,
      readonly: false,
    },
  },
});

obj=readConfig("/etc/wb-mqtt-serial.conf")
device = "WB-MWAC"
if (obj.ports[0].devices[0].device_type == "WB-MWAC-v2 ver2") {
  out = "Output K2"
  alarm = "Leakage Mode"
} else if (obj.ports[0].devices[0].device_type == "WB-MWAC") {
  out = "K2"
  alarm = "Alarm"
}

defineRule('water_alarm_control', {
  whenChanged: device + '/' + alarm,
  then: function (newValue, devName, cellName) {
    dev['button_light']['blink1'] = newValue;
    dev['water_control']['alarm'] = newValue
    if (newValue) {
      dev['water_control']['valve'] = false;
    }
  },
});

defineRule('water_control', {
  whenChanged: 'water_control/valve',
  then: function (newValue, devName, cellName) {
    dev[device][out] = newValue;
  },
});

defineRule('water_fail_control', {
  whenChanged: 'water_control/reset_fail',
  then: function (newValue, devName, cellName) {
    if (newValue) {
      // Нужно для совместительства со старым WB-MWAC
      if(obj.ports[0].devices[0].device_type == "WB-MWAC-v2 ver2") {
        dev[device]["Leakage Mode Reset"] = true;  
      } else {
        dev[device][alarm] = false;
      }
    }
  },
});

defineRule('water_valve_control', {
  whenChanged: 'water_control/valve',
  then: function (newValue, devName, cellName) {
    if (newValue) {
      if (dev[device][alarm]) {
        dev['water_control']['reset_fail'] = true;
        dev['water_control']['valve'] = false;
      }
    }
  },
});

defineRule('water_button_control', {
  whenChanged: 'wb-gpio/EXT1_IN1',
  then: function (newValue, devName, cellName) {
    if (newValue) {
      dev['water_control']['valve'] = !dev['water_control']['valve'];
    }
  },
});


