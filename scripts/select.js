//select.js :: card selection
//it's so screwed it needs its own file

moveDelay = 16 //ms delay between mousemove events
selected = 0 //ammount of cards selected
selectMax = 5 //max cards to select

function setCards(){ //set up card moving
	cards = document.querySelectorAll("#playhand card-t:not([onmousedown])")
	cards.forEach((card) => {
		card.onmousedown = dragStart
		card.onmouseenter = swipeSelect
	})
}

function selectCard(card){ //toggle card selection
	if (card.getAttribute("selected") == null){
		if (selected < selectMax){
			card.setAttribute("selected","")
			selected += 1
			console.log("i'm readyy")
		}
	}else{
		card.removeAttribute("selected")
		selected -= 1
		console.log("oh.. nevermind")
	}
}
function swipeSelect(e){ //swipe card to select it
	if (e.buttons == 1 && data.settings.card_swipeselect && cutscene == 0){
		selectCard(e.target)
	}
}
//card moving::
function dragStart(e){
	if (cutscene){return}
	dragTarget = e.target
	//console.log(dragTarget)
	//dragTarget.style.opacity = "1"
	cards = document.querySelectorAll("card-t")
	cards.forEach((card) => {
		card.onmousedown = "" //{removeAttribute doesn't work}
		card.onmouseenter = ""
	})
	document.body.onmouseup = dragStop
	document.body.onmouseleave = dragStop
	mousepos = [e.clientX,e.clientY]
	xpositions = []
	document.body.onmousemove = dragMove
	clickLeniency = data.settings.card_clickleniency
}
function cardSwap(e){ //swapping cards while dragging
	pile = dragTarget.parentElement
	cards = pile.querySelectorAll("card-t:not([style])")
	order = []
	order.push([dragTarget,e.clientX - 40])
	cards.forEach((card) => {
		order.push([card,card.getBoundingClientRect().x])
	})
	order.sort((a,b) => {return a[1] - b[1]}) //sort by x position
	pile.innerHTML = "<div class=cardmove></div>"
	order.forEach((item) => {
		pile.appendChild(item[0])
	})
	for (var i = 0;i<order.length;i+=1){
		pile.appendChild(order[i][0])
		// console.log(order[i][0])
	}
}
function dragMove(e){
	if (clickLeniency == 0){
		if (!data.settings.card_dragoptimise){
			cardSwap(e)
		}else{
			if (document.querySelector(".cardmove") == null){
				drag = document.createElement("div")
				drag.className = "cardmove"
				dragTarget.parentElement.appendChild(drag)
			}
		}
		dragTarget.style.opacity = "0"
		drag = document.querySelector(".cardmove")
		drag.style.left = `${e.clientX - 40}px`
		drag.style.top = `${e.clientY - 56}px`
	}else{
		clickLeniency -= 1
		if (clickLeniency == 0){console.log("movingmoving")}
	}
}
function dragStop(e){
	if (data.settings.card_dragoptimise == 1 && clickLeniency == 0){
		cardSwap(e)
		document.querySelector(".cardmove").remove()
	}
	if (clickLeniency > 0){ //click detection
		selectCard(dragTarget)
	}else{
		console.log("you've dropped me..")
		try{document.querySelector(".cardmove").remove()}catch{}
	}
	document.body.onmousemove = ""
	document.body.onmouseup = ""
	document.body.onmouseleave = ""
	dragTarget.onmousedown = dragStart
	dragTarget.onmouseenter = swipeSelect
	dragTarget.removeAttribute("style")
	setCards()
}