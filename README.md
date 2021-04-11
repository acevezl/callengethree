# 03 JavaScript: Password Generator

Application that generates a random password based on user-selected criteria. The app asks for the following parameters:

* Password Length (Numeric input)
* Include numbers? (Checkbox)
* Include upper case charaters? (Checkbox)
* Include special characters? (Checkbox)

This app dynamically updates HTML and CSS powered by JavaScript code. 

## Logic

### Step One: Collecting user inputs

1. Instead of JS prompts, I've opted for HTML input elements (number, and checkbox). User will enter a password length between 8 and 128 characters.

2. Users may select additional types of characters to include in the password. These selections are collected via input (checkbox).

3. Password generation is triggered when users click on Generate Password. This button has an event listener _**writePassword()**_ which in turn calls other functions to validate inpupts and create the password.

### Step Two: Validating user inputs

1. _Generate Password_ has event listener: _**writePassword()**_.

2. **writePassword()** calls the function _**generatePassword()**_. This function will call _**validateSize()**_.

3. **validateSize()** checks that the _passwordLength_ input has a number between 8 and 128. If the number is within this range, it will return **True**, otherwise, it will return **False**

4. **generatePassword()** uses the True / False value to either generate a password, or alert the user that the password length must be between 8 and 128 characters.

### Step Three: Generate the actual password

1. If **validateSize()** returns true. The fun starts!

2. The following variables gather the additinoal inputs selected by the user (Include Numbers?, Include Upper Case?, and Include Special Characters?)
```
    var includeNumbers = document.getElementById("numericCharacters").checked;
    var includeUppercase = document.getElementById("uppercaseCharacters").checked;
    var includeSpecial = document.getElementById("specialCharacters").checked;
```
3. The very first step to start geerating a password is to create a _**Password Pool**_ that contains all possible password characters to choose from:
``` 
    var passwordCharacters = "abcdefghijklmnopqrstuvwxyz";
```

4. We'll need to create three more character pools for the additional inputs the user might have selected:
```
    var uppercaseCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var numericCharacters = "0123456789";
    var specialCharacters = "!\"#$%&*+-?^_|";
```

5. Next, we need to add the smaller character pools into our original _**passwordCharacters**_ pool if users have selected those additional inputs. We'll check for _upper case_ characters first:
```
    if (includeUppercase) {
      passwordCharacters = passwordCharacters + uppercaseCharacters;
    }
```

* Note: We're starting the password with a letter because most systems require the first character to be a letter, not a special ASCII nor a number:

```
    var availableCharacters = passwordCharacters.length;
    password = passwordCharacters[Math.floor(Math.random()*availableCharacters)];
```

6. At this point our password has one character, which is a letter. Next we need to check if user selected numbers. If so, we'll add the numbers to our _**passwordCharacters**_ pool:
```
    if (includeNumbers) {
      passwordCharacters = passwordCharacters + numericCharacters;
    }
```
7. We'll repeat the same logic, now for special characters: If user selected this input, we'll add them to the pool.
```
    if (includeSpecial) {
      passwordCharacters = passwordCharacters + specialCharacters;
    }
```
8. We'll refresh the length of our _**passwordCharacters**_ pool. This will be used to randomly generate an _index_ which will help us select a random character from the pool. 
```
    availableCharacters = passwordCharacters.length;
```

9. We'll do this as many times as needed up until we reach the password length entered by the user (which is stored in _**passwordSize**_):
```
    for (var i=1; i<passwordSize; i++) {
      password = password + 
        passwordCharacters[Math.floor(Math.random()*availableCharacters)];
    }
```
10. At this point we have a randomly-generated* password on _**password**_ with a length of: _**passwordSize**_. 

 > *Math.random() **does not** generate a true random number, it is a PNRG (pseudo-random number generator). We _could_ use the **Crypto.getRandomValues()** whichi is a HRNG (hardware random number generator) which incorporates real-world dat points, but for the purposes of this specific tool a PNRG is perfectly sufficient. Not to mention that... philosophically speaking... is randomness real?

**Anyway, I've digressed here...** At this point, due to the "Random" nature of the script above, we may or may not have hit all the additional characters selected by the user. This is because there's a much larger chace to get a letter than a number or a special character (in fact, it is twice as likely that each character of the password will be a letter instead of a number o a special character). 

In order to ensure the generated password complies with the criteria entered by the user, we'll need to add at least one character of each of the selected inputs into a random location in the string:

11. If user selected Include numbers: randomly select a number from the numbers pool _**numericCharacters**_ and enter it in a random location between 1 (the second character of the string) and _**passwordSize**_.
```
    if (includeNumbers) {
      // Get a random position between 1 (second character) and password length (preserve first char as a letter)
      var randomPosition = Math.floor(Math.random() 
        * (passwordSize - 1)) + 1; // The + 1 ensures the first letter is never overwritten
      password = password.slice(0,randomPosition) 
        + numericCharacters[Math.floor(Math.random()*numericCharacters.length)] 
        + password.slice(randomPosition+1,password.length);
      randomNumberPosition = randomPosition; // Remember where the number is, so the next if doesn't replace the number
    }
```

12. As you can see we're storing the position where we entered the character, so that we dont overwrite it when adding a special character. We'll repeat a very similar logic, with the addition of a _while_ cycle which will allow us to generate a random position that is not the same as the position where we entered the number in the previous step.

```
    if (includeSpecial) {
      // Start with the same position where we placed the number (or zero, if user didn't ask for a number)
      var randomPosition = randomNumberPosition;
      // Ensure we don't pick the same position where we placed a number
      while (randomPosition === randomNumberPosition) {
        randomPosition = Math.floor(Math.random() 
        * (passwordSize - 1)) + 1; 
        // The + 1 ensures the first letter is never overwritten
      } 
      password = password.slice(0,randomPosition) 
        + specialCharacters[Math.floor(Math.random()*specialCharacters.length)] 
        + password.slice(randomPosition+1,password.length);
      randomSpecialPosition = randomPosition;
    }
```

13. It would be very rare if we don't have an upper case character on the generated password - however, it is certainly possible that an uppercase letter was not randomly added to the password (Although this possibility is reduced to virtually zero when a user selects a password longer than 76 character) - Note I'm saying _virtually_ because the limit only approaches zero, but never really hits it. ("The limit doesn't exist" - Mean Girls). Here is where we'll ensure at least one upper case character is added - again same logic as above, but now check that we don't place this upper case character on the position where we placed both the numeric and the special characters:
```
   if (includeUppercase) {
      // Start with the same position where we placed a special character (or zero, if user didn't ask for a special character)
      var randomPosition = randomSpecialPosition;
      // Ensure we don't pick the same position where we placed a number, or a special character (or zero, if user didn't ask for a number)
      while (randomPosition === randomSpecialPosition || randomPosition === randomNumberPosition) {
        randomPosition = Math.floor(Math.random() * (passwordSize - 1)) + 1; // The + 1 ensures the first letter is never overwritten
      } 
      password = password.slice(0,randomPosition) + uppercaseCharacters[Math.floor(Math.random()*uppercaseCharacters.length)] + password.slice(randomPosition+1,password.length);
    }
```

# Epilogue

With all these crazy edge scenarios covered, you may wonder _but like... won't we also have edge cases on which a lower case character was never randomly generated?_ Perhaps yes, but there's no acceptance criteria nor requirement on the user story that explicitly states that the password must include a lower case character. It simply states to generate the password - and ask for additional prompts for Upper, Numbers, and Special characters. So... in the words of Joe Biden: "C'mon maaaaan!".





- - -
Luis Arnaut