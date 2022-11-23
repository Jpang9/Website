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

    // reset values
    preview_img.style.maxWidth = "initial"
    preview_img.style.width = "initial"
    preview_img.style.height = "initial"
    
    // check image height against it's width
    if (this.naturalHeight > this.naturalWidth) {
        preview_img.style.height = "calc(100% - 125px)"
        preview_img.style.width = "initial"
    } else {
        preview_img.style.height = "initial"
        preview_img.style.width = "calc(100% - 20px)"
    }

    // little bit of lazy code but should be good
    setTimeout(() => {  

        console.log(preview_img.width, window.innerWidth)
        if (preview_img.width >= window.innerWidth) {
            preview_img.style.height = "initial"
            preview_img.style.maxWidth = "100%"
        } else {
            preview_img.style.maxWidth = "initial"
        }
    
    }, 50);

}

function hideImage() {
    document.getElementsByTagName("html")[0].style.overflow = "auto"
    preview.classList.remove('shown')
}