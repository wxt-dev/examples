import "./style.css";

declare const app: HTMLDivElement;
const faviconService = getFaviconService();

loadFavicons();

async function loadFavicons() {
  // Load favicons
  app.innerHTML = "<p>Loading...</p>";
  const favicons = await faviconService.getAll();
  app.removeChild(app.firstChild!);

  // Render favicons
  favicons.map((favicon) => {
    const img = getFaviconImg(favicon);
    app.append(img);
  });
}

function getFaviconImg(info: FaviconInfo) {
  const img = document.createElement("img");
  img.src = info.faviconUrl;
  img.title = info.hostname;
  return img;
}
