let spaceship = {
    abc: "apple",
    dfg: "tomato",
    diet: () => {
        console.log(this);
    }
}

function energy(object) {
    object["abc"] = "cucuber";
}

function active(object) {
    object.active = "true";
}

energy(spaceship);
console.log(spaceship);
spaceship.diet();