class Item {
  constructor(text) {
    this.text = text;
  }
}
// ----------------------------------
class Slide {
  constructor(landingText, slideItems = []) {
    this.landingText = landingText;
    this.slideItems = slideItems;
  }

  addItem(entry) {
    this.slideItems.push(new Item(entry));
  }
  deleteItem(entryToDelete) {
    this.slideItems = this.slideItems.filter(
      (item) => item.text !== entryToDelete
    );
  }
}

// ---------------------------------
class Group {
  constructor(title, slides = [new Slide(title, [])]) {
    this.title = title;
    this.slides = slides;
  }

  addSlide(slide, index) {
    this.slides.splice(index, 0, slide);
  }

  deleteSlide(index) {
    this.slides.splice(index, 1);
  }
}

export { Item, Group };
