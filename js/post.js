var img_list = document.getElementsByTagName("img")

var preview = document.getElementsByClassName("preview")[0]
var preview_img = preview.getElementsByTagName("img")[0]

preview.addEventListener('click', hideImage, false);

for (var i = 0; i < img_list.length; i++) {
    img_list[i].addEventListener('click', previewImage, false);
}

function previewImage() {
    // Stop the main page from moving whilst previewing
    document.getElementsByTagName("html")[0].style.overflow = "hidden"
    // Show and set src img
    preview.classList.add('shown')
    preview_img.src = this.src

}

function hideImage() {
    document.getElementsByTagName("html")[0].style.overflow = "auto"
    preview.classList.remove('shown')
}