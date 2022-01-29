// script.js (utf-8)
// 
// Edited by: RR-DSE
// Timestamp: 22-01-29 00:06:54

const aListTypes = ["list", "list-ordered", "list-unordered"];

function getFirst(oParent, sTag, sClass){
  let bFound = true;
  for(let oElement of oParent.children){
    bFound  = true;
    if(sTag != null && sTag.toUpperCase() != oElement.tagName){
      bFound  = false;
    }
    if(sClass != null && (!oElement.hasAttribute("class") || (oElement.hasAttribute("class") && oElement.getAttribute("class").toLowerCase() != sClass.toLowerCase()))){
      bFound  = false;
    }
    if(bFound){
      return oElement;
    }
  }
  return null;
}

function newElement(sElement, sID, sClass, sText, oParent){
  const oElement = document.createElement(sElement);
  if(sID != null && sID != ""){
    oElement.id = sID;
  }
  if(sClass != null && sClass != ""){
    oElement.setAttribute("class", sClass);
  }
  if(sText != null && sText != ""){
    oElement.appendChild(document.createTextNode(sText));
  }
  oParent.appendChild(oElement);
  return oElement;
}

function getBulletedListValue(aLevels){
  let sRes = "";
  for(let uLevel of aLevels){
    sRes = sRes == "" ? "-" : "  ".concat(sRes);
  }
  return sRes;  
}

function getNumberedListValue(aLevels){
  let sRes = "";
  for(let uLevel of aLevels){
    sRes = sRes.concat(uLevel.toString(), ".");
  }
  return sRes;  
}

function resetListParameters(oParent, sListType, aLevels){
  let aCurrLevels = aLevels != null ? aLevels : [];
  for(let oChild of oParent.children){
    if(oChild.hasAttribute("data-listvalue")){
      oChild.removeAttribute("data-listvalue");
    }
    if(oChild.hasAttribute("class") && oChild.getAttribute("class") == "group"){
      let uLastLevel = 1;
      let oText = getFirst(oChild, "div", "entry");
      if(sListType != null){
        if(oText != null){
          if(sListType == "list-ordered"){
            oText.setAttribute("data-listvalue", getNumberedListValue(aCurrLevels));
          }
          else{
            oText.setAttribute("data-listvalue", getBulletedListValue(aCurrLevels));
          }
        }
        if(sListType == "list-ordered"){
          oChild.setAttribute("data-listvalue", getNumberedListValue(aCurrLevels));
        }
        else{
          oChild.setAttribute("data-listvalue", getBulletedListValue(aCurrLevels));
        }
      }
      if (oText != null){
        const oP = getFirst(getFirst(oText, "div", "text"), "p", null);
        oP.innerHTML = (oText.hasAttribute("data-listvalue") ? oText.getAttribute("data-listvalue").trim() : "").concat(" ", oText.getAttribute("data-value")).trim();
      }
      if(oChild.hasAttribute("data-type") && isInList(oChild.getAttribute("data-type"), aListTypes)){
        aCurrLevels.push(1);
        resetListParameters(getFirst(getFirst(oChild, "div", "body"), "div", "content"), oChild.getAttribute("data-type"), aCurrLevels);
        uLastLevel = aCurrLevels.pop();
      }
      else{
        resetListParameters(getFirst(getFirst(oChild, "div", "body"), "div", "content"), null, null);
      }
      if(sListType != null && (oText != null || uLastLevel > 1)){
        aCurrLevels[aCurrLevels.length - 1] = aCurrLevels[aCurrLevels.length - 1] + 1;
      }
    }
    else if(oChild.hasAttribute("class") && oChild.getAttribute("class") == "entry"){
      if(sListType != null){
        if(sListType == "list-ordered"){
          oChild.setAttribute("data-listvalue", getNumberedListValue(aCurrLevels));
        }
        else{
          oChild.setAttribute("data-listvalue", getBulletedListValue(aCurrLevels));
        }
        aCurrLevels[aCurrLevels.length - 1] = aCurrLevels[aCurrLevels.length - 1] + 1;
      }
      const oP = getFirst(getFirst(oChild, "div", "text"), "p", null);
      oP.innerHTML = (oChild.hasAttribute("data-listvalue") ? oChild.getAttribute("data-listvalue").trim() : "").concat(" ", oChild.getAttribute("data-value")).trim();
    }
  }
}

