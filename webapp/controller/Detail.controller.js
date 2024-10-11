sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (Controller, History, JSONModel, Filter, FilterOperator, MessageToast, MessageBox) {
	"use strict";

	var newImages = [],
		binaryArray = [],
		counter = 0;
	return Controller.extend("com.mindsquare.mde_remove_delivery.mind2_mde_2_remove_delivery.controller.Detail", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.mindsquare.mde_remove_delivery.mind2_mde_2_remove_delivery.view.Detail
		 */
		onInit: function () {

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);
		},
		fnNextPage: function () {

		},
		_onObjectMatched: function (oEvent) {
			  
			var oModel = this.getView().getModel(),
				oArgs = oEvent.getParameter("arguments"),
				svbeln = oArgs.vbeln,
				sWbstk = oArgs.wbstk,
				sKunnr = oArgs.kunnr,
				sName1 = oArgs.name1,
				aFilter = new Filter("Vbeln", FilterOperator.EQ, svbeln), //create a filter for the BE call
				sPath = "/DeliveryItemSet";
			this.getView().getModel("Vbeln").setProperty("/", {Vbeln: svbeln, Kunnr: sKunnr, Name1: sName1});
			// this.getView().getModel("Kunnr").setProperty("/", sKunnr);
			// this.getView().getModel("Name1").setProperty("/", sName1);
			this.getView().getModel("Wbstk").setProperty("/", false);
			if (sWbstk == "C") {
				  
				this.getView().getModel("Wbstk").setProperty("/", sWbstk);
			}
			  
			oModel.read(
				sPath, {
					filters: [aFilter],
					success: function (oData) {
						if (oData.results.length > 0) {
							  
							var sRequest = new sap.ui.model.json.JSONModel(oData.results);

							this.getView().setModel(sRequest, "RezervationList");
						} else {
							  
							var oResBundle = this.getView().getModel("i18n").getResourceBundle();
							MessageBox.error(oResBundle.getText("noPos"));

						}
					}.bind(this),
					error: function (Error) { //In case of error show pop up and navigate back to the view
						  
						// MessageBox.error("Error!");
						// var oResBundle = this.getView().getModel("i18n").getResourceBundle();
						var ErrorMessage = "Error " + Error.statusCode + ": " + Error.message
						MessageBox.error(ErrorMessage);
						// try {
						// 	var sErrMsg = JSON.parse(Error.responseText).error.message.value;
						// } catch (err) {
						// 	var sErrMsg = JSON.parse(Error.responseText).error;
						// }

						// that.getView().getModel("ErrorVbeln").setProperty("/", sErrMsg);
						// that.onErrorPopUp(sErrMsg, that);

					}
				});
			  
		},
		onBuildList: function (id, oCtx) {
			  
			var oFragment = this.byId("listItemMaterial");
			if (oFragment) {
				var oListItem = oFragment.clone(id);
				var oMaterialData = oCtx.getObject();
				// oListItem.getContent()[0].getItems()[1].getItems()[1].setText(oDecimalFormat.formatValue(fMaterialQuant, "float"));
				return oListItem;

			}

		},
		
		handleUploadComplete: function () {
			  
			sap.m.MessageToast.show("File Uploaded");
			var oFilerefresh = this.getView().byId("itemlist");
			oFilerefresh.getModel("Data").refresh(true);
			sap.m.MessageToast.show("File refreshed");
		},

		// handleUploadPress: function (oEvent) {
			  
		// 	var oFileUploader = this.byId("fileUploader");
		// 	var file = oFileUploader.oFileUpload.files[0];
		// 	var oResBundle = this.getView().getModel("i18n").getResourceBundle();

		// 	var sPhotoName = oResBundle.getText("takePhotoDiaDefaultFilename");
		// 	var iNextPhotoNumber = binaryArray.length + 1;
		// 	sPhotoName = sPhotoName.replace("[[X]]", iNextPhotoNumber);

		// 	if (file) {
		// 		var dataCheck = 0;
		// 		if (newImages.length > 0) {
		// 			for (var i = 0; i < newImages.length; i++) {
		// 				if (newImages[i].name === file.name) {
		// 					dataCheck = 1;
		// 				}
		// 			}
		// 		}
		// 		if (dataCheck === 0) {
		// 			var mimeDet = file.type,
		// 				fileName = file.name;
		// 			this.base64coonversionMethod(mimeDet, fileName, file, "001");
		// 			newImages.push({
		// 				name: sPhotoName + "." + file.name.split(".")[file.name.split(".").length - 1], //file.name,
		// 				originalName: file.name
		// 			});
		// 			var newImagesData = new JSONModel(newImages);
		// 			this.getView().setModel(newImagesData, "imagesData");

		// 		} else {
		// 			MessageBox.show(
		// 				oResBundle.getText("imageInsertErrorText"), { //"Image cannot be inserted : allready exist or change the name of the file", {
		// 					icon: MessageBox.Icon.INFORMATION,
		// 					title: oResBundle.getText("imageInsertErrorTitle"), // "My message box title",
		// 					actions: [MessageBox.Action.CLOSE],
		// 					emphasizedAction: MessageBox.Action.CLOSE
		// 				}
		// 			);
		// 		}

		// 		//TS, 15.06.2022, CLear uploader
		// 		this.byId("fileUploader").setValue("");
		// 	} else {
		// 		//TS, 15.06.2022, Cancel is no error - do nothing
		// 		// MessageBox.show(
		// 		// 	"Please insert a file", {
		// 		// 		icon: MessageBox.Icon.INFORMATION,
		// 		// 		title: "My message box title",
		// 		// 		actions: [MessageBox.Action.CLOSE],
		// 		// 		emphasizedAction: MessageBox.Action.CLOSE
		// 		// 	}
		// 		// );
		// 	}
		// },
	handleUploadPress: function (oEvent) {

			var oFileUpload = oEvent.getSource();
			var domRef = oFileUpload.getFocusDomRef();
			var oFileUploader = this.byId("fileUploader");
			var file = oFileUploader.oFileUpload.files[0];
			var oResBundle = this.getView().getModel("i18n").getResourceBundle();

			var sPhotoName = oResBundle.getText("takePhotoDiaDefaultFilename");
			var iNextPhotoNumber = binaryArray.length + 1;
			sPhotoName = sPhotoName.replace("[[X]]", iNextPhotoNumber);

			if (file) {
				var allowedImageTypes = [];
				allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
				if (allowedImageTypes.includes(file.type) && file.size > '500000') {
				//Compress File (IMG, setQuality, setScale, ReturnValue)
					this.compressImage(file, 0.5, 0.7, function (compressedFile) {
						file = compressedFile;
						this.convertFile(oFileUpload, domRef, file, oResBundle, sPhotoName, iNextPhotoNumber);
					}.bind(this));
				} else {
					this.convertFile(oFileUpload, domRef, file, oResBundle, sPhotoName, iNextPhotoNumber);
				}


			} else {
				//TS, 15.06.2022, Cancel is no error - do nothing
				// MessageBox.show(
				// 	"Please insert a file", {
				// 		icon: MessageBox.Icon.INFORMATION,
				// 		title: "My message box title",
				// 		actions: [MessageBox.Action.CLOSE],
				// 		emphasizedAction: MessageBox.Action.CLOSE
				// 	}
				// );
			}
		},


		convertFile: function (oFileUpload, domRef, file, oResBundle, sPhotoName, iNextPhotoNumber) {

			var dataCheck = 0;
			if (newImages.length > 0) {
				for (var i = 0; i < newImages.length; i++) {
					if (newImages[i].name === file.name) {
						dataCheck = 1;
					}
				}
			}
			if (dataCheck === 0) {
				var mimeDet = file.type,
					fileName = file.name;
				this.base64coonversionMethod(mimeDet, fileName, file, "001");
				newImages.push({
					name: sPhotoName + "." + file.name.split(".")[file.name.split(".").length - 1], //file.name,
					originalName: file.name
				});
				var newImagesData = new JSONModel(newImages);
				this.getView().setModel(newImagesData, "imagesData");

			} else {
				MessageBox.show(
					oResBundle.getText("imageInsertErrorText"), { //"Image cannot be inserted : allready exist or change the name of the file", {
						icon: MessageBox.Icon.INFORMATION,
						title: oResBundle.getText("imageInsertErrorTitle"), // "My message box title",
						actions: [MessageBox.Action.CLOSE],
						emphasizedAction: MessageBox.Action.CLOSE
					}
				);
			}

			//TS, 15.06.2022, CLear uploader
			this.byId("fileUploader").setValue("");

		},

		compressImage: function (file, quality, scale, callback) {
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function (event) {
				var img = new Image();
				img.src = event.target.result;
				//Actions while IMG is loaded
				img.onload = function () {
					//Create new Canvas
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext('2d');
					//Scale Canvas according to IMG and Scale
					canvas.width = img.width * scale;
					canvas.height = img.height * scale;
					//Draw new IMG
					ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
					canvas.toBlob(function (blob) {
						callback(new File([blob], file.name, {
							type: file.type
						}));
						//Set File Type and quality for new IMG
					}, file.type, quality);
				};
			};
		},
		
		base64coonversionMethod: function (fileMime, fileName, fileDetails, DocNum) {
			  
			var that = this;
			if (!FileReader.prototype.readAsBinaryString) {
				FileReader.prototype.readAsBinaryString = function (fileData) {
					var binary = "";
					var reader = new FileReader();
					reader.onload = function (e) {
						var bytes = new sap.ui.getCore().Uint8Array(reader.result);
						var length = bytes.byteLength;
						for (var i = 0; i < length; i++) {
							binary += String.fromCharCode(bytes[i]);
						}
						that.base64ConversionRes = btoa(binary);
						that.base64ConversionRes = btoa(that.base64ConversionRes);
						binaryArray.push({
							"MimeType": fileMime,
							"FileName": fileName,
							"Content": that.base64ConversionRes
						});
					};
					reader.readAsArrayBuffer(fileData);
				};
			}
			var reader = new FileReader();
			reader.onload = function (readerEvt) {
				var binaryString = readerEvt.target.result;
				that.base64ConversionRes = btoa(binaryString);
				// that.base64ConversionRes = btoa(that.base64ConversionRes);
				binaryArray.push({
					// "DocumentType": DocNum,
					"MimeType": fileMime,
					"FileName": fileName,
					"Content": that.base64ConversionRes
				});
			};
			reader.readAsBinaryString(fileDetails);
		},

		clearAttachments: function () {
			  
			//clear all all global variables
			newImages = [];
			binaryArray = [];
			counter = 0;
			var newImagesData = new JSONModel(newImages);
			this.getView().setModel(newImagesData, "imagesData");
		},

		callAttach: function () {
			  
			// binaryArray[iCounter]

			if (binaryArray) {
				//TS, 14.06.2022, Perform create requests directly within a loop to send all images at once with a batch request
				for (var i = 0; i < binaryArray.length; ++i) {
					var oAttachment = {},
						oModel = this.getView().getModel();
					oAttachment.Vbeln = this.getView().getModel("Vbeln").getProperty("/").Vbeln;
					// oAttachment.Filename = binaryArray[i].FileName;
					oAttachment.Filename = newImages[i].name;
					oAttachment.Mimetype = binaryArray[i].MimeType;
					oAttachment.Content = binaryArray[i].Content;
					oModel.create("/PO_ATTACHMENTSet", oAttachment, {
						success: function (oData, oResponse) {
							  
							this.clearAttachments();
							this.byId("fileUploader").setValue("");
							var FileUploadFinish = this.getView().getModel("i18n").getResourceBundle().getText("FileUploadFinish");
							MessageToast.show(FileUploadFinish);
						}.bind(this),
						error: function (oError) {
							  
							var errorResponse = JSON.parse(oError.responseText);
							var errorMsg = errorResponse.error.message.value;
							sap.m.MessageBox.error(errorMsg);
							//In case of error show pop up and navigate back to the view
						}.bind(this)
					});
				}
			} else {
				// this.clearAttachments();
				// this.byId("fileUploader").setValue("");
				// var FileUploadFinish = this.getView().getModel("i18n").getResourceBundle().getText("FileUploadFinish");
				// MessageToast.show(FileUploadFinish);

			}
		},
		callAttachPost: function () {
			  
			// binaryArray[iCounter]

			if (binaryArray) {
				//TS, 14.06.2022, Perform create requests directly within a loop to send all images at once with a batch request
				for (var i = 0; i < binaryArray.length; ++i) {
					var oAttachment = {},
						oModel = this.getView().getModel();
					oAttachment.Vbeln = this.getView().getModel("Vbeln").getProperty("/").Vbeln;
					// oAttachment.Filename = binaryArray[i].FileName;
					oAttachment.Filename = newImages[i].name;
					oAttachment.Mimetype = binaryArray[i].MimeType;
					oAttachment.Content = binaryArray[i].Content;
					oModel.create("/PO_ATTACHMENTSet", oAttachment, {
						success: function (oData, oResponse) {
							  
							this.clearAttachments();
							this.byId("fileUploader").setValue("");
							var FileUploadFinish = this.getView().getModel("i18n").getResourceBundle().getText("FileUploadFinish");
							MessageToast.show(FileUploadFinish);
							onNavBack();
						}.bind(this),
						error: function (oError) {
							  
							var errorResponse = JSON.parse(oError.responseText);
							var errorMsg = errorResponse.error.message.value;
							sap.m.MessageBox.error(errorMsg);
							//In case of error show pop up and navigate back to the view
						}.bind(this)
					});
				}
			} else {
				// this.clearAttachments();
				// this.byId("fileUploader").setValue("");
				// var FileUploadFinish = this.getView().getModel("i18n").getResourceBundle().getText("FileUploadFinish");
				// MessageToast.show(FileUploadFinish);
				onNavBack();
			}
		},
		onButtonPostPress: function (oEvent) {
			  

			var oView = this.getView(),
				oModel = oView.getModel(),
				oData = oView.getModel("RezervationList").oData[0],
				that = this;

			var sPath = "/DeliveryItemSet(Vbeln='" + oData.Vbeln + "',Posnr='" + oData.Posnr + "')"; // ('" + sVbeln + "')

			oModel.update(sPath, oData, {
				success: function (oData, oResponse) {
					
					// Erfolgreiche Ausführung - Hier kannst du entsprechende Aktionen ausführen
					var response = oResponse.headers;
					var sapmessage = oResponse.headers['sap-message'];
					var msgtxt = JSON.parse(sapmessage).message;
					// sap.m.MessageBox.success(msgtxt);
					sap.m.MessageToast.show(msgtxt);
					that.callAttachPost();  
				},
				error: function (oError) {
					  
					var errorResponse = JSON.parse(oError.responseText);
					var errorMsg = errorResponse.error.message.value;
					sap.m.MessageBox.error(errorMsg);
					// console.error("Fehler beim Starten des Update-Prozesses:", oError);
				}
			});

		},

		deleteRow: function (oEvent) {
			var oSelectedPath = oEvent.getParameter("listItem").getBindingContext("imagesData").getObject().originalName;
			for (var i = 0; i < newImages.length; i++) {
				if (newImages[i].originalName === oSelectedPath) {
					newImages.splice(i, 1);
				}
			}
			var newImagesData = new JSONModel(newImages);
			this.getView().setModel(newImagesData, "imagesData");

			for (var j = 0; j < binaryArray.length; j++) {
				if (binaryArray[j].FileName === oSelectedPath) {
					binaryArray.splice(j, 1);
				}
			}
			this.byId("itemlist").getBinding("items").refresh();
		},
		onNavBack() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Lieferungauswahl");
			}
		},
		showSuccessMessage: function (hdrMessageObject, iDuration) {
			var duration;
			if (iDuration === undefined) {
				duration = 3000;
			} else {
				duration = iDuration;
			}
			// response header
			sap.m.MessageToast.show(hdrMessageObject.message, {
				duration: duration, // default
				width: "15em", // default
				my: "center bottom", // default
				at: "center bottom", // default
				of: window, // default
				offset: "0 -100", // default
				collision: "fit fit", // default
				onClose: null, // default
				autoClose: true, // default
				animationTimingFunction: "ease", // default
				animationDuration: 1000, // default
				closeOnBrowserNavigation: true // default
			});
		},

	});

});