var not_detect_overload = 0;
var old_speed = 0;
var coeff_alarm_power_fan = 0;

defineVirtualDevice('power_control', {
  title: 'Power Control',
  cells: {
    power_fail: {
      type: 'switch',
      value: false,
      forceDefault: true,
      readonly: false,
    },
  },
});

startTicker('fan_overload_ticker', 200);
coeff_alarm_power_fan = readConfig('/mnt/data/etc/wb-demo-kit-configs.conf').coeff_power_fan;

defineRule('fan_overload_detect', {
  when: function () {
    return timers.fan_overload_ticker.firing;
  },
  then: function () {
    var alarmPower;
    if (dev['wb-mdm3_57']['Channel 2'] - old_speed >= 10) {
      dev['load_control']['fan_up_speed'] = true;
    }
    old_speed = dev['wb-mdm3_57']['Channel 2'];
    //log("current power " + dev['wb-map12e_35']['Ch 3 P L1'] + " W");
    if (dev['load_control']['fan_up_speed'] == false) {
      not_detect_overload = 0;
      if (dev['wb-mdm3_57']['Channel 2'] == 100) {
        // Вычисление аварийной мощности в зависимости от напряжения выше которой считается что на вентиляторе излишняя механическая нагрузка
        // 180 - нижний порог напряжения после которого нагрузки отключатся, правило "power_mdm_fail"
        // Вычисление разности напряжения между текущим и меньше которого уже авария питания (180 вольт).
        voltageDiff = Math.max(dev['wb-map12e_35']['Urms L1'] - 180, 0);
        // 6.66 - коэффециент полученный экспериментально связывающий питающее напряжение и мощность потребляемую вентилятором
        // 10 - аварийная мощность вентилятора при напряжении 180 В
        // coeff_alarm_power_fan - коэффециент коррекции аварийной мощности вентилятора,
        // введён потому что у вентиляторов разное сопротивление обмоток и соответственно разная потребляемая мощность.
        if (voltageDiff !== 0) {
          // Проверяем превышение мощности если только разность напряжений не равна нулю
          alarmPower = voltageDiff / 6.66 + (11 + coeff_alarm_power_fan);
          if (
            dev['wb-map12e_35']['Ch 3 P L1'] > alarmPower &&
            dev['load_control']['fan_overload'] == false
          ) {
            dev['load_control']['fan_overload'] = true;
            dev['load_control']['fan_up_speed'] = true;
          }
        }
      }
    } else {
      not_detect_overload++;
      log(not_detect_overload);
      if (not_detect_overload >= 25) {
        dev['load_control']['fan_up_speed'] = false;
      }
    }
  },
});

defineRule('timer_clear_fail', {
  when: function () {
    return timers.clear_fail.firing;
  },
  then: function () {
    load_fail_count = 0;
  },
});

defineRule('power_fail', {
  whenChanged: 'power_status/working on battery',
  then: function (newValue, devName, cellName) {
    if (newValue) {
      if (!dev['power_control']['power_fail']) {
        log('power fail');
        dev['wb-mdm3_57']['Channel 1'] = 0;
        dev['wb-mdm3_57']['Channel 2'] = 0;
        dev['water_control']['valve'] = false;
        dev['power_control']['power_fail'] = true;
        runShellCommand('/usr/lib/wb-demo-kit-configs/fail.sh');
      }
    } else {
      if (dev['power_control']['power_fail']) {
        runShellCommand('pkill -f fail.sh', {
          captureOutput: true,
          exitCallback: function (exitCode, capturedOutput) {
            runShellCommand('/usr/lib/wb-demo-kit-configs/not_fail.sh')
          }
        });
        dev['power_control']['power_fail'] = false;
      }
    }
  },
});

defineRule('power_mdm_fail', {
  whenChanged: 'wb-map12e_35/Urms L1',
  then: function (newValue, devName, cellName) {
    if (newValue < 181) {
      dev['wb-mdm3_57']['Channel 1'] = 0;
      dev['wb-mdm3_57']['Channel 2'] = 0;
    }
  },
});

