class ContactsAPI {
  static fetchContacts() {
    return $.ajax({
      type: "GET",
      url: "/api/contacts",
      async: false,
    });
  }

  static createContact(contact) {
    return $.ajax({
      type: "POST",
      url: "/api/contacts",
      data: contact,
      async: false,
    });
  }

  static deleteContact(id) {
    return $.ajax({
      type: "DELETE",
      url: `/api/contacts/${id}`,
    });
  }

  static getContact(id) {
    return $.ajax({
      async: false,
      type: "GET",
      url: `/api/contacts/${id}`,
    });
  }

  static updateContact(id, newContact) {
    return $.ajax({
      type: "PUT",
      url: `/api/contacts/${id}`,
      data: newContact,
    });
  }
}