let uploadArea = document.getElementById("uploadArea");
let fileInput = document.getElementById("fileInput");
let conBtn = document.getElementById("convertBtn");
let preview = document.getElementById('preview');
let image = new Array();

uploadArea.addEventListener("click", () => fileInput.click());
uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    uploadArea.classList.add("dragover");
});
uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover");
});

uploadArea.addEventListener("drop", (e) => {
    e.preventDefault();
    uploadArea.classList.remove("dragover");
    const droppedFile = e.dataTransfer.files;
    console.log(droppedFile);
    if(droppedFile) processFile(droppedFile);
});

fileInput.addEventListener("change", (e) => {
    const changedFile = e.target.files[0];
    if(changedFile) processFile(changedFile);
});

conBtn.addEventListener('click', () => convert());

let processFile = (files) => {
    const error = document.getElementById("error");
    for(let i = 0; i < files.length; ++i)
    {
        if(!files[i].type.startsWith("image/"))
        {
                error.innerText = "The file format is not an image";
                error.style.display = "block";
                return;
        }
    }

    error.style.display = "none";
    
    let previewList = document.getElementById("preivew-list");
    Array.from(files).map(file => {
        const fileReader = new FileReader();            
            fileReader.onload = (e) => {
                    const _image = new Image();

                    _image.onload = () => {
                        const node = document.createElement("img");
                        node.src = e.target.result;
                        previewList.appendChild(node);
                        const convertBtn = document.getElementById("convertBtn");
                        convertBtn.disabled = false;
                    }
                    _image.src = e.target.result;
                    
                    image.push(_image);
            };

            fileReader.readAsDataURL(file);

    });     
    
    console.log(image);
}

function convert() {
    const formatSelect = document.getElementById('formatSelect');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    for(let i = 0; i < image.length; ++i)
    {
        if(!image[i]) continue;
        canvas.width = image[i].width;
        canvas.height = image[i].height;
        ctx.drawImage(image[i], 0, 0);
        const format = formatSelect.value;
        const quality = format === 'image/jpeg' ? 0.9 : 1;
    
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          const extension = format.split('/')[1];
          a.href = url;
          let r = (Math.random() + 1).toString(36).substring(7);
          a.download = `${r}-${i}.${extension}`;
          a.click();
          URL.revokeObjectURL(url);
        }, format, quality);
    }
  }
