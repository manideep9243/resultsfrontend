document.getElementById('searchButton').addEventListener('click', () => {
  const rollNumber = document.getElementById('rollNumberInput').value.trim();

  if (!rollNumber) {
    alert('Please enter a roll number');
    return;
  }

  fetch('http://localhost:3000/api/data')
    .then(response => response.json())
    .then(data => {
      const studentData = data.filter(item => item.rollNumber === rollNumber);
      if (studentData.length === 0) {
        document.getElementById('data-container').innerHTML = '<p>No results found for the entered roll number.</p>';
        document.getElementById('status').textContent = 'N/A';
        document.getElementById('sgpa').textContent = 'N/A';
        return;
      }

      // Render data in a table
      let tableHTML = `
        <table class="result-table">
          <thead>
            <tr>
              <th>Subject Code</th>
              <th>Subject Name</th>
              <th>Grade</th>
              <th>Grade Point</th>
              <th>Credits</th>
            </tr>
          </thead>
          <tbody>
      `;

      studentData.forEach(item => {
        tableHTML += `
          <tr>
            <td>${item.SUBCODE}</td>
            <td>${item.SUBNAME}</td>
            <td>${item.GRADE_LETTER}</td>
            <td>${item.GRADE_POINT}</td>
            <td>${item.CREDITS}</td>
          </tr>
        `;
      });

      tableHTML += '</tbody></table>';
      document.getElementById('data-container').innerHTML = tableHTML;

      // Calculate Pass/Fail status
      const isFail = studentData.some(item => item.GRADE_LETTER === 'F');
      document.getElementById('status').textContent = isFail ? 'Fail' : 'Pass';
      document.getElementById('status').style.color = isFail ? 'red' : 'green';

      // Calculate SGPA
      if (isFail) {
        document.getElementById('sgpa').textContent = 'N/A';
      } else {
        let totalGradePoints = 0;
        let totalCredits = 0;
        studentData.forEach(item => {
          totalGradePoints += item.GRADE_POINT * item.CREDITS;
          totalCredits += item.CREDITS;
        });

        const sgpa = totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : 'N/A';
        document.getElementById('sgpa').textContent = sgpa;
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      alert('Failed to fetch data. Please try again later.');
    });
});
