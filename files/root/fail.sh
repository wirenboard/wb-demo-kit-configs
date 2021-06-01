#!/bin/bash

. /etc/wb_env.sh

wb_source hardware
led_blink red
led_off green

echo 250 > /sys/class/leds/red/delay_on
echo 250 > /sys/class/leds/red/delay_off

echo 250000 > /sys/class/pwm/pwmchip0/pwm0/period
echo 125000 > /sys/class/pwm/pwmchip0/pwm0/duty_cycle

while true
do
	for ((a=0; a<4; a++))
	do
		sleep 0.1
		echo 1 > /sys/class/pwm/pwmchip0/pwm0/enable
		sleep 0.1
		echo 0 > /sys/class/pwm/pwmchip0/pwm0/enable
	done
	sleep 10
done
