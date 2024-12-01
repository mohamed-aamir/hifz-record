// Display current date
const today = new Date();
const dateString = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
});
document.getElementById("date").innerText = `Date: ${dateString}`;

// Save record
document.getElementById("hifzForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const record = {
        date: dateString,
        currentLesson: document.getElementById("currentLesson").value,
        sabqLesson: document.getElementById("sabqLesson").value,
        oldLesson: document.getElementById("oldLesson").value,
    };

    // Save to localStorage
    const records = JSON.parse(localStorage.getItem("hifzRecords")) || [];
    records.push(record);
    localStorage.setItem("hifzRecords", JSON.stringify(records));

    alert("Record saved!");
    this.reset(); // Reset form
});

// View records
document.getElementById("viewRecords").addEventListener("click", function () {
    const records = JSON.parse(localStorage.getItem("hifzRecords")) || [];
    const recordsList = document.getElementById("recordsList");
    recordsList.innerHTML = "";

    if (records.length === 0) {
        recordsList.innerHTML = "<p>No records found.</p>";
        return;
    }

    records.forEach(record => {
        const recordDiv = document.createElement("div");
        recordDiv.innerHTML = `
            <h4>${record.date}</h4>
            <p><strong>Current Lesson:</strong> ${record.currentLesson}</p>
            <p><strong>Sabq Lesson:</strong> ${record.sabqLesson}</p>
            <p><strong>Old Lesson:</strong> ${record.oldLesson}</p>
        `;
        recordsList.appendChild(recordDiv);
    });
});

// Function to generate PDF from records
document.getElementById("downloadPDF").addEventListener("click", function () {
    const { jsPDF } = window.jspdf; // Destructure jsPDF from the window object
    const doc = new jsPDF(); // Create new PDF document

    const records = JSON.parse(localStorage.getItem("hifzRecords")) || [];
    if (records.length === 0) {
        alert("No records to download.");
        return;
    }

    // Get current date
    const today = new Date();
    const dateString = today.toLocaleDateString('en-GB'); // 'en-GB' for dd-mm-yyyy format

    // Add title to PDF
    doc.setFontSize(18);
    doc.text("Hifz Records", 20, 20);

    // Start adding records to the PDF
    doc.setFontSize(12);
    let yPosition = 30; // Y position to start adding text

    records.forEach((record, index) => {
        doc.text(`Date: ${record.date}`, 20, yPosition);
        doc.text(`Current Lesson: ${record.currentLesson}`, 20, yPosition + 10);
        doc.text(`Sabq Lesson: ${record.sabqLesson}`, 20, yPosition + 20);
        doc.text(`Old Lesson: ${record.oldLesson}`, 20, yPosition + 30);

        // Add some space between records
        yPosition += 40;

        // If the content goes beyond the page, add a new page
        if (yPosition > 270) {
            doc.addPage();
            yPosition = 20; // Reset Y position for new page
        }
    });

    // Save the PDF with the date in the filename
    doc.save(`hifz_record_${dateString}.pdf`);
});
