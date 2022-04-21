# Re-Invest

## How it works
In Osmosis and other cosmos chain you can re-invest your reward with simple scheduled script.
This re-invest just delegate your balance to specific validator.

## ! Important share your MNEMONIC !

## Clone Repository

Clone this repository.
```shell
git clone https://github.com/alighasemzadeh/reinvest
cd reinvest
cp .env.sample .env
npm install
```

Set your chain and wallet data in `.env`.

To run reinvest just run `npm run reinvest`

## Setup System Timer

### Create systemd service file
`sudo vim /etc/systemd/system/reinvest.service`
```shell
[Unit]
Description=Reinvest
Wants=reinvest.timer

[Service]
Type=oneshot
WorkingDirectory=/root/restake
ExecStart=npm run reinvest

[Install]
WantedBy=multi-user.target
```

### Create systemd timer file
`sudo vim /etc/systemd/system/reinvest.timer`
```shell
[Unit]
Description=Reinvest

[Timer]
AccuracySec=1min
OnCalendar=*-*-* 21:00:00

[Install]
WantedBy=timers.target
```


### Enable and Start bot
```shell
systemctl enable reinvest.service
systemctl enable reinvest.timer
systemctl start reinvest.timer
```


