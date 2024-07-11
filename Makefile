PREFIX = /usr

install:
	mkdir -p $(DESTDIR)/mnt/data/etc
	cp -r files/etc $(DESTDIR)/mnt/data
	install -Dm0755 files/usr/lib/wb-demo-kit-configs/*.sh -t $(DESTDIR)$(PREFIX)/lib/wb-demo-kit-configs
	install -Dm0644 files/usr/share/wb-demo-kit-configs/*.j2 -t $(DESTDIR)$(PREFIX)/share/wb-demo-kit-configs
	minify files/usr/share/wb-demo-kit-configs/WB6.svg -o $(DESTDIR)$(PREFIX)/share/wb-demo-kit-configs/WB6.svg
	minify files/usr/share/wb-demo-kit-configs/mwac.svg -o $(DESTDIR)$(PREFIX)/share/wb-demo-kit-configs/mwac.svg
	minify files/usr/share/wb-demo-kit-configs/mwac_v2.svg -o $(DESTDIR)$(PREFIX)/share/wb-demo-kit-configs/mwac_v2.svg
	install -Dm0644 files/usr/share/wb-mqtt-confed/schemas/*.json -t $(DESTDIR)$(PREFIX)/share/wb-mqtt-confed/schemas
