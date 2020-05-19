const weatherIcons = {
	"Rain": "wi wi-day-rain",
	"Clouds": "wi wi-day-cloudy",
	"Clear": "wi wi-day-sunny",
	"Snow": "wi wi-day-snow",
	"mist": "wi wi-day-fog",
	"Drizzle": "wi wi-day-sleet",
}

function capitalize(str) {
	return str[0].toUpperCase() + str.slice(1);
}

async function main(withIP = true) {
	let city;

	if (withIP) {
		//1. Aller chercher l'adresse IP du PC ou mobile qui ouvre la page :
		// https://api.ipify.org?format=json
		const ip = await fetch('https://api.ipify.org?format=json')

			//Réception du résultat et transforme en JSON
			.then(result => result.json())
			//Ici je récupère objet IP que je stocke dans const
			.then(json => json.ip)

		//2. Aller chercher la Ville grâce à l'IP récupéré :
		//https://freegeoip.net/json/adresseIP
		city = await fetch('https://freegeoip.app/json/' + ip)
			.then(result => result.json())
			.then(json => json.city)
	} else {
		city = document.querySelector('#city').textcontent;
	}

	//3. Aller chercher les infos météo de la Ville :
	//https://api.openweathermap.org
	const meteo = await fetch('https://api.openweathermap.org/data/2.5/weather?q=${city}&lang=fr&units=metric&appid=cb901a7223fbb87d94e1799c3edfb63e')
		.then(result => result.json())
		.then(json => json)
	//4.Affichage dynamique sur la page
	displayWeatherInfos(meteo);
}

function displayWeatherInfos(data) {
	const name = data.name;
	const temperature = data.main.temp;
	const conditions = data.weather[0].main;
	const description = data.weather[0].description;

	document.querySelector('#city').textContent = name;
	document.querySelector('#temperature').textContent = Math.round(temperature);
	document.querySelector('#conditions').textContent = capitalize(description);
	document.querySelector('i.wi').className = weatherIcons[conditions];
	document.body.className = conditions.toLowerCase();
}

const city = document.querySelector('#city');
city.addEventListener('click', () => {
	city.contentEditable = true;
});

city.addEventListener('keydown', (evt) => {
	if (evt.keyCode === 13) {
		evt.preventDefault();
		city.contentEditable = false;
		main(false);
	}
});

main();