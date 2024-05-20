#!/usr/bin/env bash

. /etc/wb_env.sh

echo 0 > /sys/class/pwm/pwmchip0/pwm$WB_PWM_BUZZER/enable

wb_source hardware
led_blink green
led_off red
