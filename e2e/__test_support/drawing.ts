import type {Page} from '@playwright/test';

// React does its drawing in tasks it posts to itself through a MessageChannel, so delaying those posts holds every draw
// back, the first one over the page included, while the network goes on
export const drawingHeldBack = async (page: Page, milliseconds: number): Promise<void> => {
  await page.addInitScript(delay => {
    const Channel = window.MessageChannel;
    window.MessageChannel = class extends Channel {
      constructor() {
        super();
        const post = this.port2.postMessage.bind(this.port2);
        this.port2.postMessage = (message: unknown): void => {
          setTimeout(() => post(message), delay);
        };
      }
    };
  }, milliseconds);
};
