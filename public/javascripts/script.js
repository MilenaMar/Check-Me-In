const url ="https://restcountries.eu/rest/v2/all"


function updateCountry(response) {
const countries =[];
for (let i =0 ; i<response.data.length;i++){
  countries.push(response.data[i].name)
  
}
const select = document.createElement("select");
  select.name = "country";
  select.id = "location-country";
  select.type="text"
  for (const val of countries) {
    const option = document.createElement("option");
    option.value = val;
    option.text = val.charAt(0).toUpperCase() + val.slice(1);
    select.appendChild(option);
  }
  document.getElementById("location-country").appendChild(select);
} 

axios.get(url).then(updateCountry).catch(err => console.log ("not cities", err))


