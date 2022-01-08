// function Validator(options) {
//     var selectorRules = {};

//     function getParent(inputElement, groupSelector) {
//         while (inputElement.parentElement) {
//             if (inputElement.parentElement.matches(groupSelector)) {
//                 return inputElement.parentElement;
//             } else {
//                 inputElement = inputElement.parentElement;
//             }
//         }
//     }

//     function validate(inputElement, rule) {
//         var errorMessage;
//         var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);

//         var rules = selectorRules[rule.selector];

//         for (var i = 0; i < rules.length; i++) {
//             switch (inputElement.type) {
//                 case 'checkbox':
//                 case 'radio':
//                     errorMessage = rules[i](formElement.querySelector(rule.selector + ':checked'));
//                     break;

//                 default:
//                     errorMessage = rules[i](inputElement.value);
//             }
//             if (errorMessage) {
//                 break;
//             }
//         }
//         if (errorMessage) {
//             errorElement.innerText = errorMessage;
//             getParent(inputElement, options.formGroupSelector).classList.add('invalid');
//         } else {
//             errorElement.innerText = "";
//             getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
//         }

//         return !errorMessage;
//     }

//     var formElement = document.querySelector(options.form);

//     if (formElement) {

//         formElement.onsubmit = function(e) {
//             e.preventDefault();
//             var IsFormValid = true;
//             options.rules.forEach(function(rule) {
//                 var inputElement = document.querySelector(rule.selector);
//                 if (!validate(inputElement, rule)) {
//                     IsFormValid = false;
//                 };
//             });

//             if (IsFormValid) {
//                 var enabledInputs = document.querySelectorAll('[name]:not(meta)');
//                 var valueForms = Array.from(enabledInputs).reduce((value, input) => {
//                     switch (input.type) {
//                         case "radio":
//                             if (input.matches(":checked")) {
//                                 value[input.name] = input.value;
//                             }
//                             break;
//                         case "checkbox":

//                             if (input.matches(":checked")) {
//                                 if (!Array.isArray(value[input.name])) {
//                                     value[input.name] = [input.value];
//                                 } else {
//                                     value[input.name].push(input.value);
//                                 }
//                             } else {
//                                 if (Array.isArray(value[input.name])) {
//                                     return value;
//                                 } else {
//                                     value[input.name] = "";
//                                     return value;
//                                 }
//                             }
//                             break;
//                         case 'file':
//                             value[input.name] = input.files;
//                             break;
//                         default:
//                             value[input.name] = input.value;
//                     }
//                     return value;
//                 }, {});
//                 if (typeof options.onSubmit === 'function') {
//                     options.onSubmit(valueForms);
//                 }
//             }
//         }
//         options.rules.forEach(function(rule) {

//             if (Array.isArray(selectorRules[rule.selector])) {
//                 selectorRules[rule.selector].push(rule.test);
//             } else {
//                 selectorRules[rule.selector] = [rule.test];
//             }

//             var inputElements = document.querySelectorAll(rule.selector);

//             Array.from(inputElements).forEach(function(inputElement) {

//                 inputElement.onblur = function() {
//                     validate(inputElement, rule);
//                 }

//                 inputElement.oninput = function() {
//                     var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
//                     errorElement.innerText = "";
//                     getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
//                 }
//             });
//         });
//     }
// }

// Validator.isRequired = function(selector, message) {
//     return {
//         selector: selector,
//         test: function(value) {
//             return value ? undefined : message || 'Vui lòng nhập trường này'
//         }
//     }
// }

// Validator.isEmail = function(selector, message) {
//     return {
//         selector: selector,
//         test: function(value) {
//             var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//             return regex.test(value) ? undefined : message || "Trường này phải là email";
//         }
//     }
// }
// Validator.minLength = function(selector, min, message) {
//     return {
//         selector: selector,
//         test: function(value) {
//             return value.length >= min ? undefined : message || `Vui lòng nhập tối thiểu ${min} ký tự`
//         }
//     }
// }
// Validator.isConfirmed = function(selector, getConfirmValue, message) {
//     return {
//         selector: selector,
//         test: function(value) {
//             return value === getConfirmValue() ? undefined : message || "Gía trị nhập vào không đúng"
//         }
//     }
// }




function Validator(selectorForm, option = '') {
    var formElement = document.querySelector(selectorForm);
    var formRules = {};
    var validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này'
        },
        isEmail: function(value) {
            var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return regex.test(value) ? undefined : "Trường này phải là email";
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Phải nhập ít nhất ${min} kí tự`
            }
        }
    }

    function getParent(formElement, selector) {
        while (formElement.parentElement) {
            if (formElement.parentElement.matches(selector)) {
                return formElement.parentElement;
            }
            formElement = formElement.parentElement;

        }
    }

    function handlerClearError(event) {
        var formElement = event.target;
        var messageError;
        getParent(formElement, '.form-group').classList.remove('invalid');
        getParent(formElement, '.form-group').querySelector('.form-message').innerText = "";
    }


    function handlerValidate(event) {
        var rules = formRules[event.target.name];
        var messageError;
        rules.some(function(rule) {
            messageError = rule(event.target.value);
            return messageError;
        });

        if (messageError) {
            getParent(event.target, '.form-group').classList.add('invalid');
            getParent(event.target, '.form-group').querySelector('.form-message').innerText = messageError;
        } else {
            getParent(event.target, '.form-group').classList.remove('invalid');
            getParent(event.target, '.form-group').querySelector('.form-message').innerText = "";
        }
        return !messageError;
    }

    if (formElement) {
        var inputs = formElement.querySelectorAll('[name],[rule]');
        for (var input of inputs) {
            var rules = input.getAttribute('rule').split('|');

            for (var rule of rules) {
                var ruleInfo = [];
                var ruFunc = rule.includes(':');
                if (ruFunc) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }
                if (Array.isArray(formRules[input.name])) {
                    if (ruFunc) {
                        formRules[input.name].push(validatorRules[rule](ruleInfo[1]));
                    } else {
                        formRules[input.name].push(validatorRules[rule]);
                    }
                } else {
                    if (ruFunc) {
                        formRules[input.name] = [validatorRules[rule](ruleInfo[1])];
                    } else {
                        formRules[input.name] = [validatorRules[rule]];
                    }
                }

            }
            input.onblur = handlerValidate;
            input.oninput = handlerClearError;
        }
        formElement.onsubmit = function(e) {
            if (typeof option.onSubmit === 'function') {
                e.preventDefault();
                var isFormValid = true;
                for (var input of inputs) {
                    if (!handlerValidate({ target: input })) {
                        isFormValid = false;
                    }
                }
                if (isFormValid) {
                    var fomrValues = Array.from(inputs).reduce((value, input) => {
                        value[input.name] = input.value;
                        return value;
                    }, {});
                    option.onSubmit(fomrValues);
                }
            } else {
                formElement.submit();
            }

        }
    }
}