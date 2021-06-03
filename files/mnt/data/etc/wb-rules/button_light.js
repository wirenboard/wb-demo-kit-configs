var blink_state = false;

defineVirtualDevice("button_light", {
    title: "button light control",
    cells: {
        light1: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        },
        light2: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        },
        light3: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        },
        blink1: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        },
        blink2: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        },
        blink3: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        }
    }
});

defineRule("light1_state_rule", {
    whenChanged: "wb-mwac_25/K2",
    then: function(newValue, devName, cellName) {
        dev["button_light"]["light1"] = newValue;
    }
});

defineRule("light3_state_rule", {
    whenChanged: "wb-mdm3_57/K1",
    then: function(newValue, devName, cellName) {
        dev["button_light"]["light3"] = newValue;
    }
});

defineRule("SB1_light_control", {
    whenChanged: "button_light/light1",
    then: function(newValue, devName, cellName) {
        dev["wb-mr6c_46"]["K1"] = newValue;
    }
});

defineRule("SB2_light_control", {
    whenChanged: "button_light/light2",
    then: function(newValue, devName, cellName) {
        dev["wb-mr6c_46"]["K2"] = newValue;
    }
});

defineRule("SB3_light_control", {
    whenChanged: "button_light/light3",
    then: function(newValue, devName, cellName) {
        dev["wb-mr6c_46"]["K3"] = newValue;
    }
});


var interval = setInterval(function() {
    blink_state = !blink_state;
    if (dev["button_light"]["blink1"] && !dev["power_control"]["power_fail"]) {
        dev["wb-mr6c_46"]["K1"] = blink_state;
    } else {
        dev["wb-mr6c_46"]["K1"] = dev["button_light"]["light1"];
    }
    if (dev["button_light"]["blink2"] && !dev["power_control"]["power_fail"]) {
        dev["wb-mr6c_46"]["K2"] = blink_state;
    } else {
        dev["wb-mr6c_46"]["K2"] = dev["button_light"]["light2"];
    }
    if (dev["button_light"]["blink3"] && !dev["power_control"]["power_fail"]) {
        dev["wb-mr6c_46"]["K3"] = blink_state;
    } else {
        dev["wb-mr6c_46"]["K3"] = dev["button_light"]["light3"];
    }
}, 1000);