function clearGroups(oParent){
  for(let oChild of oParent.children){
    if(oChild.hasAttribute("class") && oChild.getAttribute("class") == "group"){
      let oGroup = oChild;
      let oBody = getFirst(oGroup, "div", "body");
      let oContent = getFirst(oBody, "div", "content");
      clearGroups(oContent);
      if(
        getFirst(oGroup, "div", "entry") == null &&
        getFirst(oContent, "div", "entry") == null &&
        getFirst(oContent, "div", "group") == null &&
        getFirst(oBody, "div", "select") == null
      ){
        oParent.removeChild(oGroup);
      }
    }
  }
}

function editEntry(oEntry){
  const oP = getFirst(getFirst(oEntry, "div", "text"), "p", null);
  let sText = "";
  let bPrompt = true;
  while(bPrompt){
    sText = prompt("Edit this entry", oEntry.getAttribute("data-value"));
    if(sText == null){
      return false;
    }
    else if(sText.trim() == ""){
      alert("Insert valid text, please.");
    }
    else{
      sText = sText.replace(/\s+/g, ' ').trim();
      oEntry.setAttribute("data-value", sText);
      oP.innerHTML = (oEntry.hasAttribute("data-listvalue") ? oEntry.getAttribute("data-listvalue").trim() : "").concat(" ", oEntry.getAttribute("data-value")).trim();
      bPrompt = false;
    }
  }
  return true;
}

function isInList(vObject, aList){
  let bRes = false;
  for(let vSearch of aList){
    if(vObject === vSearch){
      bRes = true;
      break;
    }
  }
  return bRes;
}

function delEntry(oEntry, bConfirmed){
  let oElement = oEntry;
  let bDelete = true;
  if(oElement.parentElement.hasAttribute("class") && oElement.parentElement.getAttribute("class") == "group"){
    if(oElement.parentElement.hasAttribute("data-type") && isInList(oElement.parentElement.getAttribute("data-type"), aListTypes)){
      if(!bConfirmed && confirm("Attention: This group will be removed. Continue?")){
        oElement = oElement.parentElement;
      }
      else{
        bDelete = false;
      }
    }
  }
  if(bDelete){
    oElement.parentElement.removeChild(oElement);
    clearGroups(getFirst(document.body, "div", "main"));
    resetListParameters(getFirst(document.body, "div", "main"), null, null);
  }
}

function moveEntryUp(oEntry){
  const oMovingElement = oEntry.parentElement.hasAttribute("class") && oEntry.parentElement.getAttribute("class") == "group" ? oEntry.parentElement : oEntry;
  const oParent = oMovingElement.parentElement;
  const oBefore = oMovingElement.previousElementSibling;
  if(oBefore != null){
    oParent.insertBefore(oMovingElement, oBefore);
  }
  resetListParameters(getFirst(document.body, "div", "main"), null, null);
}

function moveEntryDown(oEntry){
  const oMovingElement = oEntry.parentElement.hasAttribute("class") && oEntry.parentElement.getAttribute("class") == "group" ? oEntry.parentElement : oEntry;
  const oParent = oMovingElement.parentElement;
  let oNextElement = oMovingElement.nextElementSibling;
  if(oNextElement != null){
    oNextElement = oNextElement.nextElementSibling;
    if(oNextElement == null){
      oParent.appendChild(oMovingElement);
    }
    else{
      oParent.insertBefore(oMovingElement, oNextElement);
    }
  }
  resetListParameters(getFirst(document.body, "div", "main"), null, null);
}

