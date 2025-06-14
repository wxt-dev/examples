browser.devtools.panels.create(
  "Example Panel",
  "icon/128.png",
  "devtools-panel.html",
);

browser.devtools.panels.elements.createSidebarPane("Example Pane", (pane) => {
  pane.setPage("devtools-pane.html");
});
