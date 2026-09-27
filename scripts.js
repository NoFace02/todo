window.addEventListener("DOMContentLoaded", function () {
  var form = document.querySelector(".new-todo");
  var input = document.querySelector("#new-todo");
  var list = document.querySelector(".todo-list");
  var counter = document.querySelector(".todo-footer span");
  var themeButton = document.querySelector(".theme-icon");
  var themeImage = themeButton.querySelector("img");
  var currentFilter = "all";
  var number = list.querySelectorAll(".todo-item").length + 1;

  function updateCounter() {
    var todos = list.querySelectorAll(".todo-item");
    var left = 0;

    for (var i = 0; i < todos.length; i++) {
      if (!todos[i].classList.contains("is-completed")) {
        left++;
      }
    }

    if (left === 1) {
      counter.textContent = "1 item left";
    } else {
      counter.textContent = left + " items left";
    }
  }

  function showTodos() {
    var todos = list.querySelectorAll(".todo-item");

    for (var i = 0; i < todos.length; i++) {
      var completed = todos[i].classList.contains("is-completed");

      if (currentFilter === "active" && completed) {
        todos[i].style.display = "none";
      } else if (currentFilter === "completed" && !completed) {
        todos[i].style.display = "none";
      } else {
        todos[i].style.display = "flex";
      }
    }
  }

  function setFilter(filter) {
    currentFilter = filter;
    var filterLinks = document.querySelectorAll(".filters a");

    for (var i = 0; i < filterLinks.length; i++) {
      filterLinks[i].classList.remove("is-active");
      if (filterLinks[i].getAttribute("href") === "#" + filter) {
        filterLinks[i].classList.add("is-active");
      }
    }

    showTodos();
  }

  function addTodo(text) {
    var item = document.createElement("li");
    var id = "todo-" + number;
    var checkbox = document.createElement("input");
    var label = document.createElement("label");
    var deleteButton = document.createElement("button");
    var deleteImage = document.createElement("img");

    item.className = "todo-item";
    checkbox.className = "todo-checkbox";
    checkbox.type = "checkbox";
    checkbox.id = id;
    label.setAttribute("for", id);
    label.textContent = text;
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.setAttribute("aria-label", "Delete " + text);
    deleteImage.src = "./images/icon-cross.svg";
    deleteImage.alt = "";

    deleteButton.appendChild(deleteImage);
    item.appendChild(checkbox);
    item.appendChild(label);
    item.appendChild(deleteButton);
    list.appendChild(item);
    number++;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var text = input.value.trim();

    if (text !== "") {
      addTodo(text);
      input.value = "";
      updateCounter();
      showTodos();
      input.focus();
    }
  });

  list.addEventListener("change", function (event) {
    if (event.target.classList.contains("todo-checkbox")) {
      if (event.target.checked) {
        event.target.parentElement.classList.add("is-completed");
      } else {
        event.target.parentElement.classList.remove("is-completed");
      }
      updateCounter();
      showTodos();
    }
  });

  list.addEventListener("click", function (event) {
    if (event.target.closest(".delete-button")) {
      event.target.closest(".todo-item").remove();
      updateCounter();
    }
  });

  var clearButton = document.querySelector(".clear-completed");
  clearButton.addEventListener("click", function () {
    var completedTodos = list.querySelectorAll(".is-completed");

    for (var i = 0; i < completedTodos.length; i++) {
      completedTodos[i].remove();
    }

    updateCounter();
    showTodos();
  });

  var filterLinks = document.querySelectorAll(".filters a");
  for (var i = 0; i < filterLinks.length; i++) {
    filterLinks[i].addEventListener("click", function (event) {
      event.preventDefault();
      setFilter(this.getAttribute("href").substring(1));
    });
  }

  function setTheme(theme) {
    document.body.classList.remove("theme-light");
    document.body.classList.remove("theme-dark");
    document.body.classList.add("theme-" + theme);
    localStorage.setItem("todo-theme", theme);

    if (theme === "dark") {
      themeImage.src = "./images/icon-sun.svg";
      themeButton.setAttribute("aria-label", "Switch to light mode");
    } else {
      themeImage.src = "./images/icon-moon.svg";
      themeButton.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  var savedTheme = localStorage.getItem("todo-theme");
  if (savedTheme === "light" || savedTheme === "dark") {
    setTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    themeImage.src = "./images/icon-sun.svg";
    themeButton.setAttribute("aria-label", "Switch to light mode");
  }

  themeButton.addEventListener("click", function () {
    var dark = document.body.classList.contains("theme-dark");
    if (!dark && !document.body.classList.contains("theme-light")) {
      dark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    setTheme(dark ? "light" : "dark");
  });

  var oldTodos = list.querySelectorAll(".todo-item");
  for (var i = 0; i < oldTodos.length; i++) {
    if (oldTodos[i].querySelector(".todo-checkbox").checked) {
      oldTodos[i].classList.add("is-completed");
    }
  }

  updateCounter();
  showTodos();
});
