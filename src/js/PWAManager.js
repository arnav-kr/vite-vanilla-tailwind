import ServiceWorkerManager from './serviceWorkerManager';

/**
 * @class PWAManager
 * @description This class is responsible for managing the PWA Installation/Update process.
 * @param {Object} options - The options object.
 * @param {String} options.serviceWorkerPath - The path to the service worker file.
 * @param {Function} options.beforeInstallPrompt - The callback function to be called before the installation prompt. Usuallly used to show an install button when this event fires.
 * @param {Function} options.appInstalled - The callback function to be called after the app is installed. Usually used to show a popup dialog to let user know the app is installed. or remove the install popup when app is installed.
 * @param {Function} options.controllerChange - The callback function to be called after the controller changes. i.e. when the power goes in the hands of the new service worker. usually used to the page.
 * @param {HTMLElement} options.installButton - The HTML element that will be used to trigger the installation prompt on click.
 * @param {HTMLElement} options.updateButton - The HTML element that will be used to trigger the update prompt on click.
 * 
 * @example
 * import { PWAManager } from './PWAManager';
 * let PWAManagerInstance = new PWAManager({
 *  serviceWorkerPath: './sw.js',
 * beforeInstallPrompt: () => { document.querySelector('#install-button').style.display = 'block'; },
 * appInstalled: () => { document.querySelector('#install-button').style.display = 'none'; },
 * controllerChange: () => { document.querySelector('#update-popup').style.display = 'block'; },
 * installButton: document.querySelector('#install-button'),
 * updateButton: document.querySelector('#update-button'),
 * });
 * PWAManagerInstance.init();
 * 
 * @returns {Object} - The PWAManager instance.
 */
export class PWAManager {

  constructor({
    serviceWorkerPath = './sw.js',
    beforeInstallPrompt = () => { },
    appInstalled = () => { },
    controllerChange = () => { },
    installButton = null,
    updateButton = null,
  }) {
    this.serviceWorkerPath = serviceWorkerPath;
    this.deferredPrompt = null;
    this.refreshing = false;

    if (installButton !== null && !(installButton instanceof HTMLElement)) {
      throw new Error('installButton must be an HTMLElement');
    }
    if (updateButton !== null && !(updateButton instanceof HTMLElement)) {
      throw new Error('updateButton must be an HTMLElement');
    }

    this.installButton = installButton;
    this.updateButton = updateButton;

    this.beforeInstallPrompt = beforeInstallPrompt;
    this.appInstalled = appInstalled;
    this.controllerChange = controllerChange;

    if (!('serviceWorker' in navigator)) {
      throw new Error('ServiceWorker is not supported in this browser');
    }
  }

  init() {
    if (('serviceWorker' in navigator)) {
      this.swManager = new ServiceWorkerManager(this.serviceWorkerPath);
      this.swManager.init();
      window.addEventListener("load", () => {
        window.addEventListener('beforeInstallPrompt', (e) => {
          e.preventDefault();
          this.deferredPrompt = e;
          this.beforeInstallPrompt(e);
          console.log("Prompted user to install");
        });

        this.installButton && this.installButton.addEventListener('click', async () => {
          this.deferredPrompt.prompt();
          const { outcome } = await this.deferredPrompt.userChoice;
          console.log(`User response to the install prompt: ${outcome}`);
          this.deferredPrompt = null;
        });

        this.updateButton && updateButton.addEventListener("click", () => {
          window.location.reload();
        });

        window.addEventListener('appInstalled', (e) => {
          this.appInstalled(e);
          this.deferredPrompt = null;
          console.log('PWA was installed');
        });
      });

      navigator.serviceWorker.addEventListener('controllerChange', (e) => {
        if (this.refreshing) return;
        this.controllerChange(e);
        this.refreshing = true;
      });

      // Just shout in console when the new update is available no use of the event here btw
      window.addEventListener("updatefound", () => {
        console.log("New Update Available!");
      });
    }
    else {
      throw new Error('ServiceWorker is not supported in this browser');
    }
  }
}