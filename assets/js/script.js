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

    var includeNumbers = document.getElementById("numericCharacters").checked;
    var includeUppercase = document.getElementById("uppercaseCharacters").checked;
    var includeSpecial = document.getElementById("specialCharacters").checked;
    var passwordCharacters = "abcdefghijklmnopqrstuvwxyz";
    var uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numericCharacters = "0123456789";
    var specialCharacters = "!\"#$%&*+-?^_|";

    // We first add uppercase letters, if selected, so that we can pick a random character that is always a letter
    if (includeUppercase) {
      passwordCharacters = passwordCharacters + uppercaseCharacters;
    }
    // Choose a first character that is a letter (lower or upper case)
    var availableCharacters = passwordCharacters.length;
    password = passwordCharacters[Math.floor(Math.random()*availableCharacters)];

    if (includeNumbers) {
      passwordCharacters = passwordCharacters + numericCharacters;
    }
    
    if (includeSpecial) {
      passwordCharacters = passwordCharacters + specialCharacters;
    }
    // Refresh availableCharacters in case numbers and special characters were selected
    availableCharacters = passwordCharacters.length;
    
    for (var i=1; i<passwordSize; i++) {
      password = password + passwordCharacters[Math.floor(Math.random()*availableCharacters)];
    }
    
    // At this point the password may or may not include Upper Case characters, Numbers, and Special characters
    // The following code is necessary to add at least one special, number, or upper case character (if any of those were selected)
    // This will allow the password to always have at least one of the types of characters selected by the user
    
    var randomNumberPosition = 0;
    var randomSpecialPosition = 0;
    
    // Add one random number in a random location
    if (includeNumbers) {
      // Get a random position between 1 (second character) and password length (preserve first char as a letter)
      var randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1;
      password = password.slice(0,randomPosition) + numericCharacters[Math.floor(Math.random()*numericCharacters.length)] + password.slice(randomPosition+1,password.length);
      randomNumberPosition = randomPosition; // Remember where the number is, so the next if doesn't replace the number
    }

    // Add one random special character in a random location
    if (includeSpecial) {
      // Start with the same position where we placed the number (or zero, if user didn't ask for a number)
      var randomPosition = randomNumberPosition;
      // Ensure we don't pick the same position where we placed a number (or zero, if user didn't ask for a number)
      while (randomPosition === randomNumberPosition) {
        randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1;
      } 
      password = password.slice(0,randomPosition) + specialCharacters[Math.floor(Math.random()*specialCharacters.length)] + password.slice(randomPosition+1,password.length);
      randomSpecialPosition = randomPosition;
    }

    // Add one random special character in a random location
    if (includeUppercase) {
      // Start with the same position where we placed a special character (or zero, if user didn't ask for a special character)
      var randomPosition = randomNumberPosition;
      // Ensure we don't pick the same position where we placed a number, or a special character (or zero, if user didn't ask for a number)
      while (randomPosition === randomSpecialPosition || randomPosition === randomNumberPosition) {
        randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1;
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
