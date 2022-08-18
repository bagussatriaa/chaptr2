const cardData = [];
function addPost(event) {
  event.preventDefault();
  let projectName = document.getElementById('project-name').value;
  let desc = document.getElementById('description').value;

  // icons
  let node = document.getElementById('node').checked;
  let python = document.getElementById('python').checked;
  let laravel = document.getElementById('laravel').checked;
  let js = document.getElementById('js').checked;
  // icons conditions
  if (node) {
    node = document.getElementById('node').value;
  } else {
    node = '';
  }
  if (python) {
    python = document.getElementById('python').value;
  } else {
    python = '';
  }
  if (laravel) {
    laravel = document.getElementById('laravel').value;
  } else {
    laravel = '';
  }
  if (js) {
    js = document.getElementById('js').value;
  } else {
    js = '';
  }

  let image = document.getElementById('img').files;
  if (image.length == 0) {
    return alert('Please select an image to continue');
  }
  image = URL.createObjectURL(image[0]);

  // input alert
  if (projectName == '') {
    return alert('Fill the name of the project');
  } else if (desc == '') {
    return alert('Description must be filled in');
  } else if (node == '' && python == '' && laravel == '' && js == '') {
    return alert('Take at least 1 technologies');
  }

  // Time declaration
  let startDate = document.getElementById('start-date').value;
  let endDate = document.getElementById('end-date').value;
  if (startDate == '' || endDate == '') {
    return alert('Fill the date');
  } else if (startDate > endDate) {
    return alert('Wrong Date');
  }
  let duration = getDuration(startDate, endDate);
  let post = {
    projectName,
    startDate,
    endDate,
    duration,
    desc,
    js,
    node,
    python,
    laravel,
    image,
  };
  cardData.push(post);
  renderCard();
  // detailCard();
}

function renderCard() {
  document.getElementById('contents').innerHTML = '';

  // ${cardData[i].image}
  for (let i = 0; i < cardData.length; i++) {
    document.getElementById('contents').innerHTML += `
    <div class="row" id="contents">
          <div class="col-lg-4">
            <div class="card shadow-lg" width="10rem">
              <img src="${cardData[i].image}" class="card-img-top" alt="Image" />
              <div class="card-body">
                <h2 class="card-title fw-bold">${cardData[i].projectName}</h2>
                <h6 class="card-text mb-3 text-muted">Duration: ${cardData[i].duration}</h6>
                <p>${cardData[i].desc}</p>
                <div class="d-flex fs-4">
                  <i class="fa-brands fa-${cardData[i].node} me-3"></i>
                  <i class="fa-brands fa-${cardData[i].python} me-3"></i>
                  <i class="fa-brands fa-${cardData[i].laravel} me-3"></i>
                  <i class="fa-brands fa-${cardData[i].js}"></i>
                </div>
                <div class="d-flex mt-4 justify-content-evenly">
                  <div class="btn ps-5 pe-5"><a class="text-light" href="project.html">Edit</a></div>
                  <div class="btn ps-5 pe-5"><a class="text-light" href="">Delete</a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
  }
}

function getDuration(startDate, endDate) {
  let start = new Date(startDate);
  let end = new Date(endDate);
  let result;
  if (start < end) {
    result = end - start;
  } else {
    return alert('Wrong Date');
  }
  console.log(result);
  const msecond = 1000;
  const secInHours = 3600;
  const hoursInDay = 24;
  const dayInMonth = 30;
  const monthInYears = 12;

  let distanceInDays = Math.floor(result / (msecond * secInHours * hoursInDay));
  let distanceInMonth = Math.floor(result / (msecond * secInHours * hoursInDay * dayInMonth));
  let distanceInYears = Math.floor(result / (msecond * secInHours * hoursInDay * dayInMonth * monthInYears));

  if (distanceInDays == 1) {
    return `${distanceInDays} Day`;
  } else if (distanceInMonth > 12) {
    return `${distanceInYears} Years`;
  } else if (distanceInDays >= 30) {
    return `${distanceInMonth} Month `;
  } else if (distanceInDays > 1) {
    return `${distanceInDays} Days`;
  }
}

// function detailCard() {
//   document.getElementById('details').innerHTML = '';
//   for (let i = 0; i < cardData.length; i++) {
//     document.getElementById('details').innerHTML += `
//       <h1>${cardData[i].projectName}</h1>
//       <div class="container">
//         <img src="assets/vicky-hladynets-C8Ta0gwPbQg-unsplash.jpg" alt="" />
//         <div class="right">
//           <h2>Duration</h2>
//           <div class="date">
//             <i class="fa-solid fa-calendar-days"></i>
//             <p>20 July -</p>
//             <p>30 July</p>
//           </div>
//           <div class="duration">
//             <i class="fa-solid fa-clock"></i>
//             <p>1 Month</p>
//           </div>
//           <div class="tech">
//             <h2>Technologies</h2>
//             <div class="icons1">
//               <i class="fa-brands fa-node-js"></i>
//               <p>Node Js</p>
//               <i class="fa-brands fa-python"></i>
//               <p>Python</p>
//             </div>
//             <div class="icons2">
//               <i class="fa-brands fa-laravel"></i>
//               <p>Laravel</p>
//               <i class="fa-brands fa-js"></i>
//               <p>Javascript</p>
//             </div>
//           </div>
//         </div>
//       </div>
//       <main>Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima natus quos cupiditate nam quis dolore quaerat deserunt ipsam exercitationem dolorum incidunt optio quisquam odit modi, culpa hic pariatur quae. Deleniti?</main>
//   `;
//   }
// }
