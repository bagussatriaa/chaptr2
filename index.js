// const { query } = require('express');
const express = require('express');
const database = require('./connections/database');
const app = express();
const dayjs = require('dayjs');

app.set('view engine', 'hbs');
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));

port = 300;

database.connect((err, client, done) => {
  if (err) throw err;

  app.get('/', (req, res) => {
    let query = 'SELECT * FROM tb_projects ORDER BY id DESC';
    client.query(query, (err, result) => {
      if (err) throw err;
      data = result.rows;
      // console.log(data);
      // console.log(data);
      // console.log(data.start_date);
      let cardData = data.map((items) => {
        return {
          ...items,
          duration: getDuration(items.start_date, items.end_date),
        };
      });
      // console.log(cardData);
      res.render('index', { cardData });
    });
  });

  app.get('/add-project', (req, res) => {
    res.render('project');
  });

  app.post('/add-project', (req, res) => {
    let data = req.body;
    // console.log(data.projectName);

    let icons = {
      node: data.node,
      python: data.python,
      laravel: data.laravel,
      js: data.js,
    };
    let query = `INSERT INTO tb_projects(project_name, start_date, end_date, "desc", tech) 
    VALUES ('${data.project_name}', '${data.start_date}', '${data.end_date}', '${data.desc}', '{"${icons.node}","${icons.python}","${icons.laravel}","${icons.js}"}');`;
    console.log(data);
    client.query(query, (err, result) => {
      if (err) throw err;
    });
    res.redirect('/');
  });

  app.get('/update/:id', (req, res) => {
    let id = req.params.id;

    let query = `SELECT * FROM tb_projects WHERE id = ${id}`;

    client.query(query, (err, result) => {
      if (err) throw err;
      let data = result.rows;
      let sd_beforeFormat = dayjs(data[0].start_date);
      let ed_beforeFormat = dayjs(data[0].end_date);

      let sd_afterFormat = sd_beforeFormat.format('YYYY-MM-DD');
      let ed_afterFormat = ed_beforeFormat.format('YYYY-MM-DD');
      let editData = data.map((items) => {
        return {
          ...items,
          sd_afterFormat,
          ed_afterFormat,
        };
      });

      console.log(editData[0]);

      res.render('edit-project', { id, data: editData[0] });
    });
  });

  app.post('/update/:id', (req, res) => {
    let id = req.params.id;
    // let dataUpdate = req.body[0];
    // let updating = dataUpdate;
    // console.log(dataUpdate);
    // console.log(updating);
    // // let iconsUpdate = {
    // //   node: dataUpdate.node,
    // //   python: dataUpdate.python,
    // //   laravel: dataUpdate.laravel,
    // //   js: dataUpdate.js,
    // // };
    // // console.log(iconsUpdate);

    // let query = `UPDATE public.tb_projects SET project_name=${updating.project_name}, start_date=${updating.start_date}, end_date=${updating.end_date}, "desc"=${updating.desc} WHERE id= ${id}`;

    // client.query(query, (err, result) => {
    //   if (err) throw err;
    // });
    res.redirect('/');
  });

  app.get('/contact', (req, res) => {
    res.render('contact');
  });

  app.get('/detail/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    let query = `SELECT * FROM tb_projects WHERE id =${id}`;
    database.query(query, (err, result) => {
      if (err) throw err;

      data = result.rows;
      // console.log(data);
      let detail = data.map((items) => {
        return {
          ...items,
          duration: getDuration(items.start_date, items.end_date),
          startDate: new Date(items.start_date),
          endDate: new Date(items.end_date),
        };
      });
      console.log(detail);
      res.render('detail', { data: detail[0] });
    });
  });

  app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    let query = `DELETE FROM tb_projects WHERE id= ${id}`;
    client.query(query, (err, result) => {
      if (err) throw err;
      res.redirect('/');
    });
  });
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
