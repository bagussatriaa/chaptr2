function submitContact() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let phone = document.getElementById('phone').value;
  let subject = document.getElementById('subject').value;
  let message = document.getElementById('message').value;

  if (name == '') {
    return alert('Name must be filled');
  } else if (email == '') {
    return alert('Email must be filled in');
  } else if (phone == '') {
    return alert(`Your phone number can't be empty`);
  } else if (message == '') {
    return alert('Your messages have to be filled in');
  }

  const emailReceiver = 'admin@mail.com';
  const anchor = document.createElement('a');

  anchor.href = `mailto:${emailReceiver}?subject=${subject}&body=Hello my name  ${name}.  ${message}. Give me a call, ${phone}`;
  anchor.click();
}
