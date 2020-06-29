const elements = ["name", "motto", "subjects"]
let selectedElements = []

const form = document.querySelector("#form")
let allowSubmission = false

elements.forEach(element => {
	selectedElements.push(document.getElementById(element))
})


// Functions

// Shows the error message
const showErrorMessage = (inputTag, message) => {
	const formControl = inputTag.parentElement;
	formControl.className = "form-control error";
	const messageBox = formControl.querySelector("small");
	messageBox.innerText = message;
};

const showSuccess = inputTag => {
	inputTag.parentElement.className = "form-control success";
};

// Gets the input field name and turns the first letter to capital
const getFieldName = input => input.id.charAt(0).toUpperCase() + input.id.slice(1);

// Checks if a field is empty
const checkRequired = inputTagArr => {
	inputTagArr.forEach(input => {
		if (input.value.trim() === "") {
			showErrorMessage(input, `${getFieldName(input)} is required`);
			return false
		} else {
			showSuccess(input);
			return false 
		}
	});
};


// Checks if the passwords match
const checkMatchingPasswords = (firstInput, secondInput) => {
	let arr = [firstInput, secondInput];
	if (firstInput.value !== secondInput.value) {
		showErrorMessage(secondInput, `Passwords do not match`);
	} else {
		showSuccess(secondInput);
	}
};

// Checks the legth of the input field
const checkLength = (input, min, max) => {
	if (input.value.length < min) {
		showErrorMessage(input, `${getFieldName(input)}, must be at least ${min} characters`);
		return false
	} else if (input.value.length > max) {
		showErrorMessage(input, `${getFieldName(input)}, must be less than ${max} characters`);
		return false
	} else {
		showSuccess(input); 
		return true
	}
};

const checkSubmission = () => {

	if (!checkRequired([...selectedElements]) 
		|| !checkLength(selectedElements[0], 4, 16) 
		|| !checkLength(selectedElements[1], 6, 25)) {
		return false
	}
	else {
		allowSubmission = true
		return true
	}
}


form.addEventListener("submit", (event) => {
	checkSubmission()
	
});