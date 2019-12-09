// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var Templates = {}
Templates.Spell = `
<div class="item spell">
<div class="title property"></div>
<div class="level property"></div>
<div class="school property"></div>
<i class="fas fa-angle-up"></i>
<div class="info">
  <div class="range property"></div>
  <div class="time property"></div>
  <div class="components property"></div>
  <div class="duration property"></div>
  <div class="description property"></div>
</div>
<div class="edit-panel">                      
  <i class="fas fa-edit"></i>
  <i class="fas fa-minus-circle"></i>
</div>
</div>
`
Templates.Feat = `
<div class="item feat">
<div class="title property"></div>
<i class="fas fa-angle-up"></i>
<div class="description property"></div>
<div class="edit-panel">                      
  <i class="fas fa-edit"></i>
  <i class="fas fa-minus-circle"></i>
</div>
</div>
`
Templates.Attack = `
<div class="attack">
  <input class="name property" placeholder="Name">
  <input class="attack-bonus property" placeholder="+ Atk">
  <input class="damage-type property" placeholder="Damage/Type">
  <i class="fas fa-minus-circle remove"></i>
</div>
`
Templates.Item = `
<div class="item inv-item">
<div class="title property"></div>
<i class="fas fa-angle-up"></i>
<div class="description property"></div>
<div class="edit-panel">                      
  <i class="fas fa-edit"></i>
  <i class="fas fa-minus-circle"></i>
</div>
</div>
`
Templates.Character = `
<div class="item character" data-path="">
<div class="title"></div>
<i class="fas fa-minus-circle"></i>
<div class="info">
  <div class="race"></div>
  <div class="class"></div>
  <div class="level"></div>
</div>
</div>`

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
    var levelElement = itemElement.querySelector('.level')
    var schoolElement = itemElement.querySelector('.school')
    var rangeElement = itemElement.querySelector('.range')
    var timeElement = itemElement.querySelector('.time')
    var componentsElement = itemElement.querySelector('.components')
    var durationElement = itemElement.querySelector('.duration')
    var descriptionElement = itemElement.querySelector('.description')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(levelElement, "Level")
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
function spell_save(event) {
    var itemElement = event.target.closest('.item')
    
    var titleElement = itemElement.querySelector('.title')
    var levelElement = itemElement.querySelector('.level')
    var schoolElement = itemElement.querySelector('.school')
    var rangeElement = itemElement.querySelector('.range')
    var timeElement = itemElement.querySelector('.time')
    var componentsElement = itemElement.querySelector('.components')
    var durationElement = itemElement.querySelector('.duration')
    var descriptionElement = itemElement.querySelector('.description')

    unwrap_edit_property(titleElement)
    unwrap_edit_property(levelElement)
    unwrap_edit_property(schoolElement)
    unwrap_edit_property(rangeElement)
    unwrap_edit_property(timeElement)
    unwrap_edit_property(componentsElement)

    unwrap_edit_property(durationElement)
    unwrap_edit_property(descriptionElement)
    
    event.target.remove()
    itemElement.classList.remove('editing')
    itemElement.querySelector(".fa-angle-up").click()
    categorize_spells()
}
/* Add Spell */
document.querySelector(".sidebar .section.spells .item.add").addEventListener("click", add_spell)
function add_spell(event) {
    var spellElement = createElementFromHTML(Templates.Spell)
    if (event === undefined) {
        event = {}
        event.target = document.querySelector(".sidebar .section.spells .add")
        spellElement.classList.add("new-item")
    }
    var spellContainer = document.querySelector(".sidebar-right .section.spells .content")

    spellElement.querySelector(".edit-panel .fa-edit").addEventListener("click", spell_edit)
    spellElement.querySelector(".edit-panel .fa-minus-circle").addEventListener("click", item_delete)
    spellElement.querySelector(".fa-angle-up").addEventListener("click", spell_toggle)

    begin_edit_spell(spellElement)

    spellContainer.insertBefore(spellElement, event.target)

}

