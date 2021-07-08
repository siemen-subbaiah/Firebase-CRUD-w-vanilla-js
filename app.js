const contactsList = document.querySelector('#contact-list');
const form = document.querySelector('#add-contact-form');

let editFlag = false;
let editId = '';

// INITIAL DATA FETCH!
const getContacts = async () => {
  db.collection('contacts')
    .orderBy('name')
    .onSnapshot((snapshot) => {
      const contacts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      showContacts(contacts);
    });
};

window.addEventListener('load', getContacts);

// GET DATA (READ)!
const showContacts = (contacts) => {
  const html = contacts
    .map((contact) => {
      return `
        <li>
            <span>${contact.name}</span>
            <span>${contact.number}</span>
            <i class="far fa-edit edit" id=${contact.id} onclick="editContacts(this.id)"></i>
            <div className="delete" id=${contact.id} onclick="deleteContacts(this.id)">X</div>
        </li>
      `;
    })
    .join('');
  contactsList.innerHTML = html;
};

// SAVE DATA (CREATE)!
form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (form.name.value && form.number.value && !editFlag) {
    db.collection('contacts').add({
      name: form.name.value,
      number: form.number.value,
    });
  } else if (form.name.value && form.number.value && editFlag) {
    db.collection('contacts').doc(editId).update({
      name: form.name.value,
      number: form.number.value,
    });
  } else {
    alert('please enter!');
  }
  form.reset();
});

// DELETE DATA (DELETE)!
function deleteContacts(id) {
  db.collection('contacts').doc(id).delete();
}

// UPDATE DATA! (UPDATE)
async function editContacts(id) {
  const snapshot = await db.collection('contacts').doc(id).get();
  const data = snapshot.data();
  form.name.value = data.name;
  form.number.value = data.number;
  editFlag = true;
  editId = id;
}
