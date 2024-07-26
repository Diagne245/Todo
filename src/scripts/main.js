import Storage from './static';
import { MainForm } from '../components/form';
import { GroupList, ItemList } from '../components/listItems';
import Filter from '../components/filter';
import Button from '../components/buttons';
import { app, mainContainer } from '..';
import Focus from '../components/focus';

// ------------------
class Main {
  constructor() {
    this.editModeHandler = this.editItem.bind(this);
    this.render();
  }

  // ---------
  _mainBaseHTML() {
    mainContainer.innerHTML = `
      <section id="main-section">
        <form id="main-form" class="main-form">
          <div class="buttons"></div>
        </form>
        <div class="main-line line"></div>
        <ul id="groups"></ul>
        <div id="filter" class="filter"></div>
        <ul class="items"></ul>
        <div class="clear"></div>
        </section>
      <aside id="focus"></aside>
    `;

    this.mainSection = mainContainer.querySelector('#main-section');
    this.mainLine = this.mainSection.querySelector('.main-line');
  }

  render() {
    this._mainBaseHTML();
    this.form = new MainForm();
    this.groupList = new GroupList();

    this.filter = new Filter();
    this.itemList = new ItemList();
    // ---------------------------
    this.clearAllBtn = new Button(
      this.mainSection.querySelector('.clear'),
      'button',
      ' Clear All',
      'btn btn-clear',
      'fa-solid fa-trash-can'
    );
    new Focus();

    this._addEventListeners();
  }

  _addEventListeners() {
    this.form.formEl.addEventListener('submit', this.onSubmitEvent.bind(this));
    this.itemList.items.addEventListener('click', this.editModeHandler);
    this.itemList.items.addEventListener('click', this.deleteItem.bind(this));
    this.filter.filterInput.addEventListener(
      'input',
      this.itemList.filterItems.bind(this.itemList)
    );
    this.clearAllBtn.button.addEventListener('click', this.clearAll.bind(this));
  }

  // reset main leaving select mode active
  resetMain() {
    app.isEditMode = false;
    this.form.reset();
    this.itemList.render();
    this.filter.hide();
    this.clearAllBtn.hide();
  }

  // UI State--------
  editModeUI() {
    this.form.editMode();
    this.showUIElements();
  }

  selectModeUI() {
    this.form.addItemBtn.hide();
    this.itemList.toggleEditMode();
    this.showUIElements();
    this.clearAllBtn.removeSelection();
  }

  // Adding & Updating of entries --------------------
  onSubmitEvent(e) {
    e.preventDefault();

    if (app.isSelectMode) {
      this.addSelection();
      return;
    }

    const formInput = this.form.formInput;
    e.submitter === this.form.addItemBtn.button &&
      this.form.validEntry(formInput.value) &&
      (app.isEditMode ? this.updateItem() : this.addItem(formInput.value));

    e.submitter === this.form.addGroupBtn.button &&
      this.form.validGroup(formInput.value) &&
      this.addGroup(formInput.value);

    this.form.blur();
  }

  addItem(newEntry) {
    Storage.addItem(newEntry);
    this.itemList.render();
  }

  updateItem() {
    const formInput = this.form.formInput;
    const liToUpdate = this.itemList.items.querySelector('.edit-mode');
    Storage.updateItem(liToUpdate.innerText, formInput.value);
    this.form.reset();
    this.itemList.render();
  }

  addGroup(title) {
    Storage.addGroup(title);
    this.groupList.render();
  }

  addSelection() {
    Storage.addSelection(app.selectionSrc);
    Storage.deleteSelectedItems(app.selectionSrc, app.srcGroup);
    this.itemList.exitSelectMode();
  }

  // Edit Mode ------------------------
  editItem(e) {
    if (e.target.parentElement.classList.contains('items')) {
      setTimeout(() => {
        if (!app.isSelectMode) {
          const li = e.target;

          // item already in edit mode
          if (li.classList.contains('edit-mode')) {
            this.exitEditMode();
            return;
          }

          const formInput = this.form.formInput;
          this.editModeUI();

          // switching to another item while in edit mode
          app.isEditMode && this.itemList.toggleEditMode();

          // ------
          formInput.value = li.innerText;
          formInput.focus();
          li.classList.add('edit-mode');
          app.isEditMode = true;
        }
      }, 200);
    }
  }

  exitEditMode(index = null) {
    this.form.reset();
    this.itemList.toggleEditMode();
    app.isEditMode = false;
  }

  // Items Removal----------------------
  deleteItem(e) {
    e.stopImmediatePropagation();

    if (e.target.closest('.item-btn')) {
      const li = e.target.closest('.item-btn').parentElement;

      // let delete-mode classes take effect
      setTimeout(() => {
        if (confirm('Are You Sure?')) {
          Storage.deleteItem(li.innerText);
          this.form.reset();
          this.itemList.render();

          Storage.getItems().length === 0 && this.hideUIElements();
        }
      }, 200);
    }
  }

  // ---------
  hideUIElements() {
    this.mainLine.style.display = 'block';
    this.filter.hide();
    this.clearAllBtn.hide();
  }

  showUIElements() {
    this.mainLine.style.display = 'none';
    this.filter.show();
    this.clearAllBtn.show();
  }

  clearAll(e) {
    e.stopImmediatePropagation();
    if (confirm('Are You Sure?')) {
      if (app.isSelectMode) {
        Storage.deleteSelectedItems();
        this.itemList.exitSelectMode();
        return;
      }
      // Regular items clearing
      Storage.clearMainStore();
      this.itemList.clear();
    }
  }
}

export default Main;