/* Categorize Spells */
function categorize_spells() {
    var spellContainer = document.querySelector(".sidebar-right .section.spells > .content")

    spellContainer.querySelectorAll(":scope > .title").forEach(function (element, index) {
        element.remove()
    })

    var spells = spellContainer.querySelectorAll(".spell")
    spells = Array.from(spells).sort(function(a, b) {
        return(a.querySelector(".level").textContent.localeCompare(b.querySelector(".level").textContent))
    })
    var lastLevel = "-1";
    spells.forEach(function(element, index) {
        var level = element.querySelector(".level").textContent
        if (level !== lastLevel) {
            spellContainer.appendChild(createElementFromHTML('<div class="title">Level ' + (level != "" ? level : '-') + '</div>'))
            lastLevel = level
        }
        spellContainer.appendChild(element)
    })
    spellContainer.appendChild(document.querySelector(".sidebar-right .section.spells .content i.add"))

}

/* Item Delete */
document.querySelectorAll(".sidebar .item i.fa-minus-circle").forEach(function(element) {
    element.addEventListener("click", item_delete)
})
function item_delete(event) {
    var itemElement = event.target.closest('.item')
    if (itemElement.classList.contains("spell")){
        itemElement.remove()
        categorize_spells()
    } else {
        itemElement.remove()
    }
}

/* Add Feat */
document.querySelector(".sidebar .section.feats .item.add").addEventListener("click", add_feat)
function add_feat(event) {
    var featElement = createElementFromHTML(Templates.Feat)
    if (event === undefined) {
        event = {}
        event.target = document.querySelector(".sidebar .section.feats .add")
        featElement.classList.add("new-item")
    }
    var featContainer = document.querySelector(".sidebar-right .section.feats .content")

    featElement.querySelector(".edit-panel .fa-edit").addEventListener("click", feat_edit)
    featElement.querySelector(".edit-panel .fa-minus-circle").addEventListener("click", item_delete)
    featElement.querySelector(".fa-angle-up").addEventListener("click", feat_toggle)

    begin_edit_feat(featElement)

    featContainer.insertBefore(featElement, event.target)

}

/* Feat Collapse */
document.querySelectorAll(".sidebar .section .feat > i").forEach(function(element) {
    element.addEventListener("click", spell_toggle)
})
function feat_toggle(event) {
    event.target.parentElement.classList.toggle("collapsed")   
    event.target.classList.toggle("fa-angle-up")
    event.target.classList.toggle("fa-angle-down")
}

/* Feat Editing */
document.querySelectorAll(".sidebar .section .feat .edit-panel > i.fa-edit").forEach(function(element) {
    element.addEventListener("click", feat_edit)
})
function feat_edit(event) {
    var itemElement = event.target.closest('.item')
    begin_edit_feat(itemElement)
}
function begin_edit_feat(itemElement) {    
    itemElement.classList.add('editing')
    
    var titleElement = itemElement.querySelector('.title')
    var descriptionElement = itemElement.querySelector('.description')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(descriptionElement, "Description", 'textarea')

    var saveElement = document.createElement('i')
    saveElement.classList = "fas fa-save"
    itemElement.querySelector(".edit-panel").appendChild(saveElement)

    saveElement.addEventListener("click", feat_save)

}
function feat_save(event) {
    var itemElement = event.target.closest('.item')
    
    var titleElement = itemElement.querySelector('.title')
    var descriptionElement = itemElement.querySelector('.description')

    unwrap_edit_property(titleElement)
    unwrap_edit_property(descriptionElement)
    
    event.target.remove()
    itemElement.querySelector(".fa-angle-up").click()
    itemElement.classList.remove('editing')
}

/* Auto Select All */
document.querySelectorAll("input:not([type=checkbox])").forEach(function(element) {
    element.addEventListener("focus", function(event) {
        element.select()
    })
})

