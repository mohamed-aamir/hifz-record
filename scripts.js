
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

        // Reverse the records so the latest saved one appears first
        records.reverse(); 

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

        let records = JSON.parse(localStorage.getItem("hifzRecords")) || [];
        if (records.length === 0) {
            alert("No records to download.");
            return;
        }

        // Reverse the records so the latest saved one appears first
        records = records.reverse(); 

        // Get current date
        const today = new Date();
        const dateString = today.toLocaleDateString('en-GB'); // 'en-GB' for dd-mm-yyyy format

        // Embed the Beau Ravage font (Base64 encoded string)
        const beauRavageBase64 = "/beau_base64.txt"; // Replace with actual Base64 string of Beau Ravage font
        doc.addFileToVFS("BeauRavage.ttf", beauRavageBase64); // Add the font to VFS (Virtual File System)
        doc.addFont("BeauRavage.ttf", "Beau Ravage", "normal"); // Register the font
    
        // Set Beau Ravage font for the title
        doc.setFont("Beau Ravage", "normal");
        doc.setFontSize(18);
        doc.text("Hifz Records", 20, 20); // Add the title in Beau Ravage font

        // Start adding records to the PDF
        doc.setFontSize(12);
        let yPosition = 30; // Y position to start adding text

        records.forEach((record) => {
            // Add Date
            doc.setFont("helvetica", "bold");
            doc.text(`Date: ${record.date}`, 20, yPosition);

            // Add Current Lesson
            yPosition += 10;
            doc.setFont("helvetica", "normal");
            doc.text(`Current Lesson: ${record.currentLesson}`, 20, yPosition);

            // Add Sabq Lesson
            yPosition += 10;
            doc.text(`Sabq Lesson: ${record.sabqLesson}`, 20, yPosition);

            // Add Old Lesson
            yPosition += 10;
            doc.text(`Old Lesson: ${record.oldLesson}`, 20, yPosition);

            // Add a line after each record
            yPosition += 10; // Space between text and line
            doc.setDrawColor(0, 0, 0); // Set line color to black
            doc.line(20, yPosition, 190, yPosition); // Draw the line

            // Add space after the line for separation
            yPosition += 10;

            // If the content goes beyond the page, add a new page
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20; // Reset Y position for new page
            }
        });

        // Save the PDF with the date in the filename
        doc.save(`hifz_record_${dateString}.pdf`);
    });
