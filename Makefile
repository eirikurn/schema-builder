
test:
	@NODE_ENV=test ./node_modules/expresso/bin/expresso \
		-I lib \
		-I support \
		$(TESTFLAGS) \
		test/*.test.js

.PHONY: test
