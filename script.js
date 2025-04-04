window.onload = function () {
    // elemente canvas si context
    const drawingCanvas = document.getElementById("drawingCanvas");
    const backgroundCanvas = document.getElementById("backgroundCanvas");
    const ctx = drawingCanvas.getContext("2d");
    const bgCtx = backgroundCanvas.getContext("2d");
    const saveRasterButton = document.getElementById('saveRaster');
    

    if (!drawingCanvas || !backgroundCanvas) {
        console.error("Canvas elements not found!");
        return;
    }

    // variabile pentru elemente
    let activeTool = "freeLine"; // element default
    let isDrawing = false;
    let startX = 0, startY = 0;
    let endX = 0, endY = 0; // pt preview
    const shapes = []; // lista de stocare a elem desenate

    // Resize canvas pt a se potrivi in container
    function resizeCanvas() {
        const canvasContainer = document.getElementById("canvas-container");
        const containerWidth = canvasContainer.clientWidth;
        const containerHeight = canvasContainer.clientHeight;

        backgroundCanvas.width = containerWidth;
        backgroundCanvas.height = containerHeight;
        drawingCanvas.width = containerWidth;
        drawingCanvas.height = containerHeight;

        bgCtx.fillStyle = document.getElementById("backgroundColor").value;
        bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

        redrawCanvas();
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);



   

    document.getElementById("toolLine").addEventListener("click", () => {
        activeTool = "line";
        ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
        ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;
        console.log("Line tool activated");
        console.log("the color is" + ctx.strokeStyle);
    });

    document.getElementById("toolRectangle").addEventListener("click", () => {
        activeTool = "rectangle";
        ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
        ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;
        console.log("Rectangle tool activated");
    });

    document.getElementById("toolEllipse").addEventListener("click", () => {
        activeTool = "ellipse";
        ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
        ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;
        console.log("Ellipse tool activated");
        console.log("the color is" + ctx.strokeStyle);
    });



    // mouse event handlers
    function onMouseDown(event) {
        isDrawing = true;
        const rect = drawingCanvas.getBoundingClientRect();
        startX = event.clientX - rect.left;
        startY = event.clientY - rect.top;

        ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
        ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;


        console.log("mouse down");
        console.log("the color is" + ctx.strokeStyle);

        if (activeTool === "freeLine") {
            ctx.beginPath();
            ctx.moveTo(startX, startY);
        } else if (activeTool === "rectangle") {
            endX = startX; // initializare endX si endY pt preview
            endY = startY;
        } else if (activeTool === "ellipse") {
            endX = startX; 
            endY = startY;
        }
    }

    function onMouseMove(event) {
        if (!isDrawing) return;

        const rect = drawingCanvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        
        if (activeTool === "line") {
            ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
            ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;
            redrawCanvas();
            drawStraightLine(ctx, startX, startY, mouseX, mouseY);
        } else if (activeTool === "rectangle") {
            ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
            ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;
            redrawCanvas(); // curatare canvas si desen preview
            drawRectangle(ctx, startX, startY, mouseX, mouseY);
        } else if (activeTool === "ellipse") {
            ctx.strokeStyle = document.getElementById("lineColor").value || "#000000";
            ctx.lineWidth = parseInt(document.getElementById("lineWidth").value) || 1;

            console.log("mouse move");
            console.log("the color is" + ctx.strokeStyle);

            redrawCanvas(); 
            drawEllipse(ctx, startX, startY, mouseX, mouseY);
        }
    }

    function onMouseUp(event) {
        if (!isDrawing) return;
    
        const rect = drawingCanvas.getBoundingClientRect();
        endX = event.clientX - rect.left;
        endY = event.clientY - rect.top;
    
        if (activeTool === "line") {
            drawStraightLine(ctx, startX, startY, endX, endY);
            shapes.push({
                type: "line",
                x1: startX,
                y1: startY,
                x2: endX,
                y2: endY,
                color: ctx.strokeStyle, 
                lineWidth: ctx.lineWidth 
            });
            addShapeToList(startX, startY, endX, endY);
        } else if (activeTool === "rectangle") {
            drawRectangle(ctx, startX, startY, endX, endY);
            shapes.push({
                type: "rectangle",
                x: startX,
                y: startY,
                width: endX - startX,
                height: endY - startY,
                color: ctx.strokeStyle, 
                lineWidth: ctx.lineWidth 
            });
            addRectangleToList(startX, startY, endX, endY);
        } else if (activeTool === "ellipse") {
            drawEllipse(ctx, startX, startY, endX, endY);
            shapes.push({
                type: "ellipse",
                x: startX,
                y: startY,
                width: endX - startX,
                height: endY - startY,
                color: ctx.strokeStyle, 
                lineWidth: ctx.lineWidth 
            });
            addEllipseToList(startX, startY, endX, endY);
        }
    
        isDrawing = false;
    }

    // drawing functions
    function drawStraightLine(ctx, x1, y1, x2, y2) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.closePath();
    }

    function drawRectangle(ctx, x1, y1, x2, y2) {
       
        
        ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
    }

    function drawEllipse(ctx, x1, y1, x2, y2) {
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);
        const centerX = x1 + width / 2;
        const centerY = y1 + height / 2;

       

        
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, Math.PI * 2);
        ctx.stroke();
    }

    function redrawCanvas() {
        ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    
        shapes.forEach(shape => {
            ctx.strokeStyle = shape.color; 
            ctx.lineWidth = shape.lineWidth; 
    
            if (shape.type === "line") {
                drawStraightLine(ctx, shape.x1, shape.y1, shape.x2, shape.y2);
            } else if (shape.type === "rectangle") {
                drawRectangle(ctx, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height);
            } else if (shape.type === "ellipse") {
                drawEllipse(ctx, shape.x, shape.y, shape.x + shape.width, shape.y + shape.height);
            }
        });
    }

    // adaugare in lista de elemente
    function addShapeToList(x1, y1, x2, y2) {
        const shapesList = document.getElementById("shapeItems");
        if (!shapesList) {
            console.error("Element 'shapeItems' not found.");
            return;
        }
        const listItem = document.createElement("li");
        listItem.textContent = `Line from (${x1.toFixed(2)}, ${y1.toFixed(2)}) to (${x2.toFixed(2)}, ${y2.toFixed(2)})`;
        shapesList.appendChild(listItem);
    }

   

    function addRectangleToList(x1, y1, x2, y2) {
        const shapesList = document.getElementById("shapeItems");
        if (!shapesList) {
            console.error("Element 'shapeItems' not found.");
            return;
        }
        const listItem = document.createElement("li");
        listItem.textContent = `Rectangle from (${x1.toFixed(2)}, ${y1.toFixed(2)}) to (${x2.toFixed(2)}, ${y2.toFixed(2)})`;
        shapesList.appendChild(listItem);
    }

    function addEllipseToList(x1, y1, x2, y2) {
        const shapesList = document.getElementById("shapeItems");
        if (!shapesList) {
            console.error("Element 'shapeItems' not found.");
            return;
        }
        const listItem = document.createElement("li");
        listItem.textContent = `Ellipse from (${x1.toFixed(2)}, ${y1.toFixed(2)}) to (${x2.toFixed(2)}, ${y2.toFixed(2)})`;
        shapesList.appendChild(listItem);
    }

    
    

    // schimbare culoare background
    document.getElementById("backgroundColor").addEventListener("input", (event) => {
        bgCtx.fillStyle = event.target.value;
        bgCtx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);
        redrawCanvas();
    });

    // event listeners pt canvas
    drawingCanvas.addEventListener("mousedown", onMouseDown);
    drawingCanvas.addEventListener("mousemove", onMouseMove);
    drawingCanvas.addEventListener("mouseup", onMouseUp);
    drawingCanvas.addEventListener("mouseleave", () => {
        isDrawing = false;
        ctx.closePath();
    });

    //salvare imagine
    saveRasterButton.addEventListener('click', () => {
        //canvas temporar
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = backgroundCanvas.width;
        tempCanvas.height = backgroundCanvas.height;
    
        const tempCtx = tempCanvas.getContext('2d');
    
        // deseneaza fundalul
        tempCtx.drawImage(backgroundCanvas, 0, 0);
    
        // deseneaza desenul de pe drawingCanvas peste fundal
        tempCtx.drawImage(drawingCanvas, 0, 0);
    
        // obt imaginea combinata ca URL
        const imageData = tempCanvas.toDataURL("image/png");
    
        // link pentru descarcare
        const downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        downloadLink.download = 'combined_drawing.png'; // Numele fișierului
    
        // click pe link pentru descarcare
        downloadLink.click();
    });


    //salvare svg
