class ContactsList {
  constructor() {
    super();
    this.registerTemplates();
    this.contacts = this.fetchContacts();
    this.configureTags(this.contacts);
    this.displayContacts();
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

  configureTags(contacts) {
    $.each(contacts, function (_index, contact) {
      while (!contact.tags) {
        contact.tags = null;
        return;
      }

      while (typeof contact.tags === "string") {
        contact.tags = contact.tags.split(",").map(function (tag) {
          return { tag_name: tag };
        });
      }
    });
  }

  displayContacts() {
    $("main").html(this.templates["contacts"]({ contacts: this.contacts }));
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
      case $target.hasClass("cancel-update-contact"):
        event.preventDefault();
        this.removeUpdateForm.call(this, $target);
        break;
    }
  }

  removeUpdateForm($target) {
    $target.closest("form").remove();
  }

  resetHeader() {
    $("header div.add").html('<button id="add-contact">Add Contact</button>');
  }

  linkHandlers(event) {
    let $target = $(event.target);
    switch (true) {
      case $target.hasClass("tag-delete"):
        this.removeTag.call(this, $target);
        break;
      case $target.hasClass("tag-name"):
        event.preventDefault();
        if (
          this.tagFilters &&
          this.tagFilters.includes($target.data("tagname"))
        )
          return;
        this.filterByTag.call(this, $target.data("tagname"));
        break;
    }
  }

  updateContact(event) {
    let $form = $(event.target);
    let contact = this.createContactFromForm($form);

    ContactsAPI.updateContact($form.data("id"), contact).done(
      this.displayUpdatedContact.bind(this)
    );
  }

  displayUpdateForm(event) {
    let id = $(event.target).parent("li").data("id");
    let contact = this.getContact(id);

    this.configureTags([contact]);

    let form = this.templates["updateContact"](contact);
    $(event.target).parent("li").append(form);
  }

  getContact(id) {
    let contact;

    ContactsAPI.getContact(id).done((res) => (contact = res));

    return contact;
  }

  removeTag($deleteLink) {
    let tagName = $deleteLink.closest(".tag")[0].innerText.split(" ")[0];

    if ($deleteLink.closest("header").length === 1) {
      this.tagFilters.splice(
        this.tagFilters.findIndex((tag) => tag === tagName),
        1
      );
      this.resetFilters();
      this.tagFilters.forEach((tag) => {
        this.filterByTag(tag);
      });
    }
    $deleteLink.closest(".tag").remove();
  }

  resetFilters() {
    $("#contacts-list .contact").each(function (_index, contact) {
      let $contact = $(contact);
      $contact.css("display", "");
    });
  }

  addTag($form) {
    let $tag = $form.find(".tag-name-input");
    let tagName = $tag.val();

    while (!tagName) {
      return;
    }

    $($form)
      .find(".tags")
      .append(this.templates["tag"]({ tag_name: tagName }));
    $tag.val("");
  }

  displayAddContactForm() {
    $("header div.add").html(this.templates["addContact"]());
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

  displayUpdatedContact(contact) {
    let $li = $(`li[data-id=${contact.id}]`);

    this.configureTags([contact]);

    $li.replaceWith(this.templates["contact"](contact));
  }

  displayDeleteContactModal(event) {
    let id = $(event.target).parent("li").data("id");

    $("body").append(this.templates["deleteModal"]({ id }));
  }

  deleteContact(event) {
    let deleteID = $(event.target).data("id");

    ContactsAPI.deleteContact(deleteID).done([
      this.clearDeleteContactModal.bind(this),
      this.removeContactFromDOM.bind(this, deleteID),
    ]);
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

  displayNewContact(contact) {
    this.configureTags([contact]);
    $("main").append(this.templates["contact"](contact));
  }

  updateCurrentTagFilters(tag) {
    this.tagFilters ||= [];
    if (!this.tagFilters.includes(tag)) {
      this.tagFilters.push(tag);
    }
    this.displayTagFilters();
  }

  displayTagFilters() {
    let tags = {
      tags: this.tagFilters.map((name) => {
        return { tag_name: name };
      }),
    };
    $("header .tags-filter").html(this.templates["tags"](tags));
  }

  filterByTag(tagName) {
    this.updateCurrentTagFilters(tagName);
    $("#contacts-list .contact").each(function (_index, contact) {
      let $contact = $(contact);
      if (
        [...$contact.find("a")].some((c) => $(c).data("tagname") === tagName) &&
        $contact.css("display") !== "none"
      ) {
        $contact.css("display", "");
      } else {
        $contact.css("display", "none");
      }
    });
  }

  filterContactsByQuery(event) {
    let $target = $(event.target);

    $("#contacts-list .contact").each(function (_index, contact) {
      let $contact = $(contact);
      if (
        $contact
          .find("h2")
          .text()
          .toUpperCase()
          .includes($target.val().toUpperCase()) ||
        $target.val() === ""
      ) {
        $contact.css("display", "");
      } else {
        $contact.css("display", "none");
      }
    });
  }
}

$(function () {
  return new ContactsList();
});
