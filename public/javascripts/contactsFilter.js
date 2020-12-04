const ContactFilter = {
  // constructor() {
  //   super();
  // }

  updateCurrentTagFilters(tag) {
    this.tagFilters ||= [];
    if (!this.tagFilters.includes(tag)) {
      this.tagFilters.push(tag);
      console.log(tag);
    }
    this.displayTagFilters();
  },

  resetFilters() {
    $("#contacts-list .contact").each(function (_index, contact) {
      let $contact = $(contact);
      $contact.css("display", "");
    });

    this.tagFilters.forEach((tag) => {
      this.filterByTag(tag);
    });
  },

  filterByTag(tagName) {
    this.updateCurrentTagFilters(tagName);
    $("#contacts-list .contact").each(function (_index, contact) {
      let $contact = $(contact);
      if (
        [...$contact.find("a")].some((c) => $(c).text().trim() === tagName) &&
        $contact.css("display") !== "none"
      ) {
        $contact.css("display", "");
      } else {
        $contact.css("display", "none");
      }
    });
  },

  filterContactsByQuery(event) {
    let $target = $(event.target);

    if (this.tagFilters) {
      this.resetFilters();
    }

    $("#contacts-list .contact").each(function (_index, contact) {
      let $contact = $(contact);

      if (
        ($contact
          .find("h2")
          .text()
          .toUpperCase()
          .includes($target.val().toUpperCase()) ||
          $target.val() === "") &&
        ($contact.css("display") !== "none" || this.tagFilters)
      ) {
        $contact.css("display", "");
      } else {
        $contact.css("display", "none");
      }
    });
  },
}
