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