function newEntry(sClass, sText, oParent){
  const sProcessedText = processText(sText);
  if(sProcessedText == null)
    return null;
  const oDivEntry = newElement("div", null, "entry", null, oParent);
  const oDivButtons = newElement("div", null, "buttons", null, oDivEntry);
  const oDivText = newElement("div", null, "text", null, oDivEntry);
  const oButton1 = newElement("button", null, "button", "\u270E", oDivButtons);
  const oButton2 = newElement("button", null, "button", "\u274C", oDivButtons);
  const oButton3 = newElement("button", null, "button", "\u25B2", oDivButtons);
  const oButton4 = newElement("button", null, "button", "\u25BC", oDivButtons);
  const oP = newElement("p", null, sClass, sProcessedText, oDivText);
  oDivEntry.setAttribute("data-value", sProcessedText);
  oButton1.addEventListener("click", function(){
    editEntry(oDivEntry);
  }
  )
  oButton2.addEventListener("click", function(){
    delEntry(oDivEntry, false);
  }
  )
  oButton3.addEventListener("click", function(){
    moveEntryUp(oDivEntry);
  }
  )
  oButton4.addEventListener("click", function(){
    moveEntryDown(oDivEntry);
  }
  )
  return oDivEntry;
}

function newGroup(sType, sHeading, uHeadingLevel, sText, oParent, oOptions){
  let sProcessedText = sText;
  let bContent = false;
  let bHeading = false;
  if(sText != null && sText != ""){
    sProcessedText = processText(sText);
    if(sProcessedText == null)
      return null;
  }
  const oDivGroup = newElement("div", null, "group", null, oParent)
  if(sType != null && sType != ""){
    oDivGroup.setAttribute("data-type", sType.toLowerCase());
  }
  if(sHeading != null && sHeading != "" && uHeadingLevel != null && uHeadingLevel > 0){
    newElement("h".concat(uHeadingLevel.toString()), null, "heading", sHeading, oDivGroup);
    bHeading = true;
  }
  if(sHeading != null && sHeading != "" && uHeadingLevel != null && uHeadingLevel == 0){
    newElement("p", null, "heading", sHeading, oDivGroup);
    bHeading = true;
  }
  if(sText != null && sText != ""){
    let sClass = null;
    if(isInList(sType, aListTypes)){
      sClass = "listheading";
    }
    else if(!bHeading){
      sClass = "groupheading";
    }
    else{
      sClass = "groupfirstline";
    }
    newEntry(sClass, sProcessedText, oDivGroup);
    bContent = true;
  }
  const oDivBody = newElement("div", null, "body", null, oDivGroup);
  const oDivContent = newElement("div", null, "content", null, oDivBody);
  if(oOptions != null){
    const oDivSelect = newElement("div", null, "select", null, oDivBody);
    const oSelect = newElement("select", null, "options", null, oDivSelect);
    let oOption = null;
    let uOption = 0;
    oOption = newElement("option", null, "option", "Select a new entry...", oSelect);
    oOption.value = uOption.toString();
    uOption = uOption + 1;
    oOption = newElement("option", null, "option", "Remove this group!", oSelect);
    oOption.value = uOption.toString();
    uOption = uOption + 1;
    for(let oEntry of oOptions){
      oOption = newElement("option", null, "option", oEntry.caption, oSelect);
      oOption.value = uOption.toString();
      uOption = uOption + 1;
      bContent = true;
    }
    oSelect.selectedIndex = 0;
    oSelect.addEventListener("change", function(){
      const uOptionIndex = parseInt(oSelect.options[oSelect.selectedIndex].value);
      if(uOptionIndex == 1){
        if(confirm("Are you sure to remove this group?")){
          delEntry(oSelect.parentElement.parentElement.parentElement, true);
        }
        else{
          oSelect.selectedIndex = 0;
        }
      }
      if(uOptionIndex > 1){
        if(!addEntry(
          oOptions[parseInt(oSelect.options[oSelect.selectedIndex].value) - 2], 
          oDivContent
          )
        )
          oSelect.selectedIndex = 0;
      }
      oSelect.selectedIndex = 0;
      }
      )
  }
  return [oDivContent, bContent];
}

