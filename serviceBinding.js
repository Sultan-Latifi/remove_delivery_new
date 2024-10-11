function initModel() {
	var sUrl = "/sap/opu/odata/sap/ZMDE_GDMVT_REMOVE_DELIVERY_SRV/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}