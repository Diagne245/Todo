class Button {
  constructor(
    parentEl, //= app.main.mainSection.querySelector('.buttons'),
    type = 'submit',
    btnText = ' Add Items',
    btnClasses = 'btn add-item-btn',
    iconClasses = 'fa-solid fa-plus'
  ) {
    this.button = document.createElement('button');
    this.parentEl = parentEl;
    this.type = type;
    this.btnText = btnText;
    this.btnClasses = btnClasses;
    this.iconClasses = iconClasses;

    this.render();
  }

  render() {
    this.button.type = this.type;
    this.button.className = this.btnClasses;

    const icon = document.createElement('i');
    icon.className = this.iconClasses;

    this.button.appendChild(icon);
    this.button.appendChild(document.createTextNode(this.btnText));
    this.parentEl.appendChild(this.button);
  }
  // ------------------
  hide() {
    this.button.style.display = 'none';
  }

  show() {
    this.button.style.display = 'inline-block';
  }

  removeSelection() {
    this.button.style.display = 'inline-block';
    this.button.lastChild.nodeValue = ' Remove Items';
  }

  clearAll() {
    this.button.style.display = 'none';
    this.button.lastChild.nodeValue = ' Clear All';
  }

  editMode() {
    if (this.button) {
      this.button.lastChild.nodeValue = ' Update';
      this.button.classList.add('update');

      const icon = this.button.querySelector('.fa-plus');
      icon.classList.replace('fa-plus', 'fa-pen');
    }
  }

  addSelection() {
    if (this.button) {
      this.button.lastChild.nodeValue = ' Add Selection';
      this.button.classList.add('select-mode');
    }
  }

  reset() {
    this.show();

    this.button.lastChild.nodeValue = ' Add Items';
    this.button.className = 'btn add-item-btn';

    this.button.querySelector('.fa-pen') &&
      this.button
        .querySelector('.fa-pen')
        .classList.replace('fa-pen', 'fa-plus');
  }
}

export default Button;
