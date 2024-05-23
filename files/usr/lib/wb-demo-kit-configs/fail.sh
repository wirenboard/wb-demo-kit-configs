#!/usr/bin/env bash

. /usr/lib/wb-utils/wb_env.sh

wb_source hardware
led_blink red
led_off green

echo 250 > /sys/class/leds/red/delay_on
echo 250 > /sys/class/leds/red/delay_off

echo 250000 > /sys/class/pwm/pwmchip0/pwm$WB_PWM_BUZZER/period
echo 125000 > /sys/class/pwm/pwmchip0/pwm$WB_PWM_BUZZER/duty_cycle

while true
do
	for ((a=0; a<4; a++))
	do
		sleep 0.1
		echo 1 > /sys/class/pwm/pwmchip0/pwm$WB_PWM_BUZZER/enable
		sleep 0.1
		echo 0 > /sys/class/pwm/pwmchip0/pwm$WB_PWM_BUZZER/enable
	done
	sleep 10
done
