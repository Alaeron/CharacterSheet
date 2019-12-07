// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var Templates = {}
Templates.Spell = `
<div class="item spell">
<div class="title"></div>
<div class="school"></div>
<i class="fas fa-angle-up"></i>
<div class="info">
  <div class="range"></div>
  <div class="time"></div>
  <div class="components"></div>
  <div class="duration"></div>
  <div class="description"></div>
</div>
<div class="edit-panel">                      
  <i class="fas fa-edit"></i>
  <i class="fas fa-minus-circle"></i>
</div>
</div>
`

/* Sidebar Collapse */
document.querySelectorAll(".sidebar > i").forEach(function(element) {
    element.addEventListener("click", sidebar_toggle)
})
function sidebar_toggle(event) {
    event.target.parentElement.classList.toggle("collapsed")   
    event.target.classList.toggle("fa-angle-double-left")
    event.target.classList.toggle("fa-angle-double-right")
}

/* Sidebar Section Collapse */
document.querySelectorAll(".sidebar .section > .title").forEach(function(element) {
    element.addEventListener("click", sidebar_section_select)
})
function sidebar_section_select(event) {
    document.querySelectorAll(".sidebar .section").forEach(function(element) {
        if (element !== event.target.parentElement) {
            element.classList.remove("selected")
        }
    })
    event.target.parentElement.classList.toggle("selected")
}

/* Spell Collapse */
document.querySelectorAll(".sidebar .section .spell > i").forEach(function(element) {
    element.addEventListener("click", spell_toggle)
})
function spell_toggle(event) {
    event.target.parentElement.classList.toggle("collapsed")   
    event.target.classList.toggle("fa-angle-up")
    event.target.classList.toggle("fa-angle-down")
}

/* Spell Editing */
document.querySelectorAll(".sidebar .section .spell .edit-panel > i.fa-edit").forEach(function(element) {
    element.addEventListener("click", spell_edit)
})
function spell_edit(event) {
    var itemElement = event.target.closest('.item')
    begin_edit_spell(itemElement)
}
function begin_edit_spell(itemElement) {    
    itemElement.classList.add('editing')
    
    var titleElement = itemElement.querySelector('.title')
    var schoolElement = itemElement.querySelector('.school')
    var rangeElement = itemElement.querySelector('.range')
    var timeElement = itemElement.querySelector('.time')
    var componentsElement = itemElement.querySelector('.components')
    var durationElement = itemElement.querySelector('.duration')
    var descriptionElement = itemElement.querySelector('.description')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(schoolElement, "School")
    wrap_edit_property(rangeElement, "Range")
    wrap_edit_property(timeElement, "Time")
    wrap_edit_property(componentsElement, "Components")
    wrap_edit_property(durationElement, "Duration")
    wrap_edit_property(descriptionElement, "Description", 'textarea')

    var saveElement = document.createElement('i')
    saveElement.classList = "fas fa-save"
    itemElement.querySelector(".edit-panel").appendChild(saveElement)

    saveElement.addEventListener("click", spell_save)

}
function wrap_edit_property(target, placeholder, tag, type) {
    if (tag === undefined) {
        tag = 'input'
    }
    var value = target.textContent
    var editElement = document.createElement(tag)
    editElement.className = "edit-property"
    editElement.placeholder = placeholder
    editElement.value = value
    target.textContent = ''

    if (type !== undefined) {
        editElement.type = type
    }

    target.appendChild(editElement)
}
function spell_save(event) {
    var itemElement = event.target.closest('.item')
    
    var titleElement = itemElement.querySelector('.title')
    var schoolElement = itemElement.querySelector('.school')
    var rangeElement = itemElement.querySelector('.range')
    var timeElement = itemElement.querySelector('.time')
    var componentsElement = itemElement.querySelector('.components')
    var durationElement = itemElement.querySelector('.duration')
    var descriptionElement = itemElement.querySelector('.description')

    unwrap_edit_property(titleElement)
    unwrap_edit_property(schoolElement)
    unwrap_edit_property(rangeElement)
    unwrap_edit_property(timeElement)
    unwrap_edit_property(componentsElement)
    unwrap_edit_property(durationElement)
    unwrap_edit_property(descriptionElement)
    
    event.target.remove()
    itemElement.classList.remove('editing')
}
function unwrap_edit_property(target) {
    var value = target.children[0].value
    target.innerHTML = value
}

/* Item Delete */
document.querySelectorAll(".sidebar .item i.fa-minus-circle").forEach(function(element) {
    element.addEventListener("click", item_delete)
})
function item_delete(event) {
    var itemElement = event.target.closest('.item')
    itemElement.remove()
}

/* Add Spell */
document.querySelector(".sidebar .section.spells .item.add").addEventListener("click", add_spell)
function add_spell(event) {
    var spellElement = createElementFromHTML(Templates.Spell)
    var spellContainer = document.querySelector(".sidebar-right .section.spells .content .level")

    spellElement.querySelector(".edit-panel .fa-edit").addEventListener("click", spell_edit)
    spellElement.querySelector(".edit-panel .fa-minus-circle").addEventListener("click", item_delete)
    spellElement.querySelector(".fa-angle-up").addEventListener("click", spell_toggle)

    begin_edit_spell(spellElement)

    spellContainer.insertBefore(spellElement, event.target)

}


/* Utility Functions */
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
  }