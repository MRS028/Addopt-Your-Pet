document.addEventListener("DOMContentLoaded", function () {
  loadPets();
});
// Sorting according to higher price to lower price
const sortByPrice = () => {
  const spiner = document.getElementById("loadspin"); 
  spiner.classList.remove("hidden");

  fetch("https://openapi.programming-hero.com/api/peddy/pets")
    .then((res) => res.json())
    .then((data) => {
      const sortedPets = data.pets.sort((a, b) => b.price - a.price);

      displayPets(sortedPets);

      setTimeout(() => {
        spiner.classList.add("hidden");
      }, 2000);
    })
    .catch((error) => {
      console.log(error);
      spiner.classList.add("hidden");
    });
};

// Load Categories

const loadCategories = () => {
  fetch("https://openapi.programming-hero.com/api/peddy/categories")
    .then((res) => res.json())
    .then((data) => displayCategories(data.categories))
    .catch((error) => console.log(error));
};

// Display CategoriesBTN
let clickButton = null;
const displayCategories = (categories) => {
  const categoriesContainer = document.getElementById("categoriesbtn");
  categories.forEach((item) => {
    // console.log(item);

    const buttonContainer = document.createElement("div");

    buttonContainer.innerHTML = `
    <button id="btn-${item.id}" onclick="petCategory('${
      item.category
    }',this)" class="btn border-[1px] border-[#0E7A8126] w-full font-extrabold lg:h-20 lg:text-2xl ${
      item.category === ""
        ? "rounded-full border-[2px] bg-[#0E7A811A]  border-[#0E7A81]"
        : ""
    }">
    <img class="w-8" src="${item.category_icon}"/>
    ${item.category}
    </button>
    
    `;
    if (item.category === "Dog") {
      clickButton = buttonContainer.querySelector("button");
    }
    categoriesContainer.append(buttonContainer);
  });
};
const spiner = document.getElementById("loadspin");
// petscategory click
const noInfo = document.getElementById("no-info");
const petsContainer = document.getElementById("petcontainer");
const petCategory = (category, button) => {
  spiner.classList.remove("hidden");
  petsContainer.classList.remove("grid");
  petsContainer.classList.add("hidden");
  noInfo.classList.add("hidden");
  // Remove the rounded-full class from the last clicked button
  if (clickButton) {
    clickButton.classList.remove(
      "rounded-full",
      "bg-[#0E7A811A]",
      "border-[#0E7A81]",
      "border-[3px]"
    );
  }

  button.classList.add(
    "rounded-full",
    "bg-[#0E7A811A]",
    "border-[3px]",
    "border-[#0E7A81]"
  );

  clickButton = button;

  setTimeout(function () {
    loadPets(category);
    spiner.classList.add("hidden");
  }, 2000);
};

// petcategory load
const loadPets = async (category) => {
  spiner.classList.remove("hidden");
  if (category) {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/category/${category}`
    );
    const data = await res.json();
    // console.log(data);
    displayPets(data.data);
  } else {
    const res = await fetch(
      `https://openapi.programming-hero.com/api/peddy/pets`
    );
    const data = await res.json();

    setTimeout(function () {
      displayPets(data.pets);
      spiner.classList.add("hidden");
    }, 2000);
  }
};

// display all pets

const displayPets = (pets) => {
  // console.log(pets);
  petsContainer.innerHTML = "";
  if (pets.length === 0) {
    noInfo.classList.remove("hidden");
    petsContainer.classList.remove("grid");
    petsContainer.classList.add("hidden");
  } else {
    noInfo.classList.add("hidden");
    petsContainer.classList.remove("hidden");
    petsContainer.classList.add("grid");
  }
  pets.forEach((pet) => {
    // console.log(pet);
    const card = document.createElement("div");
    card.classList =
      " my-3 shadow-xl item-center card bg-base-100 w-72 border border-slate-300";

    card.innerHTML = `
                        <figure class="px-6 pt-8">
                          <img
                            src="${pet.image}"
                            alt="Shoes"
                            class="rounded-xl" />
                        </figure>
                        <div class="card-body text-left">
                          <h2 class="card-title">${pet.pet_name}</h2>
                          
                          <div class="opacity-80">
                            <p><i class="fa fa-th-large"></i> Breed: ${
                              pet.breed ? pet.breed : "No Info"
                            } </p>
                            <p><i class="fa-regular fa-calendar"></i>  Birth: ${
                              pet.date_of_birth ? pet.date_of_birth : "No Info"
                            }</p>
                            <p><i class="fa-sharp fa-solid fa-mercury"></i>  Gender: ${
                              pet.gender ? pet.gender : "No Info"
                            } </p>
                            <p><i class="fa-solid fa-dollar-sign"></i>  Price: ${
                              pet.price ? pet.price : "Negotiable"
                            } $  </p>
                          </div>
                          <div class="flex justify-between">
                            <button onclick="likedPets('${
                              pet.image
                            }')" class="btn border border-slate-200 w-[52px]"><i class="fa-duotone fa-solid fa-thumbs-up"></i></button>
                            <button onclick="openModal(this)" class="btn text-[#0E7A81] font-bold border border-slate-200">Adopt</button>
                            <button onclick="loadPetDetails('${
                              pet.petId
                            }')" class="btn text-[#0E7A81] font-bold border border-slate-200">Details</button>
                        </div>
    
    `;
    petsContainer.append(card);
  });
};

