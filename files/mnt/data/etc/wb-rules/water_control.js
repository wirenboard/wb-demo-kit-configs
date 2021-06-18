defineVirtualDevice("water_control", {
    title: "Water Control",
    cells: {
        valve: {
            type: "switch",
            value: false,
            readonly: false
        },
        reset_fail: {
            type: "pushbutton",
            value: false,
            readonly: false
        },
    }
});

defineRule("water_alarm_control", {
    whenChanged: "wb-mwac_25/Alarm",
    then: function(newValue, devName, cellName) {
        dev["button_light"]["blink1"] = newValue;
        if (newValue) {
            dev["water_control"]["valve"] = false;
        }
    }
});

defineRule("water_control", {
    whenChanged: "water_control/valve",
    then: function(newValue, devName, cellName) {
        dev["wb-mwac_25"]["K2"] = newValue;
    }
});

defineRule("water_fail_control", {
    whenChanged: "water_control/reset_fail",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["wb-mwac_25"]["Alarm"] = false;
        }
    }
});

defineRule("water_valve_control", {
    whenChanged: "water_control/valve",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (dev["wb-mwac_25"]["Alarm"]) {
                dev["water_control"]["reset_fail"] = true;
                dev["water_control"]["valve"] = false;
            }
        }
    }
});

defineRule("water_button_control", {
    whenChanged: "wb-gpio/EXT1_IN1",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["water_control"]["valve"] = !dev["water_control"]["valve"];
        }
    }
});
