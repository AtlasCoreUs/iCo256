import '@testing-library/jest-dom';

// Polyfills for Node.js environment
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Set up a proper DOM environment for tests
const { JSDOM } = require('jsdom');
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost',
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

// Create a container for React components
const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);

// Mock pour les APIs du navigateur non disponibles dans jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock pour localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
global.localStorage = localStorageMock as Storage;

// Mock pour URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');
global.URL.revokeObjectURL = jest.fn();

// Mock pour createElement et appendChild
const mockAnchor = {
  href: '',
  download: '',
  click: jest.fn(),
} as unknown as HTMLAnchorElement;

const originalCreateElement = document.createElement;
document.createElement = jest.fn((tag) => {
  if (tag === 'a') {
    return mockAnchor;
  }
  return originalCreateElement.call(document, tag);
});
document.body.appendChild = jest.fn();
document.body.removeChild = jest.fn();