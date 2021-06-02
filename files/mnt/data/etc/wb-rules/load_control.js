var permissionWrite = false;
var powerFan = 0;

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
      		type: "switch",
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

defineRule("power_fan_from_mdm", {
    whenChanged: "wb-mdm3_57/Channel 2",
    then: function(newValue, devName, cellName) {
      if(!dev["load_control"]["fan_overload"]) {
        	dev["load_control"]["power_fan"] = newValue;
            if(newValue != 0) {
                startTimer("delay_fan", 60000);
                dev["wb-mdm3_57"]["K2"] = true;
            } else {
;                timers.delay_fan.stop();
                dev["wb-mdm3_57"]["K2"] = false;
            }
        } else {
          	timers.delay_fan.stop();
        	dev["load_control"]["power_fan"] = 0;
          	dev["wb-mdm3_57"]["Channel 2"] = 0;
          	dev["wb-mdm3_57"]["K2"] = false;
        }
    }
});

defineRule("power_lamp_from_mdm", {
    whenChanged: "wb-mdm3_57/Channel 1",
    then: function(newValue, devName, cellName) {
      dev["load_control"]["power_lamp"] = newValue;
    }
});

defineRule("full_power_fan",{
  when: function () { return timers.delay_fan.firing; },
  then: function () {
   	 dev["wb-mdm3_57"]["Channel 2"] = 100;
  }
});

defineRule("fan_button_control", {
    whenChanged: "wb-gpio/EXT1_IN2",
    then: function(newValue, devName, cellName) {
      	if(newValue) {
    		dev["load_control"]["fan_change_speed"] = true;	
        }
    }
});

defineRule("fan_speed_control", {
    whenChanged: "load_control/fan_change_speed",
    then: function(newValue, devName, cellName) {
    	if(newValue) {
          	if(!dev["load_control"]["fan_overload"]) {
                    if(dev["wb-mdm3_57"]["Channel 2"] < 33) {
                        dev["wb-mdm3_57"]["Channel 2"] = 33;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] < 66) {
                        dev["wb-mdm3_57"]["Channel 2"]= 66;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] < 100) {
                        dev["wb-mdm3_57"]["Channel 2"] = 100;
                    } else if (dev["wb-mdm3_57"]["Channel 2"] = 100) {
                        dev["wb-mdm3_57"]["Channel 2"] = 0;
                    }
            } else {
              	dev["button_light"]["blink2"] = false;
                dev["load_control"]["fan_overload"] = false;
            }
          	dev["load_control"]["fan_change_speed"] = false;
    	}
    }
});

defineRule("fan_overload_reset", {
    whenChanged: "load_control/fan_overload_reset",
    then: function(newValue, devName, cellName) {
        if(newValue) {
        	dev["load_control"]["fan_overload_reset"] = false;
          	dev["load_control"]["fan_overload"] = false;
          	dev["button_light"]["blink2"] = false;
        }
    }
});

defineRule("fan_overload_control", {
    whenChanged: "load_control/fan_overload",
    then: function(newValue, devName, cellName) {
        if(newValue) {
          	log("fan overload");
        	dev["wb-mdm3_57"]["Channel 2"] = 0;
          	dev["button_light"]["blink2"] = true;
        }
    }
});
