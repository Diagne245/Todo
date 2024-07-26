// import '@fortawesome/fontawesome-free/js/all';
import Swiper from 'swiper';

import 'swiper/css';
import './scss/style.scss';

import Storage from './scripts/static';
import Slide from './components/slide';
import Main from './scripts/main';

// Swiper Initialize ---------------------
const horizontalSwipe = new Swiper('.swiper-h', {
  allowTouchMove: false,
  speed: 600,
});

// Global variables
const mainContainer = document.querySelector('#main-page .page-container');
const groupContainer = document.querySelector('#group-page .page-container');

// -------------------
class App {
  constructor() {
    this.slides = [];
    // ---------
    this.isEditMode = false;
    this.isSelectMode = false;
    this.srcGroup = null;
    this.selectionSrc = null;

    document.addEventListener('DOMContentLoaded', this.restore.bind(this));
  }

  // ----------------------
  restore() {
    mainContainer.innerHTML = '';
    groupContainer.innerHTML = '';

    this.main = new Main();
    this.displaySlides();

    if (Storage.onGroupPage()) {
      horizontalSwipe.slideTo(1, 0, false);
    }
    Storage.clearSelected();
  }

  // @Group Page -------------------
  displaySlides() {
    if (Storage.getCurrentGroup()) {
      groupContainer.innerHTML = '';
      this.slides = [];
      for (
        let index = 0;
        index < Storage.getCurrentGroup().slides.length;
        index++
      ) {
        this.slides[index] = new Slide(index);
      }
    }
  }
}

// Shared Methods ----------------
const getSlideAtIndex = (index) => {
  return groupContainer.querySelector(`.slide[data-index="${index}"]`);
};

// ----------------------
const app = new App();

export { app, horizontalSwipe, mainContainer, groupContainer };
export { getSlideAtIndex };
