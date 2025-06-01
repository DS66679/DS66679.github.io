export function create(tag, attributes = {}, parent) {
    const el = document.createElement(tag);
    for (const key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
    parent.appendChild(el);
    return el;
}

export function createbutton(attributes = {}, parent, text, event) {
    const el = document.createElement("button");
    for (const key in attributes) {
        el.setAttribute(key, attributes[key]);
    }
    parent.appendChild(el);
    el.textContent = text;
    el.addEventListener("click", event);
    return el;
}