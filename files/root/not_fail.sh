#!/bin/bash

. /etc/wb_env.sh

echo 0 > /sys/class/pwm/pwmchip0/pwm0/enable

wb_source hardware
led_blink green
led_off red
