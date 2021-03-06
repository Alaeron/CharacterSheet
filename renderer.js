// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// Node.js APIs are available in this process because
// `nodeIntegration` is turned on. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
var Templates = {}
Templates.Spell = `
<div class="item spell">
<div class="title property" data-url="/spells" data-prop="name"></div>
<div class="level property" data-prop="level_int"></div>
<div class="school property" data-prop="school"></div>
<i class="fas fa-angle-up"></i>
<div class="info">
  <div class="range property" data-prop="range"></div>
  <div class="time property" data-prop="casting_time"></div>
  <div class="components property" data-prop="components"></div>
  <div class="duration property" data-prop="duration"></div>
  <div class="description property" data-prop="desc"></div>
  <div class="higher-level property" data-prop="higher_level"></div>
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
<div class="info">
<div class="weight property"></div>
<div class="quick-ref property"></div>
<div class="value property"></div>
</div>
<div class="description property"></div>
<div class="edit-panel">                      
  <i class="fas fa-edit"></i>
  <i class="fas fa-minus-circle"></i>
</div>
</div>
`
Templates.Character = `
<div class="item character" data-path="">
<div class="title">New Character</div>
<i class="fas fa-minus-circle"></i>
<div class="info">
  <div class="race">Race</div>
  <div class="class">Class</div>
  <div class="level"></div>
</div>
</div>`
Templates.Proficiency = `
<div class="item proficiency">
<div class="title property"></div>
<i class="fas fa-angle-up"></i>
<div class="description property"></div>
<div class="edit-panel">                      
  <i class="fas fa-edit"></i>
  <i class="fas fa-minus-circle"></i>
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
    var higherElement = itemElement.querySelector('.higher-level')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(levelElement, "Level")
    wrap_edit_property(schoolElement, "School")
    wrap_edit_property(rangeElement, "Range")
    wrap_edit_property(timeElement, "Time")
    wrap_edit_property(componentsElement, "Components")
    wrap_edit_property(durationElement, "Duration")
    wrap_edit_property(descriptionElement, "Description", 'textarea')
    wrap_edit_property(higherElement, "Higher Level", 'textarea')

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
    var higherElement = itemElement.querySelector('.higher-level')

    unwrap_edit_property(titleElement)
    unwrap_edit_property(levelElement)
    unwrap_edit_property(schoolElement)
    unwrap_edit_property(rangeElement)
    unwrap_edit_property(timeElement)
    unwrap_edit_property(componentsElement)

    unwrap_edit_property(durationElement)
    unwrap_edit_property(descriptionElement)
    unwrap_edit_property(higherElement)
    
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
    element.addEventListener("click", feat_toggle)
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


/* Add Proficiency */
document.querySelector(".sidebar .section.proficiencies .item.add").addEventListener("click", add_proficiency)
function add_proficiency(event) {
    var proficiencyElement = createElementFromHTML(Templates.Proficiency)
    if (event === undefined) {
        event = {}
        event.target = document.querySelector(".sidebar .section.proficiencies .add")
        proficiencyElement.classList.add("new-item")
    }
    var proficiencyContainer = document.querySelector(".sidebar-right .section.proficiencies .content")

    proficiencyElement.querySelector(".edit-panel .fa-edit").addEventListener("click", proficiency_edit)
    proficiencyElement.querySelector(".edit-panel .fa-minus-circle").addEventListener("click", item_delete)
    proficiencyElement.querySelector(".fa-angle-up").addEventListener("click", proficiency_toggle)

    begin_edit_proficiency(proficiencyElement)

    proficiencyContainer.insertBefore(proficiencyElement, event.target)

}

/* Proficiency Collapse */
document.querySelectorAll(".sidebar .section .proficiency > i").forEach(function(element) {
    element.addEventListener("click", proficiency_toggle)
})
function proficiency_toggle(event) {
    event.target.parentElement.classList.toggle("collapsed")   
    event.target.classList.toggle("fa-angle-up")
    event.target.classList.toggle("fa-angle-down")
}

/* Proficiency Editing */
document.querySelectorAll(".sidebar .section .proficiency .edit-panel > i.fa-edit").forEach(function(element) {
    element.addEventListener("click", proficiency_edit)
})
function proficiency_edit(event) {
    var itemElement = event.target.closest('.item')
    begin_edit_proficiency(itemElement)
}
function begin_edit_proficiency(itemElement) {    
    itemElement.classList.add('editing')
    
    var titleElement = itemElement.querySelector('.title')
    var descriptionElement = itemElement.querySelector('.description')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(descriptionElement, "Description", 'textarea')

    var saveElement = document.createElement('i')
    saveElement.classList = "fas fa-save"
    itemElement.querySelector(".edit-panel").appendChild(saveElement)

    saveElement.addEventListener("click", proficiency_save)

}
function proficiency_save(event) {
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
    var valueElement = itemElement.querySelector('.value')
    var weightElement = itemElement.querySelector('.weight')
    var quickElement = itemElement.querySelector('.quick-ref')

    wrap_edit_property(titleElement, "Title")
    wrap_edit_property(weightElement, "Weight")
    wrap_edit_property(valueElement, "Value")
    wrap_edit_property(quickElement, "Quick Ref")
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
    var valueElement = itemElement.querySelector('.value')
    var quickElement = itemElement.querySelector('.quick-ref')
    var weightElement = itemElement.querySelector('.weight')

    unwrap_edit_property(titleElement)
    unwrap_edit_property(descriptionElement)
    unwrap_edit_property(valueElement)
    unwrap_edit_property(weightElement)
    unwrap_edit_property(quickElement)
    
    event.target.remove()
    itemElement.querySelector(".fa-angle-up").click()
    itemElement.classList.remove('editing')
}

/* Autocomplete */
const autocomplete_base_url = "https://api.open5e.com"
function bind_autocomplete(element) {
    if (!element) {
        return false;
    }
    var url = element.getAttribute("data-url")
    if (url) {
        var autoElement = createElementFromHTML('<div class="autocomplete"></div>')
        element.parentElement.appendChild(autoElement)
        element.addEventListener("keyup", autocomplete_keyup)
        element.addEventListener("blur", autocomplete_lost_focus)
    }
}
function autocomplete_keyup(event) {    
    if (event.target.value.length <= 3) {
        var autoElement = document.querySelector(".autocomplete")
        while (autoElement.firstChild) {
            autoElement.firstChild.remove()
        }
        return false
    }
    if (!autoElement) {
        autoElement = createElementFromHTML('<div class="autocomplete"></div>')
        event.target.parentElement.appendChild(autoElement)
    }
    var url = event.target.getAttribute("data-url")
    if (!url) {
        return false
    }
    api_request(url + "/?search=" + event.target.value)
}
function autocomplete_item_click(event) {
    var itemElement = event.target.closest(".item")
    var propElements = itemElement.querySelectorAll(".edit-property")
    for (i = 0; i < propElements.length; i++) {
        var propName = propElements[i].parentElement.getAttribute("data-prop")
        if (propName) {
            propElements[i].value = event.target.getAttribute("data-" + propName)
        }
    }
    var autoElement = itemElement.querySelector(".autocomplete")
    if (autoElement) {
        autoElement.remove()
    }

}
function autocomplete_lost_focus(event) {  
    var itemElement = event.target.closest(".item")
    var autoElement = itemElement.querySelector(".autocomplete")
    if (autoElement) {
        autoElement.remove()
    }
    itemElement.removeEventListener("blur", autocomplete_lost_focus)
}

/* ipc handling */
const ipc = require("electron").ipcRenderer;

ipc.on("api-response", function(evt, data) {
    var autoElement = document.querySelector(".autocomplete") 
    
    while (autoElement.firstChild) {
        autoElement.firstChild.remove()
    }
    data.results.forEach(function(item, index) {
        var itemElement = createElementFromHTML('<div class="autocomplete-item">' + item.name + '</div>')
        for (var key in item) {
            if (!item.hasOwnProperty(key)) continue;
            itemElement.setAttribute("data-" + key, item[key])   
        }
        autoElement.appendChild(itemElement)
        itemElement.addEventListener("mousedown", autocomplete_item_click)
    })
})
ipc.on("update-alert", function(evt, data) {
    var url = "https://github.com/Alaeron/CharacterSheet/releases/tag/" + data

    show_notification('<a href="#" data-url="' + url + '">Update</a> available!')
})

/* Utility Functions */
function show_notification(content) {
    var notiElement = document.querySelector(".item.notification")
    notiElement.innerHTML = content
    notiElement.classList.add("show")
    
    // if there are any links, bind an open external to the data-url
    var links = notiElement.querySelectorAll("a")
    links.forEach(function(element) {
        element.addEventListener("click", function(event) {
            window.require("electron").shell.openExternal(element.getAttribute("data-url"))
        })
    })

    setTimeout(() => {
        notiElement.classList.remove("show")
    }, 3000)

}

function api_request(url) {
    ipc.send("api-request", autocomplete_base_url + url)
}
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
    var url = target.getAttribute("data-url")
    if (url) {
        editElement.setAttribute("data-url", url)
    }

    target.appendChild(editElement)
    bind_autocomplete(editElement)
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