// Arrays to store job applications and custom calendar events.
let applications = [];
let calendarEvents = [];

// Global variables for calendar navigation.
let currentYear = 2025;
let currentMonth = 0; // January (0-indexed)

/* ---------------------------
   Modal Handling Functions
--------------------------- */
function showModal() {
  const modal = document.getElementById('modal');
  modal.classList.remove('opacity-0', 'pointer-events-none');
}
function closeModal() {
  const modal = document.getElementById('modal');
  modal.classList.add('opacity-0', 'pointer-events-none');
}
function showEditModal(index) {
  const modal = document.getElementById('editModal');
  const app = applications[index];
  document.getElementById('editIndex').value = index;
  document.getElementById('editStatus').value = app.status;
  document.getElementById('editAssessmentStatus').value = app.assessmentStatus;
  document.getElementById('editJobType').value = app.jobType;
  document.getElementById('editAppliedOn').value = app.appliedOn;
  document.getElementById('editDeadline').value = app.deadline;
  document.getElementById('editJobDescription').value = app.jobDescription || '';
  document.getElementById('editJobUrl').value = app.jobUrl || '';
  document.getElementById('currentCV').textContent = app.cv ? app.cv : 'No file';
  document.getElementById('currentCL').textContent = app.cl ? app.cl : 'No file';
  modal.classList.remove('opacity-0', 'pointer-events-none');
}
function closeEditModal() {
  const modal = document.getElementById('editModal');
  modal.classList.add('opacity-0', 'pointer-events-none');
}
function showJobDescription(index) {
  const app = applications[index];
  document.getElementById('descContent').textContent = app.jobDescription || 'No description provided.';
  document.getElementById('descModal').classList.remove('opacity-0', 'pointer-events-none');
}
function closeDescModal() {
  const modal = document.getElementById('descModal');
  modal.classList.add('opacity-0', 'pointer-events-none');
}
function showEventModal() {
  document.getElementById('eventModal').classList.remove('opacity-0', 'pointer-events-none');
}
function closeEventModal() {
  document.getElementById('eventModal').classList.add('opacity-0', 'pointer-events-none');
}
function editCalendarEvent(eventIndex) {
  const ev = calendarEvents[eventIndex];
  document.getElementById('editEventIndex').value = eventIndex;
  document.getElementById('editEventDate').value = ev.date;
  document.getElementById('editEventCompany').value = ev.company;
  document.getElementById('editEventDescription').value = ev.description;
  document.getElementById('editEventModal').classList.remove('opacity-0', 'pointer-events-none');
}
function closeEditEventModal() {
  document.getElementById('editEventModal').classList.add('opacity-0', 'pointer-events-none');
}

/* ---------------------------
   Form Submission Handling
--------------------------- */
document.getElementById('applicationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const application = {
    company: formData.get('company'),
    status: formData.get('status'),
    assessmentStatus: formData.get('assessmentStatus'),
    jobType: formData.get('jobType'),
    jobRole: formData.get('jobRole'),
    deadline: formData.get('deadline'),
    appliedOn: formData.get('appliedOn'),
    jobDescription: formData.get('jobDescription'),
    jobUrl: formData.get('jobUrl'),
    cv: formData.get('cv') && formData.get('cv').name ? formData.get('cv').name : '',
    cl: formData.get('cl') && formData.get('cl').name ? formData.get('cl').name : ''
  };
  applications.push(application);
  updateTable();
  updateVisualizations();
  closeModal();
  this.reset();
});
document.getElementById('editApplicationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const index = formData.get('editIndex');
  applications[index].status = formData.get('editStatus');
  applications[index].assessmentStatus = formData.get('editAssessmentStatus');
  applications[index].jobType = formData.get('editJobType');
  applications[index].appliedOn = formData.get('editAppliedOn');
  applications[index].deadline = formData.get('editDeadline');
  applications[index].jobDescription = formData.get('editJobDescription');
  applications[index].jobUrl = formData.get('editJobUrl');
  if (formData.get('editCV') && formData.get('editCV').name) {
    applications[index].cv = formData.get('editCV').name;
  }
  if (formData.get('editCL') && formData.get('editCL').name) {
    applications[index].cl = formData.get('editCL').name;
  }
  updateTable();
  updateVisualizations();
  closeEditModal();
});
document.getElementById('eventForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const eventObj = {
    date: formData.get('eventDate'),
    company: formData.get('eventCompany'),
    description: formData.get('eventDescription')
  };
  calendarEvents.push(eventObj);
  updateVisualizations();
  closeEventModal();
  this.reset();
});
document.getElementById('editEventForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const index = formData.get('editEventIndex');
  calendarEvents[index].date = formData.get('editEventDate');
  calendarEvents[index].company = formData.get('editEventCompany');
  calendarEvents[index].description = formData.get('editEventDescription');
  updateVisualizations();
  closeEditEventModal();
  this.reset();
});

/* ---------------------------
   Delete File Functions
--------------------------- */
function deleteCV() {
  const index = document.getElementById('editIndex').value;
  applications[index].cv = '';
  document.getElementById('currentCV').textContent = 'No file';
}
function deleteCL() {
  const index = document.getElementById('editIndex').value;
  applications[index].cl = '';
  document.getElementById('currentCL').textContent = 'No file';
}

/* ---------------------------
   Delete Calendar Event Function
--------------------------- */
function deleteCalendarEvent(index) {
  calendarEvents.splice(index, 1);
  updateVisualizations();
}

