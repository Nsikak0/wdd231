const currentYear = document.querySelector("#current-year");
const lastModified = document.querySelector("#last-modified");
const confirmationMessage = document.querySelector("#confirmation-message");
const applicationSummary = document.querySelector("#application-summary");
const query = new URLSearchParams(window.location.search);

if (currentYear) {
  currentYear.textContent = String(new Date().getFullYear());
}

if (lastModified) {
  lastModified.textContent = document.lastModified;
}

const requiredFields = ["firstName", "lastName", "email", "phone", "organization", "timestamp"];
const applicationWasSubmitted = requiredFields.every((field) => query.get(field)?.trim());

if (applicationWasSubmitted && applicationSummary && confirmationMessage) {
  const submittedAt = new Date(query.get("timestamp"));
  const displayTimestamp = Number.isNaN(submittedAt.getTime())
    ? query.get("timestamp")
    : submittedAt.toLocaleString();

  applicationSummary.querySelector('[data-field="firstName"]').textContent = query.get("firstName");
  applicationSummary.querySelector('[data-field="lastName"]').textContent = query.get("lastName");
  applicationSummary.querySelector('[data-field="email"]').textContent = query.get("email");
  applicationSummary.querySelector('[data-field="phone"]').textContent = query.get("phone");
  applicationSummary.querySelector('[data-field="organization"]').textContent =
    query.get("organization");
  applicationSummary.querySelector('[data-field="timestamp"]').textContent = displayTimestamp;
  applicationSummary.hidden = false;
  confirmationMessage.textContent = "Your application details have been recorded for this demonstration.";
} else if (confirmationMessage) {
  confirmationMessage.textContent =
    "No complete application details were provided. Please use the join page to submit the form.";
}
