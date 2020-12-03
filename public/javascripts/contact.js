class Contact extends Tag {
  constructor() {
    super();
  }

  updateContact(event) {
    let $form = $(event.target);
    let contact = this.createContactFromForm($form);

    ContactsAPI.updateContact($form.data("id"), contact)
                .done(this.displayUpdatedContact.bind(this)
    );
  }

  clearDeleteContactModal() {
    $(".delete-modal").remove();
  }

  removeContactFromDOM(id) {
    $(`li[data-id=${id}]`).remove();
  }

  createContact(event) {
    let contact = this.createContactFromForm($(event.target));

    ContactsAPI.createContact(contact).done(this.displayNewContact.bind(this));
  }

  createContactFromForm($form) {
    let contact = {
      full_name: $form.find("input#full-name").val(),
      email: $form.find("input#email").val(),
      phone_number: $form.find("input#phone-number").val(),
      tags: "",
    };
    contact.tags = [
      ...new Set(
        [...$form.find(".tags .tag")].map(function (tag) {
          return tag.innerText;
        })
      ),
    ].join(",");

    if ($form.hasClass("update-contact")) {
      contact.id = +$form.data("id");
    }

    if (!contact.tags) contact.tags = null;

    return contact;
  }

  deleteContact(event) {
    let deleteID = $(event.target).data("id");

    ContactsAPI.deleteContact(deleteID).done(
      [
        this.clearDeleteContactModal.call(this),
        this.removeContactFromDOM.call(this, deleteID)
      ]
    );
  }
}
