/// <reference types="jest" />
import 'jest-preset-angular/setup-jest';

window.HTMLElement.prototype.scrollIntoView = jest.fn();
