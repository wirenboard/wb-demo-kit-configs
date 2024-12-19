PREFIX = /usr

install:
	mkdir -p $(DESTDIR)/mnt/data/etc
	cp -r files/etc $(DESTDIR)/mnt/data
	install -Dm0755 files/usr/lib/wb-demo-kit-configs/*.sh -t $(DESTDIR)$(PREFIX)/lib/wb-demo-kit-configs
	install -Dm0644 files/usr/share/wb-demo-kit-configs/*.j2 -t $(DESTDIR)$(PREFIX)/share/wb-demo-kit-configs
	for svg in files/usr/share/wb-demo-kit-configs/*.svg; do \
	    minify $${svg} -o $(DESTDIR)$(PREFIX)/share/wb-demo-kit-configs/$${svg##*/}; \
	done
	install -Dm0644 files/usr/share/wb-mqtt-confed/schemas/*.json -t $(DESTDIR)$(PREFIX)/share/wb-mqtt-confed/schemas
