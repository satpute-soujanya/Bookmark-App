const modalContainer = document.getElementById('modal_container')
const showModal = document.getElementById('showModel')
console.log(modalContainer)
const closeModal = document.getElementById('close_modal')
const bookmarkForm = document.getElementById('bookmark_form')
const websiteName = document.getElementById('website_name')
const websiteURL = document.getElementById('website_url')
const bookmarkContainer = document.getElementById('bookmark_container')

let Bookmarks = []

// Adding show modal Class
function showModalOnClick() {
  modalContainer.classList.add('show_modal')
  websiteName.focus()
}
// Modal EventListener
showModal.addEventListener('click', showModalOnClick)
closeModal.addEventListener('click', () =>
  modalContainer.classList.remove('show_modal')
)
window.addEventListener('click', (e) =>
  e.target == modalContainer
    ? modalContainer.classList.remove('show_modal')
    : false
)
// Validate form
function validateForm(nameValue, urlValue) {
  const expression =
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g
  const regx = new RegExp(expression)
  if (!nameValue || !urlValue) {
    alert('Please submit value for both fields')
    return false
  }
  if (!urlValue.match(regx)) {
    alert('Please Provide Valid URL')
    return false
  }
  return true
}

// DeleteBookMark

function deleteBookMark(url) {
  Bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      Bookmarks.splice(i, 1)
    }
  })
  // Update bookmarks Array
  localStorage.setItem('Bookmarks', JSON.stringify(Bookmarks))
  fetchBookmark()
}

// Build Bookmarks in DOM
function buildBookmarks() {
  // Remove everything before building new thing
  bookmarkContainer.textContent = ''
  // Build Items
  Bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark
    // console.log(name, url)
    // Item Container
    const item_container = document.createElement('div')
    item_container.classList.add('item_container')
    // Delete Icon
    const deleteIcon = document.createElement('i')
    deleteIcon.classList.add('fas', 'fa-trash')
    deleteIcon.setAttribute('title', 'Delete Bookmark')
    deleteIcon.setAttribute('onClick', `deleteBookMark('${url}')`)
    // Favicon and link name
    const linkinfo = document.createElement('div')
    linkinfo.classList.add('name')
    // Favicon
    const favicon = document.createElement('img')
    favicon.setAttribute(
      'src',
      `https://www.google.com/s2/favicons?domain_url=${url}`
    )
    favicon.setAttribute('alt', 'favicon')
    // Link
    const link = document.createElement('a')
    link.setAttribute('href', 'url')
    link.setAttribute('target', '_blank')
    link.textContent = name

    // Appending to the DOM
    linkinfo.append(favicon, link)
    item_container.append(deleteIcon, linkinfo)
    bookmarkContainer.append(item_container)
  })
}
// Fetch BookMark
function fetchBookmark() {
  // If local storage have bookmarks Fetch it
  if (localStorage.getItem('Bookmarks').length) {
    Bookmarks = JSON.parse(localStorage.getItem('Bookmarks'))
  } else {
    // Create an array
    Bookmarks = [{ name: 'Google', url: 'https://google.com' }]
    localStorage.setItem('Bookmarks', JSON.stringify(Bookmarks))
  }
  console.log(Bookmarks)
  buildBookmarks()
}

// Handle data from form
function storeBookmark(e) {
  e.preventDefault()
  const websiteNameValue = websiteName.value
  let websiteURLvValue = websiteURL.value
  // Old Version
  if (!websiteURLvValue.includes('http://', 'https://')) {
    websiteURLvValue = `https://${websiteURLvValue}`
  }
  if (!validateForm(websiteNameValue, websiteURLvValue)) {
    return false
  }
  const bookmark = {
    name: websiteNameValue,
    url: websiteURLvValue,
  }
  Bookmarks.push(bookmark)
  localStorage.setItem('Bookmarks', JSON.stringify(Bookmarks))
  fetchBookmark()
  bookmarkForm.reset()
  websiteName.focus()
}

// Eventlistener
bookmarkForm.addEventListener('submit', storeBookmark)

// On Load
fetchBookmark()
