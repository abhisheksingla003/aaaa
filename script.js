/*
  Program name: script.js
  Author: Muhammad Ashar
  Date created: 03/28/2026
  Version: 2.0
  Description: External JavaScript for patient registration form validation,
               dynamic interactions, and review panel generation.
*/

/* ===================================================
   PAGE INITIALIZATION
   =================================================== */

window.onload = function () {
    setDateBounds();
    showSliderValue(document.getElementById("health_rating").value);
};

/* ===================================================
   DATE BOUNDS — set min/max for DOB field dynamically
   =================================================== */

function setDateBounds() {
    var today = new Date();

    // Max date = today (cannot be in the future)
    var maxDate = today.toISOString().split("T")[0];

    // Min date = 120 years ago
    var minDate = new Date(
        today.getFullYear() - 120,
        today.getMonth(),
        today.getDate()
    ).toISOString().split("T")[0];

    var dobField = document.getElementById("dob");
    if (dobField) {
        dobField.setAttribute("max", maxDate);
        dobField.setAttribute("min", minDate);
    }
}

/* ===================================================
   SLIDER — show value dynamically as user slides
   =================================================== */

function showSliderValue(val) {
    document.getElementById("health_display").textContent = val;
}

/* ===================================================
   USER ID — convert to lowercase on input, validate
   =================================================== */

function formatUserID() {
    var field = document.getElementById("user_id");
    field.value = field.value.toLowerCase();
    validateUserID();
}

function validateUserID() {
    var val = document.getElementById("user_id").value;
    var msg = document.getElementById("user_id_msg");

    if (val === "") {
        msg.textContent = "";
        return;
    }

    var errors = [];

    if (val.length < 5 || val.length > 30) {
        errors.push("Must be 5 to 30 characters");
    }
    if (/^[0-9]/.test(val)) {
        errors.push("First character cannot be a number");
    }
    if (/[^a-z0-9_\-]/.test(val)) {
        errors.push("Only letters, numbers, underscores, and dashes allowed");
    }
    if (/\s/.test(val)) {
        errors.push("No spaces allowed");
    }

    if (errors.length > 0) {
        msg.textContent = "✗ " + errors.join(". ");
        msg.className = "field-msg error-msg";
    } else {
        msg.textContent = "✓ Looks good";
        msg.className = "field-msg success-msg";
    }
}

/* ===================================================
   PASSWORD — validate in real time
   =================================================== */

