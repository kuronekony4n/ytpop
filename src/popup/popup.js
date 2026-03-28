document.addEventListener('DOMContentLoaded', () => {
    const blurToggle = document.getElementById('blurToggle');
    const popupMode = document.getElementById('popupMode');
    const popupSize = document.getElementById('popupSize');
    const miniSize = document.getElementById('miniSize');
    const miniPos = document.getElementById('miniPos');

    // Load the current state
    chrome.storage.local.get({
        blurBackdrop: true,
        popupMode: 'page',
        popupSize: '1',
        miniSize: '1',
        miniPos: 'bottom-right'
    }, (result) => {
        blurToggle.checked = result.blurBackdrop;
        popupMode.value = result.popupMode;
        popupSize.value = result.popupSize;
        miniSize.value = result.miniSize;
        miniPos.value = result.miniPos;
    });

    // Save the state when toggled or changed
    blurToggle.addEventListener('change', (e) => chrome.storage.local.set({ blurBackdrop: e.target.checked }));
    popupMode.addEventListener('change', (e) => chrome.storage.local.set({ popupMode: e.target.value }));
    popupSize.addEventListener('change', (e) => chrome.storage.local.set({ popupSize: e.target.value }));
    miniSize.addEventListener('change', (e) => chrome.storage.local.set({ miniSize: e.target.value }));
    miniPos.addEventListener('change', (e) => chrome.storage.local.set({ miniPos: e.target.value }));
});
