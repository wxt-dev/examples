document.title = browser.i18n.getMessage("popupTitle");

declare const messageH1: HTMLHeadingElement;
messageH1.textContent = browser.i18n.getMessage("helloWorld", "John Smith");