function validatePassword() {
    var pwd    = document.getElementById("password").value;
    var userId = document.getElementById("user_id").value.toLowerCase();
    var first  = document.getElementById("first_name").value.toLowerCase();
    var last   = document.getElementById("last_name").value.toLowerCase();
    var msg    = document.getElementById("pwd_msg");

    if (pwd === "") {
        msg.textContent = "";
        checkPasswords();
        return;
    }

    var errors = [];

    if (pwd.length < 8 || pwd.length > 30) {
        errors.push("Must be 8–30 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
        errors.push("Needs 1 uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
        errors.push("Needs 1 lowercase letter");
    }
    if (!/[0-9]/.test(pwd)) {
        errors.push("Needs 1 digit");
    }
    if (!/[!@#%^&*()\-_+=\/><.,`~]/.test(pwd)) {
        errors.push("Needs 1 special character (e.g. !@#$%)");
    }
    if (pwd.includes('"')) {
        errors.push("Cannot contain double quotes");
    }
    if (userId.length >= 3 && pwd.toLowerCase().includes(userId)) {
        errors.push("Cannot contain your User ID");
    }
    if (first.length >= 3 && pwd.toLowerCase().includes(first)) {
        errors.push("Cannot contain your first name");
    }
    if (last.length >= 3 && pwd.toLowerCase().includes(last)) {
        errors.push("Cannot contain your last name");
    }

    if (errors.length > 0) {
        msg.textContent = "✗ " + errors.join(" | ");
        msg.className = "field-msg error-msg";
    } else {
        msg.textContent = "✓ Password strength OK";
        msg.className = "field-msg success-msg";
    }

    checkPasswords();
}

/* ===================================================
   PASSWORD CONFIRM — compare both fields
   =================================================== */

function checkPasswords() {
    var pwd     = document.getElementById("password").value;
    var confirm = document.getElementById("confirm_password").value;
    var msg     = document.getElementById("confirm_pwd_msg");

    if (confirm === "") {
        msg.textContent = "";
        return;
    }

    if (pwd === confirm) {
        msg.textContent = "✓ Passwords match";
        msg.className = "field-msg success-msg";
    } else {
        msg.textContent = "✗ Passwords do not match";
        msg.className = "field-msg error-msg";
    }
}

/* ===================================================
   TEXTAREA — warn if double quotes are entered
   =================================================== */

function validateSymptoms() {
    var val = document.getElementById("symptoms").value;
    var msg = document.getElementById("symptoms_msg");

    if (val.includes('"')) {
        msg.textContent = "✗ Please remove double quote characters (\")";
        msg.className = "field-msg error-msg";
    } else {
        msg.textContent = "";
    }
}

/* ===================================================
   ZIP CODE — strip non-digit/dash characters on input
   =================================================== */

function cleanZip() {
    var field = document.getElementById("zip");
    field.value = field.value.replace(/[^0-9\-]/g, "");
}

/* ===================================================
   FINAL VALIDATION — runs on form submit
   =================================================== */

function finalValidate() {
    var pwd     = document.getElementById("password").value;
    var confirm = document.getElementById("confirm_password").value;

    // Check password strength
    if (pwd.length < 8 ||
        !/[A-Z]/.test(pwd) ||
        !/[a-z]/.test(pwd) ||
        !/[0-9]/.test(pwd) ||
        !/[!@#%^&*()\-_+=\/><.,`~]/.test(pwd)) {
        alert("Password does not meet the requirements. Please check the password field.");
        return false;
    }

    // Check passwords match
    if (pwd !== confirm) {
        alert("Passwords do not match. Please re-enter your password.");
        return false;
    }

    // Check textarea for double quotes
    var symptoms = document.getElementById("symptoms").value;
    if (symptoms.includes('"')) {
        alert("Please remove double quote characters from the symptoms field.");
        return false;
    }

    return true;
}

/* ===================================================
   REVIEW FORM — collect and display all data
   =================================================== */

function reviewForm() {
    // Pull values from every field
    var firstName = document.getElementById("first_name").value.trim();
    var mi        = document.getElementById("middle_initial").value.trim();
    var lastName  = document.getElementById("last_name").value.trim();
    var dob       = document.getElementById("dob").value;
    var ssn       = document.getElementById("ssn").value;
    var email     = document.getElementById("email").value.trim();
    var phone     = document.getElementById("phone").value.trim();
    var addr1     = document.getElementById("address1").value.trim();
    var addr2     = document.getElementById("address2").value.trim();
    var city      = document.getElementById("city").value.trim();
    var stateEl   = document.getElementById("state");
    var stateVal  = stateEl.options[stateEl.selectedIndex].text;
    var zip       = document.getElementById("zip").value.trim();
    var symptoms  = document.getElementById("symptoms").value.trim();
    var health    = document.getElementById("health_rating").value;
    var userId    = document.getElementById("user_id").value.trim();
    var pwd       = document.getElementById("password").value;
    var confirm   = document.getElementById("confirm_password").value;

    // Checkboxes
    var conditionBoxes = document.querySelectorAll("input[name='condition']:checked");
    var conditions = [];
    conditionBoxes.forEach(function (cb) {
        conditions.push(cb.getAttribute("data-label") || cb.value);
    });

    // Radio buttons
    var genderEl     = document.querySelector("input[name='gender']:checked");
    var vaccinatedEl = document.querySelector("input[name='vaccinated']:checked");
    var insuranceEl  = document.querySelector("input[name='insurance']:checked");

    // ---- Build the review HTML ----
    var today = new Date();

    var html = "<h3>PLEASE REVIEW THIS INFORMATION</h3>";
    html += "<table class='review-table'>";
    html += "<thead><tr><th>Field</th><th>Value Entered</th><th>Status</th></tr></thead>";
    html += "<tbody>";

    // --- Name ---
    var fullName = firstName + (mi ? " " + mi + "." : "") + (lastName ? " " + lastName : "");
    var nameOk = firstName !== "" && lastName !== "";
    html += reviewRow("Full Name", fullName || "(not entered)", nameOk, nameOk ? "" : "First and Last name are required");

    // --- Date of Birth ---
    var dobOk = true;
    var dobErr = "";
    if (!dob) {
        dobOk = false;
        dobErr = "Required";
    } else {
        var dobDate = new Date(dob + "T00:00:00");
        if (dobDate > today) {
            dobOk = false;
            dobErr = "Cannot be in the future";
        }
        var minDob = new Date(today.getFullYear() - 120, today.getMonth(), today.getDate());
        if (dobDate < minDob) {
            dobOk = false;
            dobErr = "Cannot be more than 120 years ago";
        }
    }
    html += reviewRow("Date of Birth", dob ? formatDisplayDate(dob) : "(not entered)", dobOk, dobErr);

    // --- SSN (masked) ---
    var ssnDisplay = ssn ? "***-**-" + ssn.slice(-4) : "(not entered)";
    var ssnPattern = /^\d{3}-\d{2}-\d{4}$/;
    var ssnOk = ssnPattern.test(ssn);
    html += reviewRow("Social Security", ssnDisplay, ssnOk, ssnOk ? "" : "Format must be XXX-XX-XXXX");

    // --- Email ---
    var emailOk = email !== "" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    html += reviewRow("Email Address", email || "(not entered)", emailOk, emailOk ? "" : "Invalid email format");

    // --- Phone ---
    var phoneOk = /^\d{3}-\d{3}-\d{4}$/.test(phone);
    html += reviewRow("Phone Number", phone || "(not entered)", phoneOk, phoneOk ? "" : "Format must be 000-000-0000");

    // --- Address ---
    var addrDisplay = addr1;
    if (addr2) addrDisplay += ", " + addr2;
    if (city)  addrDisplay += ", " + city;
    if (stateVal !== "Select") addrDisplay += ", " + stateVal;
    if (zip)   addrDisplay += " " + zip;
    var addrOk  = addr1 !== "" && city !== "" && stateVal !== "Select" && zip !== "";
    var addrErr = "";
    if (!addr1) addrErr += "Address Line 1 required. ";
    if (!city)  addrErr += "City required. ";
    if (stateVal === "Select") addrErr += "State required. ";
    if (!zip)   addrErr += "Zip Code required.";
    html += reviewRow("Address", addrDisplay || "(not entered)", addrOk, addrErr.trim());

    // --- Conditions ---
    html += reviewRow(
        "Past Conditions",
        conditions.length > 0 ? conditions.join(", ") : "None selected",
        true,
        ""
    );

    // --- Gender ---
    var genderOk = genderEl !== null;
    html += reviewRow("Gender", genderEl ? capitalize(genderEl.value) : "(not selected)", genderOk, genderOk ? "" : "Please select a gender");

    // --- Vaccinated ---
    var vaccOk = vaccinatedEl !== null;
    html += reviewRow("Vaccinated?", vaccinatedEl ? capitalize(vaccinatedEl.value) : "(not selected)", vaccOk, vaccOk ? "" : "Please select Yes or No");

    // --- Insurance ---
    var insOk = insuranceEl !== null;
    html += reviewRow("Has Insurance?", insuranceEl ? capitalize(insuranceEl.value) : "(not selected)", insOk, insOk ? "" : "Please select Yes or No");

    // --- Health Rating ---
    html += reviewRow("Health Rating", health + " / 10", true, "");

    // --- Symptoms ---
    var symptomsOk = !symptoms.includes('"');
    html += reviewRow("Described Symptoms", symptoms || "(none entered)", symptomsOk, symptomsOk ? "" : "Remove double quote characters");

    // --- User ID ---
    var userIdOk = userId.length >= 5 && userId.length <= 30 &&
                   /^[a-z]/.test(userId) &&
                   /^[a-z0-9_\-]+$/.test(userId);
    html += reviewRow("User ID", userId || "(not entered)", userIdOk, userIdOk ? "" : "5–30 chars, start with letter, no spaces or special chars");

    // --- Password ---
    var pwdStrong = pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) &&
                    /[0-9]/.test(pwd) && /[!@#%^&*()\-_+=\/><.,`~]/.test(pwd) && !pwd.includes('"');
    var pwdMatch  = pwd === confirm && pwd !== "";
    var pwdOk     = pwdStrong && pwdMatch;
    var pwdErr    = "";
    if (!pwdStrong) pwdErr += "Password does not meet strength requirements. ";
    if (!pwdMatch)  pwdErr += "Passwords do not match.";
    html += reviewRow("Password", pwd ? "*".repeat(pwd.length) : "(not entered)", pwdOk, pwdErr.trim());

    html += "</tbody></table>";

    // Count errors
    var errorCount = (html.match(/review-fail/g) || []).length;
    if (errorCount === 0) {
        html += "<p class='review-all-pass'>✓ All fields look good! You may submit the form.</p>";
    } else {
        html += "<p class='review-has-errors'>⚠ Please fix the " + errorCount + " error(s) above before submitting.</p>";
    }

    // Inject and scroll
    var reviewDiv = document.getElementById("review_section");
    reviewDiv.innerHTML = html;
    reviewDiv.style.display = "block";
    reviewDiv.scrollIntoView({ behavior: "smooth" });
}

/* ===================================================
   HELPER — build a single review table row
   =================================================== */

function reviewRow(label, value, isOk, errorMsg) {
    var statusCell;
    if (isOk) {
        statusCell = "<span class='review-pass'>✓ pass</span>";
    } else {
        statusCell = "<span class='review-fail'>✗ ERROR" + (errorMsg ? ": " + errorMsg : "") + "</span>";
    }
    return "<tr>" +
               "<td class='review-label'>" + label + "</td>" +
               "<td class='review-value'>" + value + "</td>" +
               "<td>" + statusCell + "</td>" +
           "</tr>";
}

/* ===================================================
   HELPER — format ISO date (YYYY-MM-DD) to MM/DD/YYYY
   =================================================== */

function formatDisplayDate(isoDate) {
    if (!isoDate) return "";
    var parts = isoDate.split("-");
    return parts[1] + "/" + parts[2] + "/" + parts[0];
}

/* ===================================================
   HELPER — capitalize first letter
   =================================================== */

function capitalize(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// End of script.js