loadCategories();

const likedContainer = document.getElementById("likepets");

const likedPets = (images) => {
  likedContainer.classList.remove("h-[465px]");

  const liked = document.createElement("figure");
  liked.innerHTML = `
                <figure class="w-[125px] h-[125px]">
              <img
                src="${images}"
                alt="Shoes"
                class="rounded-xl w-full h-full object-cover"
              />
            </figure>
    `;
  likedContainer.append(liked);
};

const loadPetDetails = (details) => {
  fetch(`https://openapi.programming-hero.com/api/peddy/pet/${details}`)
    .then((res) => res.json())
    .then((data) => showPetDetails(data.petData))
    .catch((error) => console.log(error));
};

const modals = document.getElementById("modals");
const showPetDetails = (data) => {
  const {
    breed,
    pet_name,
    pet_details,
    gender,
    image,
    price,
    date_of_birth,
    vaccinated_status,
  } = data;

  modals.innerHTML = `
    <dialog id="my_modal_1" class="modal w-[95%] mx-auto px-2">
  <div class="modal-box max-w-full lg:w-[700px] w-full ">
    <figure class="px-2 pt-2 h-56 ">
        <img
          src="${image}"
          alt=""
          class="rounded-xl h-full w-full object-fill"
        />
      </figure>
      <div class="flex flex-col gap-5 p-5">
        <div class="text-left px-1">
          <h3 class="font-bold text-xl pb-2">${pet_name}</h3>
          <div class="text-[#131313B3] grid grid-cols-2 space-y-1 text-xs lg:text-base">
            <p class="">
              <i class="fa fa-th-large"></i>
              Breed: ${breed ? breed : "No Info"}
            </p>
            <p class="">
              <i class="fa-regular fa-calendar"></i> Birth: ${
                date_of_birth ? date_of_birth : "No Info"
              }
            </p>
            <p class="">
              <i class="fa-sharp fa-solid fa-mercury"></i> Gender:
              ${gender ? gender : "No Info About Gender"}
            </p>
            <p class="">
              <i class="fa-solid fa-dollar-sign"></i> Price : ${
                price ? price : "Negotiable"
              } $
            </p>
            <p class="">
                <i class="fas fa-syringe"></i>
               Vaccinated Status:
                ${vaccinated_status ? vaccinated_status : "Not enough data"}
              </p>
          </div>
        </div>
        <div
          class="text-left pt-4 border-t-1 space-y-1"
        >
        <p class="font-semibold">Details Information</p>
        <p class="font-normal text-[#131313B3] text-xs lg:text-base">${pet_details}</p>
        </div>
      </div>
    <div class="modal-action w-full justify-center">
      <form method="dialog" class="w-full flex justify-end px-4">
        
            <button class="btn bg-[#5daac633] w-full font-bold">Cancel</button>
      </form>
    </div>
  </div>
</dialog>
    `;
  my_modal_1.showModal();
};

// modal
const openModal = (button) => {
  const modal = document.getElementById("adoptModal");
  modal.classList.remove("hidden");
  startCountdown(button);
};

const closeModal = () => {
  const modal = document.getElementById("adoptModal");
  modal.classList.add("hidden");
};

const startCountdown = (button) => {
  let countdown = 3;
  const countdownDisplay = document.getElementById("countdownDisplay");

  const interval = setInterval(() => {
    countdownDisplay.innerText = countdown;
    countdown--;

    if (countdown < 0) {
      clearInterval(interval);
      button.innerText = "Adopted";
      button.classList.add("font-bold", "text-white");
      button.disabled = true;
      closeModal();
    }
  }, 1000);
};

// view section

const viewMoreButton = document.getElementById("viewMoreButton");
const mainSection = document.getElementById("mainSection");


const scrollToMainSection = () => {
  mainSection.scrollIntoView({ behavior: 'smooth' }); 
};
viewMoreButton.addEventListener("click", scrollToMainSection);

