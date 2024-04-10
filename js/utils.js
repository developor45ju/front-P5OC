export const createNotification = (messageToDisplay, state) => {
  const status = state
    ? 'message__notification--success'
    : 'message__notification--error';
  document.body.insertAdjacentHTML(
    'afterbegin',
    `
            <div class="message__notification ${status}">
                <p><b>${messageToDisplay}</b></p>
            </div>
        `
  );
  const notificationAddKanap = document.getElementsByClassName(status)[0];
  setTimeout(() => notificationAddKanap.remove(), 3000);
};
