// Sample data for demonstration
let applications = [];

/* --- Modal Show/Hide --- */
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
  const descContent = document.getElementById('descContent');
  descContent.textContent = app.jobDescription || 'No description provided.';
  const modal = document.getElementById('descModal');
  modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeDescModal() {
  const modal = document.getElementById('descModal');
  modal.classList.add('opacity-0', 'pointer-events-none');
}

/* --- Form Submissions --- */
// New Application
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

// Edit Application
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

/* --- Delete CV/CL in Edit Modal --- */
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

/* --- Update Table --- */
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
        <button
          onclick="showJobDescription(${index})"
          class="text-purple-500 hover:text-purple-700"
        >
          View
        </button>
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        ${
          app.jobUrl
            ? `<a href="${app.jobUrl}" target="_blank" class="text-green-500 hover:text-green-600">Open</a>`
            : 'N/A'
        }
      </td>
      <td class="px-6 py-4 whitespace-nowrap">
        <button
          onclick="showEditModal(${index})"
          class="text-blue-500 hover:text-blue-600 mr-2"
        >
          <i class="bi bi-pencil"></i>
        </button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

/* --- Visualizations --- */
// Bar chart
function drawBarChart() {
  const chartContainer = document.getElementById('barChart');

  // Count applications by job role
  const roleCount = applications.reduce((acc, app) => {
    acc[app.jobRole] = (acc[app.jobRole] || 0) + 1;
    return acc;
  }, {});

  const data = Object.entries(roleCount).map(([role, count]) => ({
    role,
    count
  }));
  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const containerHeight = 250;

  chartContainer.innerHTML = data
    .map(
      (d) => `
      <div class="inline-block mr-4">
        <div class="flex flex-col items-center">
          <div
            class="w-16 bg-blue-500 bar"
            style="height: ${(d.count / maxCount) * containerHeight}px;"
          ></div>
          <span class="text-sm mt-2">${d.role}</span>
          <span class="text-sm font-bold">${d.count}</span>
        </div>
      </div>
    `
    )
    .join('');
}

// Calendar
function generateCalendar() {
  const calendar = document.getElementById('calendar');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendar.innerHTML = ''; // Clear previous calendar

  // Add day headers
  days.forEach((day) => {
    const dayHeader = document.createElement('div');
    dayHeader.className = 'text-center font-semibold text-gray-600';
    dayHeader.textContent = day;
    calendar.appendChild(dayHeader);
  });

  // Current month/year
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).getDay();

  // Padding for first week
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement('div');
    emptyCell.className = 'calendar-cell';
    calendar.appendChild(emptyCell);
  }

  // Calendar dates
  for (let i = 1; i <= daysInMonth; i++) {
    const dateCell = document.createElement('div');
    dateCell.className = 'calendar-cell';

    // Date number
    const dateNumber = document.createElement('div');
    dateNumber.textContent = i;
    dateNumber.className = 'text-sm font-semibold mb-1';
    dateCell.appendChild(dateNumber);

    // Add events for this date
    const dateString = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      '0'
    )}-${String(i).padStart(2, '0')}`;
    const dayEvents = applications.filter((app) => app.deadline === dateString);

    dayEvents.forEach((event) => {
      const eventDiv = document.createElement('div');
      eventDiv.className = 'calendar-event';
      eventDiv.innerHTML = `
        <div class="font-bold">${event.company}</div>
        <div class="text-xs">${event.status}</div>
      `;
      dateCell.appendChild(eventDiv);
    });

    calendar.appendChild(dateCell);
  }
}

// Combined update for chart & calendar
function updateVisualizations() {
  drawBarChart();
  generateCalendar();
}

// Initial load
updateVisualizations();






