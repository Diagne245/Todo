import { app, mainContainer, getSlideAtIndex } from '..';
import Storage from '../scripts/static';
import Button from './buttons';

class Form {
  constructor(formEl = document.getElementById('main-form')) {
    this.formEl = formEl;
    this.buttons = this.formEl.querySelector('.buttons');

    this._render();
  }

  _render() {
    this.formEl.insertAdjacentHTML(
      'afterbegin',
      `
      <input
        type="text"
        name="form-input"
        class="form-input"
        spellcheck="false"
        autocomplete="off"
        placeholder="New Entry"
        onfocus="this.placeholder=''"
        onblur="this.placeholder='New Entry'"
        />
    `
    );
    this.formInput = this.formEl.querySelector('.form-input');
  }

  // Form Add Entry Validation---------------------
  validEntry(entry, index = null) {
    // Empty input field
    if (entry === '') {
      alert('Please Enter an Item');
      return false;
    }
    // Preventing duplicates
    if (
      (index !== null &&
        Storage.getSlideItems(index).find((item) => item.text === entry)) ||
      (index === null && Storage.getItems().find((item) => item.text === entry))
    ) {
      alert('Item already in the list, Please enter a new Item');
      return false;
    }

    // Valid Entry
    return true;
  }

  // UI Methods --------------
  editMode() {
    app.isEditMode === false && this.addItemBtn.editMode();
  }

  addSelectionMode() {
    this.addItemBtn.addSelection();
  }

  reset() {
    this.blur();
    this.addItemBtn.reset();
  }

  blur() {
    this.formInput.value = '';
    this.formInput.blur();
  }
}

class MainForm extends Form {
  constructor() {
    super();
    this.render();
  }

  render() {
    this.addItemBtn = new Button(mainContainer.querySelector('.buttons'));
    this.addGroupBtn = new Button(
      mainContainer.querySelector('.buttons'),
      'submit',
      ' Add Group',
      'btn add-group-btn group-theme'
    );
  }

  // Add Group Form Validation---------------------
  validGroup(groupTitle) {
    if (groupTitle === '') {
      alert('Please Enter a Group Title');
      return false;
    }
    if (groupTitle.length > 20) {
      alert('Please Enter a Shorter Group Name, You can customize it later');
      return false;
    }
    if (
      Storage.getGroups().find(
        (group) => group.title.toLowerCase() === groupTitle.trim().toLowerCase()
      )
    ) {
      alert('Group already in the list, Please enter a new Group name');
      return false;
    }
    // group title is valid
    return true;
  }
}

// ------------------------
class SlideForm extends Form {
  constructor(index) {
    const slideForm = getSlideAtIndex(index).querySelector('.slide-form');
    super(slideForm);
    this.addItemBtn = new Button(slideForm.querySelector('.buttons'));
  }
}

export { SlideForm, MainForm };
