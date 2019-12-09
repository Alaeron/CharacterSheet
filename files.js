function get_character() {
    var propElements = document.querySelectorAll("*[id]")
    var props = []
    propElements.forEach(function(element, index) {
        if (element.type == "checkbox") {
            props.push(element.checked)            
        } else {
            props.push(element.value || element.innerText)
        }
    })
    var character = {}
    character.name = document.querySelector("#name").value
    character.sheet = props
    character.items = get_items()
    character.spells = get_spells()
    character.feats = get_feats()
    character.attacks = get_attacks()
    character.notes = document.querySelector("#notes").value
    character.backstory = document.querySelector("#backstory").value
    character.class = document.querySelector("#class").value
    character.level = document.querySelector("#level").value
    character.race = document.querySelector("#race").value
    return character
}
function load_character(character){
    clear_sheet()
    var propElements = document.querySelectorAll("*[id]")
    propElements.forEach(function(element, index) {
        if (element.type == "checkbox") {
            element.checked = character.sheet[index]
        } else {
            element.value = character.sheet[index]
        }
    })
    set_items(character.items)
    set_spells(character.spells)
    set_feats(character.feats)
    set_attacks(character.attacks)
    document.querySelector("#notes").value = character.notes
    document.querySelector("#backstory").value = character.backstory

}
function clear_all() {
    clear_sheet()
    set_attacks()
    set_feats()
    set_spells()
    set_items()
}
function get_items() {
    var itemElements = document.querySelectorAll(".sidebar .section.inv-items .item.inv-item")
    var items = []
    itemElements.forEach(function(element, index) {
        var propertyElements = element.querySelectorAll(".property")
        var properties = []
        propertyElements.forEach(function (element, index) {
            properties.push(element.innerHTML)
        })
        items.push(properties)
    })
    return items
}
function get_spells() {
    var spellElements = document.querySelectorAll(".sidebar .section.spells .item.spell")
    var spells = []
    spellElements.forEach(function(element, index) {
        var propertyElements = element.querySelectorAll(".property")
        var properties = []
        propertyElements.forEach(function (element, index) {
            properties.push(element.innerHTML)
        })
        spells.push(properties)
    })
    return spells
}
function get_feats() {
    var featElements = document.querySelectorAll(".sidebar .section.feats .item.feat")
    var feats = []
    featElements.forEach(function(element, index) {
        var propertyElements = element.querySelectorAll(".property")
        var properties = []
        propertyElements.forEach(function (element, index) {
            properties.push(element.innerHTML)
        })
        feats.push(properties)
    })
    return feats

}
function get_attacks() {
    var attackElements = document.querySelectorAll(".sheet .attacks .attack")
    var attacks = []
    attackElements.forEach(function(element, index) {
        var propertyElements = element.querySelectorAll(".property")
        var properties = []
        propertyElements.forEach(function (element, index) {
            properties.push(element.value)
        })
        attacks.push(properties)
    })
    return attacks

}

function set_items(items) {
    var itemContainer = document.querySelector(".sidebar-right .section.inv-items .content")
    empty(itemContainer)
    if (!items) return false
    items.forEach(function(element, index) {
        add_inv_item()
        var newinv_itemElement = itemContainer.querySelector(".new-item")
        newinv_itemElement.querySelectorAll(".property .edit-property").forEach(function(propElement, propIndex) {
            propElement.value = element[propIndex]
        })
        newinv_itemElement.classList.remove("new-item")
        newinv_itemElement.querySelector(".fa-save").click()
    })
    return true
}
function set_spells(spells) {
    var spellContainer = document.querySelector(".sidebar-right .section.spells .content")
    empty(spellContainer)
    if (!spells) return false
    spells.forEach(function(element, index) {
        add_spell()
        var newSpellElement = spellContainer.querySelector(".new-item")
        newSpellElement.querySelectorAll(".property .edit-property").forEach(function(propElement, propIndex) {
            propElement.value = element[propIndex]
        })
        newSpellElement.classList.remove("new-item")
        newSpellElement.querySelector(".fa-save").click()
    })
    return true
}
function set_feats(feats) {
    var featContainer = document.querySelector(".sidebar-right .section.feats .content")
    empty(featContainer)
    if (!feats) return false
    feats.forEach(function(element, index) {
        add_feat()
        var newFeatElement = featContainer.querySelector(".new-item")
        newFeatElement.querySelectorAll(".property .edit-property").forEach(function(propElement, propIndex) {
            propElement.value = element[propIndex]
        })
        newFeatElement.classList.remove("new-item")
        newFeatElement.querySelector(".fa-save").click()
    })
    return true
}
function set_attacks(attacks) {
    var attackContainer = document.querySelector(".sheet .section.combat .attacks .content")
    empty(attackContainer)
    if (!attacks) return false
    attacks.forEach(function(element, index) {
        add_attack()
        var newAttackElement = attackContainer.querySelector(".new-item")
        newAttackElement.querySelectorAll(".property").forEach(function(propElement, propIndex) {
            propElement.value = element[propIndex]
        })
        newAttackElement.classList.remove("new-item")
    })
    return true
}
/* saving files */
document.querySelector(".sidebar .file-panel .fa-save").addEventListener("click", save_file_click)
function save_file_click(event) {
    const p = require('path');
    const { dialog, BrowserWindow } = require('electron').remote
    const fs = require('fs');

    var charContainer = document.querySelector(".sidebar-left .content")
    var charElement = charContainer.querySelector(".item.selected")

    if (!charElement) {
        alert("Please select a character first!")
        return false
    }

    var path = charElement.getAttribute('data-path')

    if (!path) {
        path = dialog.showSaveDialogSync(BrowserWindow.getFocusedWindow(), {
            filters: [{
                name: 'json',
                extensions: ['json']
            }]
        })
        if (!path.endsWith(".json")) {
            path += ".json"
        }
        charElement.setAttribute('data-path', path)
    }
    var character = get_character()
    fs.writeFileSync(path, JSON.stringify(character), 'utf-8')
    
    build_char_list(p.dirname(path))
    clear_all()
    document.querySelectorAll(".sidebar-left .content .item .title").forEach(function(element, item) {
        if (element.textContent == character.name) {
            element.closest(".item").click()
        }
    })
    
}

