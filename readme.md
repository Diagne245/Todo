# TODO App

This is a `Vanilla JavaScript` Todo app to store Ideas and Todos. It uses `Swiper UI Library` for the sliding system, `Webpack` modules bundler and `LocalStorage` to store data.

We started with the *`Shopping List App`* from the [**Modern JS From The Beginning 2.0**](https://www.udemy.com/course/modern-javascript-from-the-beginning/?kw=modern+javascript+from+the+beg&src=sac&couponCode=LETSLEARNNOW) Traversy Media Udemy course(see link below).  
https://legendary-lokum-bd58e5.netlify.app/
<br>

![App Screenshot](/src/images/screenshot.png)

Demo:&ensp;**https://todo-app-x2kh.onrender.com/**

## Functionalities

- `CRUD` capabilities
- Create `Groups` to organize ideas and tasks
- A `Slide System` for each group to further organize items
- A `Select Mode` that allows us to:
  - Transfer items from one slide to another or one group to another
  - Delete multiple items at once
- A `Focus Area` to add motivation text like quotes, etc.

### How To

1. Click on an item to enter **`Edit Mode`** and click it again to exit  

2. `Double Click` any item to enter `Select Mode`. You can then select items by clicking on them to either:
    * `Move` them to another location by hitting the `Add Selection` button
    *  `Delete` them by pressing the `Remove Items` button  

3. To `Delete a Group`, you need to remove all his slides.

4. To `Change Focus Text`, click on it, edit it, then press Enter. `Slide Titles` can be edited too.

## Usage

### Install Dependencies

```bash
npm install
```

### Webpack Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000`

### To build Production Files

```bash
npm run build
```
Production files will go into the **`dist/`** folder

## Features To Add

  - Move storage system from localStorage to a `database`  

  - Turn the app into a `Fullstack CRUD App/Api`   

  - Add `Color Themes` 

  - Add `About App Group` to have a `How To` section 