function processText(sText){
  let bProcess = true;
  let sCurrText = sText;
  if(sCurrText == null || sCurrText == "")
    return sCurrText;
  const oRE1 = /\{(.*?)\}/;
  const oRE2 = /(.*)\/(.*)/;
  while(bProcess){
    let oMatch1 = oRE1.exec(sCurrText);
    if(oMatch1 != null){
      let sMatch1 = oMatch1[1];
      let sPromptCaption = sMatch1;
      let sPromptText = "";
      oMatch2 = oRE2.exec(sMatch1);
      if(oMatch2 != null){
        sPromptCaption = oMatch2[1];
        sPromptText = oMatch2[2];
      }
      let bPrompt = true;
      let sPrompt = "";
      while(bPrompt) {
        sPrompt = prompt(sPromptCaption, sPromptText);
        if(sPrompt == null){
          return null;
        }
        else if(sPrompt.trim() == ""){
          alert("Enter valid text, please.")
        }
        else {
          bPrompt = false;
        }
      }
      sCurrText = sCurrText.replace(oRE1, sPrompt);
    }
    else {
      bProcess = false;
    }
  }
  sCurrText = sCurrText.replace(/\s+/g, ' ').trim();
  return sCurrText;
}

function addEntry(oEntry, oParent){
  let oCurrParent = oParent;
  let bRes = false;
  if(
   ('options' in oEntry && oEntry.options != null) ||
   ('heading' in oEntry && oEntry.heading != null) ||
   ('heading_level' in oEntry && oEntry.heading_level != null) ||
   ('entries' in oEntry && oEntry.entries != null)
  ) {
    const oGroup = newGroup(
      'type' in oEntry ? oEntry.type : null,
      'heading' in oEntry ? oEntry.heading : null,
      'heading_level' in oEntry ? oEntry.heading_level : null,
      'text' in oEntry ? oEntry.text : null,
      oCurrParent,
      'options' in oEntry ? oEntry.options : null
      );
    if(oGroup == null){
      return false;
    }
    oCurrParent = oGroup[0];
    if(oGroup[1]){
      bRes = true;
    }
  }
  else {
    if('text' in oEntry && oEntry.text != null && oEntry.text != ""){
      if(newEntry(null, oEntry.text, oCurrParent) != null){
        bRes = true;
      }
    }
  }
  if('entries' in oEntry && oEntry.entries != null){
    for(let oCurrEntry of oEntry.entries){
      if(addEntry(oCurrEntry, oCurrParent)){
        bRes = true;
      }
    }
  }
  if('options' in oEntry && oEntry.options != null){
    for(let oCurrEntry of oEntry.options){
      if('add' in oCurrEntry && oCurrEntry.add){
        if(addEntry(oCurrEntry, oCurrParent)){
          bRes = true;
        }
      }
    }
  }
  if(!bRes){
    oParent.removeChild(oCurrParent.parentElement);
  }
  resetListParameters(getFirst(document.body, "div", "main"), null, null);
  return bRes;
}

function onGetNoteText(){
  const anHeadingLevels = [0, 0, 0, 0, 0, 0];
  const sNoteText = getNoteText(getFirst(document.body, "div", "main"), "", anHeadingLevels, false).replace(/\n{3,}/g, "\n\n").trim();
  const oTextArea = document.forms['noteform']['notetext'];
  const oMain = document.getElementById("main");
  const oNote = document.getElementById("note");
  const oBottom = document.getElementById("bottom");
  const oButtonGetNoteText = document.getElementById("button_getnotetext");
  const oButtonEditNote = document.getElementById("button_editnote");
  oMain.hidden = true;
  oNote.hidden = false;
  oButtonEditNote.hidden = false;
  oButtonGetNoteText.hidden = true;
  oTextArea.value = sNoteText;
  oTextArea.setAttribute("style", "".concat("height: ", "15px; overflow-y:hidden;"));
  oTextArea.setAttribute("style", "".concat("height: ", parseInt(oTextArea.scrollHeight + 15), "px; overflow-y:auto;"));
}

