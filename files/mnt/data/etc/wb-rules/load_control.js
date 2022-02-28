var fan_buzzer_enabled = false;

defineVirtualDevice("load_control", {
    title: "Load control",
    cells: {
        power_lamp: {
            type: "range",
            forceDefault: true,
            max: 100,
            value: 0,
            readonly: true
        },
        power_fan: {
            type: "range",
            forceDefault: true,
            max: 100,
            value: 0,
            readonly: true
        },
        fan_up_speed: {
            type: "switch",
            forceDefault: true,
            value: false,
            readonly: true
        },
        fan_change_speed: {
            type: "pushbutton",
            value: false,
            readonly: false
        },
        fan_overload: {
            type: "switch",
            value: false,
            readonly: true
        },
        fan_overload_reset: {
            type: "switch",
            value: false,
            readonly: false
        }
    }
});

defineRule("power_fan_mdm", {
    whenChanged: "wb-mdm3_57/Channel 2",
    then: function(newValue, devName, cellName) {
        dev["load_control"]["power_fan"] = newValue;
    }
});

defineRule("on_off_fan", {
    whenChanged: "wb-mdm3_57/K2",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["load_control"]["fan_up_speed"] = true;
        } else {
            dev["load_control"]["fan_up_speed"] = false;
        }
    }
});

defineRule("power_lamp_mdm", {
    whenChanged: "wb-mdm3_57/Channel 1",
    then: function(newValue, devName, cellName) {
        dev["load_control"]["power_lamp"] = newValue;
    }
});

defineRule("fan_button_control", {
    whenChanged: "wb-gpio/EXT1_IN2",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            dev["load_control"]["fan_change_speed"] = true;
        }
    }
});

defineRule("fan_speed_control", {
    whenChanged: "load_control/fan_change_speed",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (!dev["load_control"]["fan_overload"]) {
                if (dev["wb-mdm3_57"]["K2"] == false) {
                    dev["wb-mdm3_57"]["Channel 2"] = 100
                    dev["wb-mdm3_57"]["K2"] = true;
                } else {
                    if (dev["wb-mdm3_57"]["Channel 2"] == 0) {
                        dev["wb-mdm3_57"]["Channel 2"] = 100;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] == 100) {
                        dev["wb-mdm3_57"]["Channel 2"] = 66;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] > 66) {
                        dev["wb-mdm3_57"]["Channel 2"] = 66;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] > 33) {
                        dev["wb-mdm3_57"]["Channel 2"] = 33;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] > 0) {
                        dev["wb-mdm3_57"]["K2"] = false;
                    }
                }
            } else {
                dev["load_control"]["fan_overload_reset"] = true;
            }
        }
    }
});

defineRule("fan_overload_reset", {
    whenChanged: "load_control/fan_overload_reset",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            log("overload reset");
            fan_buzzer_enabled = false;
            dev["load_control"]["fan_overload_reset"] = false;
            dev["load_control"]["fan_overload"] = false;
            dev["button_light"]["blink2"] = false;
        }
    }
});

defineRule("fan_overload_control", {
    whenChanged: "load_control/fan_overload",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            log("fan overload");
            startTicker("buzzer_fan_interval", 2000);
            fan_buzzer_enabled = true;
            dev["button_light"]["blink2"] = true;
        }
    }
});

defineRule("buzzer_fan_interval_handler", {
    when: function() {
        return timers.buzzer_fan_interval.firing;
    },
    then: function() {
        dev["buzzer"]["enabled"] = !dev["buzzer"]["enabled"];
        if (fan_buzzer_enabled == false) {
            dev["buzzer"]["enabled"] = false;
            timers.buzzer_fan_interval.stop();
        }
    }
});