/* opening folder */
document.querySelector(".sidebar .file-panel .fa-folder-open").addEventListener("click", open_folder_click)
function open_folder_click(event) {
    const { dialog, BrowserWindow } = require('electron').remote
    const fs = require('fs');

    var path = dialog.showOpenDialogSync(BrowserWindow.getFocusedWindow(), {
        properties: ['openDirectory']
    })
    clear_all()
    build_char_list(path[0])    
}
document.querySelector(".sidebar .file-panel .fa-plus").addEventListener("click", add_character_click)
function add_character_click(event) {
    var charContainer = document.querySelector(".sidebar-left .content")
    var characterElement = createElementFromHTML(Templates.Character)
    clear_all()

    charContainer.appendChild(characterElement)
    
    characterElement.parentElement.querySelectorAll(".item").forEach(function(element, index) {
        element.classList.remove("selected")
    })
    characterElement.classList.add("selected")

}
/* load a character from file */
function open_char_click(event) {
    const fs = require('fs');
    var charElement = event.target.closest(".item")
    var path = charElement.getAttribute('data-path')
    
    var character = fs.readFileSync(path)
    charElement.parentElement.querySelectorAll(".item").forEach(function(element, index) {
        element.classList.remove("selected")
    })
    charElement.classList.add("selected")
    load_character(JSON.parse(character))
}
/* delete a character */
function delete_character_click(event) {
    const fs = require('fs');
    const p = require('path');
    var charContainer = document.querySelector(".sidebar-left .content")
    var characterElement = event.target.closest(".item")
    if (confirm("Are you sure you want to delete " + charContainer.querySelector(".title").textContent + "?")) {
        var path = characterElement.getAttribute("data-path")
        fs.unlinkSync(path)
        build_char_list(p.dirname(path))
        clear_all()
    }
    event.stopPropagation()

}

function get_file_info(path) {
    const fs = require('fs');
    var character = fs.readFileSync(path)
    try {
        var char = {}
        character = JSON.parse(character)
        char.name = character.name
        char.class = character.class
        char.level = character.level
        char.race = character.race
        char.path = path
        return char
    } 
    catch {
        return false
    }
    
}

function build_char_list(path) {
    const fs = require('fs');
    const p = require('path');

    var characters = []
    fs.readdirSync(path).forEach(file => {
        if (file.endsWith(".json")) {
            var charInfo = get_file_info(p.join(path, file))
            if (charInfo) {
                characters.push(charInfo);
            }
        }
    });

    var charContainer = document.querySelector(".sidebar-left .content")
    var selectedPath = ""
    while (!charContainer.lastChild.classList || !charContainer.lastChild.classList.contains("file-panel")) {
        if (charContainer.lastChild.classList && charContainer.lastChild.classList.contains("selected")){
            selectedPath = charContainer.lastChild.getAttribute("data-path")
        }
        charContainer.removeChild(charContainer.lastChild)
    }

    characters.forEach(function(element, index) {
        var charElement = createElementFromHTML(Templates.Character)
        charElement.querySelector(".title").innerText = element.name
        charElement.querySelector(".class").innerText = element.class
        charElement.querySelector(".race").innerText = element.race
        charElement.querySelector(".level").innerText = element.level
        charElement.setAttribute('data-path', element.path)
        charElement.addEventListener("click", open_char_click)
        charElement.querySelector(".fa-minus-circle").addEventListener("click", delete_character_click)
        if (element.path == selectedPath) {
            charElement.click()
        }

        charContainer.appendChild(charElement)
    })
}
function init() {
    clear_all()
}
init()