function onEditNote(){
  const oMain = document.getElementById("main");
  const oNote = document.getElementById("note");
  const oBottom = document.getElementById("bottom");
  const oButtonGetNoteText = document.getElementById("button_getnotetext");
  const oButtonEditNote = document.getElementById("button_editnote");
  oMain.hidden = false;
  oNote.hidden = true;
  oButtonEditNote.hidden = true;
  oButtonGetNoteText.hidden = false;
}

function onRestart(){
  if(confirm("Warning: All changes will be lost. Continue?")){
    reset();
  }
}

function getNoteText(oParent, sText, anHeadingLevels, bList){
  let sCurrText = sText;
  let anCurrHeadingLevels = anHeadingLevels;
  const sClass = oParent.hasAttribute("class") ? oParent.getAttribute("class") : null;
  if(sClass != null && sClass == "group"){
    const oHeading = getFirst(oParent, null, "heading");
    const oEntry = getFirst(oParent, "div", "entry");
    const oContent = getFirst(getFirst(oParent, "div", "body"), "div", "content");
    const bListContent = oParent.hasAttribute("data-type") && isInList(oParent.getAttribute("data-type"), aListTypes) ? true : false;
    let sGroupText = "";
    if(oHeading != null){
      if(oHeading.tagName == "P"){
        sGroupText = sGroupText.concat(oHeading.innerText, "\n\n");
      }
      else {
        uLevelIndex = parseInt(Array.from(oHeading.tagName)[1]) - 1;
        for(let uIndex = uLevelIndex + 1; uIndex < 6; uIndex++){
          anCurrHeadingLevels[uIndex] = 0;
        }
        anCurrHeadingLevels[uLevelIndex] = anCurrHeadingLevels[uLevelIndex] + 1;
        let sHeadingValue = "";
        for(let uIndex = 0; uIndex <= uLevelIndex; uIndex++){
          sHeadingValue = sHeadingValue.concat(anCurrHeadingLevels[uIndex].toString(), ".");
        }
        sGroupText = sGroupText.concat(sHeadingValue, " ", oHeading.innerHTML, "\n\n");
      }
    }
    if(oEntry != null){
      sGroupText = getNoteText(oEntry, sGroupText, anCurrHeadingLevels, bList || bListContent);
    }
    sGroupText = getNoteText(oContent, sGroupText, anCurrHeadingLevels, bList || bListContent);
    if(sGroupText.trim() != ""){
      if(!bList){
        sGroupText = "\n".concat(sGroupText, "\n");
      }
    }
    sCurrText = sCurrText.concat(sGroupText);
  }
  else if(sClass != null && (sClass == "content" || sClass == "main")){
    for(let oChild of oParent.children){
      sCurrText = getNoteText(oChild, sCurrText, anCurrHeadingLevels, bList);
    }
  }
  else if(sClass != null && sClass == "entry"){
    const oP = getFirst(getFirst(oParent, "div", "text"), "p", null);
    let sListValue = oParent.hasAttribute("data-listvalue") ? oParent.getAttribute("data-listvalue") : "";
    sListValue = sListValue != "" ? sListValue.concat(" ") : "";
    sCurrText = sCurrText.concat(sListValue, oParent.getAttribute("data-value"), "\n");
  }
  else{
    return sCurrText;
  }
  return sCurrText;
}

function reset(){
  oMainDiv = getFirst(document.body, "div", "main");
  while(oMainDiv.firstChild){
    oMainDiv.removeChild(oMainDiv.lastChild);
  }
  for(let oEntry of ENTRIES){
    addEntry(oEntry, oMainDiv);
  }
  const oMain = document.getElementById("main");
  const oNote = document.getElementById("note");
  const oBottom = document.getElementById("bottom");
  const oButtonGetNoteText = document.getElementById("button_getnotetext");
  const oButtonEditNote = document.getElementById("button_editnote");
  oMain.hidden = false;
  oNote.hidden = true;
  oButtonEditNote.hidden = true;
  oButtonGetNoteText.hidden = false;
}

reset();