const saveVectorButton = document.getElementById('saveVector');

saveVectorButton.addEventListener('click', () => {
    // dimensiunea canvas-urilor
    const width = backgroundCanvas.width;
    const height = backgroundCanvas.height;

    // elementul SVG
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

    // adaugare fundal
    const backgroundColor = document.getElementById('backgroundColor').value;
    svgContent += `<rect width="${width}" height="${height}" fill="${backgroundColor}" />`;

    // parcurgerea formelor salvate in `shapes`
    shapes.forEach(shape => {
        switch (shape.type) {
            case 'line':
                svgContent += `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="${shape.color}" stroke-width="${shape.lineWidth}" />`;
                break;
            case 'rectangle':
                svgContent += `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="none" stroke="${shape.color}" stroke-width="${shape.lineWidth}" />`;
                break;
            case 'ellipse':
                const cx = shape.x + shape.width / 2;
                const cy = shape.y + shape.height / 2;
                const rx = Math.abs(shape.width / 2);
                const ry = Math.abs(shape.height / 2);
                svgContent += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${shape.color}" stroke-width="${shape.lineWidth}" />`;
                break;
            
        }
    });

    // inchidere tag-ului SVG
    svgContent += `</svg>`;

    // creare fis SVG si accesare
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(svgBlob);
    downloadLink.download = 'drawing.svg';
    downloadLink.click();
});


//stergere ellement

const clearCanvasButton = document.getElementById('clearCanvas');

clearCanvasButton.addEventListener('click', () => {
    // stergere continut canvas drawingCanvas
    const drawingContext = drawingCanvas.getContext('2d');
    drawingContext.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height); 

    // golire lista forme din DOM
    shapesList = []; // golire lista interna
    const shapeListElement = document.getElementById('shapeItems');
    shapeListElement.innerHTML = ''; // golire lista vizuala din DOM

});

};
