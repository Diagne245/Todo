import Storage from '../scripts/static';
import { app, horizontalSwipe, groupContainer } from '..';

import { HomeIcon, AddSlideIcon, RemoveSlideIcon } from './icons';
import SlideTitle from './slideTitle';
import { SlideForm } from './form';
import Filter from './filter';
import { ItemList, ListItem } from './listItems';
import Button from './buttons';

class Slide {
  constructor(index) {
    this.slideEl = document.createElement('div');
    this.slideEl.dataset.index = index;
    this.slideEl.classList.add('slide');
    this.index = index;

    this.addActiveClassHandler = this.addActiveSlideClass.bind(this);

    this.editModeHandler = this.editItem.bind(this);
    this.render();
  }

  // -----------------
  _slideBaseHTML() {
    this.slideEl.innerHTML = `
      <div class="home-btn"></div>
      <div class="delete-btn"></div>
      <div class="title-wrapper"></div>
      <form class="slide-form">
        <div class="buttons"></div>
      </form>
      <div class="slide-filter filter"></div>
      <ul class="items"></ul>
      <div class="clear"></div> 
      <div class="add-slide"></div>
    `;
    groupContainer.appendChild(this.slideEl);
  }

  render() {
    this._slideBaseHTML();
    // -------------
    this.homeIcon = new HomeIcon(this.index);
    this.removeSlideIcon = new RemoveSlideIcon(this.index);
    this.slideTitle = new SlideTitle(this.index);
    this.slideForm = new SlideForm(this.index);
    this.slideFilter = new Filter(this.index);
    this.slideItemList = new ItemList(this.index);
    // -------------
    this.slideClearBtn = new Button(
      this.slideEl.querySelector('.clear'),
      'button',
      ' Clear All',
      'btn btn-clear',
      'fa-solid fa-trash-can'
    );
    // -----------
    this.addSlideIcon = new AddSlideIcon(this.index);
    // -------------
    groupContainer.appendChild(this.slideEl);

    this._addEventListeners();
  }

  _addEventListeners() {
    this.slideEl.addEventListener('click', this.addActiveClassHandler);
    this.homeIcon.homeBtn.addEventListener('click', this.backToMain.bind(this));
    this.removeSlideIcon.deleteBtn.addEventListener(
      'click',
      this.removeSlide.bind(this)
    );
    this.slideTitle.titleForm.addEventListener(
      'submit',
      this.setLandingText.bind(this)
    );
    this.slideForm.formEl.addEventListener('submit', this.addEntry.bind(this));
    this.slideFilter.filterInput.addEventListener(
      'input',
      this.slideItemList.filterItems.bind(this.slideItemList)
    );
    this.slideItemList.items.addEventListener('click', this.editModeHandler);
    this.slideItemList.items.addEventListener(
      'click',
      this.deleteItem.bind(this)
    );
    this.slideClearBtn.button.addEventListener(
      'click',
      this.clearAll.bind(this)
    );
    this.addSlideIcon.addSlideBtn.addEventListener(
      'click',
      this.addNewSlide.bind(this)
    );
  }

  // Methods --------------
  reset() {
    this.slideForm.reset();
    this.slideItemList.render();
    this.hideUIElements();
    this.hideFilter();
  }

  // ---------
  hideUIElements() {
    this.homeIcon.hide();
    this.removeSlideIcon.hide();
  }

  showUIElements() {
    this.homeIcon.show();
    this.removeSlideIcon.show();
  }

  showFilter() {
    this.slideFilter.show();
    this.slideClearBtn.show();
  }
  hideFilter() {
    this.slideFilter.hide();
    this.slideClearBtn.hide();
  }

  // Updating slides UI state
  updateUI() {
    let activeSlide = app.slides.find((slide) =>
      slide.slideEl.classList.contains('active-slide')
    );
    activeSlide.showUIElements();
    Storage.getSlideItems(activeSlide.index).length !== 0
      ? activeSlide.showFilter()
      : activeSlide.hideFilter();

    let inactiveSlides = app.slides.filter(
      (slide) =>
        slide.index !== activeSlide.index && slide.index !== app.selectionSrc
    );
    for (const slide of inactiveSlides) {
      slide.reset();
    }
    horizontalSwipe.slideTo(1, 0, false);
  }

  //  --------------
  backToMain() {
    Storage.clearCurrentGroup();
    horizontalSwipe.slidePrev();

    // When selection src is Main
    app.isSelectMode && app.srcGroup === null && app.main.selectModeUI();
  }

