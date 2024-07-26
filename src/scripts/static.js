import { Item, Group } from './Item';

class Storage {
  // Landing Text----------------
  static getLandingText(index = null) {
    if (index === null) {
      return localStorage.getItem('mainFocus')
        ? localStorage.getItem('mainFocus')
        : 'Your Motivation Text Here';
    } else {
      return this.getCurrentGroup().slides[index].landingText;
    }
  }
  static setLandingText(newText, index = null) {
    if (index === null) {
      localStorage.setItem('mainFocus', newText.trim());
    } else {
      const groups = this.getGroups();
      const group = groups.find(
        (group) => group.title === this.getCurrentGroupTitle()
      );
      group.slides[index].landingText = newText.trim();

      localStorage.setItem('groups', JSON.stringify(groups));
    }
  }

  // @Main Items Methods----------------------
  static addItem(entry) {
    let items = this.getItems();
    items.push(new Item(entry));
    localStorage.setItem('mainStore', JSON.stringify(items));
  }

  static getItems() {
    let items = [];
    localStorage.getItem('mainStore') === null
      ? localStorage.setItem('mainStore', JSON.stringify(items))
      : (items = JSON.parse(localStorage.getItem('mainStore')));

    return items;
  }

  static deleteItem(entryToDelete) {
    let items = this.getItems();

    const itemToDelete = items.find((item) => item.text === entryToDelete);
    items.splice(items.indexOf(itemToDelete), 1);

    localStorage.setItem('mainStore', JSON.stringify(items));
  }

  static updateItem(oldEntry, newEntry, index = null) {
    if (index === null) {
      const items = this.getItems();
      const itemToUpdate = items.find((item) => item.text === oldEntry);
      items.splice(items.indexOf(itemToUpdate), 1, new Item(newEntry));
      localStorage.setItem('mainStore', JSON.stringify(items));
    } else {
      const groups = this.getGroups();
      const group = groups.find(
        (group) => group.title === this.getCurrentGroupTitle()
      );
      const items = group.slides[index].slideItems;
      const itemToUpdate = items.find((item) => item.text === oldEntry);

      items.splice(items.indexOf(itemToUpdate), 1, new Item(newEntry));

      localStorage.setItem('groups', JSON.stringify(groups));
    }
  }

  static clearMainStore() {
    localStorage.setItem('mainStore', JSON.stringify([]));
  }

  // @Groups Methods----------------------
  static onGroupPage() {
    return localStorage.getItem('current-group') ? true : false;
  }

  static setCurrentGroup(groupTitle) {
    localStorage.setItem('current-group', groupTitle);
  }
  static getCurrentGroupTitle() {
    return localStorage.getItem('current-group');
  }
  static clearCurrentGroup() {
    localStorage.removeItem('current-group');
  }

  // ---------------------
  static addGroup(title) {
    const formatTitle =
      title.trim().charAt(0).toUpperCase() + title.trim().substring(1);
    const groups = this.getGroups();
    groups.push(new Group(formatTitle));
    localStorage.setItem('groups', JSON.stringify(groups));
  }

  static getGroups() {
    if (!localStorage.getItem('groups')) {
      localStorage.setItem('groups', JSON.stringify([]));
      return [];
    } else {
      return JSON.parse(localStorage.getItem('groups'));
    }
  }
  static getCurrentGroup() {
    return this.getGroups().find(
      (group) => group.title === this.getCurrentGroupTitle()
    );
  }

  static removeGroup() {
    const groups = this.getGroups();
    const group = groups.find(
      (group) => group.title === this.getCurrentGroupTitle()
    );
    groups.splice(groups.indexOf(group), 1);

    localStorage.setItem('groups', JSON.stringify(groups));
  }

  // Slides Methods-------------------
  static addItemToSlide(entry, index) {
    const groups = this.getGroups();

    const group = groups.find(
      (group) => group.title === this.getCurrentGroupTitle()
    );
    group.slides[index].slideItems.push(new Item(entry));

    localStorage.setItem('groups', JSON.stringify(groups));
  }

  static getGroupByTitle(groupTitle) {
    return this.getGroups().find((group) => group.title === groupTitle);
  }
  static removeSlideItem(
    entryToDelete,
    index,
    groupToDeleteFrom = this.getCurrentGroupTitle()
  ) {
    const groups = this.getGroups();
    const group = groups.find((group) => group.title === groupToDeleteFrom);
    const items = group.slides[index].slideItems;
    const itemToDelete = items.find((item) => item.text === entryToDelete);
    items.splice(items.indexOf(itemToDelete), 1);

    localStorage.setItem('groups', JSON.stringify(groups));
  }

  static getSlideItems(index, groupTitle = this.getCurrentGroupTitle()) {
    const groups = this.getGroups();
    const group = groups.find((group) => group.title === groupTitle);
    return group.slides[index].slideItems;
  }

  static clearSlideItems(index) {
    const groups = this.getGroups();
    const group = groups.find(
      (group) => group.title === this.getCurrentGroupTitle()
    );
    group.slides[index].slideItems = [];

    localStorage.setItem('groups', JSON.stringify(groups));
  }
  static addNewSlide(index) {
    const groups = this.getGroups();
    const group = groups.find(
      (group) => group.title === this.getCurrentGroupTitle()
    );
    group.slides.splice(index, 0, {
      landingText: 'New Slide',
      slideItems: [],
    });

    localStorage.setItem('groups', JSON.stringify(groups));
  }

  static removeSlide(index) {
    const groups = this.getGroups();
    const group = groups.find(
      (group) => group.title === this.getCurrentGroupTitle()
    );

    group.slides.splice(index, 1);
    localStorage.setItem('groups', JSON.stringify(groups));
  }

  // Selecting Items ------------------------
  static getSelectedItems() {
    if (!sessionStorage.getItem('selected')) {
      return [];
    } else return JSON.parse(sessionStorage.getItem('selected'));
  }

  static selectItem(entry) {
    const selectedItems = this.getSelectedItems();
    selectedItems.push(entry);
    sessionStorage.setItem('selected', JSON.stringify(selectedItems));
  }

  static removeFromSelection(entry) {
    const selectedItems = this.getSelectedItems();
    selectedItems.splice(selectedItems.indexOf(entry), 1);
    sessionStorage.setItem('selected', JSON.stringify(selectedItems));
  }

  static deleteSelectedItems(index = null, groupToDeleteFrom = null) {
    if (index === null) {
      for (let entry of this.getSelectedItems()) {
        this.deleteItem(entry); //deleting from Home Page
      }
    } else {
      for (let entry of this.getSelectedItems()) {
        this.removeSlideItem(entry, index, groupToDeleteFrom); //deleting from slide
      }
    }
    this.clearSelected();
  }

  static addSelection(srcIndex, destIndex = null) {
    destIndex === null
      ? // Adding to Home Page
        this.getSelectedItems().forEach((entry) => {
          this.addItem(entry);
        })
      : // adding to slide
        this.getSelectedItems().forEach((entry) => {
          this.addItemToSlide(entry, destIndex);
        });
  }

  static clearSelected() {
    sessionStorage.removeItem('selected');
  }
}

// ---------------------------------------
export default Storage;
