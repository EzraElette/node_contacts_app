class App extends ContactsFilter {
  constructor() {
    super();
    this.displayContacts();
  }

  displayContacts() {
    let contacts = this.fetchContacts();
    this.configureTags(contacts);
    $("main").html(this.templates["contacts"]({ contacts }));
  }

  displayAddContactForm() {
    $("header div.add").html(this.templates["addContact"]());
  }

  displayNewContact(contact) {
    this.configureTags([contact]);
    $("main").append(this.templates["contact"](contact));
  }

  displayUpdatedContact(contact) {
    let $li = $(`li[data-id=${contact.id}]`);

    this.configureTags([contact]);

    $li.replaceWith(this.templates["contact"](contact));
  }

  displayUpdateForm(event) {
    let id = $(event.target).parent("li").data("id");
    let contact = this.getContact(id);

    this.configureTags([contact]);

    let form = this.templates["updateContact"](contact);
    $(event.target).parent("li").append(form);
  }

  displayDeleteContactModal(event) {
    let id = $(event.target).parent("li").data("id");

    $("body").append(this.templates["deleteModal"]({ id }));
  }

  removeUpdateForm($target) {
    $target.closest("form").remove();
  }

  get headerAddHTML() {
    return '<button id="add-contact">Add Contact</button>';
  }

  resetHeader() {
    $("header div.add").html(this.headerAddHTML);
  }
}

$(() => new App());
