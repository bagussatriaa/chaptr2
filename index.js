const express = require('express');

const app = express();
app.set('view engine', 'hbs');
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));

port = 300;

const cardData = [];
app.get('/', (req, res) => {
  let data = cardData.map(function (items) {
    return {
      ...items,
    };
  });

  res.render('index', { cardData: data });
});

app.get('/add-project', (req, res) => {
  res.render('project');
});

app.post('/add-project', (req, res) => {
  let post = req.body;
  post = {
    projectName: post.projectName,
    desc: post.desc,
    duration: getDuration(post.startDate, post.endDate),
    node: post.node,
    python: post.python,
    laravel: post.laravel,
    js: post.js,
  };
  // console.log(post);
  cardData.push(post);

  res.redirect('/');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.get('/detail', (req, res) => {
  res.render('detail');
});

app.get('/delete/:index', (req, res) => {
  let index = req.params;

  cardData.splice(index, 0);
  res.render('index');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

function getDuration(startDate, endDate) {
  let result;
  start = new Date(startDate);
  end = new Date(endDate);

  if (start < end) {
    result = end - start;
  } else {
    start - end;
  }

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
  } else if (distanceInYears == 1) {
    return `${distanceInYears} Year`;
  } else if (distanceInYears > 1) {
    return `${distanceInYears} Years`;
  } else if (distanceInDays >= 30) {
    return `${distanceInMonth} Month `;
  } else if (distanceInDays > 1) {
    return `${distanceInDays} Days`;
  }
}
