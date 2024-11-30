const courses = {
  devops: {
    price: 500,
    duration: 6,
  },
  web1: {
    price: 600,
    duration: 8,
  },
  web2: {
    price: 700,
    duration: 8,
  },
  dl: {
    price: 800,
    duration: 10,
  },
  python: {
    price: 400,
    duration: 6,
  },
};
const form = document.getElementById("form");
form.addEventListener("change", (e) => {
  const selectedOptions = document.getElementById("courses").selectedOptions;
  const errorMessage = document.getElementById("error-message");

  if (selectedOptions.length < 2) {
    errorMessage.textContent = "You must select at least 2 courses !";
    errorMessage.style.color = "red";

    e.preventDefault();
  } else if (selectedOptions.length > 3) {
    errorMessage.textContent = "You can select up to 3 courses only !";
    errorMessage.style.color = "red";

    e.preventDefault();
  } else {
    if (selectedOptions.length >= 3) {
      document.getElementById("third-date-div").style.display = "unset";
    } else {
      document.getElementById("third-date-div").style.display = "none";
    }
    errorMessage.textContent = "All Good !";
    errorMessage.style.color = "green";
  }
  const totalPrice = Array.from(selectedOptions).reduce(
    (total, option) => total + courses[String(option.value)].price,
    0
  );
  document.getElementById("price").textContent =
    totalPrice <= 1500
      ? totalPrice
      : totalPrice * 0.9 + "You just got a 10% reduction";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const selectedOptions = document.getElementById("courses").selectedOptions;
  const errorMessage = document.getElementById("error-message");
  const current = new Date();
  const first = new Date(document.getElementById("date-1").value);
  const second = new Date(document.getElementById("date-2").value);
  const third = new Date(document.getElementById("date-3").value);

  let currentTime = current.getTime();
  let firstCourseTime = first.getTime();
  let secondCourseTime = second.getTime();
  let thirdCourseTime = third.getTime();

  let firstCourseTimeCompletion =
    firstCourseTime +
    604800000 * courses[String(selectedOptions[0]?.value)].duration;
  let secondCourseTimeCompletion =
    secondCourseTime +
    604800000 * courses[String(selectedOptions[1]?.value)].duration;

  console.log(thirdCourseTime - secondCourseTimeCompletion);

  if (firstCourseTime <= currentTime + 604800000) {
    errorMessage.textContent =
      "The date of the first course should be at least 7 days more than today";
    errorMessage.style.color = "red";

    return false;
  } else if (firstCourseTimeCompletion >= secondCourseTime + 172800000) {
    errorMessage.textContent =
      "The date of the second course should be at least 2 days more than the date of completion of the first course";
    errorMessage.style.color = "red";

    return false;
  } else if (secondCourseTimeCompletion >= thirdCourseTime + 172800000) {
    errorMessage.textContent =
      "The date of the third course should be at least 2 days more than the date of completion of the second course";
    errorMessage.style.color = "red";

    return false;
  } else {
    document.getElementById("devi").innerHTML = "";
  }
});

document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const fname = document.querySelector('input[name="fname"]').value;
  const lname = document.querySelector('input[name="lname"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const phone = document.querySelector('input[name="phone"]').value;
  const level = document.querySelector('input[name="level"]').value;
  const selectedCourses = Array.from(
    document.querySelectorAll("#courses option:checked")
  ).map((opt) => opt.value);
  const startDate1 = document.getElementById("date-1").value;
  const startDate2 = document.getElementById("date-2").value;
  const startDate3 = document.getElementById("date-3").value;

  const coursePrices = {
    devops: 500,
    web1: 600,
    web2: 700,
    dl: 800,
    python: 400,
  };

  let totalPrice = selectedCourses.reduce(
    (total, course) => total + coursePrices[course],
    0
  );

  const reportDiv = document.getElementById("report");
  reportDiv.innerHTML = `
      <h2>Recap Report</h2>
      <p><strong>Name:</strong> ${fname} ${lname}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Level of Education:</strong> ${level}</p>
      <p><strong>Selected Courses:</strong></p>
      <ul>
        ${selectedCourses
          .map((course) => `<li>${course} - ${coursePrices[course]} DT</li>`)
          .join("")}
      </ul>
      <p><strong>Starting Dates:</strong></p>
      <ul>
        <li>Course 1: ${startDate1 || "N/A"}</li>
        <li>Course 2: ${startDate2 || "N/A"}</li>
        ${
          selectedCourses.length > 2
            ? `<li>Course 3: ${startDate3 || "N/A"}</li>`
            : ""
        }
      </ul>
      <p><strong>Total Price:<br></strong> ${
        totalPrice <= 1500
          ? totalPrice
          : `<del>${totalPrice}</del> (-10%) <br>${totalPrice * 0.9}`
      } DT</p>
    `;
  const emailBody = encodeURIComponent(reportDiv);

  window.location.href = `mailto:${email}?subject=Report Summary&body=${emailBody}`;

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const summary = reportDiv.innerText;

  doc.text(summary, 10, 10);
  doc.save("summary.pdf");
});
