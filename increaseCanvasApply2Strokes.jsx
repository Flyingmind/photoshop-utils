if (app.documents.length > 0) {
    var doc = app.activeDocument;

    // Incrementa el lienzo en 50px por cada lado
    var newWidth = doc.width + 200; // 50px extra a cada lado (100 total)
    var newHeight = doc.height + 200; // 50px extra a cada lado (100 total)
    doc.resizeCanvas(newWidth, newHeight, AnchorPosition.MIDDLECENTER);

    // Calcular el grosor del primer trazo basado en las dimensiones
    var minDimension = Math.min(doc.width, doc.height);
    var strokeWidth1 = Math.round(minDimension / 50); // Primer trazo
    var strokeWidth2 = Math.round(strokeWidth1 * 1.1); // Segundo trazo (10% más grueso)

    try {
        // Aplicar el primer trazo en la capa original
        applyStroke(strokeWidth1, [255, 255, 255]); // Grosor de 10 px, color blanco

        // Crear una nueva capa duplicada
        var duplicateLayer = createDuplicateLayer();

        // Aplicar el segundo trazo en la capa duplicada
        applyStrokeToLayer(duplicateLayer, strokeWidth2, [212, 212, 212]); // Grosor de 15 px, color #D4D4D4

        moveLayerFrontOrBack("front"); // "front" or "back"

        //alert("Dos trazos aplicados correctamente en capas separadas.");
    } catch (e) {
        alert("Error al aplicar los trazos: " + e.message);
    }
} else {
    alert("No hay documentos abiertos.");
}

function applyStroke(size, rgb) {
    if (!doc.activeLayer) {
        throw new Error("No hay una capa activa.");
    }

    applyStrokeToLayer(doc.activeLayer, size, rgb);
}

function applyStrokeToLayer(layer, size, rgb) {
    // Configuración del trazo
    var desc = new ActionDescriptor();
    var ref = new ActionReference();
    ref.putIdentifier(stringIDToTypeID("layer"), layer.id);
    desc.putReference(stringIDToTypeID("null"), ref);

    var layerStyleDesc = new ActionDescriptor();
    var strokeDesc = new ActionDescriptor();

    strokeDesc.putBoolean(stringIDToTypeID("enabled"), true);
    strokeDesc.putUnitDouble(stringIDToTypeID("size"), stringIDToTypeID("pixelsUnit"), size);

    // Configuración del color
    var colorDesc = new ActionDescriptor();
    colorDesc.putDouble(stringIDToTypeID("red"), rgb[0]);
    colorDesc.putDouble(stringIDToTypeID("green"), rgb[1]);
    colorDesc.putDouble(stringIDToTypeID("blue"), rgb[2]);
    strokeDesc.putObject(stringIDToTypeID("color"), stringIDToTypeID("RGBColor"), colorDesc);

    // Configuración de posición del trazo
    strokeDesc.putEnumerated(
        stringIDToTypeID("style"),
        stringIDToTypeID("frameStyle"),
        stringIDToTypeID("outsetFrame")
    );

    layerStyleDesc.putObject(stringIDToTypeID("frameFX"), stringIDToTypeID("frameFX"), strokeDesc);
    desc.putObject(stringIDToTypeID("to"), stringIDToTypeID("layerEffects"), layerStyleDesc);

    // Ejecutar la acción
    try {
        executeAction(stringIDToTypeID("set"), desc, DialogModes.NO);
    } catch (e) {
        throw new Error("Error al ejecutar executeAction: " + e.message);
    }
}

function createDuplicateLayer() {
    if (!doc.activeLayer) {
        throw new Error("No hay una capa activa para duplicar.");
    }

    // Duplicar la capa activa
    var duplicateLayer = doc.activeLayer.duplicate();
    duplicateLayer.name = "Capa 2";
    return duplicateLayer;
}


function moveLayerFrontOrBack(relPos) {
	var c2t = function (s) {
		return app.charIDToTypeID(s);
	};
	var s2t = function (s) {
		return app.stringIDToTypeID(s);
	};
	var descriptor = new ActionDescriptor();
	var reference = new ActionReference();
	var reference2 = new ActionReference();
	reference.putEnumerated( s2t( "layer" ), s2t( "ordinal" ), s2t( "targetEnum" ));
	descriptor.putReference( c2t( "null" ), reference );
	reference2.putEnumerated( s2t( "layer" ), s2t( "ordinal" ), s2t( relPos ));
	descriptor.putReference( s2t( "to" ), reference2 );
	executeAction( s2t( "move" ), descriptor, DialogModes.NO );
}