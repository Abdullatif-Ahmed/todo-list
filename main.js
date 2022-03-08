let modeToggle = document.getElementById("mode-toggle");
let todosContainer = document.querySelector(".todos-container");
let addTodo = document.getElementById("add-todo");
let todoInput = document.getElementById("todo-input");
let clearCompleted = document.querySelector("#clear-completed");
let todoFilters = document.querySelectorAll(".todo-filters button");

let todoCollection = [];
toggleImg();
function toggleImg() {
  if (document.querySelector(".dark-mode #mode-toggle img")) {
    let toggleModeImg = document.querySelector(".dark-mode #mode-toggle img");
    toggleModeImg.setAttribute("src", "images/icon-sun.svg");
  } else if (document.querySelector(".light-mode #mode-toggle img")) {
    let toggleLightImg = document.querySelector(".light-mode #mode-toggle img");
    toggleLightImg.setAttribute("src", "images/icon-moon.svg");
  }
}
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  if (document.querySelector(".light-mode")) {
    localStorage.setItem("light-mode", "light-mode");
  } else {
    localStorage.removeItem("light-mode");
  }
  toggleImg();
});
if (localStorage.getItem("light-mode")) {
  document.body.classList.remove("dark-mode");
  document.body.classList.add("light-mode");
  toggleImg();
}

class todo {
  constructor(id, content, done) {
    this.id = id;
    this.content = content;
    this.done = done;
  }
}
addTodo.addEventListener("click", (e) => {
  e.preventDefault;
  if (todoInput.value.trim() !== "") {
    addToArray();

    todoInput.value = "";
  }
});
clearCompleted.addEventListener("click", (e) => {
  e.preventDefault;
  deleteCompleted();
  itemLeft();
});
function addToArray() {
  let st = "abcdefghijkmlnopqrstuvwxyz";
  let randomId = "";
  for (let i = 0; i < 9; i++) {
    randomId += st[Math.trunc(Math.random() * st.length)];
  }
  let obj = new todo(randomId, todoInput.value, false);
  todoCollection.push(obj);
  addToPage(todoCollection);
  addToLocal(todoCollection);
}
function addToPage(ar) {
  document.querySelectorAll(".todo-item").forEach((el) => {
    el.remove();
  });
  ar.forEach((obj) => {
    let todoItem = document.createElement("div");
    todoItem.className = "todo-item";
    todoItem.setAttribute("data-id", obj.id);
    todoItem.addEventListener("click", (e) => {
      todoItem.classList.toggle("done");
      completeItem(obj.id);
    });
    if (obj.done === true) {
      todoItem.classList.add("done");
    }
    let p = document.createElement("p");
    p.className = "todo-item-content";
    p.appendChild(document.createTextNode(obj.content));
    let deleteTodo = document.createElement("button");
    deleteTodo.id = "delete-todo";
    deleteTodo.addEventListener("click", (e) => {
      e.preventDefault;
      deleteItem(obj.id);
      deleteTodo.parentElement.remove();
    });
    let img = document.createElement("img");
    img.src = "images/icon-cross.svg";
    deleteTodo.appendChild(img);
    todoItem.appendChild(p);
    todoItem.appendChild(deleteTodo);
    todosContainer.prepend(todoItem);
    itemLeft();
  });
  document.querySelectorAll(".todo-filters button").forEach((el) => {
    if (el.classList.contains("active")) {
      showItem(el);
    }
  });
}
function itemLeft() {
  let itemLeft = document.querySelector(".item-left");
  let undone = todoCollection.filter((obj) => {
    return obj.done !== true;
  });
  itemLeft.innerHTML = undone.length;
}
function deleteCompleted() {
  todoCollection = todoCollection.filter((obj) => {
    return obj.done === false;
  });
  addToLocal(todoCollection);
  document.querySelectorAll(".todo-item").forEach((el) => {
    if (el.classList.contains("done")) {
      el.remove();
    }
  });
}
function completeItem(id) {
  todoCollection.forEach((obj) => {
    if (obj.id === id) {
      obj.done === false ? (obj.done = true) : (obj.done = false);
    }
  });
  addToLocal(todoCollection);
  itemLeft();
  document.querySelectorAll(".todo-filters button").forEach((el) => {
    if (el.classList.contains("active")) {
      showItem(el);
    }
  });
}
function deleteItem(id) {
  todoCollection = todoCollection.filter((obj) => {
    return obj.id !== id;
  });
  addToLocal(todoCollection);
  itemLeft();
}
function addToLocal(ar) {
  localStorage.setItem("tasks", JSON.stringify(ar));
}
function getTasksfromLocal() {
  if (window.localStorage.getItem("tasks")) {
    todoCollection = JSON.parse(window.localStorage.getItem("tasks"));
    addToPage(JSON.parse(window.localStorage.getItem("tasks")));
  }
}
todoFilters.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault;
    todoFilters.forEach((btn) => {
      btn.classList.remove("active");
    });
    e.target.classList.add("active");
    removeHiddenClass();
    showItem(e.target);
  });
});

function removeHiddenClass() {
  document.querySelectorAll(".todo-item").forEach((el) => {
    el.classList.remove("hidden");
  });
}
getTasksfromLocal();
function showItem(el) {
  if (el.id === "show-completed") {
    document.querySelectorAll(".todo-item").forEach((el) => {
      if (!el.classList.contains("done")) {
        el.classList.add("hidden");
      }
    });
  } else if (el.id === "show-active") {
    document.querySelectorAll(".todo-item").forEach((el) => {
      if (el.classList.contains("done")) {
        el.classList.add("hidden");
      }
    });
  }
}
