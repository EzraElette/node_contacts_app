class Tag {
  displayTagFilters() {
    let tags = {
      tags: this.tagFilters.map((name) => {
        return { tag_name: name };
      }),
    };
    $("header .tags-filter").html(this.templates["tags"](tags));
  }

  removeTag($deleteLink) {
    let tagName = $deleteLink
      .closest(".tag")[0]
      .innerText.trim()
      .replace(/X$/i, "")
      .trim();
    if ($deleteLink.closest("header").length === 1) {
      this.tagFilters.splice(
        this.tagFilters.findIndex((tag) => tag === tagName),
        1
      );
      this.resetFilters();
    }
    $deleteLink.closest(".tag").remove();
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
}
