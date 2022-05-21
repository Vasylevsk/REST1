const API_URL = "https://5dd3d5ba8b5e080014dc4bfa.mockapi.io/users";
const DELETE_BTN_CLASS = "delete-btn";
const EDIT_BTN_CLASS = "edit-btn";
const CONTACT_ROW_SELECTOR = ".contact-row";
const STORAGE_KEY = "contactsList";

const contactForm = document.querySelector("#newContactForm");
const contactsListEl = document.querySelector("#contactsList");
const contactTemplate = document.querySelector("#contactTemplate").innerHTML;
const formInputs = document.querySelectorAll(".form-input");

contactForm.addEventListener("submit", onContactFormSubmit);
contactsListEl.addEventListener("click", onContactsListClick);

let contactsList = [];

init();

function onContactFormSubmit(e) {
  e.preventDefault();

  const contact = getFormData();

  if (isContactValid(contact)) {
    saveContact(contact);
    resetForm();
  } else {
    alert("Not valid");
  }
}

function onContactsListClick(e) {
  const id = getContactRowId(e.target);
  if (e.target.classList.contains(DELETE_BTN_CLASS)) {
    removeContact(id);
  }
  if (e.target.classList.contains(EDIT_BTN_CLASS)) {
    editContact(id);
  }
}

function init() {
  fetchContacts();
}

function fetchContacts() {
  fetch(API_URL)
    .then((res) => res.json())
    .then((data) => {
      contactsList = data;
      renderList();
    });
}

function getFormData() {
  const contact = {};

  formInputs.forEach((inp) => {
    contact[inp.name] = inp.value;
  });

  return contact;
}

function setFormData(contact) {
  formInputs.forEach((inp) => {
    inp.value = contact[inp.name];
  });
}

function isContactValid(contact) {
  return (
    isTextFieldValid(contact.name) &&
    isTextFieldValid(contact.surname) &&
    isPhoneFieldValid(contact.phone)
  );
}

function isTextFieldValid(value) {
  return value !== "";
}

function isPhoneFieldValid(value) {
  return isTextFieldValid(value) && !isNaN(value);
}

function generateContactHtml(contact) {
  return interpolate(contactTemplate, contact);
}

function saveContact(contact) {
  if (contact.id) {
    updateContact(contact);
  } else {
    addContact(contact);
  }
}

function updateContact(contact) {
  fetch(API_URL + "/" + contact.id, {
    method: "PUT",
    body: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => {
    fetchContacts();
  });
}

function addContact(contact) {
  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(contact),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((data) => {
    fetchContacts();
  });
}

function resetForm() {
  formInputs.forEach((inp) => {
    inp.value = "";
  });
}

function getContactRowId(el) {
  return el.closest(CONTACT_ROW_SELECTOR).dataset.id;
}

function interpolate(template, obj) {
  for (key in obj) {
    template = template.replaceAll(`{{${key}}}`, obj[key]);
    if (typeof obj[key] === "object") {
      template = interpolate(template, obj[key]);
    }
  }
  return template;
}

function renderList() {
  contactsListEl.innerHTML = contactsList.map(generateContactHtml).join("\n");
}

function removeContact(contactId) {
  fetch(API_URL + "/" + contactId, {
    method: "DELETE",
  }).then((data) => {
    console.log(contactId);
    console.log(data);
    fetchContacts();
  });
}

function editContact(id) {
  const contact = contactsList.find((contact) => contact.id === id);
  currentId = id;
  setFormData(contact);
}
