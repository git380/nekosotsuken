document.getElementById('screenshotBtn').addEventListener('click', function () {
    // Take screenshot
    takeScreenshot();
});

function takeScreenshot() {
    // Get the entire document body
    const body = document.body;

    // Use html2canvas library to capture the screenshot
    html2canvas(body).then(canvas => {
        // Convert the canvas to base64 image data
        const imageData = canvas.toDataURL('image/png');

        // Create a link element and set the download attribute
        const downloadLink = document.createElement('a');
        downloadLink.href = imageData;
        downloadLink.download = 'screenshot.png';

        // Append the link to the body and trigger a click event
        document.body.appendChild(downloadLink);
        downloadLink.click();

        // Remove the link from the DOM
        document.body.removeChild(downloadLink);
    });
}


$(document).ready(function () {
    const canvas = document.getElementById("drawingCanvas");
    const context = canvas.getContext("2d");
    const penButton = document.getElementById("penButton");
    const eraserButton = document.getElementById("eraserButton");
    const clearButton = document.getElementById("clearButton");
    const colorPickerIcon = document.getElementById("colorPickerIcon");
    const colorPicker = document.getElementById("colorPicker");
    const lineWidthInput = document.getElementById("lineWidth");
    let isDrawing = false;
    let drawingMode = "pen"; // ペンまたは消しゴム

    penButton.addEventListener("click", function () {
        drawingMode = "pen";
        context.globalCompositeOperation = "source-over"; // ペンモード
    });

    eraserButton.addEventListener("click", function () {
        drawingMode = "eraser";
        context.globalCompositeOperation = "destination-out"; // 消しゴムモード
    });

    clearButton.addEventListener("click", function () {
        context.clearRect(0, 0, canvas.width, canvas.height);
    });

    colorPickerIcon.addEventListener("click", function () {
        colorPicker.click(); // Trigger the color picker when the icon is clicked
    });

    colorPicker.addEventListener("input", function () {
        context.strokeStyle = this.value;
    });

    lineWidthInput.addEventListener("input", function () {
        context.lineWidth = this.value;
    });

    canvas.addEventListener("mousedown", function (e) {
        isDrawing = true;
        context.beginPath();
        context.moveTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    });

    canvas.addEventListener("mousemove", function (e) {
        if (!isDrawing) return;
        if (drawingMode === "pen" || drawingMode === "eraser") {
            context.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
            context.stroke();
        }
    });

    canvas.addEventListener("mouseup", function () {
        isDrawing = false;
    });

    canvas.addEventListener("mouseout", function () {
        isDrawing = false;
    });
});