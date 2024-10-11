/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/mindsquare/mde_remove_delivery/mind2_mde_2_remove_delivery/test/unit/AllTests"
	], function () {
		QUnit.start();
	});
});