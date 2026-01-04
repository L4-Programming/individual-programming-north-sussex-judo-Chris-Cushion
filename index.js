const form = document.getElementById("form");
const output = document.getElementById("output");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Get the user's name
    const name = document.getElementById("athlete-name")?.value.trim() || "";

    // Get the user's weight
    const weightRaw = document.getElementById("current-weight")?.value;
    const weight = weightRaw ? parseInt(weightRaw, 10) : NaN;

    // Get the user's level
    const level =
      document.querySelector('input[name="training-plan"]:checked')?.value ||
      "";

    // Get the user's private tutoring hours
    const privateHoursRaw = document.querySelector(
      'input[name="private-coaching-hours"]'
    )?.value;
    const privateHours =
      privateHoursRaw !== undefined && privateHoursRaw !== ""
        ? parseInt(privateHoursRaw, 10)
        : NaN;

    // validation for private hours (0-5 per submission)
    const privateHoursValid =
      !isNaN(privateHours) && privateHours >= 0 && privateHours <= 5;

    // Competitions (binary: 0 or 1)
    const competitionsSelected =
      document.querySelector('input[name="competitions-entered"]:checked')
        ?.value ?? "0";
    const enteredCompetition = Number(competitionsSelected) === 1 ? 1 : 0;

    // Only Intermediate and Elite can enter competitions
    const competitionsAllowed = level === "intermediate" || level === "elite";

    const competitionsFinal = competitionsAllowed ? enteredCompetition : 0;

       // Determine weight category (uses weightClass function below)
    const weightCategory = isNaN(weight) ? "Unknown" : weightClass(weight);

    function weightClass(w) {
  if (w >= 30 && w <= 66) return "Flyweight";
  if (w >= 67 && w <= 73) return "Lightweight";
  if (w >= 74 && w <= 81) return "Light Middleweight";
  if (w >= 82 && w <= 90) return "Middleweight";
  if (w >= 91 && w <= 100) return "Light Heavyweight";
  if (w >= 101 && w <= 300) return "Heavyweight";
  return "Unknown";
}

// Collect validation errors
const errors = [];
if (!name) errors.push("Name is required.");
// Validate name format: require at least two name parts (first and last), allow letters, hyphens and apostrophes
const nameRegex = /^[A-Za-z'’-]+(?: [A-Za-z'’-]+)+$/;
if (name && !nameRegex.test(name))
errors.push("Name must include at least a first and last name (letters, hyphens or apostrophes allowed).");
if (isNaN(weight) || weight < 30 || weight > 300)
errors.push("Weight must be a number between 30 and 300 kg.");
if (!level) errors.push("Select a training level.");
if (!competitionsAllowed && enteredCompetition === 1)
errors.push("Beginners cannot enter competitions.");
if (
!privateHoursValid &&
privateHoursRaw !== undefined &&
privateHoursRaw !== ""
)
errors.push("Private hours must be between 0 and 5.");

    // If there are validation errors, show them and stop — do not capture/display user inputs
    if (errors.length) {
      if (output) {
        output.textContent = "Errors: " + errors.join(" ");
        output.classList.add("error"); // optional: style via CSS
      }
      console.error("Form validation failed:", errors);
      return;
    }

    // No validation errors -> safe to capture/process user inputs
    console.log({
      name,
      weight,
      weightCategory,
      level,
      privateHours,
      competitionsSelected,
      enteredCompetition,
      competitionsAllowed,
      competitionsFinal,
    });

    // Calculate costs (inside handler so current form values are used)
    const WEEKLY_COSTS = { beginner: 25.0, intermediate: 30.0, elite: 35.0 };
    const PRIVATE_RATE = 9.5; // per hour
    const COMPETITION_FEE = 22.0; // per month

    const weeklyCost = WEEKLY_COSTS[level] ?? 0;
    const monthlyBase = weeklyCost * 4; // 4 weeks per month
    // Private coaching allowed for all levels (including Beginners)
    const privateAllowed =
      level === "beginner" || level === "intermediate" || level === "elite";
    const privateCost =
      privateAllowed && !isNaN(privateHours) ? privateHours * PRIVATE_RATE : 0;
    const competitionCost = competitionsFinal === 1 ? COMPETITION_FEE : 0;
    const totalMonthly = monthlyBase + privateCost + competitionCost;

    if (output) {
      const privateText = privateAllowed
        ? privateHoursValid
          ? `${privateHours} hrs`
          : isNaN(privateHours)
          ? "N/A"
          : "Invalid (0-5)"
        : "N/A";

      const compText = competitionsFinal === 1 ? "One" : "Zero";

      // New: show separate private & competition cost lines
      const privateCostText =
        privateAllowed && privateHoursValid
          ? `£${privateCost.toFixed(2)}`
          : privateAllowed && !isNaN(privateHours)
          ? "Invalid (0-5)"
          : "£0.00";

      const competitionCostText =
        competitionsFinal === 1 ? `£${competitionCost.toFixed(2)}` : "£0.00";

      // Display each piece of information on its own line
      const lines = [
        `Name: ${name || "N/A"}`,
        `Weight: ${isNaN(weight) ? "N/A" : weight + " kg"}`,
        `Weight Category: ${weightCategory}`,
        `Level: ${level || "N/A"}`,
        `Entered Competition: ${compText} (Cost: ${competitionCostText})`,
        `Private: ${privateText} (Cost: ${privateCostText})`,
        `Total Cost: £${totalMonthly.toFixed(2)}`,
      ];

      const outputsWrapperEl = document.getElementById("outputs-wrapper");
      if (outputsWrapperEl) {
        // Clear previous outputs then append each line as its own output-field
        outputsWrapperEl.innerHTML = "";
        lines.forEach((line) => {
          const div = document.createElement("div");
          div.className = "output-field";
          div.textContent = line;
          outputsWrapperEl.appendChild(div);
        });
      }

      // Name format validated earlier; no DOM check required here.
    }
  });
}

// Validate the user's input:
// Check if the user has entered a name
// Check if the user has clicked a level
// Check if the user has added a valid weight (30-300)
// Check if the user has entered a valid number of competitions (0-1) - Make competitions a binary button
// Check if the user has entered a valid number of private coaching hours (0-5)
// Only Intermediate and Elite can enter competitions
// A month always consists of 4 weeks

// Calculate the total cost
// Beginner - £25.00 weekly
// Intermediate - £30.00 weekly
// Elite - £35.00 weekly
// Private tuition £9.50 per hour - available to all levels
// Competition entry fee - £22.00 - only one per month

// Calculate the weight category, convert into integer
// flyweight 30-66
// lightweight 67-73
// light middleweight 74-81
// middleweight 82-90
// light heavyweight 91-100
// heavyweight 101-300
function weightClass(w) {
  if (w >= 30 && w <= 66) return "Flyweight";
  if (w >= 67 && w <= 73) return "Lightweight";
  if (w >= 74 && w <= 81) return "Light Middleweight";
  if (w >= 82 && w <= 90) return "Middleweight";
  if (w >= 91 && w <= 100) return "Light Heavyweight";
  if (w >= 101 && w <= 300) return "Heavyweight";
  return "Unknown";
}

// Display the total cost to the user
// Userlevelcost + competition + (privatecoaching * userhours)

// Display the weight class to the user
