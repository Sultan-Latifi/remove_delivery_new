/*global QUnit*/

sap.ui.define([
	"com/mindsquare/mde_remove_delivery/mind2_mde_2_remove_delivery/controller/Lieferungauswahl.controller"
], function (Controller) {
	"use strict";

	QUnit.module("Lieferungauswahl Controller");

	QUnit.test("I should test the Lieferungauswahl controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});