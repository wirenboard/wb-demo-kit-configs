var not_detect_overload = 0;

defineVirtualDevice("power_control", {
    title: "Power Control",
    cells: {
        power_fail: {
            type: "switch",
            value: false,
            forceDefault: true,
            readonly: false
        }
    }
});

startTicker("fan_overload_ticker", 200);

defineRule("fan_overload_detect", {
    when: function() {
        return timers.fan_overload_ticker.firing;
    },
    then: function() {
        //log("current power " + dev['wb-map12e_35']['Ch 3 P L1'] + " W");
        if (dev["load_control"]["fan_up_speed"] == false) {
            not_detect_overload = 0;
            if (dev["wb-mdm3_57"]["Channel 2"] == 100) {
                if ((dev['wb-map12e_35']['Ch 3 P L1'] > 18) && (dev["load_control"]["fan_overload"] == false)) {
                    dev["load_control"]["fan_overload"] = true;
                    dev["load_control"]["fan_up_speed"] = true;
                }
            }

        } else {
            not_detect_overload++
            log(not_detect_overload);
            if (not_detect_overload >= 25) {
                dev["load_control"]["fan_up_speed"] = false;
            }
        }
    }
});

defineRule("timer_clear_fail", {
    when: function() {
        return timers.clear_fail.firing;
    },
    then: function() {
        load_fail_count = 0;
    }
});

defineRule("power_fail", {
    whenChanged: "power_status/working on battery",
    then: function(newValue, devName, cellName) {
        if (newValue) {
            if (!dev["power_control"]["power_fail"]) {
                log('power fail');
                dev["wb-mdm3_57"]["Channel 1"] = 0;
                dev["wb-mdm3_57"]["Channel 2"] = 0;
                dev["water_control"]["valve"] = false;
                dev["power_control"]["power_fail"] = true;
                runShellCommand("./root/fail.sh");
            }
        } else {
            if (dev["power_control"]["power_fail"]) {
                runShellCommand("killall -9 fail.sh");
                runShellCommand("./root/not_fail.sh");
                dev["power_control"]["power_fail"] = false;
            }
        }
    }
});

defineRule("power_mdm_fail", {
    whenChanged: "wb-map12e_35/Urms L1",
    then: function(newValue, devName, cellName) {
        if (newValue < 100) {
            dev["wb-mdm3_57"]["Channel 1"] = 0;
            dev["wb-mdm3_57"]["Channel 2"] = 0;
        }
    }
});
