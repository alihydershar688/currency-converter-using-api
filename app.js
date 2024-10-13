const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies" // Correct URL with version

const dropdown = document.querySelectorAll(".dropdown select")
const btn = document.querySelector("form button")
const fromCurr = document.querySelector(".form select")
const toCurr = document.querySelector(".to select")

for (let select of dropdown) {
  for (currCode in countryList) {
    let newOption = document.createElement("option")
    newOption.innerText = currCode
    newOption.value = currCode

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected"
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected"
    }
    select.append(newOption)
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target)
  })
}

const updateFlag = (element) => {
  let currCode = element.value
  let countryCode = countryList[currCode]
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`
  let img = element.parentElement.querySelector("img")
  img.src = newSrc
}

btn.addEventListener("click", async (evt) => {
  evt.preventDefault()
  let amount = document.querySelector(".amount-input")
  let amtVal = amount.value

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1
    amount.value = "1"
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`

  try {
    console.log(`Fetching data from: ${URL}`)
    let response = await fetch(URL)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    let data = await response.json()
    console.log("Fetched data:", data)

    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()]

    if (!rate) {
      throw new Error(
        `Conversion rate not found for ${fromCurr.value} to ${toCurr.value}`
      )
    }

    let finalAmount = amtVal * rate
    const msg = document.querySelector(".msg")
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`
  } catch (error) {
    console.error("Error:", error.message)
    alert("Failed to fetch the exchange rate. Please try again later.")
  }
})
