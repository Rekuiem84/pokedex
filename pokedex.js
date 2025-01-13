const url = "https://pokeapi.co/api/v2/pokemon/";

const spriteGrandElement = document.querySelector(".pokemon-3Dmodel > img");

const pokemonList = document.querySelector(".pokemon-list");
const shinyButton = document.querySelector(".shiny-button");

let isShiny = false;
window.addEventListener("load", getPokeData(1, 151));

function getPokeData(firstPoke, lastPoke) {
	//must wait a bit before fetching the data for the gen selector animation to work properly
	setTimeout(() => {
		const pokemonData = []; // array to store each Pokemon's data
		const nb_pokemon = lastPoke - firstPoke + 1;

		const promises = [];

		for (let i = firstPoke; i <= lastPoke; i++) {
			const finalUrl = url + i;
			const promise = fetch(finalUrl)
				.then((response) => response.json())
				.then((data) => {
					pokemonData[i - firstPoke] = data;
				});
			promises.push(promise);
		}
		// after all the promises are resolved, we can generate the cards
		Promise.all(promises).then(() => {
			pokemonList.innerHTML = "";
			// if we have fetched all the Pokemon data, generate the cards in the correct order
			pokemonData.forEach((data) => {
				generateCard(data, lastPoke, isShiny);
			});
			betterPokemonCards();
			selectPokemon();
		});
	}, 200);
}

function generateCard(data, lastPoke, isShiny) {
	const dex_number = data.id;
	const name = data.name;
	const spriteGrand = data.sprites.other["official-artwork"].front_default;
	const spriteGrandShiny = data.sprites.other["official-artwork"].front_shiny;
	const spriteIcon = data.sprites.front_default;

	pokemonList.innerHTML += ` <li class="pokemon${
		dex_number == lastPoke ? " pokemon-active" : ""
	}" 
	data-sprite-grand="${spriteGrand}" 
	data-shiny="${spriteGrandShiny}" 
	data-id="${dex_number}">
  <div>
  <div class="pokemon__sprite">
  <img src="${spriteIcon}" alt="sprite">
  </div>
  <p class="pokemon__num">No. <span class="pokemon__num--field">${dex_number}</span></p>
  </div>
  <p class="pokemon__name">${name}</p>
  <div class="pokeball">
  <img src="images/pokeball.png" alt="pokeball">
  </div>
  </li>
  `;
	if (isShiny) {
		spriteGrandElement.src = spriteGrandShiny;
	} else {
		spriteGrandElement.src = spriteGrand;
	}
	spriteGrandElement.setAttribute("data-id", dex_number);
}

function betterPokemonCards() {
	let pokemons = document.querySelectorAll(".pokemon");
	//adds one or two 0 to the dex number if it is less than 10 or 100
	pokemons.forEach((pokemon) => {
		let dex_entry = pokemon.firstElementChild.lastElementChild.lastElementChild;
		if (dex_entry.innerText.length == 1) {
			dex_entry.innerText = "00" + dex_entry.innerText;
		} else if (dex_entry.innerText.length == 2) {
			dex_entry.innerText = "0" + dex_entry.innerText;
		}
	});
}
function selectPokemon() {
	let pokemons = document.querySelectorAll(".pokemon");
	pokemons.forEach((pokemon) => {
		//adds an event listener to each pokemon so that when you click on it, it adds the class pokemon-active and changes the sprite
		pokemon.addEventListener("click", () => {
			spriteGrandElement.setAttribute(
				"data-id",
				pokemon.getAttribute("data-id")
			);
			determinePokemonSprite(pokemon, isShiny);
			pokemons.forEach((pokemon) => {
				pokemon.classList.remove("pokemon-active");
			});
			pokemon.classList.add("pokemon-active");
		});
	});
}
function determinePokemonSprite(pokemon, isShiny) {
	if (isShiny) {
		spriteGrandElement.src = pokemon.getAttribute("data-shiny");
	} else {
		spriteGrandElement.src = pokemon.getAttribute("data-sprite-grand");
	}
	console.log(isShiny);
}

shinyButton.addEventListener("click", () => {
	toggleShiny();
});

function toggleShiny() {
	let pokemonSpriteLink =
		"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
	isShiny = !isShiny;
	let shinyButtonImage = document.querySelector(".shiny-button > img");
	shinyButtonImage.src =
		isShiny == true
			? "images/shiny-stars-active.png"
			: "images/shiny-stars.png";
	if (isShiny) {
		spriteGrandElement.src =
			pokemonSpriteLink +
			"shiny/" +
			spriteGrandElement.getAttribute("data-id") +
			".png";
	} else {
		spriteGrandElement.src =
			pokemonSpriteLink + spriteGrandElement.getAttribute("data-id") + ".png";
	}
}
