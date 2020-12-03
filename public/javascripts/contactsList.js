class ContactsList extends Contact {
  constructor() {
    super();
    this.registerTemplates();
    this.bindEventHandlers();
  }

  registerTemplates() {
    this.templates ||= {};

    $('script[type="text/x-handlebars"]').each(
      function (_index, template) {
        let $template = $(template);
        switch ($template.data("template")) {
          case "partial":
            Handlebars.registerPartial($template.attr("id"), $template.html());
          default:
            this.templates[$template.attr("id")] = Handlebars.compile(
              $template.html()
            );
        }
      }.bind(this)
    );
  }

  fetchContacts() {
    let contacts;
    ContactsAPI.fetchContacts().done((res) => (contacts = res));
    return contacts;
  }

  bindEventHandlers() {
    $(document).click(this.clickHandlers.bind(this));
    $(document).submit(this.submitHandlers.bind(this));
    $("#search").keyup(this.filterContactsByQuery.bind(this));
  }

  submitHandlers(event) {
    let $form = $(event.target);

    switch (true) {
      case $form.hasClass("update-contact"):
        event.preventDefault();
        this.updateContact.call(this, event);
        break;
      case $form.hasClass("add-contact"):
        event.preventDefault();
        this.createContact.call(this, event);
        this.resetHeader.call(this);
        break;
    }
  }

  clickHandlers(event) {
    switch (true) {
      case event.target.tagName === "BUTTON":
        this.buttonHandlers.call(this, event);
        break;
      case event.target.tagName === "A":
        this.linkHandlers.call(this, event);
        break;
      case event.target.classList.contains("delete-modal"):
        this.clearDeleteContactModal();
        break;
    }
  }

  buttonHandlers(event) {
    let $target = $(event.target);
    switch (true) {
      case $target.hasClass("update-contact"):
        this.displayUpdateForm.call(this, event);
        break;
      case $target.hasClass("add-tag"):
        event.preventDefault();
        this.addTag.call(this, $target.closest("form"));
        break;
      case $target.hasClass("delete-contact"):
        this.displayDeleteContactModal.call(this, event);
        break;
      case $target.hasClass("confirm-delete-contact"):
        this.deleteContact.call(this, event);
        break;
      case $target.hasClass("cancel-delete-contact"):
        this.clearDeleteContactModal.call(this);
        break;
      case $target.attr("id") === "add-contact":
        this.displayAddContactForm.call(this);
        break;
      case $target.attr("id") === "cancel-create-contact":
        event.preventDefault();
        this.resetHeader.call(this);
        break;
      case $target.hasClass("cancel-update-contact"):
        event.preventDefault();
        this.removeUpdateForm.call(this, $target);
        break;
    }
  }

  linkHandlers(event) {
    let $target = $(event.target);
    event.preventDefault();
    switch (true) {
      case $target.hasClass("tag-delete"):
        this.removeTag.call(this, $target);
        break;
      case $target.hasClass("tag-name"):
        if (
          this.tagFilters &&
          this.tagFilters.includes($target.text().trim())
        )
          return;
        this.filterByTag.call(this, $target.text().trim());
        break;
    }
  }

  getContact(id) {
    let contact;
    ContactsAPI.getContact(id).done((res) => (contact = res));

    return contact;
  }
}
