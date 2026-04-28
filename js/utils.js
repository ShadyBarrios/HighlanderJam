function date(timestamp){
    const date = timestamp.toDate();
    const formatted = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
    });

    return formatted
}


function getDisplayName(fullName){
    if(!fullName) return null;

    const firstName = fullName.split(" ")[0];

    // this'll only pull main last names (i.e. only "Cruz" from "de la Cruz")
    // needs global flag to get all matches
    const initialRegex = new RegExp("(?<= )[A-Z]", "g"); 

    const lastInitials = fullName.match(initialRegex).map(initial => `${initial}.`).join("");
    const displayName = firstName.concat(" ", lastInitials);
    return displayName;
}

export{ date, getDisplayName } 