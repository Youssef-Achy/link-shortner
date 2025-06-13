// const body = document.querySelector("body");

// const input = document.getElementById("url");
// const submitButton = document.querySelector(".submit-button");
// const inputError = document.querySelector(".input-error");
// const shortenedUrls = document.querySelector(".shortened-links");
// const form = document.querySelector(".form");

// const hamburger = document.getElementById('hamburger');
// const navLinks = document.querySelector('.nav-links');

// document.addEventListener("DOMContentLoaded" , (e) => {
//   if(localStorage.getItem("urls")){
//     const urls = JSON.parse(localStorage.getItem("urls"));

//     console.log(urls)
//   }
// })
// hamburger.addEventListener('click', () => {
//   navLinks.classList.toggle('active');
// });


// let inputValue = "";

// input.addEventListener("input", (e) => {
//   inputValue = e.target.value;
//   console.log(inputValue);
//   validateUrlInput(inputValue);
// });

// submitButton.addEventListener("click", async (e) => {
//   e.preventDefault();

//   if (verifyAndEncodeUrl(inputValue)) {
//     const shortenedUrl = await shortURL(verifyAndEncodeUrl(inputValue));

//     const listItem = document.createElement("li");
//     const urls = [];
//     listItem.innerHTML = `
//                   <div class="url-card">
//                       <div class="url-content-left">
//                           <span class="original-url">${inputValue}</span>
//                       </div>
//                       <div class="url-content-right">
//                       <span class="short-url">${shortenedUrl}</span>
//                       <button class="copy-btn button-primary" onclick="copyToClipboard('${shortenedUrl}')">Copy</button>
//                       </div>
//                   </div>
//               `;

//     urls.push(listItem);
//     localStorage.setItem("urls" , JSON.stringify(urls))
//     shortenedUrls.appendChild(listItem);
//   }else{
//     alert("could not shorten it.")
//   }
// });

// function validateUrlInput(value) {
//   if (!verifyAndEncodeUrl(value)) {
//     input.style.borderColor = "red";
//     if (value.trim() === "") {
//       inputError.textContent = "Input must not be empty !";
//     } else {
//       inputError.textContent = "Enter a valid url !";
//     }
//   } else {
//     input.style.borderColor = "green";
//     inputError.textContent = "";
//   }
// }

// function verifyAndEncodeUrl(longUrl) {
//   let trimmedUrl = longUrl.trim();

//   if (/\s/.test(trimmedUrl)) {
//     return false;
//   }

//   try {
//     new URL(trimmedUrl);
//   } catch (_) {
//     return false;
//   }

//   let encodedUrl = encodeURI(trimmedUrl);

//   return encodedUrl;
// }

// function copyToClipboard() {
//   const shortUrl = document.querySelector(".short-url").textContent;
//   navigator.clipboard
//     .writeText(shortUrl)
//     .then(() => {
//       const copyButton = document.querySelector(".copy-btn");
//       copyButton.style.backgroundColor = "black";
//       copyButton.textContent = "copied!";
//       setTimeout(() => {
//         copyButton.style.backgroundColor = "#2acfcf";
//         copyButton.textContent = "copy";
//       }, 3000);
//     })
//     .catch((err) => {
//       console.error("Failed to copy: ", err);
//     });
// }

// async function shortURL(url) {
//   const response = await fetch(
//     `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
//   );
//   if (response.ok) {
//     const data = await response.text();
//     return data;
//   } else {
//     alert("Error");
//   }
// }


const body = document.querySelector("body");

const input = document.getElementById("url");
const submitButton = document.querySelector(".submit-button");
const inputError = document.querySelector(".input-error");
const shortenedUrls = document.querySelector(".shortened-links");
const form = document.querySelector(".form");

const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');

let inputValue = "";
let urls = JSON.parse(localStorage.getItem("urls")) || [];

document.addEventListener("DOMContentLoaded", () => {
  urls.forEach(({ originalUrl, shortUrl }) => {
    addUrlToList(originalUrl, shortUrl);
  });
});

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

input.addEventListener("input", (e) => {
  inputValue = e.target.value;
  validateUrlInput(inputValue);
});

submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (verifyAndEncodeUrl(inputValue)) {
    const shortenedUrl = await shortURL(verifyAndEncodeUrl(inputValue));
    addUrlToList(inputValue, shortenedUrl);

    urls.push({ originalUrl: inputValue, shortUrl: shortenedUrl });
    localStorage.setItem("urls", JSON.stringify(urls));

    input.value = ""; // Clear input
    inputValue = ""; // Reset input value
  } else {
    alert("Could not shorten the URL.");
  }
});

function addUrlToList(originalUrl, shortUrl) {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <div class="url-card">
        <div class="url-content-left">
            <span class="original-url">${originalUrl}</span>
        </div>
        <div class="url-content-right">
            <span class="short-url">${shortUrl}</span>
            <button class="copy-btn button-primary" onclick="copyToClipboard('${shortUrl}')">Copy</button>
        </div>
    </div>
  `;
  shortenedUrls.appendChild(listItem);
}

function validateUrlInput(value) {
  if (!verifyAndEncodeUrl(value)) {
    input.style.borderColor = "red";
    inputError.textContent = value.trim() === "" ? "Input must not be empty!" : "Enter a valid URL!";
  } else {
    input.style.borderColor = "green";
    inputError.textContent = "";
  }
}

function verifyAndEncodeUrl(longUrl) {
  let trimmedUrl = longUrl.trim();

  if (/\s/.test(trimmedUrl)) {
    return false;
  }

  try {
    new URL(trimmedUrl);
  } catch (_) {
    return false;
  }

  return encodeURI(trimmedUrl);
}

function copyToClipboard(shortUrl) {
  navigator.clipboard
    .writeText(shortUrl)
    .then(() => {
      const copyButton = document.querySelector(".copy-btn");
      copyButton.style.backgroundColor = "black";
      copyButton.textContent = "Copied!";
      setTimeout(() => {
        copyButton.style.backgroundColor = "#2acfcf";
        copyButton.textContent = "Copy";
      }, 3000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
    });
}

async function shortURL(url) {
  const response = await fetch(
    `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`
  );
  if (response.ok) {
    const data = await response.text();
    return data;
  } else {
    alert("Error shortening the URL.");
    return null;
  }
}