  // ---------------
  editItem(e) {
    if (e.target.parentElement.classList.contains('items')) {
      if (!app.isSelectMode) {
        const li = e.target;

        // item already in edit mode
        if (li.classList.contains('edit-mode')) {
          this.exitEditMode();
          return;
        }

        // Setting current slide as active
        this.addActiveSlideClass(e);
        this.editModeUI();

        // switching to another item while in edit mode
        app.isEditMode && this.slideItemList.toggleEditMode();

        // ------
        this.slideForm.formInput.value = li.innerText;
        this.slideForm.formInput.focus();
        li.classList.add('edit-mode');
        app.isEditMode = true;
      }
    }
  }

  editModeUI() {
    this.slideForm.editMode();
  }

  exitEditMode() {
    this.slideForm.reset();
    this.slideItemList.toggleEditMode();
    app.isEditMode = false;
  }

  // ----------------------
  selectModeUI() {
    for (const slide of app.slides.filter(
      (slide) => slide.index !== this.index
    )) {
      slide.slideForm.addSelectionMode();
    }

    // Src Slide State ---------
    this.slideForm.addItemBtn.hide();
    this.slideItemList.toggleEditMode();
    this.slideFilter.show();
    this.slideClearBtn.removeSelection();
  }

  // ----------------
  addActiveSlideClass(e) {
    if (
      !e.target.closest('.home-btn') &&
      !e.target.closest('.delete-btn') &&
      !e.target.closest('.add-slide') &&
      app.isSelectMode === false
    ) {
      this.removeActiveSlideClass();
      this.slideEl.classList.add('active-slide');
      this.updateUI();
    }
  }

  removeActiveSlideClass() {
    let activeSlide = app.slides.find((slide) =>
      slide.slideEl.classList.contains('active-slide')
    );
    if (activeSlide) {
      activeSlide.slideEl.classList.remove('active-slide');
    }
  }

  // ------------------
  addSelectionMode() {
    this.slideForm.addSelectMode();
  }

  setLandingText(e) {
    e.preventDefault();

    const titleInput = this.slideTitle.titleInput;
    const slideTitle = this.slideTitle.slideTitle;
    Storage.setLandingText(titleInput.value, this.index);

    titleInput.style.display = 'none';
    slideTitle.style.display = 'block';

    slideTitle.innerText = Storage.getLandingText(this.index);
  }

  // -----------------
  addEntry(e) {
    e.preventDefault();

    if (app.isSelectMode) {
      this.addSelection();
      horizontalSwipe.slideTo(1, 0, false);
      return;
    }
    const formInput = this.slideForm.formInput;
    if (this.slideForm.validEntry(formInput.value, this.index)) {
      app.isEditMode ? this.updateItem() : this.addItem(formInput.value);
      horizontalSwipe.slideTo(1, 0, false);
    }
  }
  addItem(newEntry) {
    Storage.addItemToSlide(newEntry, this.index);
    this.slideItemList.items.appendChild(new ListItem(newEntry));
    this.slideForm.blur();
  }
  updateItem() {
    const formInput = this.slideForm.formInput;
    const liToUpdate = this.slideItemList.items.querySelector('.edit-mode');

    Storage.updateItem(liToUpdate.innerText, formInput.value, this.index);

    this.slideForm.reset();
    this.slideItemList.render();
  }
  addSelection() {
    Storage.addSelection(app.selectionSrc, this.index);
    Storage.deleteSelectedItems(app.selectionSrc, app.srcGroup);
    this.slideItemList.exitSelectMode();
  }

  // ------------------
  deleteItem(e) {
    e.stopImmediatePropagation();

    if (e.target.closest('.item-btn')) {
      const li = e.target.closest('.item-btn').parentElement;

      // let delete-mode classes take effect
      setTimeout(() => {
        if (confirm('Are You Sure?')) {
          Storage.removeSlideItem(li.innerText, this.index);
          this.slideForm.reset();
          this.slideItemList.render();

          Storage.getSlideItems(this.index).length === 0 && this.hideFilter();
        }
      }, 200);
    }
  }

  // ---------------
  clearAll(e) {
    e.stopImmediatePropagation();
    if (confirm('Are You Sure?')) {
      if (app.isSelectMode) {
        Storage.deleteSelectedItems(this.index, app.srcGroup);
        this.slideItemList.exitSelectMode();
        return;
      }

      // Regular items clearing
      Storage.clearSlideItems(this.index);
      this.slideItemList.clear();
    }
  }

  // -------------------
  addNewSlide() {
    Storage.addNewSlide(this.index + 1);
    app.displaySlides();
    horizontalSwipe.slideTo(1, 0, false);
  }

  // -----------------
  removeSlide() {
    if (confirm('Are You Sure?')) {
      if (Storage.getCurrentGroup().slides.length === 1) {
        this.deleteGroup();
      } else {
        Storage.removeSlide(this.index);
        app.displaySlides();
      }
    }
  }
  deleteGroup() {
    Storage.removeGroup();
    Storage.clearCurrentGroup();
    app.main.groupList.render();
    horizontalSwipe.slidePrev();
  }
}

// -----------------
export default Slide;
