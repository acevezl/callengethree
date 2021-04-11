// Assignment Code
var generateBtn = document.querySelector("#generate");
var passwordSize = 0;

// Validate password size is between 0 and 128
function validateSize() {
  passwordSize = parseInt(document.getElementById("passwordLength").value);
  if (passwordSize > 7 && passwordSize < 129) {
    return true;
  } else {
    return false;
  }
}

// Generate password
function generatePassword() {
  var password = "";
  if (validateSize()) {
    // User selected a valid number to create a password
    // Get the additional types of characters to include
    var includeNumbers = document.getElementById("numericCharacters").checked;
    var includeUppercase = document.getElementById("uppercaseCharacters").checked;
    var includeSpecial = document.getElementById("specialCharacters").checked;

    // Create strings with all the possible characters, we'll use the as arrays to pick characters randomly from them
    var passwordCharacters = "abcdefghijklmnopqrstuvwxyz";
    var uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numericCharacters = "0123456789";
    var specialCharacters = "!\"#$%&*+-?^_|";

    // If user selected upper case characters, add them to the pool of password characters
    // I'm doing upper characters first on purpose, so that we can randomly select a letter for the first password character
    if (includeUppercase) {
      passwordCharacters = passwordCharacters + uppercaseCharacters;
    }

    // Choose a first character that is always letter (lower or upper case)
    // I'm doing this so that the password always starts with a letter, as some systems don't accept numbers or special characters as the first letter for a password
    var availableCharacters = passwordCharacters.length;
    password = passwordCharacters[Math.floor(Math.random()*availableCharacters)];

    // If user selected numbers, add numbers to the pool of password characters
    if (includeNumbers) {
      passwordCharacters = passwordCharacters + numericCharacters;
    }
    
    // if user selected special characters, add them to the pool of password characters
    if (includeSpecial) {
      passwordCharacters = passwordCharacters + specialCharacters;
    }

    // Refresh the number availableCharacters in case numbers and special characters were added to the pool
    availableCharacters = passwordCharacters.length;
    
    // Randomly select a character from the pool for every position of the password string
    // I'm starting at position 1 on purpose, because position zero already contains a character (which is a letter)
    for (var i=1; i<passwordSize; i++) {
      password = password + passwordCharacters[Math.floor(Math.random()*availableCharacters)];
    }
    
    // At this point the password ** may ** or ** may not ** include Upper Case characters, Numbers, and Special characters
    // Since we can't guarantee that the code above randomly selected a upper, number or special (if any of those were selected)
    // the following code is necessary to insert at least one character of each of the selected types
    
    // These vars are needed to remember where the number and/or special characters were added and not overwrite them
    var randomNumberPosition = 0;
    var randomSpecialPosition = 0;
    
    // Add one random number in a random location
    if (includeNumbers) {
      // Get a random position between 1 (second character) and password length (preserve first char as a letter)
      var randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1; // The + 1 ensures the first letter is never overwritten
      password = password.slice(0,randomPosition) + numericCharacters[Math.floor(Math.random()*numericCharacters.length)] + password.slice(randomPosition+1,password.length);
      randomNumberPosition = randomPosition; // Remember where the number is, so the next if doesn't replace the number
    }

    // Add one random special character in a random location
    if (includeSpecial) {
      // Start with the same position where we placed the number (or zero, if user didn't ask for a number)
      var randomPosition = randomNumberPosition;
      // Ensure we don't pick the same position where we placed a number
      while (randomPosition === randomNumberPosition) {
        randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1; // The + 1 ensures the first letter is never overwritten
      } 
      password = password.slice(0,randomPosition) + specialCharacters[Math.floor(Math.random()*specialCharacters.length)] + password.slice(randomPosition+1,password.length);
      randomSpecialPosition = randomPosition;
    }

    // Add one random special character in a random location
    if (includeUppercase) {
      // Start with the same position where we placed a special character (or zero, if user didn't ask for a special character)
      var randomPosition = randomSpecialPosition;
      // Ensure we don't pick the same position where we placed a number, or a special character (or zero, if user didn't ask for a number)
      while (randomPosition === randomSpecialPosition || randomPosition === randomNumberPosition) {
        randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1; // The + 1 ensures the first letter is never overwritten
      } 
      password = password.slice(0,randomPosition) + uppercaseCharacters[Math.floor(Math.random()*uppercaseCharacters.length)] + password.slice(randomPosition+1,password.length);
    }
    
    
    return password;
  } else {
    alert ("Your password length must be between 8 and 128 characters.\nPlease enter a valid length.");
    return false;
  }
}

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");
  if (password) {
    passwordText.value = password;
  }
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
