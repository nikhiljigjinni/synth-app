export const FREQ_MAP = new Map<string, number>([
    ["C3", 130.81],
    ["C#3", 138.59],
    ["D3", 146.83],
    ["D#3", 155.56],
    ["E3", 164.81],
    ["F3", 174.61],
    ["F#3", 185.00],
    ["G3", 196.00],
    ["G#3", 207.65],
    ["A3", 220.00],
    ["A#3", 233.08],
    ["B3", 246.94],
    ["C4", 261.63]
  ]
);

export const KEYS_TO_FREQ = new Map<string, string> ([
    ["a", "C3"],
    ["w","C#3"],
    ["s","D3"],
    ["e","D#3"],
    ["d","E3"],
    ["f","F3"],
    ["t","F#3"],
    ["g","G3"],
    ["y","G#3"],
    ["h","A3"],
    ["u","A#3"],
    ["j","B3"],
    ["k","C4"]
])

export function domReady(callback: () => void): void {
  if (document.readyState !== 'loading') {
    callback();
  }
  else {
    document.addEventListener('DOMContentLoaded', callback);
  }
};

export function createParam(name: string, min: number, max: number, step: number, value: number): HTMLInputElement {

  if (min >= max) {
    throw new Error("ERROR: min value of param is greater than the max value");
  }
  let paramElement = document.createElement('input');
  paramElement.type = 'range';
  paramElement.min = min.toString();
  paramElement.max = max.toString();
  paramElement.step = step.toString();
  paramElement.value = value.toString();
  paramElement.name = name;
  paramElement.id = name;

  return paramElement;
}
