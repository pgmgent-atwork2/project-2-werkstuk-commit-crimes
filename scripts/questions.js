const $questionForm = document.getElementById("questionForm")
const $questionFormBtn = document.getElementById("questionFormBtn")

function formDropdown() {
    $questionFormBtn.addEventListener('click', () => {
        $questionForm.style.display = "flex"
    })
}

const $newImage = document.getElementById("myFile")
const $previewImage = document.getElementById("previewImage")

export function showNewImage() {
    $newImage.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $previewImage.src = e.target.result;
                $previewImage.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    });
}



export default formDropdown