/* Attacks */
document.querySelector(".sheet .section.combat .attacks .add").addEventListener("click", add_attack)
function add_attack(event) {
    var attackElement = createElementFromHTML(Templates.Attack)
    if (event === undefined) {
        event = {}
        event.target = document.querySelector(".sheet .section.combat .attacks .add")
        attackElement.classList.add("new-item")
    }
    var attackContainer = document.querySelector(".sheet .section.combat .attacks .content")

    attackElement.querySelector(".fa-minus-circle").addEventListener("click", remove_attack)

    attackContainer.insertBefore(attackElement, event.target)
}
function remove_attack(event) {
    event.target.closest('.attack').remove()
}
/* Items */

/* Item Collapse */
document.querySelectorAll(".sidebar .section.inv-items .item > i").forEach(function(element) {
    element.addEventListener("click", inv_item_toggle)
})
function inv_item_toggle(event) {
    event.target.parentElement.classList.toggle("collapsed")   
    event.target.classList.toggle("fa-angle-up")
    event.target.classList.toggle("fa-angle-down")
}
/* Add Item */
document.querySelector(".sidebar .section.inv-items .content .item.add").addEventListener("click", add_inv_item)
function add_inv_item(event) {    
    var inv_itemElement = createElementFromHTML(Templates.Item)
    if (event === undefined) {
        event = {}
        event.target = document.querySelector(".sidebar .section.inv-items .add")
        inv_itemElement.classList.add("new-item")
    }
    var inv_itemContainer = document.querySelector(".sidebar-right .section.inv-items .content")

    inv_itemElement.querySelector(".edit-panel .fa-edit").addEventListener("click", inv_item_edit)
    inv_itemElement.querySelector(".edit-panel .fa-minus-circle").addEventListener("click", item_delete)
    inv_itemElement.querySelector(".fa-angle-up").addEventListener("click", inv_item_toggle)

    begin_edit_inv_item(inv_itemElement)

    inv_itemContainer.insertBefore(inv_itemElement, event.target)

}
/* Item Editing */
document.querySelectorAll(".sidebar .section.inv-items .item .edit-panel > i.fa-edit").forEach(function(element) {
    element.addEventListener("click", inv_item_edit)
})
function inv_item_edit(event) {
    var itemElement = event.target.closest('.item')
    begin_edit_inv_item(itemElement)
}
function begin_edit_inv_item(itemElement) {    
    itemElement.classList.add('editing')
    
    var titleElement = itemElement.querySelector('.title')
    var descriptionElement = itemElement.querySelector('.description')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(descriptionElement, "Description", 'textarea')

    var saveElement = document.createElement('i')
    saveElement.classList = "fas fa-save"
    itemElement.querySelector(".edit-panel").appendChild(saveElement)

    saveElement.addEventListener("click", inv_item_save)

}
function inv_item_save(event) {
    var itemElement = event.target.closest('.item')
    
    var titleElement = itemElement.querySelector('.title')
    var descriptionElement = itemElement.querySelector('.description')

    unwrap_edit_property(titleElement)
    unwrap_edit_property(descriptionElement)
    
    event.target.remove()
    itemElement.querySelector(".fa-angle-up").click()
    itemElement.classList.remove('editing')
}

/* Utility Functions */
function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
  
    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild; 
}

  function wrap_edit_property(target, placeholder, tag, type) {
    if (tag === undefined) {
        tag = 'input'
    }
    var value = target.innerHTML
    var editElement = document.createElement(tag)
    editElement.className = "edit-property"
    editElement.placeholder = placeholder
    editElement.value = value.replace(/<br>/g, "\n")
    target.textContent = ''

    if (type !== undefined) {
        editElement.type = type
    }

    target.appendChild(editElement)
}

function unwrap_edit_property(target) {
    var value = target.children[0].value.replace(/(?:\r\n|\r|\n)/g, '<br>')
    target.innerHTML = value
}
function empty(element) {
    while (!element.firstChild.classList || !element.firstChild.classList.contains("add")) {
        element.removeChild(element.firstChild)
    }
}
function clear_sheet() {
    document.querySelectorAll(".sheet input, .sheet textarea").forEach(function(element, index) {
        element.value = ''
        element.checked = false
    })
}