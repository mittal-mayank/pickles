const notyf = new Notyf({
    duration: 2000,
    position: { x: 'right', y: 'top' },
    dismissible: true,
    types: [
        {
            type: 'info',
            background: 'dodgerblue',
        },
    ],
});

function notyfFeatureComingSoon() {
    notyf.open({
        type: 'info',
        message: 'Feature coming soon!',
    });
}

function openCommunity(event) {
    location.href = `/c/${event.target.innerText}`;
}

const bodyClassList = document.body.classList;
if (bodyClassList.contains('manual-dark')) bodyClassList.add('dark-mode');
else if (!bodyClassList.contains('manual-light')) {
    const osThemeQuery = matchMedia('(prefers-color-scheme: dark)');
    if (osThemeQuery.matches) bodyClassList.add('dark-mode');
}

const btnTheme = $('#btn-theme');
btnTheme.on('click', () => {
    const theme = document.body.classList.contains('dark-mode');
    $.ajax({
        url: '/settings/theme',
        type: 'PATCH',
        data: { theme },
    });
});

const imgModal = $('#img-modal');
$('body').on('click', '.link-modal-img', (event) => {
    imgModal.attr('src', event.target.src);
});

const inpSearch = $('#inp-search');
inpSearch.on('keypress', (event) => {
    if (event.which === 13) {
        const inpSearchVal = inpSearch.val().trim();
        if (inpSearchVal.length) {
            const type = inpSearchVal.substring(0, 1);
            const target = inpSearchVal.substring(1);
            if (type === '@') {
                notyf.open({
                    type: 'info',
                    message: 'Feature coming soon!',
                });
            } else if (type === '#') {
                const targetPath = `/c/${target}`;
                $.get(
                    targetPath,
                    () => (location.pathname = targetPath)
                ).fail(() => inpSearch.addClass('is-invalid'));
            } else {
                inpSearch.addClass('is-invalid');
            }
        }
    }
});

inpSearch.on('input', () => inpSearch.removeClass('is-invalid'));
inpSearch.on('blur', () => inpSearch.removeClass('is-invalid'));

function raiseValidityMsg(object, message) {
    const objectJS = object[0];
    objectJS.setCustomValidity(message);
    objectJS.reportValidity();
}

function createSubmitTrigger(object, triggerTarget) {
    object.on('keypress', (event) => {
        object[0].setCustomValidity('');
        if (event.which === 13) triggerTarget.trigger('click');
    });
}

function addFileDisplay(inputFile, imgFile) {
    const fileReader = new FileReader();
    fileReader.onload = (event) => imgFile.attr('src', event.target.result);
    inputFile.on('change', (event) => {
        fileReader.readAsDataURL(event.target.files[0]);
    });
}
