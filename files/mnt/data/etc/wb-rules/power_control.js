var load_fail_count = 0;
var old_value_power = 0;
var array_power = [];
var mean_power = 0;
var old_value_fan = 0;
var not_calc_diff = false;

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

//	Функция вычисляет среднюю мощность

function calcMeanPower() {
  	var power
	if(array_power.length < 20) {
    	array_power.push(dev['wb-map12e_35']['Ch 3 P L1']);
    } else {
      	array_power.push(dev['wb-map12e_35']['Ch 3 P L1']);
      	array_power.shift();
    }
  		power = 0;
  	for(i = 0; i < array_power.length; i++) {
      	power = power + array_power[i];
      	mean_power = power / array_power.length;
    }
}

defineRule("fan_overload_detect", {
    when: cron("@every 0h0m1s"),
    then: function() {
      	// Если произошло изменение скорости вентилятора
		diff_fan = dev["load_control"]["power_fan"] - old_value_fan;
		old_value_fan = dev["load_control"]["power_fan"];
      	// То мы 15 секунд не будем смотреть на превышение мощности
		if(diff_fan != 0) {
			log('start timeout');
          	array_power = [];
        	dev["load_control"]["fan_up_speed"] = true;
        	dev["button_light"]["light2"] = false;
          	timers.up_speed.stop();
          	startTimer("up_speed", 10000);
		}
      	// Если не было увеличения скорости вентилятора 
		if(!dev["load_control"]["fan_up_speed"] && dev["wb-mdm3_57"]["K2"]) {
			if(load_fail_count == 0) {
              	// То мы вычисляем среднюю мощность
        		calcMeanPower();
            }
          	// И смотрим не превысила ли текущая мощность среднюю
          	if((dev['wb-map12e_35']['Ch 3 P L1'] - mean_power) > 0.1) {
            	load_fail_count++;
              	log("fail count " + load_fail_count);
              	// Если превысила то начинаем считать ошибки
            	if(load_fail_count > 3) {
                  	// Если больше 3 ошибок то вентилятор перегружен и мы делаем аварию
                  	array_power = [];
              		dev["load_control"]["fan_overload"] = true;
              		timers.clear_fail.stop();
            	}
              	// Таймер который обнуляет счётчик ошибок через 10 секунд. 
              	// Это на случай если появилось единичное случайное срабатывание
            	startTimer("clear_fail", 10000);
          	}
          log("mean power " + mean_power);
          log("current power " + dev['wb-map12e_35']['Ch 3 P L1']);
        }
    }
});

defineRule("timer_up_speed",{
  when: function () { return timers.up_speed.firing; },
  then: function () {
    log('end timeout');
  	dev["load_control"]["fan_up_speed"] = false;
    if(dev["load_control"]["power_fan"] != 0) {
    	dev["button_light"]["light2"] = true;
    }
  }
});

defineRule("timer_clear_fail",{
  when: function () { return timers.clear_fail.firing; },
  then: function () {
  	load_fail_count = 0;
  }
});

defineRule("power_fail", {
    whenChanged: "power_status/working on battery",
    then: function(newValue, devName, cellName) {
        if(newValue) {
          	if(!dev["power_control"]["power_fail"]) {
              	log('power fail');
              	dev["wb-mdm3_57"]["Channel 1"] = 0;
          		dev["wb-mdm3_57"]["Channel 2"] = 0;
              	dev["water_control"]["valve"] = false;
          		dev["power_control"]["power_fail"] = true;
        		runShellCommand("./root/fail.sh");
            }
        } else {
          	if(dev["power_control"]["power_fail"]) {
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
        if(newValue < 100) {
        	dev["wb-mdm3_57"]["Channel 1"] = 0;
          	dev["wb-mdm3_57"]["Channel 2"] = 0;
    	}
    }
});