/* ---------------------------
   Update Table Function
--------------------------- */
function updateTable() {
  const tableBody = document.getElementById('applicationTable');
  tableBody.innerHTML = '';
  applications.forEach((app, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${app.company}</td>
      <td class="px-6 py-4 whitespace-nowrap">${app.status}</td>
      <td class="px-6 py-4 whitespace-nowrap">${app.assessmentStatus}</td>
      <td class="px-6 py-4 whitespace-nowrap">${app.jobType}</td>
      <td class="px-6 py-4 whitespace-nowrap">${app.jobRole}</td>
      <td class="px-6 py-4 whitespace-nowrap">${app.deadline || ''}</td>
      <td class="px-6 py-4 whitespace-nowrap">${app.appliedOn || ''}</td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="showJobDescription(${index})" class="text-purple-500 hover:text-purple-700">View</button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${app.jobUrl ? `<a href="${app.jobUrl}" target="_blank" class="text-green-500 hover:text-green-600">Open</a>` : 'N/A'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${app.cv ? `<a href="#" class="text-blue-500 hover:text-blue-600">View</a>` : 'No file'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${app.cl ? `<a href="#" class="text-blue-500 hover:text-blue-600">View</a>` : 'No file'}
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button onclick="showEditModal(${index})" class="text-blue-500 hover:text-blue-600 mr-2">
          <i class="bi bi-pencil"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/* ---------------------------
   Visualization Functions
--------------------------- */
function drawBarChart() {
  const chartContainer = document.getElementById('barChart');
  if (applications.length === 0) {
    chartContainer.innerHTML = `<p class="text-center text-gray-200">No Data</p>`;
    return;
  }
  
  const roleCount = applications.reduce((acc, app) => {
    acc[app.jobRole] = (acc[app.jobRole] || 0) + 1;
    return acc;
  }, {});
  const data = Object.entries(roleCount).map(([role, count]) => ({ role, count }));
  const maxCount = Math.max(...data.map(d => d.count), 1);
  const containerHeight = 250;
  chartContainer.innerHTML = data.map(d => `
    <div class="inline-block mr-4">
      <div class="flex flex-col items-center">
        <div class="w-16 bg-blue-500 bar" style="height: ${(d.count / maxCount) * containerHeight}px;"></div>
        <span class="text-sm mt-2">${d.role}</span>
        <span class="text-sm font-bold">${d.count}</span>
      </div>
    </div>
  `).join('');
}

function drawPieChart() {
  const roleCount = applications.reduce((acc, app) => {
    acc[app.jobRole] = (acc[app.jobRole] || 0) + 1;
    return acc;
  }, {});
  const labels = Object.keys(roleCount);
  const counts = Object.values(roleCount);
  const ctx = document.getElementById('pieChart').getContext('2d');
  if (window.myPieChart) {
    window.myPieChart.destroy();
  }
  window.myPieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: counts,
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#14b8a6',
          '#f97316'
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendar.innerHTML = '';

  // Create headers for days (first row).
  days.forEach(day => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'text-center font-semibold text-gray-300';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();

  // Add empty cells for days before the first day.
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell';
    calendar.appendChild(emptyCell);
  }

  // Create cells for each day (only showing the day number).
  for (let i = 1; i <= daysInMonth; i++) {
    const dateCell = document.createElement('div');
    dateCell.className = 'calendar-cell';

    const dayNumber = document.createElement('div');
    dayNumber.textContent = i;
    dayNumber.className = 'text-sm font-semibold text-gray-200';
    dateCell.appendChild(dayNumber);

    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    
    // Show applications with a deadline on this day.
    const appEvents = applications.filter(app => app.deadline === dateString);
    appEvents.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'calendar-event';
      eventDiv.innerHTML = `
        <div class="font-bold text-gray-100">${event.company}</div>
        <div class="text-xs text-gray-200">${event.status}</div>
      `;
      dateCell.appendChild(eventDiv);
    });
    
    // Show applications with an appliedOn date on this day.
    const appliedEvents = applications.filter(app => app.appliedOn === dateString);
    appliedEvents.forEach(event => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'calendar-event';
      eventDiv.innerHTML = `
        <div class="font-bold text-gray-100">${event.company}</div>
        <div class="text-xs text-gray-200">Applied On</div>
      `;
      dateCell.appendChild(eventDiv);
    });
    
    // Show custom calendar events.
    calendarEvents.forEach((ev, idx) => {
      if (ev.date === dateString) {
        const evDiv = document.createElement('div');
        evDiv.className = 'calendar-event';
        evDiv.innerHTML = `
          <div class="flex justify-between items-center">
            <div>
              <div class="font-bold text-gray-100">${ev.company}</div>
              <div class="text-xs text-gray-200">${ev.description}</div>
            </div>
            <div class="flex space-x-2">
              <button onclick="editCalendarEvent(${idx})" class="text-blue-400 hover:text-blue-300">
                <i class="bi bi-pencil"></i>
              </button>
              <button onclick="deleteCalendarEvent(${idx})" class="text-red-400 hover:text-red-300">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        `;
        dateCell.appendChild(evDiv);
      }
    });

    calendar.appendChild(dateCell);
  }
}

// Calendar Navigation
document.getElementById('prevMonth').addEventListener('click', function() {
  if (currentYear === 2025 && currentMonth === 0) return; // Don’t go before Jan 2025
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  updateVisualizations();
});
document.getElementById('nextMonth').addEventListener('click', function() {
  if (currentYear === 2050 && currentMonth === 11) return; // Don’t go past Dec 2050
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  updateVisualizations();
});

function updateVisualizations() {
  drawBarChart();
  drawPieChart();
  generateCalendar();
  // Update the calendar header with month and year.
  document.getElementById('currentMonthYear').textContent = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
}

function fetchApplications() {
  fetch('getApplications.php')
    .then(response => response.json())
    .then(data => {
      applications = data;
      updateTable();
      updateVisualizations();
    })
    .catch(error => console.error('Error:', error));
}

fetchApplications();
