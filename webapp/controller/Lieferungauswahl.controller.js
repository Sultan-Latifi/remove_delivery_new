sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/Dialog",
	"sap/m/Button",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Dialog, Button, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("com.mindsquare.mde_remove_delivery.mind2_mde_2_remove_delivery.controller.Lieferungauswahl", {
		onInit: function () {
			  
			this._oCustomSelect = this.byId("customSelect");
			this._oCustomInput = this.byId("customInput");
		},
		onBeforeRebindTable: function (oEvent) {
			  
			var mBindingParams = oEvent.getParameter("bindingParams"),
				// aSelectedItems = this._oCustomMultiComboBox.getSelectedItems(),
				sRatingValue = this._oCustomSelect.getSelectedKey(),
				sInputValue = this._oCustomInput.getValue()

			// bSwitchValue = this._oCustomSwitch.getState()
			;

			// aSelectedItems.forEach(function (oSelectedItem) {
			// 	mBindingParams.filters.push(
			// 		new Filter(
			// 			"CompanyCode",
			// 			FilterOperator.EQ,
			// 			oSelectedItem.getText()
			// 		)
			// 	);
			// });

			if (sRatingValue) {
				mBindingParams.filters.push(
					new Filter(
						"Wbstk",
						FilterOperator.EQ,
						sRatingValue
					)
				);
			}
			if (sInputValue) {
				mBindingParams.filters.push(
					new Filter(
						"Vbeln",
						FilterOperator.Contains,
						sInputValue
					)
				);
			}

			// mBindingParams.filters.push(
			// 	new Filter(
			// 		"DeliveredOrder",
			// 		FilterOperator.EQ,
			// 		bSwitchValue
			// 	)
			// );
		},
		onButtonPostPressNew: function (oEvent) {
			  

			var oUploadSetTableInstance = this.byId("tabletest"),
				batchChanges = [],
				that = this,
				oView = this.getView(),
				sServiceUrl = "/sap/opu/odata/sap/ZMDE_GDMVT_REMOVE_DELIVERY_SRV/",
				oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true),
				oSelectedItems = oUploadSetTableInstance.getSelectedItems();

			for (var i = 0; i < oSelectedItems.length; i++) {
				  
				var material = {
					Vbeln: oSelectedItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text
				};

				batchChanges.push(oModel.createBatchOperation("DeliveryItemSet", "POST", material));
			};

			oModel.addBatchChangeOperations(batchChanges);
			sap.ui.core.BusyIndicator.show(0);

			oModel.submitBatch(
				function (oData, response) { //success
					  
					sap.ui.core.BusyIndicator.hide();
					if (oData.__batchResponses[0].__changeResponses !== undefined) { //success
						var hdrMessage = response.data.__batchResponses[0].__changeResponses[0].headers["sap-message"];
						// sap.m.MessageBox.success(JSON.parse(hdrMessage));
						sap.m.MessageToast(JSON.parse(hdrMessage));
					} else { //error
						var body = oData.__batchResponses[0].response.body;
						body = JSON.parse(body);
						var oInnerError = body.error.innererror.errordetails
						for (var i = 0; i < oInnerError.length; i++) {
							if (errorMsg) {
								var errorMsg = errorMsg + "\n" + body.error.innererror.errordetails[i].message
							} else {
								var errorMsg = body.error.innererror.errordetails[i].message
							}
						}
						sap.m.MessageBox.error(errorMsg);
					}
				}.bind(this),
				function (err) { //error
					  
					sap.ui.core.BusyIndicator.hide();
					var errmessage = "Fehler " + err.response.statusCode;
					sap.m.MessageBox.error(errmessage);
				}.bind(this)
			);

		},

		onButtonPostPressOld: function (oEvent) {
			  

			// var oUploadSetTableInstance = this.byId("tabletest");

			// var oView = this.getView(),
			// 	oModel = oView.getModel()

			// ;

			// var oSelectedItems = oUploadSetTableInstance.getSelectedItems();
			// for (var i = 0; i < oSelectedItems.length; i++) {
			// 	var sVbeln = oSelectedItems[i].mAggregations.cells[0].mAggregations.items[0].mProperties.text;
			// 	var sPath = "/DeliverySet('" + sVbeln + "')";
			// 	var oData = {
			// 		Vbeln: sVbeln
			// 	};
			// 	  
			// 	oModel.update(sPath, oData, {
			// 		success: function (oData, oResponse) {
			// 			  
			// 			// Erfolgreiche Ausführung - Hier kannst du entsprechende Aktionen ausführen
			// 			this.showSuccessMessage(response);
			// 			// console.log("Update-Prozess erfolgreich gestartet.");
			// 		},
			// 		error: function (oError) {
			// 			  
			// 			var errorResponse = JSON.parse(oError.responseText);
			// 			var errorMsg = errorResponse.error.message.value;
			// 			sap.m.MessageBox.error(errorMsg);
			// 			// console.error("Fehler beim Starten des Update-Prozesses:", oError);
			// 		}
			// 	});

			// }

		},
		/**
		 *@memberOf com.mindsquare.mde_remove_delivery.mind2_mde_2_remove_delivery.controller.Lieferungauswahl
		 */
		navToDetail: function (oEvent) {
			  
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this),
				oVbeln = oEvent.getSource().getBindingContext().getObject().Vbeln,
				oWbstk = oEvent.getSource().getBindingContext().getObject().Wbstk,
				oKunnr = oEvent.getSource().getBindingContext().getObject().Kunnr,
				oName1 = oEvent.getSource().getBindingContext().getObject().Name1;

			oRouter.navTo("Detail", {
				vbeln: oVbeln,
				wbstk: oWbstk,
				kunnr: oKunnr,
				name1: oName1,
			});
			// oRouter.navTo("Detail");
			// this.getView().getModel("materialList").setData({
			// 	materials: []
			// });
		},
	});
});