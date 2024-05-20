defineRule('msw3_co2', {
  whenChanged: 'wb-msw-v3_64/CO2',
  then: function (newValue, devName, cellName) {
    var co2_good = newValue < 650;
    var co2_middle = newValue < 1000 && newValue > 651;
    var co2_bad = newValue > 1001;
    dev[devName]['LED Glow Duration (ms)'] = 50;
    if (co2_good) {
      dev[devName]['Green LED'] = true;
      dev[devName]['Red LED'] = false;
      dev[devName]['LED Period (s)'] = 10;
    }
    if (co2_middle) {
      dev[devName]['Green LED'] = true;
      dev[devName]['Red LED'] = true;
      dev[devName]['LED Period (s)'] = 5;
    }
    if (co2_bad) {
      dev[devName]['Green LED'] = false;
      dev[devName]['Red LED'] = true;
      dev[devName]['LED Period (s)'] = 1;
    }
  },
});
